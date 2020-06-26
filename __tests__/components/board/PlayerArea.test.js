import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import PlayerArea from 'Components/board/PlayerArea.vue'
import PlayerInfo from 'Components/board/PlayerInfo.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueKonva)

var player = {
    handle: 'theplayer',
}

var opponent1 = {
    handle: 'theopponent1',
}

var opponent2 = {
    handle: 'theopponent2',
}

const store = new Store({
    state: {},
    getters: {
        player: null,
        opponents: null,
    },
})

const mocks = {
    $store: store,
}

describe('Components/board/PlayerArea.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(PlayerArea, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders with null player or opponents', async () => {
        store.getters.player = null
        store.getters.opponents = null
        await Vue.nextTick()
        expect(wrapper.findComponent(PlayerInfo).exists()).toBe(false)
    })

    test('component renders with null player and no opponents', async () => {
        store.getters.player = null
        store.getters.opponents = []
        await Vue.nextTick()
        expect(wrapper.findComponent(PlayerInfo).exists()).toBe(false)
    })

    test('component renders with player', async () => {
        store.getters.player = player
        store.getters.opponents = []
        await Vue.nextTick()
        expect(wrapper.find('#player-theplayer').exists()).toBe(true)
        expect(wrapper.find('#player-theplayer').props().player).toMatchObject(
            player
        )
    })

    test('component renders with opponents', async () => {
        store.getters.player = null
        store.getters.opponents = [opponent1, opponent2]
        await Vue.nextTick()

        expect(wrapper.find('#player-theopponent1').exists()).toBe(true)
        expect(wrapper.find('#player-theopponent2').exists()).toBe(true)

        expect(
            wrapper.find('#player-theopponent1').props().player
        ).toMatchObject(opponent1)
        expect(
            wrapper.find('#player-theopponent2').props().player
        ).toMatchObject(opponent2)
    })
})
