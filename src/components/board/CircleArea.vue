<template>
    <v-circle
        :id="id"
        :x="x"
        :y="y"
        :radius="80"
        :fill="color"
        :stroke="black"
        :strokeWidth="2"
    ></v-circle>
</template>

<script>
import { Colors } from '../../utils/constants'

export default {
    name: 'CircleArea',
    props: ['id', 'x', 'y', 'color'],
    computed: {
        black() {
            return Colors.BLACK
        },
    },
}
</script>
