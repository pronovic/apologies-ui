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

        <!-- this is the text for the 4 start areas -->
        <v-text
            id="redStartText"
            text="START"
            :x="202"
            :y="112"
            :fill="lightred"
            :stroke="black"
            :strokeWidth="1"
            :fontSize="42"
            align="center"
            verticalAlighn="middle"
        ></v-text>
        <v-text
            id="yellowStartText"
            text="START"
            :x="622"
            :y="810"
            :fill="lightyellow"
            :stroke="black"
            :strokeWidth="1"
            :fontSize="42"
            align="center"
            verticalAlighn="middle"
        ></v-text>
        <v-text
            id="blueStartText"
            text="START"
            :x="758"
            :y="250"
            :fill="lightblue"
            :stroke="black"
            :strokeWidth="1"
            :fontSize="42"
            align="center"
            verticalAlighn="middle"
        ></v-text>
        <v-text
            id="greenStartText"
            text="START"
            :x="65"
            :y="670"
            :fill="lightgreen"
            :stroke="black"
            :strokeWidth="1"
            :fontSize="42"
            align="center"
            verticalAlighn="middle"
        ></v-text>

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

        <!-- this is the text for the 4 home areas -->
        <v-text
            id="redHomeText"
            text="HOME"
            :x="86"
            :y="412"
            :fill="lightred"
            :stroke="black"
            :strokeWidth="1"
            :fontSize="42"
            align="center"
            verticalAlighn="middle"
        ></v-text>
        <v-text
            id="yellowHomeText"
            text="HOME"
            :x="745"
            :y="510"
            :fill="lightyellow"
            :stroke="black"
            :strokeWidth="1"
            :fontSize="42"
            align="center"
            verticalAlighn="middle"
        ></v-text>
        <v-text
            id="blueHomeText"
            text="HOME"
            :x="460"
            :y="132"
            :fill="lightblue"
            :stroke="black"
            :strokeWidth="1"
            :fontSize="42"
            align="center"
            verticalAlighn="middle"
        ></v-text>
        <v-text
            id="greenHomeText"
            text="HOME"
            :x="370"
            :y="792"
            :fill="lightgreen"
            :stroke="black"
            :strokeWidth="1"
            :fontSize="42"
            align="center"
            verticalAlighn="middle"
        ></v-text>

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

        <!-- red slides -->
        <RightSlide
            id="redSlide1"
            :x="90"
            :y="10"
            :length="180"
            :color="lightred"
        ></RightSlide>
        <RightSlide
            id="redSlide1"
            :x="560"
            :y="10"
            :length="250"
            :color="lightred"
        ></RightSlide>

        <!-- yellow slides -->
        <LeftSlide
            id="yellowSlide1"
            :x="690"
            :y="910"
            :length="180"
            :color="lightyellow"
        ></LeftSlide>
        <LeftSlide
            id="yellowSlide1"
            :x="150"
            :y="910"
            :length="240"
            :color="lightyellow"
        ></LeftSlide>

        <!-- blue slides -->
        <DownSlide
            id="blueSlide1"
            :x="920"
            :y="90"
            :length="180"
            :color="lightblue"
        ></DownSlide>
        <DownSlide
            id="blueSlide1"
            :x="920"
            :y="570"
            :length="240"
            :color="lightblue"
        ></DownSlide>

        <!-- green slides -->
        <UpSlide
            id="greenSlide1"
            :x="20"
            :y="140"
            :length="240"
            :color="lightgreen"
        ></UpSlide>
        <UpSlide
            id="greenSlide1"
            :x="20"
            :y="680"
            :length="180"
            :color="lightgreen"
        ></UpSlide>
    </v-group>
</template>

<script>
import { Colors } from '../../utils/constants'
import HorizontalBoxRow from './HorizontalBoxRow.vue'
import VerticalBoxRow from './VerticalBoxRow.vue'
import CircleArea from './CircleArea.vue'
import RightSlide from './RightSlide.vue'
import LeftSlide from './LeftSlide.vue'
import DownSlide from './DownSlide.vue'
import UpSlide from './UpSlide.vue'

export default {
    name: 'GameBoardArea',
    components: {
        VerticalBoxRow: VerticalBoxRow,
        HorizontalBoxRow: HorizontalBoxRow,
        CircleArea: CircleArea,
        RightSlide: RightSlide,
        LeftSlide: LeftSlide,
        DownSlide: DownSlide,
        UpSlide: UpSlide,
    },
    computed: {
        white() {
            return Colors.WHITE
        },
        black() {
            return Colors.BLACK
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
    },
}
</script>
