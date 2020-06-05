<template>
    <v-stage v-if="visible" :config="stage">
        <v-layer>
            <v-rect :config="border"></v-rect>
        </v-layer>
        <v-layer>
            <PlayerInfoArea :config="info"></PlayerInfoArea>
            <GameBoardArea :config="board"></GameBoardArea>
        </v-layer>
    </v-stage>
</template>

<script>
import PlayerInfoArea from './board/PlayerInfoArea.vue'
import GameBoardArea from './board/GameBoardArea.vue'

export default {
    name: 'GameBoard',
    components: {
        PlayerInfoArea: PlayerInfoArea,
        GameBoardArea: GameBoardArea,
    },
    computed: {
        visible() {
            return this.$store.getters.isGameJoined
        },
        height() {
            return this.$store.getters.displayHeight
        },
        width() {
            return this.$store.getters.displayWidth
        },
        stage() {
            return {
                height: this.height,
                width: this.width,
            }
        },
        border() {
            return {
                x: 10,
                y: 10,
                height: this.height - 20,
                width: this.width - 20,
                fill: 'white',
                stroke: 'black',
                strokeWidth: 1,
            }
        },
        info() {
            return {
                x: 15,
                y: 15,
                height: this.height - 25,
                width: Math.ceil(this.width * (1 / 3)) - 5,
            }
        },
        board() {
            return {
                x: Math.ceil(this.width * (1 / 3)) + 5,
                y: 15,
                height: this.height - 25,
                width: Math.ceil(this.width * (2 / 3)) - 15,
            }
        },
    },
}
</script>
