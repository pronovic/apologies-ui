<template>
    <div>
        <b-dropdown-item
            ref="dropdown"
            v-if="visible"
            v-b-tooltip.hover.left
            title="Cancel the in-progress game"
            @click="handleClick"
            >Cancel Game</b-dropdown-item
        >
    </div>
</template>

<script>
import { logger, confirmDialog } from 'Utils/util'
import { cancelGame } from 'Utils/client'

export default {
    name: 'CancelGameMenuItem',
    computed: {
        visible() {
            return (
                this.$store.getters.isGameAdvertised &&
                !this.$store.getters.isGameCompleted
            )
        },
    },
    methods: {
        handleClick() {
            confirmDialog(
                this,
                'Are you sure you want to cancel the game?',
                () => {
                    logger.info('User triggered cancel')
                    cancelGame()
                }
            )
        },
    },
}
</script>
