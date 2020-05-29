<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand href="#">Apologies</b-navbar-brand>
        </b-navbar>

        <b-jumbotron class="w-50 mx-auto">
            <template v-slot:header>Not Found</template>

            <template v-slot:lead>
                Sorry, that page was not found.
            </template>

            <p>
                The page you requested was not found. You can try returning to
                the
                <b-link @click="$router.push({ name: 'Landing' })"
                    >landing page</b-link
                >.
            </p>
        </b-jumbotron>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
    components: {},
}
</script>
