import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import GameMenu from 'Components/GameMenu.vue'
import AdvertiseGameMenuItem from 'Components/menu/AdvertiseGameMenuItem.vue'
import CancelGameMenuItem from 'Components/menu/CancelGameMenuItem.vue'
import ClearGameMenuItem from 'Components/menu/ClearGameMenuItem.vue'
import JoinGameMenuItem from 'Components/menu/JoinGameMenuItem.vue'
import QuitGameMenuItem from 'Components/menu/QuitGameMenuItem.vue'
import UnregisterMenuItem from 'Components/menu/UnregisterMenuItem.vue'
import ToggleAutoplayMenuItem from 'Components/menu/ToggleAutoplayMenuItem.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {},
})

const mocks = {
    $store: store,
}

describe('Components/GameMenu.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(GameMenu, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders', async () => {
        await Vue.nextTick()
        expect(wrapper.find('#game-menu').exists()).toBe(true)
        expect(wrapper.findComponent(UnregisterMenuItem).exists()).toBe(true)
        expect(wrapper.findComponent(JoinGameMenuItem).exists()).toBe(true)
        expect(wrapper.findComponent(AdvertiseGameMenuItem).exists()).toBe(true)
        expect(wrapper.findComponent(QuitGameMenuItem).exists()).toBe(true)
        expect(wrapper.findComponent(CancelGameMenuItem).exists()).toBe(true)
        expect(wrapper.findComponent(ClearGameMenuItem).exists()).toBe(true)
        expect(wrapper.findComponent(ToggleAutoplayMenuItem).exists()).toBe(
            true
        )
    })
})
