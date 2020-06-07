<template>
    <v-stage v-if="visible" :config="stage">
        <v-layer>
            <PlayerArea :config="info"></PlayerArea>
            <GameBoardArea :config="board"></GameBoardArea>
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
            return this.$store.getters.displayHeight < 800
                ? 800
                : this.$store.getters.displayHeight
        },
        width() {
            return this.$store.getters.displayWidth < 1250
                ? 1250
                : this.$store.getters.displayWidth
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
                height: this.height - 25,
                width: 310,
            }
        },
        board() {
            return {
                x: 310 + 5,
                y: 15,
                height: this.height - 25,
                width: this.width - 310 - 15,
            }
        },
    },
}
</script>
