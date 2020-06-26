<template>
    <div class="pt-1 pr-2">
        <b-button
            ref="button"
            v-if="visible"
            size="md"
            variant="secondary"
            class="p-1"
            v-b-tooltip.hover.left
            title="Clear the game display, now that the game is complete"
            @click="handleClick"
        >
            <b-icon
                icon="trash-fill"
                animation="throb"
                aria-label="Clear Game Display"
            ></b-icon>
        </b-button>
    </div>
</template>

<script>
import { logger } from 'Utils/util'

export default {
    name: 'ClearGameButton',
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
            logger.debug('User triggered clear')
            this.$store.dispatch('handleGameClear')
        },
    },
}
</script>
