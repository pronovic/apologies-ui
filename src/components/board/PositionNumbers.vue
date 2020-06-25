<template>
    <!-- This draws bright magenta numbers on top of every position on the board, for debugging. -->
    <!-- You can turn it on and off dynamically (at runtime) by modifying configuration via the Vue plugin -->
    <!-- The (x,y) start of each group has to match that of GameBoardArea, so coordinates are consistent -->
    <v-group :id="id" :x="320" :y="20">
        <div v-if="visible">
            <div v-for="(c, ci) in this.colors" v-bind:key="'c' + ci">
                <div v-for="(s, si) in 4" v-bind:key="'s' + si">
                    <v-text
                        :id="id + '-start-' + c + '-' + si"
                        :config="start(c, si)"
                    ></v-text>
                </div>
                <div v-for="(h, hi) in 4" v-bind:key="'h' + hi">
                    <v-text
                        :id="id + '-home-' + c + '-' + hi"
                        :config="home(c, hi)"
                    ></v-text>
                </div>
                <div v-for="(f, fi) in 5" v-bind:key="'f' + fi">
                    <v-text
                        :id="id + '-safe-' + c + '-' + fi"
                        :config="safe(c, fi)"
                    ></v-text>
                </div>
            </div>
            <div v-for="(q, qi) in 60" v-bind:key="'q' + qi">
                <v-text
                    :id="id + '-square-' + qi"
                    :config="square(qi)"
                ></v-text>
            </div>
        </div>
    </v-group>
</template>

<script>
import {
    lookupHome,
    lookupStart,
    lookupSafe,
    lookupSquare,
} from 'Utils/movement'
import { Colors, PlayerColor } from 'Utils/constants'

export default {
    name: 'PositionNumbers',
    props: ['id'],
    data: function () {
        return {
            colors: [
                PlayerColor.RED,
                PlayerColor.YELLOW,
                PlayerColor.BLUE,
                PlayerColor.GREEN,
            ],
        }
    },
    computed: {
        visible() {
            return this.$store.state.config.SHOW_SQUARE_NUMBERS
        },
    },
    methods: {
        start(color, id) {
            const position = lookupStart(color, id)
            return this.text(position, id.toString())
        },
        home(color, id) {
            const position = lookupHome(color, id)
            return this.text(position, id.toString())
        },
        safe(color, safe) {
            const position = lookupSafe(color, safe)
            return this.text(position, safe.toString())
        },
        square(square) {
            const position = lookupSquare(square)
            return this.text(position, square.toString())
        },
        text(position, text) {
            return {
                x: position.x,
                y: position.y,
                text: text,
                fill: Colors.MAGENTA,
                fontSize: 32,
                align: 'center',
                verticalAlign: 'middle',
            }
        },
    },
}
</script>
