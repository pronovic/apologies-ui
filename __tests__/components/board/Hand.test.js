import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import Hand from 'Components/board/Hand.vue'
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
    id: 'testhand',
    x: 10,
    y: 20,
    player: null,
}

describe('Components/board/Hand.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(Hand, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders (no player)', async () => {
        props.player = null
        wrapper.setProps(props)
        await Vue.nextTick()
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.findComponent(Card).exists()).toBe(false)
    })

    test('component renders (no hand)', async () => {
        props.player = { hand: null }
        wrapper.setProps(props)
        await Vue.nextTick()
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.findComponent(Card).exists()).toBe(false)
    })

    test('component renders (empty hand)', async () => {
        props.player = { hand: [] }
        wrapper.setProps(props)
        await Vue.nextTick()
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.findComponent(Card).exists()).toBe(false)
    })

    test('component renders (non-empty hand)', async () => {
        props.player = { hand: [Cards.CARD_1, Cards.CARD_APOLOGIES] }
        wrapper.setProps(props)
        await Vue.nextTick()
        var card1 = wrapper.find('#testhand-card-0')
        var card2 = wrapper.find('#testhand-card-1')
        expect(card1.attributes().card).toBe(Cards.CARD_1)
        expect(card2.attributes().card).toBe(Cards.CARD_APOLOGIES)
    })
})
