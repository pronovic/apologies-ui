import * as util from 'Utils/util'

describe('utils/util.js', () => {
    // We don't test the logger because it dumps confusing output to the test console

    test('test objectToString()', async () => {
        var object = { one: 1, two: 'duex', three: null }
        var string = util.objectToString(object)
        expect(string).not.toBeNull()
    })

    test('test random()', async () => {
        for (var i = 0; i < 100; i++) {
            var result = util.random(25, 75)
            expect(result >= 25 && result <= 75).toBe(true)
        }
    })

    test('test sleep()', async () => {
        var start = Date.now()
        await util.sleep(250).then(() => {
            var end = Date.now()
            var elapsed = end - start
            expect(elapsed >= 225 && elapsed <= 275).toBe(true) // 25ms of slop
        })
    })
})
