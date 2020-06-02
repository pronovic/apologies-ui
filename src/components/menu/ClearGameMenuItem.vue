<template>
    <div>
        <b-dropdown-item
            v-if="visible"
            v-b-tooltip.hover.left
            title="Clear the game state"
            @click="handleClick"
            >Clear Game</b-dropdown-item
        >
    </div>
</template>

<script>
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
            this.$bvModal
                .msgBoxConfirm('Are you sure you want clear the game state?', {
                    okVariant: 'danger',
                })
                .then((value) => {
                    if (value) {
                        console.log('User triggered clear')
                        this.$store.dispatch('handleGameClear')
                    }
                })
                .catch((err) => {}) /* eslint handle-callback-err: "off" */
        },
    },
}
</script>
