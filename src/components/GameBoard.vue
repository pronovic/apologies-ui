<template>
    <div>
        <v-stage v-if="visible" :config="konva">
            <v-layer>
                <v-rect :config="border"></v-rect>
            </v-layer>
        </v-stage>
    </div>
</template>

<script>
export default {
    name: 'GameBoard',
    components: {},
    computed: {
        visible() {
            return this.$store.getters.isGameJoined
        },
        height() {
            return this.$store.getters.displayHeight
        },
        width() {
            return this.$store.getters.displayWidth
        },
        konva() {
            return {
                height: this.height,
                width: this.width,
            }
        },
        border() {
            return {
                x: 10,
                y: 10,
                height: this.height - 20,
                width: this.width - 20,
                fill: 'white',
                stroke: 'black',
                strokeWidth: 1,
            }
        },
    },
}
</script>
