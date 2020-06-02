<template>
    <div>
        <b-dropdown-item
            v-if="visible"
            v-b-tooltip.hover.left
            title="Join a previously-advertised game"
            @click="handleClick"
            >Join Game</b-dropdown-item
        >
    </div>
</template>

<script>
import { listAvailableGames } from '../../utils/client.js'

export default {
    name: 'JoinGameMenuItem',
    computed: {
        visible() {
            return !this.$store.getters.isGameJoined
        },
    },
    methods: {
        handleClick() {
            // TODO: this should be a dialog of some sort
            console.log('User triggered join')
            listAvailableGames() // this gets the games to show in the dialog
        },
    },
}
</script>
