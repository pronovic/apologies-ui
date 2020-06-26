<template>
    <div class="pt-1 pr-2">
        <b-button
            ref="button"
            v-if="visible"
            size="md"
            variant="secondary"
            class="p-1"
            v-b-tooltip.hover.left
            title="The game is in progress"
        >
            <b-icon
                icon="arrow-clockwise"
                animation="spin"
                aria-label="Game in Progress"
            ></b-icon>
        </b-button>
    </div>
</template>

<script>
export default {
    name: 'GameInProgressIndicator',
    computed: {
        visible() {
            return (
                this.$store.getters.isGameJoined &&
                this.$store.getters.isGameStarted &&
                !this.$store.getters.isGameCompleted
            )
        },
    },
}
</script>
