import { loadConfig } from 'VStore/config'

describe('store/config.js', () => {
    test('test valid config mappings from process.env', async () => {
        var env = {
            LOG_LEVEL: 'INFO',
            SHOW_SQUARE_NUMBERS: 'true',
            WEBSOCKET_API: 'websocket',
            SERVER_TIMEOUT_MS: '100',
            INITIAL_RECONNECT_DELAY_MS: '200',
            MAX_RECONNECT_DELAY_MS: '300',
            RECONNECT_DECAY_FACTOR: '4.5',
            LICENSE_APACHE_2: 'license',
            GITHUB_APOLOGIES: 'apologies',
            GITHUB_APOLOGIES_SERVER: 'server',
            GITHUB_APOLOGIES_UI: 'ui',
        }

        var config = loadConfig(env)
        expect(config.LOG_LEVEL).toBe('INFO')
        expect(config.SHOW_SQUARE_NUMBERS).toBe(true)
        expect(config.WEBSOCKET_API).toBe('websocket')
        expect(config.SERVER_TIMEOUT_MS).toBe(100)
        expect(config.INITIAL_RECONNECT_DELAY_MS).toBe(200)
        expect(config.MAX_RECONNECT_DELAY_MS).toBe(300)
        expect(config.RECONNECT_DECAY_FACTOR).toBe(4.5)
        expect(config.LICENSE_APACHE_2).toBe('license')
        expect(config.GITHUB_APOLOGIES).toBe('apologies')
        expect(config.GITHUB_APOLOGIES_SERVER).toBe('server')
        expect(config.GITHUB_APOLOGIES_UI).toBe('ui')

        env.SHOW_SQUARE_NUMBERS = 'false'
        config = loadConfig(env)
        expect(config.SHOW_SQUARE_NUMBERS).toBe(false)
    })
})
