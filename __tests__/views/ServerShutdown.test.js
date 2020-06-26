import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import ServerShutdown from 'Views/ServerShutdown.vue'

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

describe('Views/ServerShutdown.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(ServerShutdown, { localVue, mocks, attachTo: div })
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
