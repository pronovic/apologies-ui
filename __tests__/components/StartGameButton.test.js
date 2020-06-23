import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue, { BButton, BIcon } from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import * as client from 'Utils/client'

import StartGameButton from 'Components/StartGameButton.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.component('b-button', BButton)
localVue.component('b-icon', BIcon)

jest.mock('Utils/client')

const store = new Store({
    state: {},
    getters: {
        isGameAdvertised: false,
        isGameStarted: false,
        isGameCompleted: false,
    },
})

const mocks = {
    $store: store,
}

describe('Components/StartGameButton.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(StartGameButton, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('no game advertised == no button', async () => {
        store.getters.isGameAdvertised = false
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('game advertised == button', async () => {
        store.getters.isGameAdvertised = true
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(true)
    })

    test('game started == no button', async () => {
        store.getters.isGameAdvertised = true
        store.getters.isGameStarted = true
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('game completed == no button', async () => {
        store.getters.isGameAdvertised = true
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('click starts game', async () => {
        store.getters.isGameAdvertised = true
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()

        wrapper.findComponent({ ref: 'button' }).trigger('click')
        expect(client.startGame).toHaveBeenCalled()
    })
})
