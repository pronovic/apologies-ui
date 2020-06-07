<template>
    <v-group :id="id" :x="x" :y="y">
        <CardBack :id="id + '-card-1'" :x="-25" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-2'" :x="30" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-3'" :x="85" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-4'" :x="140" :y="25" :size="50"></CardBack>
        <CardBack :id="id + '-card-5'" :x="195" :y="25" :size="50"></CardBack>
    </v-group>
</template>

<script>
import CardBack from './CardBack.vue'

export default {
    name: 'Hand',
    components: { CardBack: CardBack },
    props: ['id', 'x', 'y', 'player'],
    computed: {},
}
</script>
