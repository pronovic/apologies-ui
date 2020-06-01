import Vue from 'vue'
import Vuex from 'vuex'
import { config } from '../utils/config.js'
import { game } from '../utils/game.js'
import { user, UserLoadStatus } from '../utils/user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        config: config,
        game: game,
        user: user,
    },
    getters: {
        playerHandle: (state) => {
            return state.user.player == null ? '' : state.user.player.handle
        },
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
        markPlayerHandleUnavailable(state) {
            state.user.loadStatus = UserLoadStatus.UNAVAILABLE
            state.user.registered = false
            state.user.player = null
        },
        markPlayerError(state) {
            state.user.loadStatus = UserLoadStatus.ERROR
            state.user.registered = false
            state.user.player = null
        },
    },
    actions: {
        registerHandle({ commit }, handle) {
            console.log('registerHandle for handle: ' + handle)
            // TODO: replace with websockets code of some sort - to register the handle (the websockets code will do this mutation based on messages received)
            var player = {
                handle: handle,
                playerId: null,
            }
            localStorage.setItem('player', JSON.stringify(player))
            Vue.nextTick().then(() => {
                commit('markPlayerRegistered', player) // might eventually also go to markPlayerHandleUnavailable
            })
        },
        unregisterHandle({ commit }) {
            console.log('unregisterHandle')
            // TODO: replace with websockets code of some sort - to unregister the handle (the websockets code will do this mutation based on messages received)
            localStorage.removeItem('player')
            Vue.nextTick().then(() => {
                commit('markPlayerNotRegistered')
            })
        },
        disconnectSocket({ commit }) {
            console.log('disconnectSocket')
            // TODO: do something to close the socket and interrupt its work; whatever is going on, it's not working
        },
        loadUser({ commit }) {
            console.log('Loading user')
            var stored = localStorage.getItem('player')
            if (stored == null) {
                console.log('loadUser did not find a player in local storage')
                Vue.nextTick().then(() => {
                    commit('markPlayerNotRegistered')
                })
            } else {
                try {
                    var player = JSON.parse(stored)
                    console.log(
                        'loadUser found player in local storage: ' + stored
                    )
                    // TODO: replace with websockets code of some sort - to check whether player id is valid  (the websockets code will do this mutation based on messages received)
                    Vue.nextTick().then(() => {
                        commit('markPlayerRegistered', player)
                    })
                } catch (e) {
                    console.log(
                        'loadUser failed to parse data from local storage:' +
                            stored
                    )
                    console.log(e)
                    Vue.nextTick().then(() => {
                        commit('markPlayerNotRegistered')
                    })
                }
            }
        },
    },
    modules: {},
})

export default store
