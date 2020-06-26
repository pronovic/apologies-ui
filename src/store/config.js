// Callers should access configuration through the store, not directly from here.
//
// Although parcel loads process.env for us based on the .env file, that variable
// is not available to Vue components.  We need to map the process.env variables
// into something that is available to Vue.  This is repetitive, but seems to be
// our best option.  We can't just iterate through process.env, because it exposes
// all environment variables, and that's considered a security risk.  We need to
// list specific variables individually.

function loadConfig(env) {
    return {
        // General configuration
        LOG_LEVEL: env.LOG_LEVEL,
        SHOW_SQUARE_NUMBERS: env.SHOW_SQUARE_NUMBERS === 'true',

        // Websocket configuration
        WEBSOCKET_API: env.WEBSOCKET_API,
        SERVER_TIMEOUT_MS: parseInt(env.SERVER_TIMEOUT_MS),
        INITIAL_RECONNECT_DELAY_MS: parseInt(env.INITIAL_RECONNECT_DELAY_MS),
        MAX_RECONNECT_DELAY_MS: parseInt(env.MAX_RECONNECT_DELAY_MS),
        RECONNECT_DECAY_FACTOR: parseFloat(env.RECONNECT_DECAY_FACTOR),

        // License URLs
        LICENSE_APACHE_2: env.LICENSE_APACHE_2,

        // GitHub URLs
        GITHUB_APOLOGIES: env.GITHUB_APOLOGIES,
        GITHUB_APOLOGIES_SERVER: env.GITHUB_APOLOGIES_SERVER,
        GITHUB_APOLOGIES_UI: env.GITHUB_APOLOGIES_UI,
    }
}

export { loadConfig }
