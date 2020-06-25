<template>
    <v-group ref="group" :id="id" :x="x" :y="y">
        <div v-for="index in boxes" v-bind:key="index">
            <v-rect
                :id="id + '-box-' + index"
                :x="(index - 1) * 60"
                :y="0"
                :height="55"
                :width="55"
                :fill="color"
                stroke="black"
                :strokeWidth="2"
            ></v-rect>
        </div>
    </v-group>
</template>

<script>
export default {
    name: 'HorizontalBoxRow',
    props: ['id', 'x', 'y', 'color', 'boxes'],
}
</script>
