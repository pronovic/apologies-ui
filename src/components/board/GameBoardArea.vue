<template>
    <v-rect :config="border"></v-rect>
</template>

<script>
export default {
    name: 'GameBoardArea',
    components: {},
    props: {
        config: {
            type: Object,
            default: function () {
                return {}
            },
        },
    },
    computed: {
        border() {
            return {
                x: this.config.x,
                y: this.config.y,
                height: this.config.height - 5,
                width: this.config.width - 5,
                fill: 'white',
                stroke: 'white', // TODO: get rid of the border once there are other components
                strokeWidth: 1,
            }
        },
    },
}
</script>
