<template>
    <div>
        <b-dropdown-item
            v-if="visible"
            v-b-tooltip.hover.left
            title="Clear the game display, now that the game is complete"
            @click="handleClick"
            >Clear Game Display</b-dropdown-item
        >
    </div>
</template>

<script>
import { logger } from 'Utils/util'

export default {
    name: 'ClearGameMenuItem',
    computed: {
        visible() {
            return (
                this.$store.getters.isGameJoined &&
                this.$store.getters.isGameCompleted
            )
        },
    },
    methods: {
        handleClick() {
            logger.info('User triggered clear')
            this.$store.dispatch('handleGameClear')
        },
    },
}
</script>
