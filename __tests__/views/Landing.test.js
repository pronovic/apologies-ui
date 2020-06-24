import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import Landing from 'Views/Landing.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const config = {
    LICENSE_APACHE_2: 'license',
    GITHUB_APOLOGIES: 'apologies',
    GITHUB_APOLOGIES_SERVER: 'server',
    GITHUB_APOLOGIES_UI: 'ui',
}

const store = new Store({
    state: { config: config },
    getters: {},
})

const router = {
    push: jest.fn(),
}

const mocks = {
    $store: store,
    $router: router,
}

describe('Views/Landing.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(Landing, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders', async () => {
        expect(wrapper.exists()).toBe(true)
    })

    test('license link', async () => {
        var link = wrapper.findComponent({ ref: 'licenseLink' })
        expect(link.props().href).toBe('license')
    })

    test('apologies link', async () => {
        var link = wrapper.findComponent({ ref: 'apologiesLink' })
        expect(link.props().href).toBe('apologies')
    })

    test('server link', async () => {
        var link = wrapper.findComponent({ ref: 'apologiesServerLink' })
        expect(link.props().href).toBe('server')
    })

    test('ui link', async () => {
        var link = wrapper.findComponent({ ref: 'apologiesUiLink' })
        expect(link.props().href).toBe('ui')
    })
})
