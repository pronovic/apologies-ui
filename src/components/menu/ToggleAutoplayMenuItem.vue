<template>
    <div v-if="visible">
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item
            v-b-tooltip.hover.left
            title="Autoplay lets the game choose your move for you"
            @click="handleClick"
            >{{ text }}</b-dropdown-item
        >
    </div>
</template>

<script>
import { logger } from '../../utils/util.js'
import { optimalMove } from '../../utils/client.js'

export default {
    name: 'ToggleAutoplayMenuItem',
    computed: {
        text() {
            return this.$store.getters.isAutoplayEnabled
                ? 'Disable Autoplay'
                : 'Enable Autoplay'
        },
        visible() {
            return (
                (this.$store.getters.isGameJoined ||
                    this.$store.getters.isGameAdvertised ||
                    this.$store.isGameStarted) &&
                !this.$store.getters.isGameCompleted
            )
        },
    },
    methods: {
        handleClick() {
            this.$store.dispatch('toggleAutoplay')
            logger.info(
                'User toggled autoplay ' +
                    (this.$store.getters.isAutoplayEnabled
                        ? '(now enabled)'
                        : '(now disabled)')
            )
            if (
                this.$store.getters.isAutoplayEnabled &&
                this.$store.getters.isGameStarted &&
                !this.$store.getters.isGameCompleted &&
                this.$store.getters.isPlayerTurn
            ) {
                logger.info(
                    'Autoplay is enabled and turn is pending; executing optimal move'
                )
                optimalMove()
                this.$store.dispatch('handleMovePlayed')
            }
        },
    },
}
</script>
