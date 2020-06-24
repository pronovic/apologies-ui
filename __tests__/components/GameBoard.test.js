import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import GameBoard from 'Components/GameBoard.vue'
import { PlayerColor } from 'Utils/constants'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueKonva)

const store = new Store({
    state: {},
    getters: {
        isGameJoined: true,
        redPawns: 'red-pawns', // not the real type of object
        yellowPawns: 'yellow-pawns', // not the real type of object
        bluePawns: 'blue-pawns', // not the real type of object
        greenPawns: 'green-pawns', // not the real type of object
    },
})

const mocks = {
    $store: store,
}

describe('Components/GameBoard.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(GameBoard, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('stage not visible if game not joined', async () => {
        store.getters.isGameJoined = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'stage' }).exists()).toBe(false)
    })

    test('stage visible if game is joined', async () => {
        await Vue.nextTick()
        var expected = { width: 1280, height: 980 } // the size of the entire game board is 1280x980
        expect(
            wrapper.findComponent({ ref: 'stage' }).props().config
        ).toStrictEqual(expected)
    })

    test('player', async () => {
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'player' }).exists()).toBe(true)
    })

    test('board', async () => {
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'board' }).exists()).toBe(true)
    })

    test('red pawns', async () => {
        await Vue.nextTick()
        expect(wrapper.find('#redPawns').props().color).toBe(PlayerColor.RED)
        expect(wrapper.find('#redPawns').props().pawns).toBe('red-pawns') // from the store
    })

    test('yellow pawns', async () => {
        await Vue.nextTick()
        expect(wrapper.find('#yellowPawns').props().color).toBe(
            PlayerColor.YELLOW
        )
        expect(wrapper.find('#yellowPawns').props().pawns).toBe('yellow-pawns') // from the store
    })

    test('blue pawns', async () => {
        await Vue.nextTick()
        expect(wrapper.find('#bluePawns').props().color).toBe(PlayerColor.BLUE)
        expect(wrapper.find('#bluePawns').props().pawns).toBe('blue-pawns') // from the store
    })

    test('green pawns', async () => {
        await Vue.nextTick()
        expect(wrapper.find('#greenPawns').props().color).toBe(
            PlayerColor.GREEN
        )
        expect(wrapper.find('#greenPawns').props().pawns).toBe('green-pawns') // from the store
    })

    test('positions', async () => {
        await Vue.nextTick()
        expect(wrapper.find('#positions').exists()).toBe(true)
    })
})
