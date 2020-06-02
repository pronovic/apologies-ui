<template>
    <div>
        <b-dropdown-item
            v-if="visible"
            v-b-tooltip.hover.left
            title="Advertise a new game"
            @click="handleClick"
            >Advertise Game</b-dropdown-item
        >
    </div>
</template>

<script>
export default {
    name: 'AdvertiseGameMenuItem',
    computed: {
        visible() {
            return !this.$store.getters.isGameJoined
        },
    },
    methods: {
        handleClick() {
            // TODO: this should be a dialog of some sort
            console.log('User triggered advertise')
        },
    },
}
</script>
