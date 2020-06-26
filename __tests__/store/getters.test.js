import getters from 'VStore/getters'
import { UserLoadStatus, GameStatus } from 'Utils/constants'

describe('store/getters.js', () => {
    test('test displayHeight()', async () => {
        var state = {
            dimensions: { window: { height: 100 }, header: { height: 25 } },
        }
        var result = getters.displayHeight(state)
        expect(result).toBe(75)
    })

    test('test displayWidth()', async () => {
        var state = { dimensions: { window: { width: 100 } } }
        var result = getters.displayWidth(state)
        expect(result).toBe(100)
    })

    test('test playerId()', async () => {
        var state = { user: { playerId: 'x' } }
        var result = getters.playerId(state)
        expect(result).toBe('x')
    })

    test('test playerHandle()', async () => {
        var state = { user: { handle: null } }
        var result = getters.playerHandle(state)
        expect(result).toBe('')

        state = { user: { handle: 'x' } }
        result = getters.playerHandle(state)
        expect(result).toBe('x')
    })

    test('test gameId()', async () => {
        var state = { game: { id: 'x' } }
        var result = getters.gameId(state)
        expect(result).toBe('x')
    })

    test('test availableGames()', async () => {
        var state = { server: { availableGames: 'x' } }
        var result = getters.availableGames(state)
        expect(result).toBe('x')
    })

    test('test userLoadStatus()', async () => {
        var state = { user: { loadStatus: 'x' } }
        var result = getters.userLoadStatus(state)
        expect(result).toBe('x')
    })

    test('test isUserLoaded()', async () => {
        var state = { user: { loadStatus: null } }
        var result = getters.isUserLoaded(state)
        expect(result).toBe(false)

        state = { user: { loadStatus: UserLoadStatus.NOT_LOADED } }
        result = getters.isUserLoaded(state)
        expect(result).toBe(false)

        state = { user: { loadStatus: UserLoadStatus.UNAVAILABLE } }
        result = getters.isUserLoaded(state)
        expect(result).toBe(false)

        state = { user: { loadStatus: UserLoadStatus.ERROR } }
        result = getters.isUserLoaded(state)
        expect(result).toBe(false)

        state = { user: { loadStatus: UserLoadStatus.LOADED } }
        result = getters.isUserLoaded(state)
        expect(result).toBe(true)
    })

    test('test isUserRegistered()', async () => {
        var state = { user: { registered: null } }
        var result = getters.isUserRegistered(state)
        expect(result).toBe(false)

        state = { user: { registered: true } }
        result = getters.isUserRegistered(state)
        expect(result).toBe(true)

        state = { user: { registered: false } }
        result = getters.isUserRegistered(state)
        expect(result).toBe(false)
    })

    test('test isAutoplayEnabled()', async () => {
        var state = { game: { autoplay: null } }
        var result = getters.isAutoplayEnabled(state)
        expect(result).toBe(false)

        state = { game: { autoplay: true } }
        result = getters.isAutoplayEnabled(state)
        expect(result).toBe(true)

        state = { game: { autoplay: false } }
        result = getters.isAutoplayEnabled(state)
        expect(result).toBe(false)
    })

    test('test isGameTerminated()', async () => {
        var state = { game: { terminated: null } }
        var result = getters.isGameTerminated(state)
        expect(result).toBe(false)

        state = { game: { terminated: true } }
        result = getters.isGameTerminated(state)
        expect(result).toBe(true)

        state = { game: { terminated: false } }
        result = getters.isGameTerminated(state)
        expect(result).toBe(false)
    })

    test('test isGameJoined()', async () => {
        var state = { game: { id: null } }
        var result = getters.isGameJoined(state)
        expect(result).toBe(false)

        state = { game: { id: 'x' } }
        result = getters.isGameJoined(state)
        expect(result).toBe(true)
    })

    test('test isGameAdvertised()', async () => {
        var state = { server: { advertisedGame: null } }
        var result = getters.isGameAdvertised(state)
        expect(result).toBe(false)

        state = { server: { advertisedGame: 'x' } }
        result = getters.isGameAdvertised(state)
        expect(result).toBe(true)
    })

    test('test isGameStarted()', async () => {
        var state = { game: { status: null } }
        var result = getters.isGameStarted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.GAME_JOINED } }
        result = getters.isGameStarted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.GAME_STARTED } }
        result = getters.isGameStarted(state)
        expect(result).toBe(true)

        state = { game: { status: GameStatus.GAME_CANCELLED } }
        result = getters.isGameStarted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.GAME_COMPLETED } }
        result = getters.isGameStarted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.GAME_IDLE } }
        result = getters.isGameStarted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.GAME_INACTIVE } }
        result = getters.isGameStarted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.PLAYER_QUIT } }
        result = getters.isGameStarted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.DISCONNECTED } }
        result = getters.isGameStarted(state)
        expect(result).toBe(false)
    })

    test('test isGameCompleted()', async () => {
        var state = { game: { status: null } }
        var result = getters.isGameCompleted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.GAME_JOINED } }
        result = getters.isGameCompleted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.GAME_STARTED } }
        result = getters.isGameCompleted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.GAME_CANCELLED } }
        result = getters.isGameCompleted(state)
        expect(result).toBe(true)

        state = { game: { status: GameStatus.GAME_COMPLETED } }
        result = getters.isGameCompleted(state)
        expect(result).toBe(true)

        state = { game: { status: GameStatus.GAME_IDLE } }
        result = getters.isGameCompleted(state)
        expect(result).toBe(false)

        state = { game: { status: GameStatus.GAME_INACTIVE } }
        result = getters.isGameCompleted(state)
        expect(result).toBe(true)

        state = { game: { status: GameStatus.PLAYER_QUIT } }
        result = getters.isGameCompleted(state)
        expect(result).toBe(true)

        state = { game: { status: GameStatus.DISCONNECTED } }
        result = getters.isGameCompleted(state)
        expect(result).toBe(true)
    })

    test('test isPlayerTurn()', async () => {
        // TODO: implement
    })

    test('test player()', async () => {
        // TODO: implement
    })

    test('test opponents()', async () => {
        // TODO: implement
    })

    test('test redPawns()', async () => {
        // TODO: implement
    })

    test('test yellowPawns()', async () => {
        // TODO: implement
    })

    test('test greenPawns()', async () => {
        // TODO: implement
    })

    test('test bluePawns()', async () => {
        // TODO: implement
    })

    test('test players()', async () => {
        // TODO: implement
    })
})
