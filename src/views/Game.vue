<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand>Apologies</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <StartGameButton></StartGameButton>
                <GameInProgressIndicator></GameInProgressIndicator>
                <ClearGameButton></ClearGameButton>
                <b-nav-text this.class="text-white"
                    ><em>{{ playerHandle }}</em></b-nav-text
                >
                <GameMenu></GameMenu>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import { EventBus } from '../utils/eventbus.js'
import ClearGameButton from '../components/ClearGameButton.vue'
import GameMenu from '../components/GameMenu.vue'
import GameInProgressIndicator from '../components/GameInProgressIndicator.vue'
import StartGameButton from '../components/StartGameButton.vue'

export default {
    name: 'Game',
    components: {
        GameMenu: GameMenu,
        StartGameButton: StartGameButton,
        GameInProgressIndicator: GameInProgressIndicator,
        ClearGameButton: ClearGameButton,
    },
    beforeMount: function () {
        EventBus.$on('client-toast', (message) => {
            this.$bvToast.toast(message, {
                title: null,
                toaster: 'b-toaster-top-left',
                autoHideDelay: 5000,
                appendToast: false,
                noCloseButton: true,
                variant: 'info',
            })
        })
    },
    beforeDestroy: function () {
        EventBus.$off('client-toast')
    },
    computed: {
        playerHandle() {
            return this.$store.getters.playerHandle
        },
    },
}
</script>
