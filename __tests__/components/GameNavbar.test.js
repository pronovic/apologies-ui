import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import GameNavbar from 'Components/GameNavbar.vue'
import ClearGameButton from 'Components/ClearGameButton.vue'
import GameMenu from 'Components/GameMenu.vue'
import GameInProgressIndicator from 'Components/GameInProgressIndicator.vue'
import StartGameButton from 'Components/StartGameButton.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {
        playerHandle: 'ken',
    },
})

const mocks = {
    $store: store,
}

describe('Components/GameNavbar.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(GameNavbar, { localVue, mocks, attachTo: div })
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
        expect(wrapper.findComponent({ ref: 'handle' }).text()).toBe('ken')
        expect(wrapper.findComponent(ClearGameButton).exists()).toBe(true)
        expect(wrapper.findComponent(GameMenu).exists()).toBe(true)
        expect(wrapper.findComponent(GameInProgressIndicator).exists()).toBe(
            true
        )
        expect(wrapper.findComponent(StartGameButton).exists()).toBe(true)
    })
})
