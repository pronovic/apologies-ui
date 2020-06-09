import store from '../store'

const LogLevel = {
    NONE: { name: 'NONE', level: 0 },
    ERROR: { name: 'ERROR', level: 1 },
    WARN: { name: 'WARN', level: 2 },
    INFO: { name: 'INFO', level: 3 },
    DEBUG: { name: 'DEBUG', level: 4 },
}

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

    error(message) {
        this.log(LogLevel.ERROR, message)
    }

    warn(message) {
        this.log(LogLevel.WARN, message)
    }

    info(message) {
        this.log(LogLevel.INFO, message)
    }

    debug(message) {
        this.log(LogLevel.DEBUG, message)
    }

    isEnabled(level) {
        const configured =
            store.state.config.LOG_LEVEL in LogLevel
                ? LogLevel[store.state.config.LOG_LEVEL]
                : LogLevel.ERROR
        return configured.level >= level.level
    }

    getTime() {
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

function sleep(waitMs) {
    return new Promise((resolve) => setTimeout(resolve, waitMs))
}

// random integer between min (inclusive) and max (exclusive)
function random(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const logger = new Logger()

export { logger, sleep, random }
