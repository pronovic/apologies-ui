<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand href="#">Apologies</b-navbar-brand>
        </b-navbar>

        <b-jumbotron class="w-50 mx-auto" bg-variant="white">
            <template v-slot:header>
                Please Wait
                <b-icon
                    icon="arrow-clockwise"
                    animation="spin"
                    font-scale="1"
                ></b-icon>
            </template>

            <template v-slot:lead>
                Please wait while your handle
                <em>{{ handle }}</em> is registered.
            </template>
        </b-jumbotron>
    </div>
</template>

<script>
import { registerHandle } from 'Utils/client'

export default {
    name: 'RegisterHandle',
    components: {},
    data() {
        return {
            handle: null,
        }
    },
    created: function () {
        // This will either transition away from this page or time out
        this.handle = this.$route.params.handle
        registerHandle(this.handle)
    },
}
</script>
