import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import ClearGameMenuItem from 'Components/menu/ClearGameMenuItem.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {
        isGameJoined: true,
        isGameCompleted: true,
    },
})

const mocks = {
    $store: store,
}

describe('Components/menu/ClearGameMenuItem.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(ClearGameMenuItem, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('not joined -> not visible', async () => {
        store.getters.isGameJoined = false
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(false)
    })

    test('not completed -> not visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(false)
    })

    test('joined and completed -> visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(true)
    })
})
