import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue, { BIcon } from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import LoadUser from 'Views/LoadUser.vue'
import * as storage from 'Utils/storage'
import * as client from 'Utils/client'

jest.mock('Utils/storage')
jest.mock('Utils/client')

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.component('b-icon', BIcon)

const store = new Store({
    state: {},
    getters: {},
})

const router = {
    push: jest.fn(),
}

const mocks = {
    $store: store,
    $router: router,
}

// These are split up because we need different initial conditions for the create() method

describe('Views/LoadUser.vue (no player)', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        storage.loadPlayer.mockReturnValueOnce(null) // no user in storage
        wrapper = mount(LoadUser, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('player not registered', async () => {
        expect(wrapper.exists()).toBe(true)
        expect(store.dispatch).toHaveBeenCalledWith('handlePlayerNotRegistered')
        expect(router.push).toHaveBeenCalledWith({ name: 'Landing' })
        expect(client.reregisterHandle).toHaveBeenCalledTimes(0)
    })
})

describe('Views/LoadUser.vue (with player)', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        storage.loadPlayer.mockReturnValueOnce('player') // there is a user in storage
        wrapper = mount(LoadUser, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('player registered', async () => {
        expect(store.dispatch).toHaveBeenCalledTimes(0)
        expect(router.push).toHaveBeenCalledTimes(0)
        expect(client.reregisterHandle).toHaveBeenCalledWith('player')
    })
})
