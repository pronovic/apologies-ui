<template>
    <v-shape :config="config" />
</template>

<script>
export default {
    name: 'Pawn',
    props: ['id', 'x', 'y', 'size', 'color'],
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
}
</script>
