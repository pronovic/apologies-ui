<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand href="#">Apologies</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <RegisterHandleButton id="register1" />
            </b-navbar-nav>
        </b-navbar>

        <b-jumbotron class="w-50 mx-auto">
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
                <b-link :href="this.$store.state.config.LICENSE_APACHE_2"
                    >Apache v2.0</b-link
                >
                license. You can find the source code at GitHub. See
                <b-link :href="this.$store.state.config.GITHUB_APOLOGIES"
                    >apologies</b-link
                >,
                <b-link :href="this.$store.state.config.GITHUB_APOLOGIES_SERVER"
                    >apologies-server</b-link
                >, and
                <b-link :href="this.$store.state.config.GITHUB_APOLOGIES_UI"
                    >apologies-ui</b-link
                >.
            </p>

            <RegisterHandleButton id="register2" />
        </b-jumbotron>
    </div>
</template>

<script>
import RegisterHandleButton from '../components/RegisterHandleButton.vue'

export default {
    name: 'Landing',
    components: { RegisterHandleButton: RegisterHandleButton },
    created: function () {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'markPlayerRegistered') {
                if (this.$route.name !== 'Game') {
                    console.log(
                        'Player is registered; redirecting to game page'
                    )
                    this.$router.push({ name: 'Game' })
                }
            }
        })
    },
}
</script>
