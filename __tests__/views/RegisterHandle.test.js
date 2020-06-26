import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue, { BIcon } from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import RegisterHandle from 'Views/RegisterHandle.vue'
import * as client from 'Utils/client'

jest.mock('Utils/client')

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.component('b-icon', BIcon)

const store = new Store({
    state: {},
    getters: {},
})

const route = {
    params: { handle: 'thehandle' },
}

const mocks = {
    $store: store,
    $route: route,
}

describe('Views/RegisterHandle', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(RegisterHandle, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('trigger register of handle', async () => {
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.vm.handle).toBe('thehandle')
        expect(client.registerHandle).toHaveBeenCalledWith('thehandle')
    })
})
