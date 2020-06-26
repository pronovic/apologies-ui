// Callers should access configuration through the store, not directly from here.
//
// Although parcel loads process.env for us based on the .env file, that
// variable is not available to Vue components.  We need to map the process.env
// variables into something that is available to Vue.  This is repetitive, but
// seems to be our best option.
//
// We aren't allowed to just iterate through process.env, because it exposes
// all environment variables, and that's considered a security risk.  We need
// to list specific variables individually.  Also, it doens't work to make this
// function accept an env argument, and pass process.env into it.  I think
// there is some sort of compile time search/replace going on and process.env
// isn't really a variable in the normal sense.

function loadConfig() {
    return {
        // General configuration
        LOG_LEVEL: process.env.LOG_LEVEL,
        SHOW_SQUARE_NUMBERS: process.env.SHOW_SQUARE_NUMBERS === 'true',

        // Websocket configuration
        WEBSOCKET_API: process.env.WEBSOCKET_API,
        SERVER_TIMEOUT_MS: parseInt(process.env.SERVER_TIMEOUT_MS),
        INITIAL_RECONNECT_DELAY_MS: parseInt(
            process.env.INITIAL_RECONNECT_DELAY_MS
        ),
        MAX_RECONNECT_DELAY_MS: parseInt(process.env.MAX_RECONNECT_DELAY_MS),
        RECONNECT_DECAY_FACTOR: parseFloat(process.env.RECONNECT_DECAY_FACTOR),

        // License URLs
        LICENSE_APACHE_2: process.env.LICENSE_APACHE_2,

        // GitHub URLs
        GITHUB_APOLOGIES: process.env.GITHUB_APOLOGIES,
        GITHUB_APOLOGIES_SERVER: process.env.GITHUB_APOLOGIES_SERVER,
        GITHUB_APOLOGIES_UI: process.env.GITHUB_APOLOGIES_UI,
    }
}

export { loadConfig }
