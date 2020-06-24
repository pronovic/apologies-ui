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
        // defaults are set up so button is displayed and usable
        isGameAdvertised: true,
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

    test('no game advertised -> not visible', async () => {
        store.getters.isGameAdvertised = false
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('game started -> not visible', async () => {
        store.getters.isGameAdvertised = true
        store.getters.isGameStarted = true
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('game completed -> not visible', async () => {
        store.getters.isGameAdvertised = true
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('game advertised but not started or completed -> visible', async () => {
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(true)
    })

    test('click starts game', async () => {
        await Vue.nextTick()
        wrapper.findComponent({ ref: 'button' }).trigger('click')
        expect(client.startGame).toHaveBeenCalled()
    })
})
