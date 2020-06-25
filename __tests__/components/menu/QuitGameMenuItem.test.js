import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import QuitGameMenuItem from 'Components/menu/QuitGameMenuItem.vue'
import * as util from 'Utils/util'
import * as client from 'Utils/client'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

jest.mock('Utils/util')
jest.mock('Utils/client')

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

    test('click action', async () => {
        // we can't actually interact with the inline modal, but we can at least confirm it was generated properly

        wrapper.findComponent({ ref: 'dropdown' }).find('a').trigger('click') // click the embedded link

        var [context, message, okFunction] = util.confirmDialog.mock.calls[0]

        expect(context === wrapper.vm).toBe(true)
        expect(message).toBe('Are you sure you want to quit the game?') // message

        okFunction()
        expect(client.quitGame).toHaveBeenCalled()
    })
})
