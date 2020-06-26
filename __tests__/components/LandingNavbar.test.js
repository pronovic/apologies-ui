import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import LandingNavbar from 'Components/LandingNavbar.vue'
import RegisterHandleButton from 'Components/RegisterHandleButton.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {},
})

const mocks = {
    $store: store,
}

describe('Components/LandingNavbar.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(LandingNavbar, {
            localVue,
            mocks,
            attachTo: div,
        })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders', async () => {
        await Vue.nextTick()

        // this.$el can't be mocked, so just confirm the dispatch happened and ignore the actual value
        expect(store.dispatch).toHaveBeenCalledWith(
            'handleHeaderHeightChange',
            expect.anything()
        )

        expect(wrapper.findComponent({ ref: 'brand' }).text()).toBe('Apologies')
        expect(wrapper.findComponent(RegisterHandleButton).exists()).toBe(true)
    })
})
