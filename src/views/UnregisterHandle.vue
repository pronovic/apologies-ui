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
                Please wait while your handle is unregistered.
            </template>
        </b-jumbotron>
    </div>
</template>

<script>
import { unregisterHandle } from '../utils/client.js'

export default {
    name: 'UnregisterHandle',
    components: {},
    created: function () {
        // This will either transition away from this page or time out
        unregisterHandle()
    },
}
</script>
