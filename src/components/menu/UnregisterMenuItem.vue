<template>
    <div>
        <b-dropdown-item
            ref="dropdown"
            @click="handleClick"
            v-b-tooltip.hover.left
            title="Unregister your handle, like logging off"
            >Unregister</b-dropdown-item
        >
    </div>
</template>

<script>
import { logger, confirmDialog } from 'Utils/util'

export default {
    name: 'UnregisterMenuItem',
    methods: {
        handleClick() {
            var message = 'Are you sure you want to unregister?'
            if (!this.$store.getters.isGameCompleted) {
                if (this.$store.getters.isGameAdvertised) {
                    message += '  This will also cancel your game.'
                } else if (this.$store.getters.isGameJoined) {
                    message += '  This will also quit your game.'
                }
            }

            confirmDialog(this, message, () => {
                logger.info('User triggered unregister')
                this.$router.push({ name: 'UnregisterHandle' })
            })
        },
    },
}
</script>
