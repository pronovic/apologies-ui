import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import HandleUnavailable from 'Views/HandleUnavailable.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {},
})

const router = {
    push: jest.fn(),
}

const route = {
    params: { handle: 'thehandle' },
}

const mocks = {
    $store: store,
    $router: router,
    $route: route,
}

describe('Views/HandleUnavailable.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(HandleUnavailable, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders', async () => {
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.vm.handle).toBe('thehandle')
        expect(wrapper.html()).toContain(
            'Sorry, the handle you chose (<em>thehandle</em>) was already in use.'
        )
    })

    test('landing link', async () => {
        var link = wrapper.findComponent({ ref: 'link' })
        link.trigger('click')
        expect(router.push).toHaveBeenCalledWith({ name: 'Landing' })
    })
})
