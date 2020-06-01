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
                        <b-button size="md" variant="secondary" class="p-0">
                            <b-icon icon="list" aria-label="Menu"></b-icon>
                        </b-button>
                    </template>
                    <UnregisterHandleItem />
                </b-dropdown>
            </b-navbar-nav>
        </b-navbar>
        <b-navbar
            toggleable="sm"
            type="dark"
            variant="secondary"
            fixed="bottom"
        >
            <b-navbar-nav class="flex-fill justify-content-center text-white">
                <small
                    ><em>{{ banner }}</em></small
                >
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import UnregisterHandleItem from '../components/UnregisterHandleItem.vue'

export default {
    name: 'Game',
    components: { UnregisterHandleItem: UnregisterHandleItem },
    computed: {
        playerHandle() {
            return this.$store.getters.playerHandle
        },
        banner() {
            return this.$store.getters.banner
        },
    },
}
</script>
