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
    opponentState: null,
    drawnCard: null,
    playerMoves: null,
}

const store = new Vuex.Store({
    state: {
        config: config,
        user: user,
        server: server,
        game: game,
    },
    getters: {
        playerHandle: (state) => {
            return state.user.handle == null ? '' : state.user.handle
        },
        playerId: (state) => {
            return state.user.playerId
        },
        gameId: (state) => {
            return state.game.id
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
    },
    mutations: {
        trackFailure(state, context) {
            state.server.latestFailure = context
        },
        trackLatestStatus(state, status) {
            state.server.latestStatus = status
        },
        trackRegisteredPlayers(state, context) {
            state.server.registeredPlayers = context.players
        },
        trackAvailableGames(state, context) {
            state.server.availableGames = context.games
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
        trackGameStatus(state, status, gameId) {
            state.game.status = status
            if (gameId != null) {
                state.game.id = gameId
            }
        },
        trackGamePlayers(state, context) {
            state.game.comment = context.comment
            state.game.players = context.players
        },
        trackGameState(state, context) {
            state.game.history = context.recent_history
            state.game.playerState = context.player
            state.game.opponentState = context.opponents
        },
        trackPlayerTurn(state, context) {
            state.game.drawnCard = context.drawn_card
            state.game.playerMoves = context.moves
        },
        clearGame(state) {
            state.server.advertisedGame = null
            state.game.id = null
            state.game.status = null
            state.game.comment = null
            state.game.players = []
            state.game.history = []
            state.game.playerState = null
            state.game.opponentState = null
            state.game.drawnCard = null
            state.game.playerMoves = null
        },
    },
    actions: {
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
            commit('trackGameStatus', GameStatus.GAME_JOINED, context.game_id)
        },
        handleGameStarted({ commit }) {
            commit('trackGameStatus', GameStatus.GAME_STARTED, null)
        },
        handleGameDisconnected({ commit }) {
            commit('trackGameStatus', GameStatus.DISCONNECTED, null)
        },
        handleGameCancelled({ commit }, context) {
            commit(
                'trackGameStatus',
                GameStatus.GAME_CANCELLED,
                context.game_id
            )
        },
        handleGameCompleted({ commit }, context) {
            commit(
                'trackGameStatus',
                GameStatus.GAME_COMPLETED,
                context.game_id
            )
        },
        handleGameIdle({ commit }) {
            commit('trackGameStatus', GameStatus.GAME_IDLE, null)
        },
        handleGameInactive({ commit }) {
            commit('trackGameStatus', GameStatus.GAME_INACTIVE, null)
        },
        handleGamePlayerQuit({ commit }) {
            commit('trackGameStatus', GameStatus.PLAYER_QUIT, null)
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
