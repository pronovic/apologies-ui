import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import QuitGameMenuItem from 'Components/menu/QuitGameMenuItem.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {
        isGameJoined: true,
        isGameAdvertised: false,
        isGameCompleted: false,
    },
})

const mocks = {
    $store: store,
}

// Unfortunately, there does not seem to be any way to unit test this.$bvModal.msgBoxConfirm()

describe('Components/menu/QuitGameMenuItem.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(QuitGameMenuItem, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('not joined -> not visible', async () => {
        store.getters.isGameJoined = false
        store.getters.isGameAdvertised = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(false)
    })

    test('joined but not advertised or completed -> visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameAdvertised = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(true)
    })

    test('joined and advertised -> not visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameAdvertised = true
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(false)
    })

    test('joined and completed -> not visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameAdvertised = false
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(false)
    })
})
