<template>
    <v-group ref="group" :id="id" :x="x" :y="y">
        <v-rect
            ref="box"
            :id="id + '-box'"
            :x="0"
            :y="6"
            :height="length"
            :width="20"
            :fill="color"
            stroke="black"
            :strokeWidth="2"
        ></v-rect>
        <v-circle
            ref="circle"
            :id="id + '-circle'"
            :x="10"
            :y="length - 8"
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
    name: 'DownSlide',
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

                    context.moveTo(10, 20)
                    context.lineTo(27, -7)
                    context.lineTo(-7, -7)

                    context.closePath()

                    context.fillStrokeShape(shape)
                },
            }
        },
    },
}
</script>
