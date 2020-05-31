<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand href="#">Apologies</b-navbar-brand>
        </b-navbar>

        <b-jumbotron class="w-50 mx-auto">
            <template v-slot:header>Handle Unavailable</template>

            <template v-slot:lead>
                Sorry, the handle you chose was already in use.
            </template>

            <p>
                Return to the
                <b-link @click="$router.push({ name: 'Landing' })"
                    >landing page</b-link
                >
                and register a different handle.
            </p>
        </b-jumbotron>
    </div>
</template>

<script>
export default {
    name: 'HandleUnavailable',
    components: {},
}
</script>
