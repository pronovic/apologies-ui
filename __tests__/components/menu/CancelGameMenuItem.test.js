import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import CancelGameMenuItem from 'Components/menu/CancelGameMenuItem.vue'
import * as util from 'Utils/util'
import * as client from 'Utils/client'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

jest.mock('Utils/util')
jest.mock('Utils/client')

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

    test('click action', async () => {
        // we can't actually interact with the inline modal, but we can at least confirm it was generated properly

        wrapper.findComponent({ ref: 'dropdown' }).find('a').trigger('click') // click the embedded link

        var [context, message, okFunction] = util.confirmDialog.mock.calls[0]

        expect(context === wrapper.vm).toBe(true)
        expect(message).toBe('Are you sure you want to cancel the game?') // message

        okFunction()
        expect(client.cancelGame).toHaveBeenCalled()
    })
})
