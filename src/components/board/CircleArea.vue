<template>
    <v-group ref="group" :id="id" :x="x" :y="y">
        <v-circle
            ref="circle"
            :id="id + '-circle'"
            :x="0"
            :y="0"
            :radius="80"
            :fill="color"
            :stroke="black"
            :strokeWidth="2"
        ></v-circle>
    </v-group>
</template>

<script>
import { Colors } from 'Utils/constants'

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
