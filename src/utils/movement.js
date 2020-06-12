import { PlayerColor } from './constants.js'
import { gsap, Circ } from 'gsap'
import { sleep } from './util.js'

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

class AnimationQueue {
    // This animation queue forces pawn location changes to be processed seqentially, one
    // after another.  This way, we only try to animate one pawn's movement at a time, and
    // we don't have to worry about conflicts between animations.  Especially in games
    // where there are automated players, status updates arrive stacked very tightly
    // together, within milliseconds.  Without this queue to serialize animations,
    // multiple pawn animations are often triggered nearly simultaneously, with the effect
    // that pawns stagger around drunkenly and often don't end up where they should.  By
    // processing animations sequentially, we can ensure that each movement completes in
    // its entirety before the next movement starts.

    constructor() {
        this.q = []
        this.locked = false
        this.rendering = false
    }

    async add(pawn, position, location) {
        this.q.push({ pawn: pawn, position: position, location: location })

        while (this.locked) {
            await sleep(100)
        }

        await this.dispatch()
    }

    async dispatch() {
        this.locked = true

        let action
        while ((action = this.q.shift())) {
            var position = lookupPosition(action.location)
            if (
                action.position.x !== position.x ||
                action.position.y !== position.y
            ) {
                await this.animate(action.pawn, action.position, position)
            }
        }

        this.locked = false
    }

    async animate(pawn, position, final) {
        if (position.x === -1 && position.y === -1) {
            // For board initialization, teleport is ok
            // PlayerPawns initializes its locations to (-1,-1)
            position.x = final.x
            position.y = final.y
        } else {
            // Otherwise, we always want to animate the location change
            this.rendering = true

            var val = { x: position.x, y: position.y }
            gsap.to(val, 0.75, {
                x: final.x,
                y: final.y,
                ease: Circ.easeOut,
                onComplete: () => {
                    this.rendering = false
                },
                onUpdate: () => {
                    position.x = parseInt(val.x)
                    position.y = parseInt(val.y)
                    pawn.node.getLayer().draw() // this does not seem like a good idea, but it doesn't render otherwise
                },
            })

            // Now, just periodically poll to see if rendering is complete
            // There is apparently no other, more efficient way to accomplish this
            while (this.rendering) {
                await sleep(100)
            }
        }
    }
}

var queue = new AnimationQueue()
const registered = {}

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

function registerPawns(color, pawns, positions) {
    registered[color] = { pawns: pawns, positions: positions }
}

async function updateLocations(color, locations) {
    for (let i = 0; i < 4; i++) {
        if (registered[color]) {
            const pawn = registered[color].pawns[i]
            const position = registered[color].positions[i]
            const location = locations[i]
            await queue.add(pawn, position, location)
        }
    }
}

export { registerPawns, updateLocations }
