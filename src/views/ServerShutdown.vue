<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand href="#">Apologies</b-navbar-brand>
        </b-navbar>

        <b-jumbotron class="w-50 mx-auto" bg-variant="white">
            <template v-slot:header>Server Shutdown</template>

            <template v-slot:lead>
                Sorry, the backend server has shutdown.
            </template>

            <p>
                Return to the
                <b-link @click="$router.push({ name: 'Landing' })"
                    >landing page</b-link
                >
                and try again later.
            </p>
        </b-jumbotron>
    </div>
</template>

<script>
export default {
    name: 'ServerShutdown',
}
</script>
