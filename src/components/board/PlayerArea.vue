<template>
    <div>
        <div v-if="player">
            <PlayerInfo
                :id="'player-' + player.handle"
                :x="55"
                :y="50"
                :player="player"
                :opponent="false"
            ></PlayerInfo>
        </div>

        <div
            v-for="(opponent, index) in opponents"
            v-bind:key="opponent.handle"
        >
            <PlayerInfo
                :id="'player-' + opponent.handle"
                :x="55"
                :y="index * 150 + 200"
                :player="opponent"
                :opponent="true"
            ></PlayerInfo>
        </div>
    </div>
</template>

<script>
import PlayerInfo from 'Components/board/PlayerInfo.vue'

export default {
    name: 'PlayerArea',
    components: { PlayerInfo: PlayerInfo },
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
