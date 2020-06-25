<template>
    <v-group :id="id">
        <v-shape ref="pawn" :config="config"></v-shape>
    </v-group>
</template>

<script>
import { Colors } from 'Utils/constants'

export default {
    name: 'Pawn',
    props: ['id', 'position', 'size', 'color', 'visible'],
    methods: {
        redrawLayer() {
            // This redraws the layer associated with the pawn
            this.$refs.pawn.getNode().getLayer().draw()
        },
    },
    computed: {
        config() {
            return {
                fill: this.color,
                stroke: Colors.BLACK,
                strokeWidth: 1,
                visible: this.visible,
                sceneFunc: (context, shape) => {
                    const scale = this.size / 100.0
                    context.beginPath()

                    context.moveTo(
                        this.position.x - scale * 50,
                        this.position.y + scale * 50
                    )
                    context.lineTo(
                        this.position.x - scale * 50,
                        this.position.y + scale * 40
                    )
                    context.lineTo(
                        this.position.x - scale * 20,
                        this.position.y + scale * 30
                    )

                    context.arc(
                        this.position.x,
                        this.position.y - scale * 40,
                        scale * 8,
                        Math.PI / 2 + 0.4,
                        Math.PI / 2 - 0.4
                    )

                    context.lineTo(
                        this.position.x + scale * 20,
                        this.position.y + scale * 30
                    )
                    context.lineTo(
                        this.position.x + scale * 50,
                        this.position.y + scale * 40
                    )
                    context.lineTo(
                        this.position.x + scale * 50,
                        this.position.y + scale * 50
                    )

                    context.closePath()

                    context.fillStrokeShape(shape)
                },
            }
        },
    },
}
</script>
