<template>
    <v-group ref="group" :id="id" :x="x" :y="y">
        <Pawn
            ref="pawn"
            :id="id + '-pawn'"
            :position="position"
            :size="40"
            :color="color"
            :visible="true"
        ></Pawn>
        <v-text ref="handle" :id="id + '-handle'" :config="handle"></v-text>
        <v-text ref="status" :id="id + '-status'" :config="status"></v-text>
        <Hand ref="hand" :id="id + '-hand'" :player="player"></Hand>
    </v-group>
</template>

<script>
import { gsap } from 'gsap'

import Pawn from 'Components/board/Pawn.vue'
import Hand from 'Components/board/Hand.vue'
import { PlayerState, PlayerType, Colors } from 'Utils/constants'
import { logger } from 'Utils/util'

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
            gsap.to(val, 0.25, {
                x: 0,
                y: 0,
                yoyo: true,
                repeat: 100,
                onUpdate: () => {
                    this.position.x = parseInt(val.x)
                    this.position.y = parseInt(val.y)
                    if (this.$refs.pawn) {
                        this.$refs.pawn.redrawLayer() // this does not seem like a good idea, but it doesn't render otherwise
                    }
                },
            })
        },
    },
    watch: {
        player: {
            deep: true,
            handler(newValue, oldValue) {
                logger.debug('Handling change to player')
                if (newValue && newValue.isWinner) {
                    logger.debug('This player is the winner')
                    this.bounce()
                }
            },
        },
    },
    computed: {
        color() {
            return this.player &&
                this.player.color &&
                this.player.color in Colors
                ? Colors[this.player.color]
                : Colors.GREY
        },
        handle() {
            return {
                id: this.id + '-handle',
                x: 30,
                y: -23,
                text:
                    this.player && this.player.handle ? this.player.handle : '',
                fill: Colors.BLACK,
                fontSize: 32,
                align: 'left',
            }
        },
        statusText() {
            let status = ''

            if (!this.opponent) {
                status = 'Your Player'

                if (this.player && this.player.isWinner) {
                    status = 'Game Winner'
                } else if (this.player && this.player.isAdvertiser) {
                    status = 'Game Advertiser'
                }

                if (this.$store.getters.isAutoplayEnabled) {
                    status = status + ' (Autoplay)'
                }
            } else {
                status = 'Computer Opponent'
                if (this.player && this.player.isWinner) {
                    status = 'Game Winner'
                } else if (this.player && this.player.isAdvertiser) {
                    status = 'Game Advertiser'
                } else if (
                    this.player &&
                    this.player.type === PlayerType.HUMAN
                ) {
                    status = 'Human Opponent'
                    if (this.player && this.player.state === PlayerState.QUIT) {
                        status = 'Quit Game (Autoplay)'
                    } else if (
                        this.player &&
                        this.player.state === PlayerState.DISCONNECTED
                    ) {
                        status = 'Disconnected (Autoplay)'
                    }
                }
            }

            return status
        },
        status() {
            return {
                id: this.id + '-status',
                x: 30,
                y: 9,
                text: this.statusText,
                fill: Colors.BLACK,
                fontSize: 14,
                align: 'left',
            }
        },
    },
}
</script>
