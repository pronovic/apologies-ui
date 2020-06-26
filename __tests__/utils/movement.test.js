import * as movement from 'Utils/movement'
import { PlayerColor } from 'Utils/constants'

describe('utils/movement.js', () => {
    // For most of these, we're just spot-checking behavior. The actual coordinates and
    // such are hardcoded based on manual experimentation.  All indexes, whether for
    // safe, home, or squares, are zero-based.
    //
    // It's difficult to test the animation queue and the location update process, so
    // we don't even try.  It was hard enough to get working even when looking at the screen.

    // eslint-disable-next-line jest/expect-expect
    test('test registerPawns()', async () => {
        // Just make sure it doesn't blow up
        movement.registerPawns(null, 'pawns', 'positions')
        movement.registerPawns('', 'pawns', 'positions')
        movement.registerPawns('bogus', 'pawns', 'positions')
        movement.registerPawns(PlayerColor.RED, 'pawns', 'positions')
    })

    test('test lookupPosition() for start', async () => {
        // by definition, a location will be one either start, home, safe, or square
        var location = {
            id: 1, // pawn id
            color: PlayerColor.RED,
            start: true,
            home: false,
            safe: null,
            square: null,
        }

        // equivalent to lookupStart(RED, 1)
        expect(movement.lookupPosition(location)).toStrictEqual({
            x: 300,
            y: 100,
        })
    })

    test('test lookupPosition() for home', async () => {
        // by definition, a location will be one either start, home, safe, or square
        var location = {
            id: 1, // pawn id
            color: PlayerColor.RED,
            start: false,
            home: true,
            safe: null,
            square: null,
        }

        // equivalent to lookupHome(RED, 1)
        expect(movement.lookupPosition(location)).toStrictEqual({
            x: 163,
            y: 385,
        })
    })

    test('test lookupPosition() for safe', async () => {
        // by definition, a location will be one either start, home, safe, or square
        var location = {
            id: 1, // pawn id
            color: PlayerColor.RED,
            start: false,
            home: false,
            safe: 3,
            square: null,
        }

        // equivalent to lookupSafe(RED, 3)
        expect(movement.lookupPosition(location)).toStrictEqual({
            x: 140,
            y: 255,
        })
    })

    test('test lookupPosition() for square', async () => {
        // by definition, a location will be one either start, home, safe, or square
        var location = {
            id: 1, // pawn id
            color: PlayerColor.RED,
            start: false,
            home: false,
            safe: null,
            square: 5,
        }

        // equivalent to lookupSquare(5)
        expect(movement.lookupPosition(location)).toStrictEqual({
            x: 320,
            y: 15,
        })
    })

    test('test lookupSquare()', async () => {
        expect(movement.lookupSquare(0)).toStrictEqual({ x: 20, y: 15 })
        expect(movement.lookupSquare(16)).toStrictEqual({ x: 920, y: 75 })
    })

    test('test lookupSafe()', async () => {
        expect(movement.lookupSafe('bogus', 0)).toBeNull()
        expect(movement.lookupSafe(PlayerColor.GREEN, 0)).toStrictEqual({
            x: 80,
            y: 795,
        })
        expect(movement.lookupSafe(PlayerColor.BLUE, 4)).toStrictEqual({
            x: 620,
            y: 135,
        })
    })

    test('test lookupStart()', async () => {
        expect(movement.lookupStart('bogus', 0)).toBeNull()
        expect(movement.lookupStart(PlayerColor.YELLOW, 1)).toStrictEqual({
            x: 720,
            y: 795,
        })
        expect(movement.lookupStart(PlayerColor.GREEN, 3)).toStrictEqual({
            x: 152,
            y: 707,
        })
    })

    test('test lookupHome()', async () => {
        expect(movement.lookupHome('bogus', 0)).toBeNull()
        expect(movement.lookupHome(PlayerColor.RED, 0)).toStrictEqual({
            x: 113,
            y: 385,
        })
        expect(movement.lookupHome(PlayerColor.BLUE, 2)).toStrictEqual({
            x: 485,
            y: 160,
        })
    })
})
