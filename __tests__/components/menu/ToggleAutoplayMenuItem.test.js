import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import ToggleAutoplayMenuItem from 'Components/menu/ToggleAutoplayMenuItem.vue'
import * as client from 'Utils/client'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

jest.mock('Utils/client')

const store = new Store({
    state: {},
    getters: {
        isAutoplayEnabled: false,
        isGameJoined: true,
        isGameAdvertised: true,
        isGameStarted: true,
        isGameCompleted: false,
        isPlayerTurn: false,
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

    // The toggle tests are a little confusing.  In a real environment, dispatching toggleAutoplay
    // immediately changes the state of the isAutoplayEnabled getter.  However, here, it doesn't.
    // So, the optimalMove() behavior (confusingly) happens in our enabled -> disabled test cases
    // rather than the disabled -> enabled test case where it more properly should be.

    test('toggle when disabled', async () => {
        store.getters.isAutoplayEnabled = false
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).html()).toContain(
            'Enable Autoplay'
        )
        wrapper.findComponent({ ref: 'dropdown' }).find('a').trigger('click') // click the embedded link
        expect(store.dispatch).toHaveBeenCalledWith('toggleAutoplay')
    })

    test('toggle when enabled (player turn)', async () => {
        store.getters.isAutoplayEnabled = true
        store.getters.isGameStarted = true
        store.getters.isGameCompleted = false
        store.getters.isPlayerTurn = true

        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).html()).toContain(
            'Disable Autoplay'
        )
        wrapper.findComponent({ ref: 'dropdown' }).find('a').trigger('click') // click the embedded link

        expect(store.dispatch).toHaveBeenCalledWith('toggleAutoplay')

        // see note above about confusing behavior
        expect(store.dispatch).toHaveBeenCalledWith('handleMovePlayed')
        expect(client.optimalMove).toHaveBeenCalled()
    })

    test('toggle when enabled (not player turn)', async () => {
        store.getters.isAutoplayEnabled = true
        store.getters.isGameStarted = true
        store.getters.isGameCompleted = false
        store.getters.isPlayerTurn = false

        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).html()).toContain(
            'Disable Autoplay'
        )
        wrapper.findComponent({ ref: 'dropdown' }).find('a').trigger('click') // click the embedded link

        expect(store.dispatch).toHaveBeenCalledWith('toggleAutoplay')

        // see note above about confusing behavior
        expect(store.dispatch).toHaveBeenCalledTimes(1) // the other call above
        expect(client.optimalMove).toHaveBeenCalledTimes(0)
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
