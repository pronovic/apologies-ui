import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config'

Vue.use(Vuex)

const game = {
    bannerText:
        'Hint: click the hamburger menu in the top right to start or join a game!', // TODO: seems like this should be a default somewhere, so it's what happens when we clear the text?
    showBell: false,
}

export default new Vuex.Store({
    state: {
        config: config,
        game: game,
    },
    mutations: {},
    actions: {},
    modules: {},
})
