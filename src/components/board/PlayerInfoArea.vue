<template>
    <v-rect :config="border"></v-rect>
</template>

<script>
export default {
    name: 'PlayerInfoArea',
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
        stage() {
            return {
                height: this.config.height,
                width: this.config.width,
            }
        },
        border() {
            return {
                x: this.config.x,
                y: this.config.y,
                height: this.config.height - 5,
                width: this.config.width - 5,
                fill: 'white',
                stroke: 'green', // TODO: get rid of the border
                strokeWidth: 1,
            }
        },
    },
}
</script>
