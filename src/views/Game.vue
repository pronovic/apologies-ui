<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand>Apologies</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <b-nav-text
                    :v-if="this.$store.state.user.player"
                    this.class="text-white"
                    ><em>{{
                        this.$store.state.user.player.handle
                    }}</em></b-nav-text
                >
                <b-button size="lg" variant="secondary" class="p-1">
                    <b-icon
                        icon="bell-fill"
                        class="rounded-circle bg-danger p-1"
                        variant="light"
                        v-show="this.$store.state.game.showBell"
                    ></b-icon>
                </b-button>
                <b-button size="md" variant="secondary" class="p-1">
                    <b-icon icon="question-circle" aria-label="Help"></b-icon>
                </b-button>
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
                    <b-dropdown-item @click="unregister"
                        >Unregister</b-dropdown-item
                    >
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
                    ><em>{{ this.$store.state.game.bannerText }}</em></small
                >
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: 'Game',
    components: {},
    methods: {
        unregister() {
            this.$store.dispatch('unregisterPlayer')
        },
    },
    created: function () {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'markPlayerNotRegistered') {
                console.log(
                    'Player not registered; redirecting to landing page'
                )
                this.$router.push({ name: 'Landing' })
            }
        })
    },
}
</script>
