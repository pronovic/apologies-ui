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
        isUserLoaded: (state) => {
            return state.user.loadStatus === UserLoadStatus.LOADED
        },
        isUserRegistered: (state) => {
            return state.user.registered
        },
    },
    mutations: {
        markPlayerRegistered(state, player) {
            state.user.loadStatus = UserLoadStatus.LOADED
            state.user.registered = true
            state.user.player = player
        },
        markPlayerNotRegistered(state) {
            state.user.loadStatus = UserLoadStatus.LOADED
            state.user.registered = false
            state.user.player = null
        },
        markPlayerFailed(state) {
            state.user.loadStatus = UserLoadStatus.FAILED
            state.user.registered = false
            state.user.player = null
        },
    },
    actions: {
        registerPlayer({ commit }, handle) {
            console.log('registerPlayer for handle: ' + handle)
            // TODO: replace with websockets code of some sort - to register the handle
            var player = {
                handle: handle,
                playerId: null,
                gameId: null,
            }
            localStorage.setItem('player', player)
            Vue.nextTick().then(() => {
                commit('markPlayerRegistered', player)
            })
        },
        unregisterPlayer({ commit }) {
            console.log('unregisterPlayer')
            // TODO: replace with websockets code of some sort - to unregister the player
            localStorage.removeItem('player')
            Vue.nextTick().then(() => {
                commit('markPlayerNotRegistered')
            })
        },
        loadUser({ commit }) {
            var player = localStorage.getItem('player')
            if (player == null) {
                console.log('loadUser did not find a player in local storage')
                Vue.nextTick().then(() => {
                    commit('markPlayerNotRegistered')
                })
            } else {
                console.log(
                    'loadUser found player in local storage: ' + player.handle
                )
                // TODO: replace with websockets code of some sort - to check whether player id is valid
                Vue.nextTick().then(() => {
                    commit('markPlayerRegistered', player)
                })
            }
        },
    },
    modules: {},
})

export default store
