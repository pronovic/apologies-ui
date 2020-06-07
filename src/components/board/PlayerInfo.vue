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
        <CardBack :id="id + '-card-1'" :x="-25" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-2'" :x="30" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-3'" :x="85" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-4'" :x="140" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-5'" :x="195" :y="25" :size="50"></CardBack>
    </v-group>
</template>

<script>
import Pawn from './Pawn.vue'
import CardBack from './CardBack.vue'
import { Colors } from '../../utils/constants'

export default {
    name: 'PlayerInfo',
    components: { Pawn: Pawn, CardBack: CardBack },
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
