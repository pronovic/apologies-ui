<template>
    <div class="pt-1 pr-2">
        <b-button
            v-if="visible"
            size="md"
            variant="secondary"
            class="p-1"
            v-b-tooltip.hover.left
            title="Start the game before all players have joined"
            @click="handleClick"
        >
            <b-icon
                icon="play-fill"
                animation="throb"
                aria-label="Start Game"
            ></b-icon>
        </b-button>
    </div>
</template>

<script>
import { logger } from 'Utils/util'
import { startGame } from 'Utils/client'

export default {
    name: 'StartGameButton',
    computed: {
        visible() {
            return (
                this.$store.getters.isGameAdvertised &&
                !this.$store.getters.isGameStarted &&
                !this.$store.getters.isGameCompleted
            )
        },
    },
    methods: {
        handleClick() {
            logger.info('User triggered game start')
            startGame()
        },
    },
}
</script>
