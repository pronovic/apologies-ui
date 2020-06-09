<template>
    <v-group :id="id" :x="x" :y="y">
        <Pawn
            ref="pawn"
            :id="id + '-color'"
            :x="0"
            :y="0"
            :size="40"
            :color="color"
        ></Pawn>
        <v-text :config="handle"></v-text>
        <v-text :config="status"></v-text>
        <Hand :id="id + '-hand'" :player="player"></Hand>
    </v-group>
</template>

<script>
import Pawn from './Pawn.vue'
import Hand from './Hand.vue'
import { PlayerState, Colors } from '../../utils/constants'

export default {
    name: 'OpponentInfo',
    components: { Pawn: Pawn, Hand: Hand },
    props: ['id', 'x', 'y', 'player'],
    mounted() {
        this.$nextTick(() => {
            this.$refs.pawn.toggleBounce(this.player.isWinner)
        })
    },
    watch: {
        player: {
            deep: true,
            handler(newValue, oldValue) {
                this.$refs.pawn.toggleBounce(newValue.isWinner)
            },
        },
    },
    computed: {
        color() {
            return this.player.color && this.player.color in Colors
                ? Colors[this.player.color]
                : Colors.GREY
        },
        handle() {
            return {
                id: this.id + '-handle',
                x: 30,
                y: -23,
                text: this.player.handle,
                fill: Colors.BLACK,
                fontSize: 32,
                align: 'left',
            }
        },
        status() {
            let status = 'Computer Opponent'
            if (this.player.isWinner) {
                status = 'Game Winner'
            } else if (this.player.isAdvertiser) {
                status = 'Game Advertiser'
            } else if (this.player.type === 'HUMAN') {
                status = 'Human Opponent'
                if (this.player.state === PlayerState.QUIT) {
                    status = 'Quit Game (Computer Opponent)'
                } else if (this.player.state === PlayerState.DISCONNECTED) {
                    status = 'Disconnected (Computer Opponent)'
                }
            }

            return {
                id: this.id + '-status',
                x: 30,
                y: 9,
                text: status,
                fill: Colors.BLACK,
                fontSize: 14,
                align: 'left',
            }
        },
    },
}
</script>
