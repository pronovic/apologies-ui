<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand href="#">Apologies</b-navbar-brand>
        </b-navbar>

        <b-jumbotron class="w-50 mx-auto" bg-variant="white">
            <template v-slot:header
                >Please Wait
                <b-icon
                    icon="arrow-clockwise"
                    animation="spin"
                    font-scale="1"
                ></b-icon
            ></template>

            <template v-slot:lead>
                Please wait while your existing user registration is loaded.
            </template>
        </b-jumbotron>
    </div>
</template>

<script>
import { reregisterHandle, disconnectSocket } from '../utils/client.js'

export default {
    name: 'LoadUser',
    components: {},
    data() {
        return {
            timer: null,
        }
    },
    created: function () {
        // The action below will eventually transition away from this page.
        // If that doesn't happen fast enough, the timeout will be triggered.
        this.timer = setInterval(this.timeout, this.serverTimeoutMs)
        reregisterHandle() // loads data from local storage as needed
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    computed: {
        serverTimeoutMs() {
            return this.$store.state.config.SERVER_TIMEOUT_MS
        },
    },
    methods: {
        timeout() {
            console.log('Timed out waiting to reregister user')
            clearInterval(this.timer)
            disconnectSocket()
            this.$router.push({ name: 'Error' })
        },
    },
}
</script>
