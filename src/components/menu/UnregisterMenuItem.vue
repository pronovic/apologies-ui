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
export default {
    name: 'UnregisterMenuItem',
    methods: {
        handleClick() {
            var addendum = ''
            if (this.cancelVisible) {
                addendum = '  This will also cancel your game.'
            } else if (this.quitVisible) {
                addendum = '  This will also quit your game.'
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
                        console.log('User triggered unregister')
                        this.$router.push({ name: 'UnregisterHandle' })
                    }
                })
                .catch((err) => {}) /* eslint handle-callback-err: "off" */
        },
    },
}
</script>
