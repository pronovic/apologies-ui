<template>
    <v-group ref="group" :id="id" :x="x" :y="y">
        <v-rect
            ref="box"
            :id="id + '-box'"
            :x="0"
            :y="6"
            :height="20"
            :width="length"
            :fill="color"
            stroke="black"
            :strokeWidth="2"
        ></v-rect>
        <v-circle
            ref="circle"
            :id="id + '-circle'"
            :x="2"
            :y="17"
            :radius="17"
            :fill="color"
            :stroke="black"
            :strokeWidth="2"
        ></v-circle>
        <v-shape
            ref="triangle"
            :id="id + '-triangle'"
            :config="triangle"
        ></v-shape>
    </v-group>
</template>

<script>
import { Colors } from 'Utils/constants'

export default {
    name: 'LeftSlide',
    props: ['id', 'x', 'y', 'color', 'length'],
    computed: {
        black() {
            return Colors.BLACK
        },
        triangle() {
            return {
                fill: this.color,
                stroke: this.black,
                strokeWidth: 2,
                sceneFunc: (context, shape) => {
                    context.beginPath()

                    context.moveTo(this.length - 15, 17)
                    context.lineTo(this.length + 10, 0)
                    context.lineTo(this.length + 10, 33)

                    context.closePath()

                    context.fillStrokeShape(shape)
                },
            }
        },
    },
}
</script>
