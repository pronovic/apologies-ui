<template>
    <v-group :id="id" :config="group">
        <v-group :id="id + '-front'" v-if="card">
            <v-rect :config="rectFront"></v-rect>
            <v-text :config="textFront"></v-text>
        </v-group>
        <v-group :id="id + '-back'" v-else>
            <v-rect :config="rectBack"></v-rect>
            <v-text :config="textBack"></v-text>
        </v-group>
    </v-group>
</template>

<script>
import { Cards, Colors } from 'Utils/constants'

export default {
    name: 'Card',
    props: ['id', 'x', 'y', 'size', 'color', 'card'],
    computed: {
        group() {
            return {
                x: this.x,
                y: this.y,
            }
        },
        text() {
            switch (this.card) {
                case Cards.CARD_1:
                    return ' 1'
                case Cards.CARD_2:
                    return ' 2'
                case Cards.CARD_3:
                    return ' 3'
                case Cards.CARD_4:
                    return ' 4'
                case Cards.CARD_5:
                    return ' 5'
                case Cards.CARD_7:
                    return ' 7'
                case Cards.CARD_8:
                    return ' 8'
                case Cards.CARD_10:
                    return '10'
                case Cards.CARD_11:
                    return '11'
                case Cards.CARD_12:
                    return '12'
                case Cards.CARD_APOLOGIES:
                    return ' A'
                default:
                    return ''
            }
        },
        rectFront() {
            return {
                x: 0,
                y: 0,
                width: 50,
                height: 75,
                fill: Colors.OFF_WHITE,
                stroke: Colors.BLACK,
                strokeWidth: 1,
                shadowBlur: 0,
                cornerRadius: 12,
            }
        },
        textFront() {
            return {
                x: 5,
                y: 22,
                text: this.text,
                fill: Colors.BLACK,
                fontSize: 36,
                align: 'center',
            }
        },
        rectBack() {
            return {
                x: 0,
                y: 0,
                width: 50,
                height: 75,
                fill: Colors.PURPLE,
                shadowBlur: 0,
                cornerRadius: 12,
            }
        },
        textBack() {
            return {
                x: 7,
                y: 20,
                text: '@',
                fill: Colors.OFF_WHITE,
                fontSize: 36,
                align: 'center',
            }
        },
    },
}
</script>
