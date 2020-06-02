<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand>Apologies</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <b-nav-text this.class="text-white"
                    ><em>{{ playerHandle }}</em></b-nav-text
                >
                <b-dropdown
                    size="sm"
                    id="dropdown-1"
                    no-caret
                    right
                    class="p-0"
                >
                    <template v-slot:button-content>
                        <b-button size="md" variant="secondary" class="p-1">
                            <b-icon icon="list" aria-label="Menu"></b-icon>
                        </b-button>
                    </template>
                    <UnregisterHandleItem />
                </b-dropdown>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import { EventBus } from '../utils/eventbus.js'
import UnregisterHandleItem from '../components/UnregisterHandleItem.vue'

export default {
    name: 'Game',
    components: { UnregisterHandleItem: UnregisterHandleItem },
    created: function () {
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
    computed: {
        playerHandle() {
            return this.$store.getters.playerHandle
        },
    },
}
</script>
