<template>
    <v-group :id="id" :x="x" :y="y">
        <Pawn
            ref="pawn"
            :id="id + '-color'"
            :position="position"
            :size="40"
            :color="color"
            :visible="true"
        ></Pawn>
        <v-text :config="handle"></v-text>
        <v-text :config="status"></v-text>
        <Hand :id="id + '-hand'" :player="player"></Hand>
    </v-group>
</template>

<script>
import { gsap } from 'gsap'

import Pawn from './Pawn.vue'
import Hand from './Hand.vue'
import { PlayerState, PlayerType, Colors } from '../../utils/constants'
import { logger } from '../../utils/util'

export default {
    name: 'PlayerInfo',
    components: { Pawn: Pawn, Hand: Hand },
    props: ['id', 'x', 'y', 'player', 'opponent'],
    data: function () {
        return {
            position: { x: 0, y: 0 },
        }
    },
    methods: {
        bounce() {
            var val = { x: 0, y: -10 }
            gsap.to(val, 0.1, {
                x: 0,
                y: 0,
                yoyo: true,
                repeat: 100,
                onUpdate: () => {
                    this.position.x = parseInt(val.x)
                    this.position.y = parseInt(val.y)
                    this.$refs.pawn.node.getLayer().draw() // this does not seem like a good idea, but it doesn't work otherwise
                },
            })
        },
    },
    watch: {
        player: {
            deep: true,
            handler(newValue, oldValue) {
                logger.info('Handling change to player')
                if (newValue.isWinner) {
                    logger.info('This player is the winner')
                    this.bounce()
                }
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
