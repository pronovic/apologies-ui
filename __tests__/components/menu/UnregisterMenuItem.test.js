import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import UnregisterMenuItem from 'Components/menu/UnregisterMenuItem.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {
        isGameJoined: true,
        isGameAdvertised: false,
        isGameCompleted: false,
    },
})

const mocks = {
    $store: store,
}

// Unfortunately, there does not seem to be any way to unit test this.$bvModal.msgBoxConfirm()

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
})
