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
import { logger } from 'Utils/util'
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
            this.$bvModal
                .msgBoxConfirm('Are you sure you want to quit the game?', {
                    okVariant: 'danger',
                })
                .then((value) => {
                    if (value) {
                        logger.info('User triggered quit')
                        quitGame()
                    }
                })
                .catch((err) => {}) // eslint-disable-line handle-callback-err
        },
    },
}
</script>
