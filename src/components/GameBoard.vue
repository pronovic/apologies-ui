<template>
    <v-stage ref="stage" v-if="visible" :config="stage">
        <v-layer>
            <PlayerArea ref="player" :config="info"></PlayerArea>
        </v-layer>
        <v-layer>
            <GameBoardArea ref="board" :config="board"></GameBoardArea>
        </v-layer>
        <v-layer>
            <PlayerPawns id="redPawns" :pawns="redPawns"></PlayerPawns>
            <PlayerPawns id="yellowPawns" :pawns="yellowPawns"></PlayerPawns>
            <PlayerPawns id="bluePawns" :pawns="bluePawns"></PlayerPawns>
            <PlayerPawns id="greenPawns" :pawns="greenPawns"></PlayerPawns>
        </v-layer>
        <v-layer>
            <PositionNumbers id="positions"></PositionNumbers>
        </v-layer>
    </v-stage>
</template>

<script>
import PlayerArea from './board/PlayerArea.vue'
import GameBoardArea from './board/GameBoardArea.vue'
import PlayerPawns from './board/PlayerPawns.vue'
import PositionNumbers from './board/PositionNumbers.vue'

export default {
    name: 'GameBoard',
    components: {
        PlayerArea: PlayerArea,
        GameBoardArea: GameBoardArea,
        PlayerPawns: PlayerPawns,
        PositionNumbers: PositionNumbers,
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
        redPawns() {
            return this.$store.getters.redPawns
        },
        yellowPawns() {
            return this.$store.getters.yellowPawns
        },
        bluePawns() {
            return this.$store.getters.bluePawns
        },
        greenPawns() {
            return this.$store.getters.greenPawns
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
