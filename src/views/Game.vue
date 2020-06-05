<template>
    <div>
        <GameNavbar></GameNavbar>
    </div>
</template>

<script>
import { EventBus } from '../utils/eventbus.js'
import GameNavbar from '../components/GameNavbar.vue'

export default {
    name: 'Game',
    components: {
        GameNavbar: GameNavbar,
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
}
</script>
