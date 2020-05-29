import Vue from 'vue'
import Vuex from 'vuex'
import { config } from './config.js'
import { game } from './game.js'
import { user } from './user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        config: config,
        game: game,
        user: user,
    },
    mutations: {},
    actions: {},
    modules: {},
})

export default store
