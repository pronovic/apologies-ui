<template>
    <v-group :x="320" :y="20">
        <!-- This is the box around the outside -->
        <HorizontalBoxRow
            id="topBoxes"
            :x="0"
            :y="0"
            :color="white"
            :boxes="16"
        ></HorizontalBoxRow>
        <VerticalBoxRow
            id="leftBoxes"
            :x="0"
            :y="60"
            :color="white"
            :boxes="14"
        ></VerticalBoxRow>
        <VerticalBoxRow
            id="rightBoxes"
            :x="900"
            :y="60"
            :color="white"
            :boxes="14"
        ></VerticalBoxRow>
        <HorizontalBoxRow
            id="bottomBoxes"
            :x="0"
            :y="900"
            :color="white"
            :boxes="16"
        ></HorizontalBoxRow>

        <!-- these are the 4 safe zones -->
        <VerticalBoxRow
            id="redSafe"
            :x="120"
            :y="60"
            :color="lightred"
            :boxes="5"
        ></VerticalBoxRow>
        <VerticalBoxRow
            id="yellowSafe"
            :x="780"
            :y="600"
            :color="lightyellow"
            :boxes="5"
        ></VerticalBoxRow>
        <HorizontalBoxRow
            id="blueSafe"
            :x="600"
            :y="120"
            :color="lightblue"
            :boxes="5"
        ></HorizontalBoxRow>
        <HorizontalBoxRow
            id="greenSafe"
            :x="60"
            :y="780"
            :color="lightgreen"
            :boxes="5"
        ></HorizontalBoxRow>
    </v-group>
</template>

<script>
import { Colors } from '../../utils/constants'
import HorizontalBoxRow from './HorizontalBoxRow.vue'
import VerticalBoxRow from './VerticalBoxRow.vue'

export default {
    name: 'GameBoardArea',
    components: {
        VerticalBoxRow: VerticalBoxRow,
        HorizontalBoxRow: HorizontalBoxRow,
    },
    computed: {
        white() {
            return Colors.WHITE
        },
        lightred() {
            return Colors.LIGHT_RED
        },
        lightyellow() {
            return Colors.LIGHT_YELLOW
        },
        lightgreen() {
            return Colors.LIGHT_GREEN
        },
        lightblue() {
            return Colors.LIGHT_BLUE
        },
        border() {
            return {
                x: 0,
                y: 0,
                height: 960,
                width: 960,
                fill: Colors.WHITE,
                stroke: 'red', // TODO: get rid of the border once there are other components
                strokeWidth: 1,
            }
        },
    },
}
</script>
