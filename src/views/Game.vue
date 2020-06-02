<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand>Apologies</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
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
import GameMenu from '../components/GameMenu.vue'

export default {
    name: 'Game',
    components: { GameMenu: GameMenu },
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
