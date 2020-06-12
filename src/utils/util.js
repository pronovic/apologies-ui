import store from '../store'

/** Available log levels for our customized logging implementation. */
const LogLevel = {
    NONE: { name: 'NONE', level: 0 },
    ERROR: { name: 'ERROR', level: 1 },
    WARN: { name: 'WARN', level: 2 },
    INFO: { name: 'INFO', level: 3 },
    DEBUG: { name: 'DEBUG', level: 4 },
}

/** Customized logger to replace console.log(). */
class Logger {
    log(level, message) {
        if (this.isEnabled(level)) {
            console.log(
                '[' +
                    this.getTime() +
                    '] ' +
                    level.name.padEnd(5) +
                    ' ' +
                    message
            )
        }
    }

    /** Log an error message. */
    error(message) {
        this.log(LogLevel.ERROR, message)
    }

    /** Log a warning message. */
    warn(message) {
        this.log(LogLevel.WARN, message)
    }

    /** Log an informational message. */
    info(message) {
        this.log(LogLevel.INFO, message)
    }

    /** Log a debug message. */
    debug(message) {
        this.log(LogLevel.DEBUG, message)
    }

    /** Whether a particular log level is currently enabled. */
    isEnabled(level) {
        const configured =
            store.state.config.LOG_LEVEL in LogLevel
                ? LogLevel[store.state.config.LOG_LEVEL]
                : LogLevel.ERROR
        return configured.level >= level.level
    }

    /** Get a timestamp in a standard format. */
    getTime() {
        // This is hideous.  I can't believe there isn't a better way to do this
        // in modern Javascript, but StackOverflow says otherwise. :(

        var now = new Date()

        var hour = now.getHours()
        var minute = now.getMinutes()
        var second = now.getSeconds()
        var millisecond = now.getMilliseconds()

        if (hour.toString().length === 1) {
            hour = '0' + hour
        }

        if (minute.toString().length === 1) {
            minute = '0' + minute
        }

        if (second.toString().length === 1) {
            second = '0' + second
        }

        if (millisecond.toString().length === 1) {
            millisecond = '0' + millisecond
        }

        if (millisecond.toString().length === 2) {
            millisecond = '0' + millisecond
        }

        return hour + ':' + minute + ':' + second + '.' + millisecond
    }
}

/**
 * Sleep for a certain number of milliseconds, returning a promise.
 * @see {@link https://stackoverflow.com/a/39914235/2907667|StackOverflow} for more information.
 */
function sleep(waitMs) {
    return new Promise((resolve) => setTimeout(resolve, waitMs))
}

/**
 * Return a random integer between min (inclusive) and max (inclusive).
 * @see {@link https://stackoverflow.com/a/1527820/2907667|StackOverflow} for more information.
 */
function random(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Singleton logger that all components can use. */
const logger = new Logger()

export { logger, sleep, random }
