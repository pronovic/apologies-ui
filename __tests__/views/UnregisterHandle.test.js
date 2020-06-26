import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue, { BIcon } from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import UnregisterHandle from 'Views/UnregisterHandle.vue'
import * as client from 'Utils/client'

jest.mock('Utils/client')

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.component('b-icon', BIcon)

const store = new Store({
    state: {},
    getters: {},
})

const mocks = {
    $store: store,
}

describe('Views/UnregisterHandle', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(UnregisterHandle, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('trigger unregister of handle', async () => {
        expect(wrapper.exists()).toBe(true)
        expect(client.unregisterHandle).toHaveBeenCalledTimes(1)
    })
})
