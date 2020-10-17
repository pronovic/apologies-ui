<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand href="#">Apologies</b-navbar-brand>
        </b-navbar>

        <b-jumbotron class="w-50 mx-auto" bg-variant="white">
            <template v-slot:header>Error Occurred</template>

            <template v-slot:lead> Sorry, an error occurred. </template>

            <p>
                An unrecoverable error occurred. You can try returning to the
                <b-link ref="link" @click="$router.push({ name: 'Landing' })"
                    >landing page</b-link
                >. If that doesn't work, please try again later.
            </p>
        </b-jumbotron>
    </div>
</template>

<script>
export default {
    name: 'Error',
    components: {},
}
</script>
