import * as storage from 'Utils/storage'

describe('utils/storage.js', () => {
    var setItem
    var getItem
    var removeItem

    beforeEach(() => {
        // see: https://stackoverflow.com/a/54157998/2907667
        setItem = jest.fn()
        getItem = jest.fn()
        removeItem = jest.fn()
        Object.getPrototypeOf(window.localStorage).setItem = setItem
        Object.getPrototypeOf(window.localStorage).getItem = getItem
        Object.getPrototypeOf(window.localStorage).removeItem = removeItem
    })

    test('test clearPlayer()', async () => {
        storage.clearPlayer()
        expect(removeItem).toHaveBeenCalledWith('player')
    })

    test('test persistPlayer()', async () => {
        var json = JSON.stringify({ handle: 'a', playerId: 'b' })
        storage.persistPlayer('a', 'b')
        expect(setItem).toHaveBeenCalledWith('player', json)
    })

    test('test loadPlayer()', async () => {
        var invalidJson = "'xasdal:"
        var validJson = JSON.stringify({ handle: 'a', playerId: 'b' })

        getItem
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(invalidJson)
            .mockReturnValueOnce(validJson)

        expect(storage.loadPlayer()).toBeNull() // nothing there
        expect(storage.loadPlayer()).toBeNull() // invalid JSON
        expect(storage.loadPlayer()).toStrictEqual({
            handle: 'a',
            playerId: 'b',
        })
    })
})
