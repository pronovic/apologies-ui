<template>
    <!-- Ordering in this group matters, because it determines which components overlap other components -->

    <v-group :x="320" :y="20">
        <!-- these are the 4 start areas -->
        <CircleArea
            id="redStart"
            :x="268"
            :y="130"
            :color="lightred"
            :boxes="5"
        ></CircleArea>
        <CircleArea
            id="yellowStart"
            :x="688"
            :y="825"
            :color="lightyellow"
            :boxes="5"
        ></CircleArea>
        <CircleArea
            id="blueStart"
            :x="825"
            :y="266"
            :color="lightblue"
            :boxes="5"
        ></CircleArea>
        <CircleArea
            id="greenStart"
            :x="130"
            :y="687"
            :color="lightgreen"
            :boxes="5"
        ></CircleArea>

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

        <!-- these are the 4 home areas -->
        <CircleArea
            id="redHome"
            :x="148"
            :y="430"
            :color="lightred"
            :boxes="5"
        ></CircleArea>
        <CircleArea
            id="yellowHome"
            :x="808"
            :y="525"
            :color="lightyellow"
            :boxes="5"
        ></CircleArea>
        <CircleArea
            id="blueHome"
            :x="525"
            :y="150"
            :color="lightblue"
            :boxes="5"
        ></CircleArea>
        <CircleArea
            id="greenHome"
            :x="430"
            :y="810"
            :color="lightgreen"
            :boxes="5"
        ></CircleArea>

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
import CircleArea from './CircleArea.vue'

export default {
    name: 'GameBoardArea',
    components: {
        VerticalBoxRow: VerticalBoxRow,
        HorizontalBoxRow: HorizontalBoxRow,
        CircleArea: CircleArea,
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
