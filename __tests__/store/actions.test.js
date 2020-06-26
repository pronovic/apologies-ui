import actions from 'VStore/actions'
import { ServerStatus, GameStatus } from 'Utils/constants'
import * as storage from 'Utils/storage'

jest.mock('Utils/storage')

describe('store/actions.js', () => {
    var commit
    var getters = {}

    beforeEach(() => {
        commit = jest.fn()
    })

    test('test toggleAutoplay() from enabled', async () => {
        getters.isAutoplayEnabled = true
        actions.toggleAutoplay({ commit, getters })
        expect(commit).toHaveBeenCalledWith('trackGameAutoplay', false)
    })

    test('test toggleAutoplay() from disabled', async () => {
        getters.isAutoplayEnabled = false
        actions.toggleAutoplay({ commit, getters })
        expect(commit).toHaveBeenCalledWith('trackGameAutoplay', true)
    })

    test('test markGameTerminated()', async () => {
        actions.markGameTerminated({ commit })
        expect(commit).toHaveBeenCalledWith('trackGameTerminated', true)
    })

    test('test handleHeaderHeightChange', async () => {
        actions.handleHeaderHeightChange({ commit }, 500)
        expect(commit).toHaveBeenCalledWith('trackHeaderHeightChange', 500)
    })

    test('test handleWindowSizeChange', async () => {
        actions.handleWindowSizeChange({ commit })
        expect(commit).toHaveBeenCalledWith('trackWindowSizeChange')
    })

    test('test handleRequestFailed', async () => {
        var context = 'whatever'
        actions.handleRequestFailed({ commit }, context)
        expect(commit).toHaveBeenCalledWith('trackFailure', context)
    })

    test('test handleServerShutdown', async () => {
        actions.handleServerShutdown({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackLatestStatus',
            ServerStatus.SERVER_SHUTDOWN
        )
    })

    test('test handleWebsocketIdle', async () => {
        actions.handleWebsocketIdle({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackLatestStatus',
            ServerStatus.WEBSOCKET_IDLE
        )
    })

    test('test handleWebsocketInactive', async () => {
        actions.handleWebsocketInactive({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackLatestStatus',
            ServerStatus.WEBSOCKET_INACTIVE
        )
    })

    test('test handleWebsocketError', async () => {
        actions.handleWebsocketError({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackLatestStatus',
            ServerStatus.WEBSOCKET_ERROR
        )
    })

    test('test handleRegisteredPlayers', async () => {
        var context = 'whatever'
        actions.handleRegisteredPlayers({ commit }, context)
        expect(commit).toHaveBeenCalledWith('trackRegisteredPlayers', context)
    })

    test('test handleAvailableGames', async () => {
        var context = 'whatever'
        actions.handleAvailableGames({ commit }, context)
        expect(commit).toHaveBeenCalledWith('trackAvailableGames', context)
    })

    test('test handlePlayerRegistered', async () => {
        var player = { handle: 'a', playerId: 'b' }
        actions.handlePlayerRegistered({ commit }, player)
        expect(storage.persistPlayer).toHaveBeenCalledWith('a', 'b')
        expect(commit).toHaveBeenCalledWith('trackPlayerRegistered', player)
    })

    test('test handlePlayerNotRegistered', async () => {
        actions.handlePlayerNotRegistered({ commit })
        expect(storage.clearPlayer).toHaveBeenCalled()
        expect(commit).toHaveBeenCalledWith('trackPlayerNotRegistered')
        expect(commit).toHaveBeenCalledWith('clearGame')
    })

    test('test handlePlayerIdle', async () => {
        actions.handlePlayerIdle({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackLatestStatus',
            ServerStatus.PLAYER_IDLE
        )
    })

    test('test handlePlayerInactive', async () => {
        actions.handlePlayerInactive({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackLatestStatus',
            ServerStatus.PLAYER_INACTIVE
        )
    })

    test('test handlePlayerMessageReceived', async () => {
        var context = 'whatever'
        actions.handlePlayerMessageReceived({ commit }, context)
        expect(commit).toHaveBeenCalledWith('trackReceivedMessage', context)
    })

    test('test handleGameAdvertised', async () => {
        var context = 'whatever'
        actions.handleGameAdvertised({ commit }, context)
        expect(commit).toHaveBeenCalledWith('trackAdvertisedGame', context)
    })

    test('test handleGameInvitation', async () => {
        var context = 'whatever'
        actions.handleGameInvitation({ commit }, context)
        expect(commit).toHaveBeenCalledWith('trackGameInvitation', context)
    })

    test('test handleGameJoined', async () => {
        var context = 'whatever'
        actions.handleGameJoined({ commit }, context)
        expect(commit).toHaveBeenCalledWith(
            'trackGameStatus',
            GameStatus.GAME_JOINED
        )
        expect(commit).toHaveBeenCalledWith('trackGameDetails', context)
    })

    test('test handleGameStarted', async () => {
        actions.handleGameStarted({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackGameStatus',
            GameStatus.GAME_STARTED
        )
    })

    test('test handleGameDisconnected', async () => {
        actions.handleGameDisconnected({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackGameStatus',
            GameStatus.DISCONNECTED
        )
    })

    test('test handleGameCancelled', async () => {
        actions.handleGameCancelled({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackGameStatus',
            GameStatus.GAME_CANCELLED
        )
    })

    test('test handleGameCompleted', async () => {
        var winner = 'whatever'
        actions.handleGameCompleted({ commit }, winner)
        expect(commit).toHaveBeenCalledWith(
            'trackGameStatus',
            GameStatus.GAME_COMPLETED
        )
        expect(commit).toHaveBeenCalledWith('trackGameWinner', winner)
    })

    test('test handleGameIdle', async () => {
        actions.handleGameIdle({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackGameStatus',
            GameStatus.GAME_IDLE
        )
    })

    test('test handleGameInactive', async () => {
        actions.handleGameInactive({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackGameStatus',
            GameStatus.GAME_INACTIVE
        )
    })

    test('test handleGamePlayerQuit', async () => {
        actions.handleGamePlayerQuit({ commit })
        expect(commit).toHaveBeenCalledWith(
            'trackGameStatus',
            GameStatus.PLAYER_QUIT
        )
    })

    test('test handleGamePlayerChange', async () => {
        var context = 'whatever'
        actions.handleGamePlayerChange({ commit }, context)
        expect(commit).toHaveBeenCalledWith('trackGamePlayers', context)
    })

    test('test handleGameStateChange', async () => {
        var context = 'whatever'
        actions.handleGameStateChange({ commit }, context)
        expect(commit).toHaveBeenCalledWith('trackGameState', context)
    })

    test('test handleGamePlayerTurn', async () => {
        var context = 'whatever'
        actions.handleGamePlayerTurn({ commit }, context)
        expect(commit).toHaveBeenCalledWith('trackPlayerTurn', context)
    })

    test('test handleGameClear', async () => {
        actions.handleGameClear({ commit })
        expect(commit).toHaveBeenCalledWith('clearGame')
    })

    test('test handleMovePlayed', async () => {
        actions.handleMovePlayed({ commit })
        expect(commit).toHaveBeenCalledWith('clearPlayerMove')
    })
})
