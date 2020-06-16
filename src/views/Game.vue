<template>
    <div>
        <GameNavbar></GameNavbar>
        <GameBoard></GameBoard>
    </div>
</template>

<script>
import { EventBus } from 'Utils/eventbus'
import GameNavbar from 'Components/GameNavbar.vue'
import GameBoard from 'Components/GameBoard.vue'

export default {
    name: 'Game',
    components: {
        GameNavbar: GameNavbar,
        GameBoard: GameBoard,
    },
    beforeMount: function () {
        EventBus.$on('client-toast', (message) => {
            this.$bvToast.toast(message, {
                title: 'Status Update',
                toaster: 'b-toaster-bottom-left',
                autoHideDelay: 5000,
                appendToast: false,
                noCloseButton: false,
                variant: 'info',
            })
        })
    },
    beforeDestroy: function () {
        EventBus.$off('client-toast')
    },
}
</script>
