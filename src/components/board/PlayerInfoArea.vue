<template>
    <div>
        <v-rect :config="border"></v-rect>
        <!-- TODO: this becomes a loop with one pawn/info section per player, probably a component -->
        <!-- Probably should group the pawn, text, and cards in the hand, then locations are relative to group location -->
        <!-- Need a way to indicate whether to show face or back of card (depending on handle) -->
        <!-- The hand won't be visible until after the game starts - so maybe we "flip" the player's cards when the game starts? -->
        <Pawn
            id="yellow-player"
            :x="55"
            :y="50"
            :size="25"
            :color="yellow"
        ></Pawn>
        <CardBack id="yellow-hand-1" :x="30" :y="75" :size="50"></CardBack>
        <CardBack id="yellow-hand-2" :x="85" :y="75" :size="50"></CardBack>
        <CardBack id="yellow-hand-3" :x="140" :y="75" :size="50"></CardBack>
        <CardBack id="yellow-hand-4" :x="195" :y="75" :size="50"></CardBack>
        <CardBack id="yellow-hand-5" :x="250" :y="75" :size="50"></CardBack>
    </div>
</template>

<script>
import Pawn from './Pawn.vue'
import CardBack from './CardBack.vue'
import { Colors } from '../../utils/constants.js'

export default {
    name: 'PlayerInfoArea',
    components: { Pawn: Pawn, CardBack: CardBack },
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
