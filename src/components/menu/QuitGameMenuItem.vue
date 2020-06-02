<template>
    <div>
        <b-dropdown-item
            v-if="visible"
            v-b-tooltip.hover.left
            title="Quit the in-progress game"
            @click="handleClick"
            >Quit Game</b-dropdown-item
        >
    </div>
</template>

<script>
import { quitGame } from '../../utils/client.js'

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
            this.$bvModal
                .msgBoxConfirm('Are you sure you want to quit the game?', {
                    okVariant: 'danger',
                })
                .then((value) => {
                    if (value) {
                        console.log('User triggered quit')
                        quitGame()
                    }
                })
                .catch((err) => {}) /* eslint handle-callback-err: "off" */
        },
    },
}
</script>
