<template>
    <v-stage ref="stage" v-if="visible" :config="stage">
        <v-layer>
            <PlayerArea ref="player"></PlayerArea>
        </v-layer>
        <v-layer>
            <GameBoardArea ref="board"></GameBoardArea>
        </v-layer>
        <v-layer>
            <PlayerPawns
                id="redPawns"
                :color="red"
                :pawns="redPawns"
            ></PlayerPawns>
            <PlayerPawns
                id="yellowPawns"
                :color="yellow"
                :pawns="yellowPawns"
            ></PlayerPawns>
            <PlayerPawns
                id="bluePawns"
                :color="blue"
                :pawns="bluePawns"
            ></PlayerPawns>
            <PlayerPawns
                id="greenPawns"
                :color="green"
                :pawns="greenPawns"
            ></PlayerPawns>
        </v-layer>
        <v-layer>
            <PositionNumbers id="positions"></PositionNumbers>
        </v-layer>
    </v-stage>
</template>

<script>
import PlayerArea from 'Components/board/PlayerArea.vue'
import GameBoardArea from 'Components/board/GameBoardArea.vue'
import PlayerPawns from 'Components/board/PlayerPawns.vue'
import PositionNumbers from 'Components/board/PositionNumbers.vue'
import { PlayerColor } from 'Utils/constants'

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
        red() {
            return PlayerColor.RED
        },
        yellow() {
            return PlayerColor.YELLOW
        },
        blue() {
            return PlayerColor.BLUE
        },
        green() {
            return PlayerColor.GREEN
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
    },
}
</script>
