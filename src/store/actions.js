import { clearPlayer, persistPlayer } from 'Utils/storage'
import { ServerStatus, GameStatus } from 'Utils/constants'

const actions = {
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
}

export default actions
