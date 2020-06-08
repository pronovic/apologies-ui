import Konva from 'konva'

function sleep(waitMs) {
    return new Promise((resolve) => setTimeout(resolve, waitMs))
}

function configureBounce(x, y, node) {
    const beginX = x
    const beginY = y

    const amplitude = 5
    const period = 500
    const centerY = beginY - 5

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

export { sleep, configureBounce }
