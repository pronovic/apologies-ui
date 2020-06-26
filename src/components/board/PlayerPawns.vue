<template>
    <div>
        <!-- Note that these are not a single v-group, because we want to be able to move them independently -->
        <!-- The (x,y) start of each group has to match that of GameBoardArea, so coordinates are consistent -->
        <v-group :x="320" :y="20">
            <Pawn
                ref="pawn1"
                :id="id + '-1'"
                :position="position1"
                :size="40"
                :color="htmlColor"
                :visible="visible"
            ></Pawn>
        </v-group>
        <v-group :x="320" :y="20">
            <Pawn
                ref="pawn2"
                :id="id + '-2'"
                :position="position2"
                :size="40"
                :color="htmlColor"
                :visible="visible"
            ></Pawn>
        </v-group>
        <v-group :x="320" :y="20">
            <Pawn
                ref="pawn3"
                :id="id + '-3'"
                :position="position3"
                :size="40"
                :color="htmlColor"
                :visible="visible"
            ></Pawn>
        </v-group>
        <v-group :x="320" :y="20">
            <Pawn
                ref="pawn4"
                :id="id + '-4'"
                :position="position4"
                :size="40"
                :color="htmlColor"
                :visible="visible"
            ></Pawn>
        </v-group>
    </div>
</template>

<script>
import Pawn from 'Components/board/Pawn.vue'
import { registerPawns } from 'Utils/movement'
import { Colors } from 'Utils/constants'
import { logger } from 'Utils/util'

export default {
    name: 'PlayerPawns',
    components: { Pawn: Pawn },
    props: ['id', 'color', 'pawns'],
    data: function () {
        return {
            // The (-1, -1) indicates to movement code that these positions are not initialized
            position1: { x: -1, y: -1 },
            position2: { x: -1, y: -1 },
            position3: { x: -1, y: -1 },
            position4: { x: -1, y: -1 },
        }
    },
    mounted() {
        this.$nextTick(() => {
            logger.debug('Registering pawns for color ' + this.color)
            registerPawns(
                this.color,
                [
                    this.$refs.pawn1,
                    this.$refs.pawn2,
                    this.$refs.pawn2,
                    this.$refs.pawn4,
                ],
                [this.position1, this.position2, this.position3, this.position4]
            )
        })
    },
    computed: {
        visible() {
            return this.pawns && this.pawns.length > 0
        },
        htmlColor() {
            return this.pawns &&
                this.pawns.length > 0 &&
                this.color &&
                this.color in Colors
                ? Colors[this.color]
                : Colors.GREY
        },
    },
}
</script>
