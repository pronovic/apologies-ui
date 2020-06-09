<template>
    <v-stage ref="stage" v-if="visible" :config="stage">
        <v-layer>
            <PlayerArea ref="player" :config="info"></PlayerArea>
            <GameBoardArea ref="board" :config="board"></GameBoardArea>
        </v-layer>
    </v-stage>
</template>

<script>
import PlayerArea from './board/PlayerArea.vue'
import GameBoardArea from './board/GameBoardArea.vue'

export default {
    name: 'GameBoard',
    components: {
        PlayerArea: PlayerArea,
        GameBoardArea: GameBoardArea,
    },
    computed: {
        visible() {
            return this.$store.getters.isGameJoined
        },
        height() {
            return 960 + 15 + 5 // height of components, plus spacing, plus a buffer
        },
        width() {
            return 310 + 960 + 5 + 5 // width of components, plus spacing, plus a buffer
        },
        stage() {
            return {
                height: this.height,
                width: this.width,
            }
        },
        info() {
            return {
                x: 15,
                y: 15,
                height: 960,
                width: 310,
            }
        },
        board() {
            return {
                x: 310 + 5,
                y: 15,
                height: 960,
                width: 960,
            }
        },
    },
}
</script>
