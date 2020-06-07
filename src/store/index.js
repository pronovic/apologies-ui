import Vue from 'vue'
import Vuex from 'vuex'
import { config } from './config.js'
import { clearPlayer, persistPlayer } from '../utils/storage.js'
import { UserLoadStatus, ServerStatus, GameStatus } from '../utils/constants.js'

Vue.use(Vuex)

const user = {
    loadStatus: UserLoadStatus.NOT_LOADED,
    registered: false,
    handle: null,
    playerId: null,
}

const server = {
    latestFailure: null,
    registeredPlayers: [],
    availableGames: [],
    messages: [],
    advertisedGame: null,
    invitations: [],
}

const game = {
    id: null,
    status: null,
    comment: null,
    players: [],
    history: [],
    playerState: null,
    opponentStates: [],
    drawnCard: null,
    playerMoves: [],
}

const dimensions = {
    header: {
        height: 0,
    },
    window: {
        height: 0,
        width: 0,
    },
}

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
        playerHandle: (state) => {
            return state.user.handle == null ? '' : state.user.handle
        },
        playerId: (state) => {
            return state.user.playerId
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
        playerColor: (state, getters) => {
            const info = state.game.players.filter((player) => {
                return player.handle === getters.playerHandle
            })

            return info.length === 0 ? null : info[0].player_color // eslint-disable-line camelcase
        },
        opponentColors: (state, getters) => {
            const info = state.game.players.filter((player) => {
                return player.handle !== getters.playerHandle
            })

            return info.length === 0
                ? []
                : info.map(({ player_color }) => player_color) // eslint-disable-line camelcase
        },
        stateByColor: (state, getters) => {
            // this merges info from the player change and game state events, by color

            const colors = state.game.players.map(
                ({ player_color }) => player_color // eslint-disable-line camelcase
            )

            const infoMap = Object.fromEntries(
                state.game.players.map((e) => [e.player_color, e])
            )

            const stateMap = Object.fromEntries(
                state.game.opponentStates.map((e) => [e.color, e])
            )

            // the published data splits player state and opponent state, but we want them merged here
            if (getters.playerColor) {
                stateMap[getters.playerColor] = state.game.playerState
            }

            var result = {}

            // we get player info as soon as the game is advertised
            for (var color of colors) {
                result[color] = {
                    handle: infoMap[color].handle,
                    color: infoMap[color].player_color,
                    type: infoMap[color].player_type,
                }
            }

            // there is no game state until after the game is started
            for (var color of colors) {
                if (color in stateMap) {
                    result[color].state = infoMap[color].player_state
                    result[color].hand = stateMap[color].hand
                    result[color].pawns = stateMap[color].pawns
                }
            }

            return result
        },
    },
    mutations: {
        trackHeaderHeightChange(state, headerHeight) {
            console.log('Header height: ' + headerHeight + ' px')
            state.dimensions.header.height = headerHeight
        },
        trackWindowSizeChange(state) {
            console.log(
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
        trackGameId(state, gameId) {
            state.game.id = gameId
        },
        trackGameStatus(state, status) {
            state.game.status = status
        },
        trackGamePlayers(state, context) {
            state.game.comment = context.comment
            Vue.set(state.game, 'players', context.players)
        },
        trackGameState(state, context) {
            Vue.set(state.game, 'history', context.recent_history)
            state.game.playerState = context.player
            Vue.set(state.game, 'opponentStates', context.opponents)
        },
        trackPlayerTurn(state, context) {
            state.game.drawnCard = context.drawn_card
            Vue.set(state.game, 'playerMoves', context.moves)
        },
        clearGame(state) {
            state.server.advertisedGame = null
            state.game.id = null
            state.game.status = null
            state.game.comment = null
            Vue.set(state.game, 'players', [])
            Vue.set(state.game, 'history', [])
            state.game.playerState = null
            Vue.set(state.game, 'opponentStates', [])
            state.game.drawnCard = null
            Vue.set(state.game, 'playerMoves', [])
        },
    },
    actions: {
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
            commit('trackGameId', context.game_id)
            commit('trackGameStatus', GameStatus.GAME_JOINED)
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
        handleGameCompleted({ commit }) {
            commit('trackGameStatus', GameStatus.GAME_COMPLETED)
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
    },
})

export default store
