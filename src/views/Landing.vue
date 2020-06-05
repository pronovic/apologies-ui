<template>
    <div>
        <LandingNavbar></LandingNavbar>

        <b-jumbotron class="w-50 mx-auto" bg-variant="white">
            <template v-slot:header>Apologies</template>

            <template v-slot:lead>
                A demonstration project using Vue.js on the frontend and Python
                websockets on the backend.
            </template>

            <p>
                Apologies is a game much like Sorry. You can play against your
                friends or one or more computer opponents. Click the
                <b>Register</b>
                button below to register the handle (nickname) you want to be
                known by. You can keep the handle as long as you're actively
                playing. Someone else might take the handle if you're away for a
                while.
            </p>

            <p>
                All of the source code is released under the
                <b-link :href="licenseUrl">Apache v2.0</b-link>
                license. You can find the source code at GitHub. See
                <b-link :href="apologiesUrl">apologies</b-link>,
                <b-link :href="apologiesServerUrl">apologies-server</b-link>,
                and <b-link :href="apologiesUiUrl">apologies-ui</b-link>.
            </p>

            <RegisterHandleButton id="register2" />
        </b-jumbotron>
    </div>
</template>

<script>
import LandingNavbar from '../components/LandingNavbar.vue'
import RegisterHandleButton from '../components/RegisterHandleButton.vue'

export default {
    name: 'Landing',
    components: {
        LandingNavbar: LandingNavbar,
        RegisterHandleButton: RegisterHandleButton,
    },
    computed: {
        licenseUrl() {
            return this.$store.state.config.LICENSE_APACHE_2
        },
        apologiesUrl() {
            return this.$store.state.config.GITHUB_APOLOGIES
        },
        apologiesServerUrl() {
            return this.$store.state.config.GITHUB_APOLOGIES_SERVER
        },
        apologiesUiUrl() {
            return this.$store.state.config.GITHUB_APOLOGIES_UI
        },
    },
}
</script>
