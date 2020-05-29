<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand>Apologies</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
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
                <b-button size="md" variant="secondary" class="p-1">
                    <b-icon icon="list" aria-label="Menu"></b-icon>
                </b-button>
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
}
</script>
