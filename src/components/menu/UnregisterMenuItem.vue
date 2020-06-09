<template>
    <div>
        <b-dropdown-item
            @click="handleClick"
            v-b-tooltip.hover.left
            title="Unregister your handle, like logging off"
            >Unregister</b-dropdown-item
        >
    </div>
</template>

<script>
import { logger } from '../../utils/util.js'

export default {
    name: 'UnregisterMenuItem',
    methods: {
        handleClick() {
            var addendum = ''
            if (!this.$store.getters.isGameCompleted) {
                if (this.$store.getters.isGameAdvertised) {
                    addendum = '  This will also cancel your game.'
                } else if (this.$store.getters.isGameJoined) {
                    addendum = '  This will also quit your game.'
                }
            }

            this.$bvModal
                .msgBoxConfirm(
                    'Are you sure you want to unregister?' + addendum,
                    {
                        okVariant: 'danger',
                    }
                )
                .then((value) => {
                    if (value) {
                        logger.info('User triggered unregister')
                        this.$router.push({ name: 'UnregisterHandle' })
                    }
                })
                .catch((err) => {}) // eslint-disable-line handle-callback-err
        },
    },
}
</script>
