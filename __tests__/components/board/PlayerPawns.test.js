import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import PlayerPawns from 'Components/board/PlayerPawns.vue'
import { PlayerColor, Colors } from 'Utils/constants'
import * as movement from 'Utils/movement'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueKonva)

jest.mock('Utils/movement')

const store = new Store({
    state: {},
    getters: {
        isAutoplayEnabled: false,
    },
})

const mocks = {
    $store: store,
}

// the actual type of the pawns doesn't matter, only the length of the array
const pawns = ['a', 'b', 'c', 'd']

const props = {
    id: 'testpawns',
    color: null,
    pawns: null,
}

describe('Components/board/PlayerPawns.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(PlayerPawns, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders with null color and pawns', async () => {
        props.color = null
        props.pawns = null
        wrapper.setProps(props)

        await Vue.nextTick()

        var pawn1 = wrapper.findComponent({ ref: 'pawn1' })
        var pawn2 = wrapper.findComponent({ ref: 'pawn2' })
        var pawn3 = wrapper.findComponent({ ref: 'pawn3' })
        var pawn4 = wrapper.findComponent({ ref: 'pawn4' })

        expect(wrapper.vm.position1).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position2).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position3).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position4).toStrictEqual({ x: -1, y: -1 })

        // for some reason, checking arguments here causes the test to hang
        expect(movement.registerPawns).toHaveBeenCalled()

        expect(pawn1.attributes().id).toBe('testpawns-1')
        expect(pawn1.props().color).toBe(Colors.GREY)
        expect(pawn1.props().visible).toBeFalsy()
        expect(pawn1.props().position).toMatchObject(wrapper.vm.position1)

        expect(pawn2.attributes().id).toBe('testpawns-2')
        expect(pawn2.props().color).toBe(Colors.GREY)
        expect(pawn2.props().visible).toBeFalsy()
        expect(pawn2.props().position).toMatchObject(wrapper.vm.position2)

        expect(pawn3.attributes().id).toBe('testpawns-3')
        expect(pawn3.props().color).toBe(Colors.GREY)
        expect(pawn3.props().visible).toBeFalsy()
        expect(pawn3.props().position).toMatchObject(wrapper.vm.position3)

        expect(pawn4.attributes().id).toBe('testpawns-4')
        expect(pawn4.props().color).toBe(Colors.GREY)
        expect(pawn4.props().visible).toBeFalsy()
        expect(pawn4.props().position).toMatchObject(wrapper.vm.position4)
    })

    test('component renders with valid color but no pawns', async () => {
        props.color = PlayerColor.RED
        props.pawns = []
        wrapper.setProps(props)

        await Vue.nextTick()

        var pawn1 = wrapper.findComponent({ ref: 'pawn1' })
        var pawn2 = wrapper.findComponent({ ref: 'pawn2' })
        var pawn3 = wrapper.findComponent({ ref: 'pawn3' })
        var pawn4 = wrapper.findComponent({ ref: 'pawn4' })

        expect(wrapper.vm.position1).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position2).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position3).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position4).toStrictEqual({ x: -1, y: -1 })

        // for some reason, checking arguments here causes the test to hang
        expect(movement.registerPawns).toHaveBeenCalled()

        expect(pawn1.attributes().id).toBe('testpawns-1')
        expect(pawn1.props().color).toBe(Colors.GREY)
        expect(pawn1.props().visible).toBeFalsy()
        expect(pawn1.props().position).toMatchObject(wrapper.vm.position1)

        expect(pawn2.attributes().id).toBe('testpawns-2')
        expect(pawn2.props().color).toBe(Colors.GREY)
        expect(pawn2.props().visible).toBeFalsy()
        expect(pawn2.props().position).toMatchObject(wrapper.vm.position2)

        expect(pawn3.attributes().id).toBe('testpawns-3')
        expect(pawn3.props().color).toBe(Colors.GREY)
        expect(pawn3.props().visible).toBeFalsy()
        expect(pawn3.props().position).toMatchObject(wrapper.vm.position3)

        expect(pawn4.attributes().id).toBe('testpawns-4')
        expect(pawn4.props().color).toBe(Colors.GREY)
        expect(pawn4.props().visible).toBeFalsy()
        expect(pawn4.props().position).toMatchObject(wrapper.vm.position4)
    })

    test('component renders with invalid color and with pawns', async () => {
        props.color = 'bogus'
        props.pawns = pawns
        wrapper.setProps(props)

        await Vue.nextTick()

        var pawn1 = wrapper.findComponent({ ref: 'pawn1' })
        var pawn2 = wrapper.findComponent({ ref: 'pawn2' })
        var pawn3 = wrapper.findComponent({ ref: 'pawn3' })
        var pawn4 = wrapper.findComponent({ ref: 'pawn4' })

        expect(wrapper.vm.position1).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position2).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position3).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position4).toStrictEqual({ x: -1, y: -1 })

        // for some reason, checking arguments here causes the test to hang
        expect(movement.registerPawns).toHaveBeenCalled()

        expect(pawn1.attributes().id).toBe('testpawns-1')
        expect(pawn1.props().color).toBe(Colors.GREY)
        expect(pawn1.props().visible).toBe(true)
        expect(pawn1.props().position).toMatchObject(wrapper.vm.position1)

        expect(pawn2.attributes().id).toBe('testpawns-2')
        expect(pawn2.props().color).toBe(Colors.GREY)
        expect(pawn2.props().visible).toBe(true)
        expect(pawn2.props().position).toMatchObject(wrapper.vm.position2)

        expect(pawn3.attributes().id).toBe('testpawns-3')
        expect(pawn3.props().color).toBe(Colors.GREY)
        expect(pawn3.props().visible).toBe(true)
        expect(pawn3.props().position).toMatchObject(wrapper.vm.position3)

        expect(pawn4.attributes().id).toBe('testpawns-4')
        expect(pawn4.props().color).toBe(Colors.GREY)
        expect(pawn4.props().visible).toBe(true)
        expect(pawn4.props().position).toMatchObject(wrapper.vm.position4)
    })

    test('component renders with valid color and with pawns', async () => {
        props.color = PlayerColor.RED
        props.pawns = pawns
        wrapper.setProps(props)

        await Vue.nextTick()

        var pawn1 = wrapper.findComponent({ ref: 'pawn1' })
        var pawn2 = wrapper.findComponent({ ref: 'pawn2' })
        var pawn3 = wrapper.findComponent({ ref: 'pawn3' })
        var pawn4 = wrapper.findComponent({ ref: 'pawn4' })

        expect(wrapper.vm.position1).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position2).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position3).toStrictEqual({ x: -1, y: -1 })
        expect(wrapper.vm.position4).toStrictEqual({ x: -1, y: -1 })

        // for some reason, checking arguments here causes the test to hang
        expect(movement.registerPawns).toHaveBeenCalled()

        expect(pawn1.attributes().id).toBe('testpawns-1')
        expect(pawn1.props().color).toBe(Colors.RED)
        expect(pawn1.props().visible).toBe(true)
        expect(pawn1.props().position).toMatchObject(wrapper.vm.position1)

        expect(pawn2.attributes().id).toBe('testpawns-2')
        expect(pawn2.props().color).toBe(Colors.RED)
        expect(pawn2.props().visible).toBe(true)
        expect(pawn2.props().position).toMatchObject(wrapper.vm.position2)

        expect(pawn3.attributes().id).toBe('testpawns-3')
        expect(pawn3.props().color).toBe(Colors.RED)
        expect(pawn3.props().visible).toBe(true)
        expect(pawn3.props().position).toMatchObject(wrapper.vm.position3)

        expect(pawn4.attributes().id).toBe('testpawns-4')
        expect(pawn4.props().color).toBe(Colors.RED)
        expect(pawn4.props().visible).toBe(true)
        expect(pawn4.props().position).toMatchObject(wrapper.vm.position4)
    })
})
