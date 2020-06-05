<template>
    <div>
        <v-rect :config="border"></v-rect>
        <!-- TODO: this becomes a loop with one pawn/info section per player, probably a component -->
        <Pawn
            id="yellow-player"
            :x="50"
            :y="50"
            :size="25"
            :color="yellow"
        ></Pawn>
    </div>
</template>

<script>
import Pawn from './Pawn.vue'
import { Colors } from '../../utils/constants.js'

export default {
    name: 'PlayerInfoArea',
    components: { Pawn: Pawn },
    props: {
        config: {
            type: Object,
            default: function () {
                return {}
            },
        },
    },
    computed: {
        yellow() {
            return Colors.YELLOW
        },
        green() {
            return Colors.GREEN
        },
        red() {
            return Colors.RED
        },
        blue() {
            return Colors.BLUE
        },
        stage() {
            return {
                height: this.config.height,
                width: this.config.width,
            }
        },
        border() {
            return {
                x: this.config.x,
                y: this.config.y,
                height: this.config.height - 5,
                width: this.config.width - 5,
                fill: 'white',
                stroke: 'green', // TODO: get rid of the border
                strokeWidth: 1,
            }
        },
    },
}
</script>
