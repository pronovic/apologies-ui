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
import { configureBounce } from '../../utils/movement'
import { PlayerState, PlayerType, Colors } from '../../utils/constants'

export default {
    name: 'PlayerInfo',
    components: { Pawn: Pawn, Hand: Hand },
    props: ['id', 'x', 'y', 'player', 'opponent'],
    data: function () {
        return {
            node: null,
            bounce: null,
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.node = this.$refs.pawn.node
        })
    },
    methods: {
        toggleBounce(enabled) {
            if (!this.bounce) {
                this.bounce = configureBounce(0, 0, this.node) // (0, 0) because it's relative to group
            }

            this.bounce.toggle(enabled)
        },
    },
    watch: {
        player: {
            deep: true,
            handler(newValue, oldValue) {
                this.toggleBounce(newValue.isWinner)
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
            let status = this.opponent ? 'Computer Opponent' : 'Your Player'
            if (this.player.isWinner) {
                status = 'Game Winner'
            } else if (this.player.isAdvertiser) {
                status = 'Game Advertiser'
            } else {
                if (this.opponent && this.player.type === PlayerType.HUMAN) {
                    status = 'Human Opponent'
                    if (this.player.state === PlayerState.QUIT) {
                        status = 'Quit Game (Computer Opponent)'
                    } else if (this.player.state === PlayerState.DISCONNECTED) {
                        status = 'Disconnected (Computer Opponent)'
                    }
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
