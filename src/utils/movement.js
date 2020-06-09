import Konva from 'konva'
import { PlayerColor } from './constants.js'

const BOUNCE_AMPLITUDE = 5
const BOUNCE_PERIOD_MS = 500

const RED_START = [
    { x: 240, y: 100 },
    { x: 300, y: 100 },
    { x: 240, y: 150 },
    { x: 300, y: 150 },
]

const YELLOW_START = [
    { x: 660, y: 795 },
    { x: 720, y: 795 },
    { x: 660, y: 845 },
    { x: 720, y: 845 },
]

const BLUE_START = [
    { x: 798, y: 236 },
    { x: 848, y: 236 },
    { x: 798, y: 286 },
    { x: 848, y: 286 },
]

const GREEN_START = [
    { x: 102, y: 657 },
    { x: 152, y: 657 },
    { x: 102, y: 707 },
    { x: 152, y: 707 },
]

const RED_HOME = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
]

const YELLOW_HOME = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
]

const BLUE_HOME = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
]

const GREEN_HOME = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
]

const RED_SAFE = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
]

const YELLOW_SAFE = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
]

const BLUE_SAFE = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
]

const GREEN_SAFE = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
]

const SQUARE = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
]

function lookupStart(color, id) {
    switch (color) {
        case PlayerColor.RED:
            return RED_START[id]
        case PlayerColor.YELLOW:
            return YELLOW_START[id]
        case PlayerColor.BLUE:
            return BLUE_START[id]
        case PlayerColor.GREEN:
            return GREEN_START[id]
        default:
            return null
    }
}

function lookupHome(color, id) {
    switch (color) {
        case PlayerColor.RED:
            return RED_HOME[id]
        case PlayerColor.YELLOW:
            return YELLOW_HOME[id]
        case PlayerColor.BLUE:
            return BLUE_HOME[id]
        case PlayerColor.GREEN:
            return GREEN_HOME[id]
        default:
            return null
    }
}

function lookupSafe(color, safe) {
    switch (color) {
        case PlayerColor.RED:
            return RED_SAFE[safe]
        case PlayerColor.YELLOW:
            return YELLOW_SAFE[safe]
        case PlayerColor.BLUE:
            return BLUE_SAFE[safe]
        case PlayerColor.GREEN:
            return GREEN_SAFE[safe]
        default:
            return null
    }
}

function lookupSquare(square) {
    return SQUARE[square]
}

function lookupPosition(location) {
    if (location.start) {
        return lookupStart(location.color, location.id)
    } else if (location.home) {
        return lookupHome(location.color, location.id)
    } else if (location.safe != null) {
        return lookupSafe(location.color, location.safe)
    } else {
        return lookupSquare(location.square)
    }
}

function configureBounce(x, y, node) {
    const beginX = x
    const beginY = y

    const amplitude = BOUNCE_AMPLITUDE
    const period = BOUNCE_PERIOD_MS
    const centerY = beginY - BOUNCE_AMPLITUDE

    const animation = new Konva.Animation(function (frame) {
        node.setY(
            amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + centerY
        )
    }, node.getLayer())

    return {
        node: node,
        beginX: beginX,
        beginY: beginY,
        animation: animation,
        toggle: function (enabled) {
            if (enabled) {
                this.animation.start()
            } else {
                this.animation.stop()
                node.setX(this.beginX)
                node.setY(this.beginY)
            }
        },
    }
}

export { configureBounce, lookupPosition }
