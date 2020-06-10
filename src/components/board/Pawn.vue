<template>
    <v-group :id="id">
        <v-shape ref="pawn" :config="config"></v-shape>
    </v-group>
</template>

<script>
import { Colors } from '../../utils/constants'

export default {
    name: 'Pawn',
    props: ['id', 'position', 'size', 'color', 'visible'],
    data: function () {
        return {
            node: null,
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.node = this.$refs.pawn.getNode()
        })
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
