<template>
    <v-group :id="id" :config="group">
        <v-rect :config="rect"></v-rect>
        <v-text :config="text"></v-text>
    </v-group>
</template>

<script>
import { Colors } from '../../utils/constants.js'

export default {
    name: 'CardBack',
    props: ['id', 'x', 'y', 'size', 'color'],
    computed: {
        purple() {
            return Colors.PURPLE
        },
        group() {
            return {
                x: this.x,
                y: this.y,
            }
        },
        rect() {
            return {
                x: 0,
                y: 0,
                width: 50,
                height: 75,
                fill: this.purple,
                shadowBlur: 0,
                cornerRadius: 12,
            }
        },
        text() {
            return {
                x: 7,
                y: 20,
                text: '@',
                fill: 'white',
                fontSize: 36,
                align: 'center',
            }
        },
    },
}
</script>
