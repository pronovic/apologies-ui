<template>
    <div>
        <b-dropdown-item @click="handleClick">Unregister</b-dropdown-item>
    </div>
</template>

<script>
export default {
    methods: {
        handleClick() {
            this.$router.push({ name: 'UnregisterHandle' })
        },
    },
}
</script>
