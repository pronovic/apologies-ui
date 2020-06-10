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
                :color="color"
                :visible="visible"
            ></Pawn>
        </v-group>
        <v-group :x="320" :y="20">
            <Pawn
                ref="pawn2"
                :id="id + '-2'"
                :position="position2"
                :size="40"
                :color="color"
                :visible="visible"
            ></Pawn>
        </v-group>
        <v-group :x="320" :y="20">
            <Pawn
                ref="pawn3"
                :id="id + '-3'"
                :position="position3"
                :size="40"
                :color="color"
                :visible="visible"
            ></Pawn>
        </v-group>
        <v-group :x="320" :y="20">
            <Pawn
                ref="pawn4"
                :id="id + '-4'"
                :position="position4"
                :size="40"
                :color="color"
                :visible="visible"
            ></Pawn>
        </v-group>
    </div>
</template>

<script>
import Pawn from './Pawn.vue'
import { lookupPosition } from '../../utils/movement'
import { Colors } from '../../utils/constants'
import { logger } from '../../utils/util'

export default {
    name: 'PlayerPawns',
    components: { Pawn: Pawn },
    props: ['id', 'pawns'],
    data: function () {
        return {
            position1: { x: -1, y: -1 },
            position2: { x: -1, y: -1 },
            position3: { x: -1, y: -1 },
            position4: { x: -1, y: -1 },
        }
    },
    computed: {
        visible() {
            return this.pawns && this.pawns.length > 0
        },
        color() {
            return this.pawns &&
                this.pawns.length &&
                this.pawns[0].color in Colors
                ? Colors[this.pawns[0].color]
                : Colors.GREY
        },
    },
    watch: {
        pawns: {
            deep: true,
            handler(newValue, oldValue) {
                if (newValue && newValue.length > 0) {
                    if (oldValue && oldValue.length > 0) {
                        logger.debug(
                            'Relocating ' + newValue[0].color + ' pawns'
                        )

                        this.position1 = lookupPosition(newValue[0])
                        this.position2 = lookupPosition(newValue[1])
                        this.position3 = lookupPosition(newValue[2])
                        this.position4 = lookupPosition(newValue[3])

                        // for some reason, a redraw of the Konva layer is required
                        this.$refs.pawn1.node.getLayer().draw()
                    } else {
                        logger.debug(
                            'Initializing ' + newValue[0].color + ' pawns'
                        )

                        this.position1 = lookupPosition(newValue[0])
                        this.position2 = lookupPosition(newValue[1])
                        this.position3 = lookupPosition(newValue[2])
                        this.position4 = lookupPosition(newValue[3])

                        // for some reason, a redraw of the Konva layer is required
                        this.$refs.pawn1.node.getLayer().draw()
                    }
                }
            },
        },
    },
}
</script>
