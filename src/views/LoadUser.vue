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
                Please wait while we load your existing user registration.
            </template>
        </b-jumbotron>
    </div>
</template>

<script>
import disconnectSocket from '../utils/client.js'

export default {
    name: 'LoadUser',
    components: {},
    data() {
        return {
            timer: null,
        }
    },
    created: function () {
        this.timer = setInterval(this.timeout, 15000)

        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'markPlayerRegistered') {
                if (this.$route.name !== 'Game') {
                    console.log(
                        'Player is registered; redirecting to game page'
                    )
                    this.$router.push({ name: 'Game' })
                }
            } else if (mutation.type === 'markPlayerNotRegistered') {
                if (this.$route.name !== 'Landing') {
                    console.log(
                        'Player not registered; redirecting to landing page'
                    )
                    this.$router.push({ name: 'Landing' })
                }
            } else if (mutation.type === 'markPlayerHandleUnavailable') {
                if (this.$route.name !== 'HandleUnavailable') {
                    console.log(
                        'Failed to register player: handle is not available'
                    )
                    this.$router.push({ name: 'HandleUnavailable' })
                }
            } else if (mutation.type === 'markPlayerError') {
                if (this.$route.name !== 'Error') {
                    console.log('Failed to register player: general error')
                    this.$router.push({ name: 'Error' })
                }
            }
        })

        this.$store.dispatch('loadUser')
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        timeout() {
            console.log(
                'Failed to load user after 15000ms; disconnecting socket'
            )
            clearInterval(this.timer)
            disconnectSocket()
            this.$router.push({ name: 'Error' })
        },
    },
}
</script>
