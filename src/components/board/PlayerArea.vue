<template>
    <div>
        <div v-if="player">
            <PlayerInfo
                :id="'player-' + player.handle"
                :x="55"
                :y="50"
                :player="player"
            ></PlayerInfo>
        </div>

        <div
            v-for="(opponent, index) in opponents"
            v-bind:key="opponent.handle"
        >
            <OpponentInfo
                :id="'player-' + opponent.handle"
                :x="55"
                :y="index * 150 + 200"
                :player="opponent"
            ></OpponentInfo>
        </div>
    </div>
</template>

<script>
import PlayerInfo from './PlayerInfo.vue'
import OpponentInfo from './OpponentInfo.vue'

export default {
    name: 'PlayerArea',
    components: { PlayerInfo: PlayerInfo, OpponentInfo: OpponentInfo },
    props: {
        config: {
            type: Object,
            default: function () {
                return {}
            },
        },
    },
    computed: {
        player() {
            return this.$store.getters.player
        },
        opponents() {
            return this.$store.getters.opponents
        },
    },
}
</script>
