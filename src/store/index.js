import Vue from 'vue'
import Vuex from 'vuex'
import { config } from './config.js'
import { game } from './game.js'
import { user, UserLoadStatus } from './user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        config: config,
        game: game,
        user: user,
    },
    getters: {
        userLoadStatus: (state) => {
            return state.user.loadStatus
        },
        isUserRegistered: (state) => {
            return state.user.registered
        },
    },
    mutations: {
        setUserLoadStatus(state, loadStatus) {
            state.user.loadStatus = loadStatus
        },
        setUserRegistered(state, registered) {
            state.user.registered = registered
        },
    },
    actions: {
        loadUser({ commit }) {
            // This is dummy data right now; we'll eventually fill it with
            // a combination of local storage and a call to the websocket API.
            Vue.nextTick().then(() => {
                commit('setUserLoadStatus', UserLoadStatus.LOADED)
                commit('setUserRegistered', true)
            })
        },
    },
    modules: {},
})

export default store
