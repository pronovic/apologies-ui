<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-navbar-brand ref="brand" href="#">Apologies</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <RegisterHandleButton id="navbar-register-button" />
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import { logger } from 'Utils/util'
import RegisterHandleButton from 'Components/RegisterHandleButton.vue'

export default {
    name: 'LandingNavbar',
    components: { RegisterHandleButton: RegisterHandleButton },
    mounted() {
        this.$nextTick(() => {
            logger.debug('Landing navbar mounted')
            this.$store.dispatch(
                'handleHeaderHeightChange',
                this.$el.clientHeight
            )
        })
    },
}
</script>
