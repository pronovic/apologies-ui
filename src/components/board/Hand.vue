<template>
    <v-group :id="id" :x="x" :y="y">
        <div v-for="(card, index) in player.hand" v-bind:key="index">
            <Card
                :id="id + '-card-' + index"
                :x="index * 55 - 25"
                :y="25"
                :size="50"
                :card="card"
            ></Card>
        </div>
    </v-group>
</template>

<script>
import Card from 'Components/board/Card.vue'

export default {
    name: 'Hand',
    components: { Card: Card },
    props: ['id', 'x', 'y', 'player'],
}
</script>
