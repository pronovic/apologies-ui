<template>
    <v-group :id="id" :x="x" :y="y">
        <Pawn :id="id" :x="0" :y="0" :size="40" :color="color"></Pawn>
        <v-text
            :x="30"
            :y="-22"
            :text="name"
            fill="black"
            :fontSize="32"
            align="left"
        ></v-text>
        <v-text
            :x="30"
            :y="8"
            :text="status"
            fill="black"
            :fontSize="14"
            align="left"
        ></v-text>
        <CardBack :id="id + '-card-1'" :x="-25" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-2'" :x="30" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-3'" :x="85" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-4'" :x="140" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-5'" :x="195" :y="25" :size="50"></CardBack>
    </v-group>
</template>

<script>
import Pawn from './Pawn.vue'
import CardBack from './CardBack.vue'

export default {
    name: 'OpponentInfo',
    components: { Pawn: Pawn, CardBack: CardBack },
    props: ['id', 'x', 'y', 'color', 'name', 'status'],
}
</script>
