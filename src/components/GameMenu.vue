<template>
    <div>
        <b-dropdown size="sm" id="dropdown-1" no-caret right class="p-0">
            <template v-slot:button-content>
                <b-button size="md" variant="secondary" class="p-1">
                    <b-icon icon="list" aria-label="Menu"></b-icon>
                </b-button>
            </template>

            <b-dropdown-item
                @click="handleUnregister"
                v-b-tooltip.hover.left
                title="Unregister your handle, like logging off"
                >Unregister</b-dropdown-item
            >

            <b-dropdown-divider></b-dropdown-divider>

            <b-dropdown-item
                v-if="joinVisible"
                v-b-tooltip.hover.left
                title="Join a previously-advertised game"
                @click="handleJoin"
                >Join Game</b-dropdown-item
            >

            <b-dropdown-item
                v-if="advertiseVisible"
                v-b-tooltip.hover.left
                title="Advertise a new game"
                @click="handleAdvertise"
                >Advertise Game</b-dropdown-item
            >

            <b-dropdown-item
                v-if="quitVisible"
                v-b-tooltip.hover.left
                title="Quit the in-progress game"
                @click="handleQuit"
                >Quit Game</b-dropdown-item
            >

            <b-dropdown-item
                v-if="cancelVisible"
                v-b-tooltip.hover.left
                title="Cancel the in-progress game"
                @click="handleCancel"
                >Cancel Game</b-dropdown-item
            >

            <b-dropdown-item
                v-if="clearVisible"
                v-b-tooltip.hover.left
                title="Clear the game state"
                @click="handleClear"
                >Clear Game</b-dropdown-item
            >
        </b-dropdown>
    </div>
</template>

<script>
import { quitGame, cancelGame, listAvailableGames } from '../utils/client.js'

export default {
    computed: {
        joinVisible() {
            return !this.$store.getters.isGameJoined
        },
        advertiseVisible() {
            return !this.$store.getters.isGameJoined
        },
        quitVisible() {
            return (
                this.$store.getters.isGameJoined &&
                !this.$store.getters.isGameAdvertised &&
                !this.store.getters.isGameCompleted
            )
        },
        cancelVisible() {
            return (
                this.$store.getters.isGameAdvertised &&
                !this.$store.getters.isGameCompleted
            )
        },
        clearVisible() {
            return (
                this.$store.getters.isGameJoined &&
                this.$store.getters.isGameCompleted
            )
        },
    },
    methods: {
        handleUnregister() {
            var addendum = ''
            if (this.cancelVisible) {
                addendum = '  This will also cancel your game.'
            } else if (this.quitVisible) {
                addendum = '  This will also quit your game.'
            }
            this.$bvModal
                .msgBoxConfirm(
                    'Are you sure you want to unregister?' + addendum,
                    {
                        okVariant: 'danger',
                    }
                )
                .then((value) => {
                    if (value) {
                        console.log('User triggered unregister')
                        this.$router.push({ name: 'UnregisterHandle' })
                    }
                })
                .catch((err) => {}) /* eslint handle-callback-err: "off" */
        },
        handleJoin() {
            // TODO: this should be a dialog of some sort
            console.log('User triggered join')
            listAvailableGames() // this gets the games to show in the dialog
        },
        handleAdvertise() {
            // TODO: this should be a dialog of some sort
            console.log('User triggered advertise')
        },
        handleQuit() {
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
        handleCancel() {
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
                .catch((err) => {}) /* eslint handle-callback-err: "off" */
        },
        handleClear() {
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
