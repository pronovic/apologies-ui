import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import CancelGameMenuItem from 'Components/menu/CancelGameMenuItem.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {
        isGameAdvertised: true,
        isGameCompleted: false,
    },
})

const mocks = {
    $store: store,
}

// Unfortunately, there does not seem to be any way to unit test this.$bvModal.msgBoxConfirm()

describe('Components/menu/CancelGameMenuItem.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(CancelGameMenuItem, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('no game advertised -> not visible', async () => {
        store.getters.isGameAdvertised = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(false)
    })

    test('game advertised but not completed -> visible', async () => {
        store.getters.isGameAdvertised = true
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(true)
    })

    test('game advertised and completed -> not visible', async () => {
        store.getters.isGameAdvertised = true
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(false)
    })
})
