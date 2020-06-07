<template>
    <div>
        <v-rect :config="border"></v-rect>
        <!-- TODO: this becomes a loop with one pawn/info section per player, probably a component -->
        <!-- Probably should group the pawn, text, and cards in the hand, then locations are relative to group location -->
        <!-- Need a way to indicate whether to show face or back of card (depending on handle) -->
        <!-- The hand won't be visible until after the game starts - so maybe we "flip" the player's cards when the game starts? -->

        <div v-for="(opponent, index) in opponents" v-bind:key="opponent.id">
            <OpponentInfo
                :id="'player-' + opponent.handle"
                :x="55"
                :y="index * 150 + 50"
                :player="opponent"
            ></OpponentInfo>
        </div>
    </div>
</template>

<script>
import OpponentInfo from './OpponentInfo.vue'

export default {
    name: 'PlayerArea',
    components: { OpponentInfo: OpponentInfo },
    props: {
        config: {
            type: Object,
            default: function () {
                return {}
            },
        },
    },
    computed: {
        opponents() {
            return this.$store.getters.opponents
        },
        border() {
            return {
                x: this.config.x,
                y: this.config.y,
                height: this.config.height - 5,
                width: this.config.width - 5,
                fill: 'white',
                stroke: 'green', // TODO: get rid of the border
                strokeWidth: 1,
            }
        },
    },
}
</script>
