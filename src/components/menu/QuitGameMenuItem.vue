<template>
    <div>
        <b-dropdown-item
            ref="dropdown"
            v-if="visible"
            v-b-tooltip.hover.left
            title="Quit the in-progress game"
            @click="handleClick"
            >Quit Game</b-dropdown-item
        >
    </div>
</template>

<script>
import { logger, confirmDialog } from 'Utils/util'
import { quitGame } from 'Utils/client'

export default {
    name: 'QuitGameMenuItem',
    computed: {
        visible() {
            return (
                this.$store.getters.isGameJoined &&
                !this.$store.getters.isGameAdvertised &&
                !this.$store.getters.isGameCompleted
            )
        },
    },
    methods: {
        handleClick() {
            confirmDialog(
                this,
                'Are you sure you want to quit the game?',
                () => {
                    logger.info('User triggered quit')
                    quitGame()
                }
            )
        },
    },
}
</script>
