import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import Inactive from 'Views/Inactive.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

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

describe('Views/Inactive.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(Inactive, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders', async () => {
        expect(wrapper.exists()).toBe(true)
    })

    test('landing link', async () => {
        var link = wrapper.findComponent({ ref: 'link' })
        link.trigger('click')
        expect(router.push).toHaveBeenCalledWith({ name: 'Landing' })
    })
})
