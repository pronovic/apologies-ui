// Although parcel loads process.env for us based on the .env file, that variable
// is not available to Vue components.  We need to map the process.env variables
// into something that is available to Vue.  This is repetitive, but seems to be
// our best option.  We can't just iterate through process.env, because it exposes
// all environment variables, and that's considered a security risk.  We need to
// list specific variables individually.

const config = {
    WEBSOCKET_API: process.env.WEBSOCKET_API,
    LICENSE_APACHE_2: process.env.LICENSE_APACHE_2,
    GITHUB_APOLOGIES: process.env.GITHUB_APOLOGIES,
    GITHUB_APOLOGIES_SERVER: process.env.GITHUB_APOLOGIES_SERVER,
    GITHUB_APOLOGIES_UI: process.env.GITHUB_APOLOGIES_UI,
}

export { config }
