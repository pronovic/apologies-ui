import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import ToggleAutoplayMenuItem from 'Components/menu/ToggleAutoplayMenuItem.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {
        isAutoplayEnabled: false,
        isGameJoined: true,
        isGameAdvertised: true,
        isGameStarted: true,
        isGameCompleted: false,
    },
})

const mocks = {
    $store: store,
}

// Unfortunately, there does not seem to be any way to unit test this.$bvModal.msgBoxConfirm()

describe('Components/menu/ToggleAutoplayMenuItem.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(ToggleAutoplayMenuItem, {
            localVue,
            mocks,
            attachTo: div,
        })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('joined but not completed -> visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameAdvertised = false
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(true)
    })

    test('advertised but not completed -> visible', async () => {
        store.getters.isGameJoined = false
        store.getters.isGameAdvertised = true
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(true)
    })

    test('started but not completed -> visible', async () => {
        store.getters.isGameJoined = false
        store.getters.isGameAdvertised = true
        store.getters.isGameStarted = false
        store.getters.isGameCompleted = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(true)
    })

    test('completed -> not visible', async () => {
        store.getters.isGameJoined = true
        store.getters.isGameAdvertised = true
        store.getters.isGameStarted = true
        store.getters.isGameCompleted = true
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(false)
    })
})
