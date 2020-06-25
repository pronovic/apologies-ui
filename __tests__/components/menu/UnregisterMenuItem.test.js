import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import UnregisterMenuItem from 'Components/menu/UnregisterMenuItem.vue'
import * as util from 'Utils/util'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

jest.mock('Utils/util')

const store = new Store({
    state: {},
    getters: {
        isGameJoined: true,
        isGameAdvertised: false,
        isGameCompleted: false,
    },
})

const router = {
    push: jest.fn(),
}

const mocks = {
    $store: store,
    $router: router,
}

describe('Components/menu/UnregisterMenuItem.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(UnregisterMenuItem, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders', async () => {
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'dropdown' }).exists()).toBe(true)
    })

    test('click with game joined', async () => {
        // we can't actually interact with the inline modal, but we can at least confirm it was generated properly

        store.getters.isGameJoined = true
        store.getters.isGameAdvertised = false
        store.getters.isGameCompleted = false

        wrapper.findComponent({ ref: 'dropdown' }).find('a').trigger('click') // click the embedded link

        var [context, message, okFunction] = util.confirmDialog.mock.calls[0]

        expect(context === wrapper.vm).toBe(true)
        expect(message).toBe(
            'Are you sure you want to unregister?  This will also quit your game.'
        ) // message

        okFunction()
        expect(router.push).toHaveBeenCalledWith({ name: 'UnregisterHandle' })
    })

    test('click with game advertised', async () => {
        // we can't actually interact with the inline modal, but we can at least confirm it was generated properly

        store.getters.isGameJoined = false
        store.getters.isGameAdvertised = true
        store.getters.isGameCompleted = false

        wrapper.findComponent({ ref: 'dropdown' }).find('a').trigger('click') // click the embedded link

        var [context, message, okFunction] = util.confirmDialog.mock.calls[0]

        expect(context === wrapper.vm).toBe(true)
        expect(message).toBe(
            'Are you sure you want to unregister?  This will also cancel your game.'
        ) // message

        okFunction()
        expect(router.push).toHaveBeenCalledWith({ name: 'UnregisterHandle' })
    })

    test('click with game completed', async () => {
        // we can't actually interact with the inline modal, but we can at least confirm it was generated properly

        store.getters.isGameJoined = false
        store.getters.isGameAdvertised = false
        store.getters.isGameCompleted = true

        wrapper.findComponent({ ref: 'dropdown' }).find('a').trigger('click') // click the embedded link

        var [context, message, okFunction] = util.confirmDialog.mock.calls[0]

        expect(context === wrapper.vm).toBe(true)
        expect(message).toBe('Are you sure you want to unregister?') // message

        okFunction()
        expect(router.push).toHaveBeenCalledWith({ name: 'UnregisterHandle' })
    })

    test('click with no game', async () => {
        // we can't actually interact with the inline modal, but we can at least confirm it was generated properly

        store.getters.isGameJoined = false
        store.getters.isGameAdvertised = false
        store.getters.isGameCompleted = false

        wrapper.findComponent({ ref: 'dropdown' }).find('a').trigger('click') // click the embedded link

        var [context, message, okFunction] = util.confirmDialog.mock.calls[0]

        expect(context === wrapper.vm).toBe(true)
        expect(message).toBe('Are you sure you want to unregister?') // message

        okFunction()
        expect(router.push).toHaveBeenCalledWith({ name: 'UnregisterHandle' })
    })
})
