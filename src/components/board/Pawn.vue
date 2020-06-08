<template>
    <v-group :id="id">
        <v-shape ref="pawn" :config="config"></v-shape>
    </v-group>
</template>

<script>
import Konva from 'konva'

export default {
    name: 'Pawn',
    props: ['id', 'x', 'y', 'size', 'color', 'bounce'],
    data: function () {
        return {
            animation: null
        }
    },
    computed: {
        config() {
            return {
                fill: this.color,
                stroke: 'black',
                strokeWidth: 1,
                sceneFunc: (context, shape) => {
                    const scale = this.size / 100.0
                    context.beginPath()

                    context.moveTo(this.x - scale * 50, this.y + scale * 50)
                    context.lineTo(this.x - scale * 50, this.y + scale * 40)
                    context.lineTo(this.x - scale * 20, this.y + scale * 30)

                    context.arc(
                        this.x,
                        this.y - scale * 40,
                        scale * 8,
                        Math.PI / 2 + 0.4,
                        Math.PI / 2 - 0.4
                    )

                    context.lineTo(this.x + scale * 20, this.y + scale * 30)
                    context.lineTo(this.x + scale * 50, this.y + scale * 40)
                    context.lineTo(this.x + scale * 50, this.y + scale * 50)

                    context.closePath()

                    context.fillStrokeShape(shape)
                },
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            const amplitude = 5
            const period = 500
            const centerY = this.y
            const pawn = this.$refs.pawn.getNode()

            this.animation = new Konva.Animation(function (frame) {
                pawn.setY(
                    amplitude * Math.sin((frame.time * 2 * Math.PI) / period) +
                        centerY
                )
            }, pawn.getLayer())

            if (this.bounce) {
                this.animation.start()
            }
        })
    },
    watch: {
        bounce: function (newValue, oldValue) {
            console.log("Watch noticed change in bounce from " + oldValue + " to " + newValue)
            this.$nextTick(() => {
                if (newValue) {
                    console.log("Starting animation")
                    this.animation.start()
                } else {
                    console.log("Stopping animation")
                    this.animation.stop()
                }
            })
        }
    }
}
</script>
