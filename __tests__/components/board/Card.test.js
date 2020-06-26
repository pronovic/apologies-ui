import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import Card from 'Components/board/Card.vue'
import { Cards } from 'Utils/constants'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueKonva)

const store = new Store({
    state: {},
    getters: {},
})

const mocks = {
    $store: store,
}

const props = {
    id: 'testcard',
    x: 10,
    y: 20,
    card: null,
}

describe('Components/board/Card.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(Card, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('card front renders', async () => {
        props.card = Cards.CARD_APOLOGIES // card assigned, show front
        wrapper.setProps(props)
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testcard'
        )
        expect(
            wrapper.findComponent({ ref: 'group' }).props().config
        ).toStrictEqual({ x: 10, y: 20 })
        expect(
            wrapper.findComponent({ ref: 'front-text' }).props().config.text
        ).toBe(' A')
        expect(wrapper.findComponent({ ref: 'back-text' }).exists()).toBe(false)
    })

    test('card back renders', async () => {
        props.card = null // no card assigned, show back
        wrapper.setProps(props)
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testcard'
        )
        expect(
            wrapper.findComponent({ ref: 'group' }).props().config
        ).toStrictEqual({ x: 10, y: 20 })
        expect(wrapper.findComponent({ ref: 'front-text' }).exists()).toBe(
            false
        )
        expect(
            wrapper.findComponent({ ref: 'back-text' }).props().config.text
        ).toBe('@')
    })
})
