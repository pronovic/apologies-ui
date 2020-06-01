import Vue from 'vue'
import Vuex from 'vuex'
import { config } from './config.js'
import { clearPlayer, persistPlayer } from '../utils/storage.js'
import {
    UserLoadStatus,
    ServerStatus,
    GameStatus,
    GameBanners,
} from '../utils/constants.js'

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
    banner: GameBanners.ACTION_HINT,
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
        userLoadStatus: (state) => {
            return state.user.loadStatus
        },
        isUserLoaded: (state) => {
            return state.user.loadStatus === UserLoadStatus.LOADED
        },
        isUserRegistered: (state) => {
            return state.user.registered
        },
        gameBanner: (state) => {
            return state.game.banner == null ? '' : state.game.banner
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
        trackPlayerRegistered(state, handle, playerId) {
            state.user.loadStatus = UserLoadStatus.LOADED
            state.user.registered = true
            state.user.handle = handle
            state.user.playerId = playerId
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
            state.game.id = gameId
            state.game.status = status
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
        handleRegisteredPlayers({ commit }, context) {
            commit('trackRegisteredPlayers', context)
        },
        handleAvailableGames({ commit }, context) {
            commit('trackAvailableGames', context)
        },
        handlePlayerRegistered({ commit }, handle, playerId) {
            persistPlayer(handle, playerId)
            commit('trackPlayerRegistered', handle, playerId)
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
        handleGameStarted({ commit }, context) {
            commit('trackGameStatus', GameStatus.GAME_STARTED, context.game_id)
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
        handleGameIdle({ commit }, context) {
            commit('trackGameStatus', GameStatus.GAME_IDLE, context.game_id)
        },
        handleGameInactive({ commit }, context) {
            commit('trackGameStatus', GameStatus.GAME_INACTIVE, context.game_id)
        },
        handleGamePlayerQuit({ commit }, context) {
            commit('trackLatestStatus', GameStatus.PLAYER_QUIT, context.game_id)
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
