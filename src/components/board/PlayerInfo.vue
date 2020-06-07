<template>
    <v-group :id="id" :x="x" :y="y">
        <Pawn
            :id="id + '-color'"
            :x="0"
            :y="0"
            :size="40"
            :color="color"
        ></Pawn>
        <v-text :config="handle"></v-text>
        <Hand :id="id + '-hand'" :player="player"></Hand>
    </v-group>
</template>

<script>
import Pawn from './Pawn.vue'
import Hand from './Hand.vue'
import { Colors } from '../../utils/constants'

export default {
    name: 'PlayerInfo',
    components: { Pawn: Pawn, Hand: Hand },
    props: ['id', 'x', 'y', 'player'],
    computed: {
        color() {
            return this.player.color && this.player.color in Colors
                ? Colors[this.player.color]
                : Colors.GREY
        },
        pawn() {
            return {
                id: this.id + '-pawn',
                x: 0,
                y: 0,
                size: 40,
                color: this.color,
            }
        },
        handle() {
            return {
                id: this.id + '-handle',
                x: 30,
                y: -15,
                text: this.player.handle,
                fill: 'black',
                fontSize: 32,
                align: 'left',
            }
        },
    },
}
</script>
