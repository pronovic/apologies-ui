import Vue from 'vue'
import Vuex from 'vuex'

import { logger, random } from '../utils/util.js'
import { config } from './config.js'
import { clearPlayer, persistPlayer } from '../utils/storage.js'
import {
    UserLoadStatus,
    ServerStatus,
    GameStatus,
    GameMode,
    PlayerColor,
} from '../utils/constants.js'

Vue.use(Vuex)

/** State of a user in the web UI. */
const user = {
    loadStatus: UserLoadStatus.NOT_LOADED,
    registered: false,
    handle: null,
    playerId: null,
}

/** Server state, tracked via events. */
const server = {
    latestFailure: null,
    registeredPlayers: [],
    availableGames: [],
    messages: [],
    advertisedGame: null,
    invitations: [],
}

/** Game state, tracked via events. */
const game = {
    id: null,
    autoplay: false,
    terminated: false,
    name: null,
    mode: null,
    advertiser: null,
    winner: null,
    previousTurn: null,
    status: null,
    comment: null,
    players: [],
    playerState: null,
    opponentStates: [],
    drawnCard: null,
    playerMoves: [],
}

/** Screen dimensions, tracked via an event handler. */
const dimensions = {
    header: {
        height: 0,
    },
    window: {
        height: 0,
        width: 0,
    },
}

/** The Vuex store, containing global state. */
const store = new Vuex.Store({
    state: {
        config: config,
        user: user,
        server: server,
        game: game,
        dimensions: dimensions,
    },
    getters: {
        displayHeight: (state) => {
            return (
                state.dimensions.window.height - state.dimensions.header.height
            )
        },
        displayWidth: (state) => {
            return state.dimensions.window.width
        },
        playerId: (state) => {
            return state.user.playerId
        },
        playerHandle: (state) => {
            return state.user.handle == null ? '' : state.user.handle
        },
        gameId: (state) => {
            return state.game.id
        },
        availableGames: (state) => {
            return state.server.availableGames
        },
        userLoadStatus: (state) => {
            return state.user.loadStatus
        },
        isUserLoaded: (state) => {
            return state.user.loadStatus === UserLoadStatus.LOADED
        },
        isUserRegistered: (state) => {
            return state.user.registered
        },
        isAutoplayEnabled: (state) => {
            return state.game.autoplay
        },
        isGameTerminated: (state) => {
            return state.game.terminated
        },
        isGameJoined: (state) => {
            return state.game.id != null
        },
        isGameAdvertised: (state) => {
            return state.server.advertisedGame != null
        },
        isGameStarted: (state) => {
            return state.game.status === GameStatus.GAME_STARTED
        },
        isGameCompleted: (state) => {
            switch (state.game.status) {
                case GameStatus.GAME_CANCELLED:
                case GameStatus.GAME_COMPLETED:
                case GameStatus.GAME_INACTIVE:
                case GameStatus.PLAYER_QUIT:
                case GameStatus.DISCONNECTED:
                    return true
                default:
                    return false
            }
        },
        isPlayerTurn: (state) => {
            // when it is a player's turn, there will always be at least one legal move (which might be a forfeit)
            return (
                state.game.playerMoves &&
                Object.keys(state.game.playerMoves).length > 0
            )
        },
        player: (state, getters) => {
            return getters.playerHandle in getters.players
                ? getters.players[getters.playerHandle]
                : null
        },
        opponents: (state, getters) => {
            return Object.values(getters.players)
                .filter((player) => {
                    return player.isOpponent
                })
                .map(({ handle }) => handle)
                .sort()
                .map((handle) => getters.players[handle])
        },
        redPawns: (state, getters) => {
            for (const player of Object.values(getters.players)) {
                if (player.color === PlayerColor.RED) {
                    return player.pawns
                }
            }
            return [] // if we can't find the player, just return no pawns
        },
        yellowPawns: (state, getters) => {
            for (const player of Object.values(getters.players)) {
                if (player.color === PlayerColor.YELLOW) {
                    return player.pawns
                }
            }
            return [] // if we can't find the player, just return no pawns
        },
        greenPawns: (state, getters) => {
            for (const player of Object.values(getters.players)) {
                if (player.color === PlayerColor.GREEN) {
                    return player.pawns
                }
            }
            return [] // if we can't find the player, just return no pawns
        },
        bluePawns: (state, getters) => {
            for (const player of Object.values(getters.players)) {
                if (player.color === PlayerColor.BLUE) {
                    return player.pawns
                }
            }
            return [] // if we can't find the player, just return no pawns
        },
        players: (state, getters) => {
            // This merges information from several different events into a single
            // cohesive state for each player, tracked as a map by player handle.
            //
            // Most of the information comes from the player change and game state events.
            // Public information about each opponent's hand is augmented based on the
            // previous turn information tracked via history.  For a standard mode game,
            // the player's hand is augmented based on the game player turn event.
            //
            // Unfortunately, there's no handle in the game state, only a color.  And, we
            // don't have any game state information or any color until after the game has
            // been started and colors have been assigned.  So, we need to jump through
            // some hoops to fill in only the information that is available at the current
            // time.

            var players = {}

            if (state.game.players) {
                for (const player of state.game.players) {
                    players[player.handle] = {
                        handle: player.handle,
                        color: player.player_color,
                        type: player.player_type,
                        state: player.player_state,
                        isAdvertiser: false,
                        isOpponent: player.handle !== getters.playerHandle,
                        isWinner: false,
                        turns: 0,
                        hand: [],
                        pawns: [],
                    }
                }
            }

            if (state.game.playerState) {
                players[getters.playerHandle].turns =
                    state.game.playerState.turns
                players[getters.playerHandle].hand = state.game.playerState.hand
                players[getters.playerHandle].pawns =
                    state.game.playerState.pawns
            }

            if (state.game.opponentStates) {
                const stateMap = Object.fromEntries(
                    state.game.opponentStates.map((e) => [e.color, e])
                )

                for (const player of Object.values(players)) {
                    if (player.color in stateMap) {
                        player.turns = stateMap[player.color].turns
                        player.pawns = stateMap[player.color].pawns
                    }
                }
            }

            if (state.game.mode === GameMode.STANDARD && state.game.drawnCard) {
                // In a standard mode game, the hand is always empty, so we fill it
                // with the card they most recently played.
                players[getters.playerHandle].hand = [state.game.drawnCard]
            }

            if (state.game.previousTurn) {
                for (const player of Object.values(players)) {
                    if (player.isOpponent) {
                        if (player.color === state.game.previousTurn.color) {
                            if (state.game.mode === GameMode.STANDARD) {
                                player.hand = [state.game.previousTurn.card]
                            } else {
                                // Here, we're being cute and pretending they pick from different parts of their hand
                                const index = random(0, 4)
                                const hand = [null, null, null, null, null]
                                hand[index] = state.game.previousTurn.card
                                player.hand = hand
                            }
                        } else {
                            if (state.game.mode === GameMode.STANDARD) {
                                player.hand = []
                            } else {
                                player.hand = [null, null, null, null, null]
                            }
                        }
                    }
                }
            }

            if (state.game.winner && state.game.winner in players) {
                players[state.game.winner].isWinner = true
            }

            if (state.game.advertiser && state.game.advertiser in players) {
                players[state.game.advertiser].isAdvertiser = true
            }

            return players
        },
    },
    mutations: {
        trackHeaderHeightChange(state, headerHeight) {
            logger.debug('Header height: ' + headerHeight + ' px')
            state.dimensions.header.height = headerHeight
        },
        trackWindowSizeChange(state) {
            logger.debug(
                'Window size: ' +
                    window.innerHeight +
                    'x' +
                    window.innerWidth +
                    ' px'
            )
            state.dimensions.window.height = window.innerHeight
            state.dimensions.window.width = window.innerWidth
        },
        trackFailure(state, context) {
            state.server.latestFailure = context
        },
        trackLatestStatus(state, status) {
            state.server.latestStatus = status
        },
        trackRegisteredPlayers(state, context) {
            Vue.set(state.server, 'registeredPlayers', context.players)
        },
        trackAvailableGames(state, context) {
            Vue.set(state.server, 'availableGames', context.games)
        },
        trackPlayerRegistered(state, player) {
            state.user.loadStatus = UserLoadStatus.LOADED
            state.user.registered = true
            state.user.handle = player.handle
            state.user.playerId = player.playerId
        },
        trackPlayerNotRegistered(state) {
            state.user.loadStatus = UserLoadStatus.LOADED
            state.user.registered = false
            state.user.handle = null
            state.user.playerId = null
        },
        trackReceivedMessage(state, context) {
            state.server.messages.push(context)
        },
        trackAdvertisedGame(state, context) {
            state.server.advertisedGame = context
        },
        trackGameInvitation(state, context) {
            state.server.invitations.push(context)
        },
        trackGameAutoplay(state, value) {
            state.game.autoplay = value
        },
        trackGameTerminated(state, value) {
            state.game.terminated = value
        },
        trackGameStatus(state, status) {
            state.game.status = status
        },
        trackGameWinner(state, winner) {
            state.game.winner = winner
        },
        trackGamePlayers(state, context) {
            state.game.comment = context.comment
            Vue.set(state.game, 'players', context.players)
        },
        trackGameDetails(state, context) {
            state.game.id = context.game_id
            state.game.terminated = false // just in case it's left over
            state.game.name = context.name
            state.game.mode = context.mode
            state.game.advertiser = context.advertiser_handle
        },
        trackGameState(state, context) {
            state.game.playerState = context.player
            Vue.set(state.game, 'opponentStates', context.opponents)
            state.game.previousTurn = null
            if (context.recent_history && context.recent_history.length > 0) {
                const last =
                    context.recent_history[context.recent_history.length - 1]
                if (last.color && last.card) {
                    state.game.previousTurn = last
                }
            }
        },
        trackPlayerTurn(state, context) {
            state.game.drawnCard = context.drawn_card
            Vue.set(state.game, 'playerMoves', context.moves)
        },
        clearGame(state) {
            state.server.advertisedGame = null
            state.game.id = null
            state.game.autoplay = false
            state.game.terminated = false
            state.game.name = null
            state.game.mode = null
            state.game.advertiser = null
            state.game.winner = null
            state.game.status = null
            state.game.comment = null
            Vue.set(state.game, 'players', [])
            state.game.playerState = null
            Vue.set(state.game, 'opponentStates', [])
            state.game.drawnCard = null
            Vue.set(state.game, 'playerMoves', [])
            state.game.previousTurn = null
        },
        clearPlayerMove(state) {
            state.game.drawnCard = null
            state.game.playerMoves = []
        },
    },
    actions: {
        toggleAutoplay({ commit, getters }) {
            commit('trackGameAutoplay', !getters.isAutoplayEnabled)
        },
        markGameTerminated({ commit }) {
            commit('trackGameTerminated', true)
        },
        handleHeaderHeightChange({ commit }, headerHeight) {
            commit('trackHeaderHeightChange', headerHeight)
        },
        handleWindowSizeChange({ commit }) {
            commit('trackWindowSizeChange')
        },
        handleRequestFailed({ commit }, context) {
            commit('trackFailure', context)
        },
        handleServerShutdown({ commit }) {
            commit('trackLatestStatus', ServerStatus.SERVER_SHUTDOWN)
        },
        handleWebsocketIdle({ commit }) {
            commit('trackLatestStatus', ServerStatus.WEBSOCKET_IDLE)
        },
        handleWebsocketInactive({ commit }) {
            commit('trackLatestStatus', ServerStatus.WEBSOCKET_INACTIVE)
        },
        handleWebsocketError({ commit }) {
            commit('trackLatestStatus', ServerStatus.WEBSOCKET_ERROR)
        },
        handleRegisteredPlayers({ commit }, context) {
            commit('trackRegisteredPlayers', context)
        },
        handleAvailableGames({ commit }, context) {
            commit('trackAvailableGames', context)
        },
        handlePlayerRegistered({ commit }, player) {
            persistPlayer(player.handle, player.playerId)
            commit('trackPlayerRegistered', player)
        },
        handlePlayerNotRegistered({ commit }) {
            clearPlayer()
            commit('trackPlayerNotRegistered')
            commit('clearGame')
        },
        handlePlayerIdle({ commit }) {
            commit('trackLatestStatus', ServerStatus.PLAYER_IDLE)
        },
        handlePlayerInactive({ commit }) {
            commit('trackLatestStatus', ServerStatus.PLAYER_INACTIVE)
        },
        handlePlayerMessageReceived({ commit }, context) {
            commit('trackReceivedMessage', context)
        },
        handleGameAdvertised({ commit }, context) {
            commit('trackAdvertisedGame', context)
        },
        handleGameInvitation({ commit }, context) {
            commit('trackGameInvitation', context)
        },
        handleGameJoined({ commit }, context) {
            commit('trackGameStatus', GameStatus.GAME_JOINED)
            commit('trackGameDetails', context)
        },
        handleGameStarted({ commit }) {
            commit('trackGameStatus', GameStatus.GAME_STARTED)
        },
        handleGameDisconnected({ commit }) {
            commit('trackGameStatus', GameStatus.DISCONNECTED)
        },
        handleGameCancelled({ commit }) {
            commit('trackGameStatus', GameStatus.GAME_CANCELLED)
        },
        handleGameCompleted({ commit }, winner) {
            commit('trackGameStatus', GameStatus.GAME_COMPLETED)
            commit('trackGameWinner', winner)
        },
        handleGameIdle({ commit }) {
            commit('trackGameStatus', GameStatus.GAME_IDLE)
        },
        handleGameInactive({ commit }) {
            commit('trackGameStatus', GameStatus.GAME_INACTIVE)
        },
        handleGamePlayerQuit({ commit }) {
            commit('trackGameStatus', GameStatus.PLAYER_QUIT)
        },
        handleGamePlayerChange({ commit }, context) {
            commit('trackGamePlayers', context)
        },
        handleGameStateChange({ commit }, context) {
            commit('trackGameState', context)
        },
        handleGamePlayerTurn({ commit }, context) {
            commit('trackPlayerTurn', context)
        },
        handleGameClear({ commit }) {
            commit('clearGame')
        },
        handleMovePlayed({ commit }) {
            commit('clearPlayerMove')
        },
    },
})

export default store
