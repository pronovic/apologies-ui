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
import { logger } from '../utils/util.js'
import { loadPlayer } from '../utils/storage.js'
import { reregisterHandle } from '../utils/client.js'

export default {
    name: 'LoadUser',
    components: {},
    created: function () {
        const player = loadPlayer()
        if (player == null) {
            logger.info('No player in local storage')
            this.$store.dispatch('handlePlayerNotRegistered')
            this.$router.push({ name: 'Landing' })
        } else {
            // This will either transition away from this page or time out
            logger.info('Reregistering player from local storage')
            reregisterHandle(player)
        }
    },
}
</script>
