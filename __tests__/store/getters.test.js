import getters from 'VStore/getters'

import { UserLoadStatus, GameStatus, PlayerColor } from 'Utils/constants'

describe('store/getters.js - simple getters', () => {
    // Something to keep in mind with these tests is that getters are
    // *defined* as functions, but are *invoked* as simple attributes.  So,
    // to test a getter we call a function, but when we pass in stubbed
    // getters, those are *not* functions.

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

    test('test isPlayerTurn() with null moves', async () => {
        var state = {
            game: {
                playerMoves: null,
            },
        }

        var result = getters.isPlayerTurn(state)
        expect(result).toBe(false)
    })

    test('test isPlayerTurn() with empty moves', async () => {
        var state = {
            game: {
                playerMoves: {},
            },
        }

        var result = getters.isPlayerTurn(state)
        expect(result).toBe(false)
    })

    test('test isPlayerTurn() with moves', async () => {
        // This is an odd-looking object, but comes directly from the webservice JSON
        // in the GAME_PLAYER_TURN response, the moves attribute.
        var state = {
            game: {
                playerMoves: {
                    a9fff13fbe5e46feaeda87382bf4c3b8: {
                        move_id: 'a9fff13fbe5e46feaeda87382bf4c3b8',
                    },
                    x9fff1116axe46feaeda873335f4c1ax: {
                        move_id: 'x9fff1116axe46feaeda873335f4c1ax',
                    },
                },
            },
        }

        var result = getters.isPlayerTurn(state)
        expect(result).toBe(true)
    })

    test('test player() with empty players', async () => {
        var stubbed = {
            playerHandle: 'handle',
            players: {},
        }

        var result = getters.player(null, stubbed)
        expect(result).toBeNull()
    })

    test('test player() with no player handle', async () => {
        var stubbed = {
            playerHandle: null,
            players: { handle: 'result' },
        }

        var result = getters.player(null, stubbed)
        expect(result).toBeNull()
    })

    test('test player() with player handle not found', async () => {
        var stubbed = {
            playerHandle: 'bogus',
            players: { handle: 'result' },
        }

        var result = getters.player(null, stubbed)
        expect(result).toBeNull()
    })

    test('test player() with matching player handle', async () => {
        var stubbed = {
            playerHandle: 'handle',
            players: { handle: 'result' },
        }

        var result = getters.player(null, stubbed)
        expect(result).toBe('result')
    })

    test('test opponents() with empty players', async () => {
        var stubbed = {
            players: {},
        }

        var result = getters.opponents(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test opponents() with no opponents', async () => {
        var stubbed = {
            players: {
                p1: {
                    handle: 'p1',
                    isOpponent: false,
                },
            },
        }

        var result = getters.opponents(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test opponents() with some opponents', async () => {
        var p1 = {
            handle: 'p1',
            isOpponent: false,
        }

        var p2 = {
            handle: 'p2',
            isOpponent: true,
        }

        var p3 = {
            handle: 'p3',
            isOpponent: true,
        }

        var stubbed = {
            players: {
                p1: p1,
                p2: p2,
                p3: p3,
            },
        }

        var result = getters.opponents(null, stubbed)
        expect(result).toStrictEqual([p2, p3]) // hmm, not sure order is guaranteed here?
    })

    test('test redPawns() with no players', async () => {
        var stubbed = {
            players: {},
        }

        var result = getters.redPawns(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test redPawns() with no red player', async () => {
        var player = {
            handle: 'p1',
            color: 'bogus',
            pawns: 'pawns',
        }

        var stubbed = {
            players: {
                p1: player,
            },
        }

        var result = getters.redPawns(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test redPawns() with red player', async () => {
        var player = {
            handle: 'p1',
            color: PlayerColor.RED,
            pawns: 'pawns',
        }

        var stubbed = {
            players: {
                p1: player,
            },
        }

        var result = getters.redPawns(null, stubbed)
        expect(result).toBe('pawns')
    })

    test('test yellowPawns() with no players', async () => {
        var stubbed = {
            players: {},
        }

        var result = getters.yellowPawns(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test yellowPawns() with no yellow player', async () => {
        var player = {
            handle: 'p1',
            color: 'bogus',
            pawns: 'pawns',
        }

        var stubbed = {
            players: {
                p1: player,
            },
        }

        var result = getters.yellowPawns(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test yellowPawns() with yellow player', async () => {
        var player = {
            handle: 'p1',
            color: PlayerColor.YELLOW,
            pawns: 'pawns',
        }

        var stubbed = {
            players: {
                p1: player,
            },
        }

        var result = getters.yellowPawns(null, stubbed)
        expect(result).toBe('pawns')
    })

    test('test greenPawns() with no players', async () => {
        var stubbed = {
            players: {},
        }

        var result = getters.greenPawns(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test greenPawns() with no green player', async () => {
        var player = {
            handle: 'p1',
            color: 'bogus',
            pawns: 'pawns',
        }

        var stubbed = {
            players: {
                p1: player,
            },
        }

        var result = getters.greenPawns(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test greenPawns() with green player', async () => {
        var player = {
            handle: 'p1',
            color: PlayerColor.GREEN,
            pawns: 'pawns',
        }

        var stubbed = {
            players: {
                p1: player,
            },
        }

        var result = getters.greenPawns(null, stubbed)
        expect(result).toBe('pawns')
    })

    test('test bluePawns() with no players', async () => {
        var stubbed = {
            players: {},
        }

        var result = getters.bluePawns(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test bluePawns() with no blue player', async () => {
        var player = {
            handle: 'p1',
            color: 'bogus',
            pawns: 'pawns',
        }

        var stubbed = {
            players: {
                p1: player,
            },
        }

        var result = getters.bluePawns(null, stubbed)
        expect(result).toStrictEqual([])
    })

    test('test bluePawns() with blue player', async () => {
        var player = {
            handle: 'p1',
            color: PlayerColor.BLUE,
            pawns: 'pawns',
        }

        var stubbed = {
            players: {
                p1: player,
            },
        }

        var result = getters.bluePawns(null, stubbed)
        expect(result).toBe('pawns')
    })
})

describe('store/getters.js - player state', () => {
    // Player state is the most complicated getter-related functionality.
    // It merges together information from several sources.  Because data
    // setup is so complicated, and because there are so many test cases,
    // I've split this out from the rest of the getters.

    test('test players()', async () => {
        // TODO: implement
    })
})
