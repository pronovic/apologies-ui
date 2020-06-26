import Vue from 'vue'
import Vuex from 'vuex'

import state from 'VStore/state'
import getters from 'VStore/getters'
import mutations from 'VStore/mutations'
import actions from 'VStore/actions'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
})

export default store
