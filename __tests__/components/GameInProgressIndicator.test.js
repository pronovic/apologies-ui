import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue, { BButton, BIcon } from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import GameInProgressIndicator from 'Components/GameInProgressIndicator.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.component('b-button', BButton)
localVue.component('b-icon', BIcon)

const store = new Store({
    state: {},
    getters: {
        isGameJoined: false,
        isGameStarted: false,
        isGameCompleted: false,
    },
})

const mocks = {
    $store: store,
}

describe('Components/GameInProgressIndicator.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(GameInProgressIndicator, {
            localVue,
            mocks,
            attachTo: div,
        })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('game not joined -> not visible', async () => {
        store.getters.isGameJoined = false
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('game joined but not started -> not visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('game joined and started -> visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameStarted = true
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(true)
    })

    test('game joined and completed -> not visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameStarted = true
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })
})
