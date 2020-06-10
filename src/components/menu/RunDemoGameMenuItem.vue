<template>
    <div v-if="visible">
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item
            v-b-tooltip.hover.left
            title="Run a fully-automated demo game"
            @click="handleClick"
            >Run Demo Game</b-dropdown-item
        >
    </div>
</template>

<script>
import { logger } from '../../utils/util.js'
import { advertiseGame } from '../../utils/client.js'
import { GameMode } from '../../utils/constants.js'

export default {
    name: 'RunDemoGameMenuItem',
    computed: {
        visible() {
            return (
                !this.$store.getters.isGameJoined &&
                !this.$store.getters.isGameAdvertised &&
                !this.$store.getters.isGame &&
                !this.$store.getters.isGameCompleted
            )
        },
    },
    methods: {
        handleClick() {
            logger.info('User triggered demo game')

            const advertised = {
                name: 'Demo Game',
                mode: GameMode.ADULT,
                players: 4,
                visibility: 'PUBLIC',
                invited_handles: [],
            }

            this.$store.dispatch('markDemoInProgress')
            advertiseGame(advertised)
        },
    },
}
</script>
