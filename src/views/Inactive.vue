<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand href="#">Apologies</b-navbar-brand>
        </b-navbar>

        <b-jumbotron class="w-50 mx-auto" bg-variant="white">
            <template v-slot:header>Inactive</template>

            <template v-slot:lead>
                You were inactive for too long.
            </template>

            <p>
                The server has disconnected you. If you want to continue
                playing, you can try returning to the
                <b-link @click="$router.push({ name: 'Landing' })"
                    >landing page</b-link
                >
                to register your handle again.
            </p>
        </b-jumbotron>
    </div>
</template>

<script>
export default {
    name: 'Inactive',
    components: {},
}
</script>
