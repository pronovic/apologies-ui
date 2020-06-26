import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue, { BButton, BIcon } from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import ClearGameButton from 'Components/ClearGameButton.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.component('b-button', BButton)
localVue.component('b-icon', BIcon)

const store = new Store({
    state: {},
    getters: {
        isGameJoined: false,
        isGameCompleted: false,
    },
})

const mocks = {
    $store: store,
}

describe('Components/ClearGameButton.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(ClearGameButton, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('not joined -> no button', async () => {
        store.getters.isGameJoined = false
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('not completed -> no button', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(false)
    })

    test('joined and completed -> button', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(true)
    })

    test('click clears game', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        wrapper.findComponent({ ref: 'button' }).trigger('click')
        expect(store.dispatch).toHaveBeenCalledWith('handleGameClear')
    })
})
