<template>
    <div>
        <b-dropdown-item
            v-if="visible"
            v-b-tooltip.hover.left
            title="Cancel the in-progress game"
            @click="handleClick"
            >Cancel Game</b-dropdown-item
        >
    </div>
</template>

<script>
import { cancelGame } from '../../utils/client.js'

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
            this.$bvModal
                .msgBoxConfirm('Are you sure you want to cancel the game?', {
                    okVariant: 'danger',
                })
                .then((value) => {
                    if (value) {
                        console.log('User triggered cancel')
                        cancelGame()
                    }
                })
                .catch((err) => {}) // eslint-disable-line handle-callback-err
        },
    },
}
</script>
