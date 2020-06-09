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
    { x: 113, y: 385 },
    { x: 163, y: 385 },
    { x: 113, y: 435 },
    { x: 163, y: 435 },
]

const YELLOW_HOME = [
    { x: 768, y: 485 },
    { x: 818, y: 485 },
    { x: 768, y: 535 },
    { x: 818, y: 535 },
]

const BLUE_HOME = [
    { x: 485, y: 110 },
    { x: 535, y: 110 },
    { x: 485, y: 160 },
    { x: 535, y: 160 },
]

const GREEN_HOME = [
    { x: 390, y: 770 },
    { x: 440, y: 770 },
    { x: 390, y: 820 },
    { x: 440, y: 820 },
]

const RED_SAFE = [
    { x: 140, y: 75 },
    { x: 140, y: 135 },
    { x: 140, y: 195 },
    { x: 140, y: 255 },
    { x: 140, y: 315 },
]

const YELLOW_SAFE = [
    { x: 800, y: 850 },
    { x: 800, y: 790 },
    { x: 800, y: 730 },
    { x: 800, y: 670 },
    { x: 800, y: 610 },
]

const BLUE_SAFE = [
    { x: 860, y: 135 },
    { x: 800, y: 135 },
    { x: 740, y: 135 },
    { x: 680, y: 135 },
    { x: 620, y: 135 },
]

const GREEN_SAFE = [
    { x: 80, y: 795 },
    { x: 140, y: 795 },
    { x: 200, y: 795 },
    { x: 260, y: 795 },
    { x: 320, y: 795 },
]

const SQUARE = [
    { x: 20, y: 15 },
    { x: 80, y: 15 },
    { x: 140, y: 15 },
    { x: 200, y: 15 },
    { x: 260, y: 15 },
    { x: 320, y: 15 },
    { x: 380, y: 15 },
    { x: 440, y: 15 },
    { x: 500, y: 15 },
    { x: 560, y: 15 },
    { x: 620, y: 15 },
    { x: 680, y: 15 },
    { x: 740, y: 15 },
    { x: 800, y: 15 },
    { x: 860, y: 15 },
    { x: 920, y: 15 },

    { x: 920, y: 75 },
    { x: 920, y: 135 },
    { x: 920, y: 195 },
    { x: 920, y: 255 },
    { x: 920, y: 315 },
    { x: 920, y: 375 },
    { x: 920, y: 435 },
    { x: 920, y: 495 },
    { x: 920, y: 555 },
    { x: 920, y: 615 },
    { x: 920, y: 675 },
    { x: 920, y: 735 },
    { x: 920, y: 795 },
    { x: 920, y: 855 },
    { x: 920, y: 915 },

    { x: 860, y: 915 },
    { x: 800, y: 915 },
    { x: 740, y: 915 },
    { x: 680, y: 915 },
    { x: 620, y: 915 },
    { x: 560, y: 915 },
    { x: 500, y: 915 },
    { x: 440, y: 915 },
    { x: 380, y: 915 },
    { x: 320, y: 915 },
    { x: 260, y: 915 },
    { x: 200, y: 915 },
    { x: 140, y: 915 },
    { x: 80, y: 915 },
    { x: 20, y: 915 },

    { x: 20, y: 855 },
    { x: 20, y: 795 },
    { x: 20, y: 735 },
    { x: 20, y: 675 },
    { x: 20, y: 615 },
    { x: 20, y: 555 },
    { x: 20, y: 495 },
    { x: 20, y: 432 },
    { x: 20, y: 372 },
    { x: 20, y: 312 },
    { x: 20, y: 257 },
    { x: 20, y: 195 },
    { x: 20, y: 135 },
    { x: 20, y: 75 },
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

export {
    configureBounce,
    lookupPosition,
    lookupHome,
    lookupStart,
    lookupSafe,
    lookupSquare,
}
