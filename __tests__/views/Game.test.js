import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import Game from 'Views/Game.vue'
import * as eventbus from 'Utils/eventbus'
import GameNavbar from 'Components/GameNavbar.vue'
import GameBoard from 'Components/GameBoard.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

jest.mock('Utils/eventbus')
eventbus.EventBus.$on = jest.fn()

const store = new Store({
    state: {},
    getters: {},
})

const mocks = {
    $store: store,
}

// This looks a little different than some other tests, because we need to destroy the
// component within the test case to test the beforeDestroy() handler.

describe('Views/Game.vue', () => {
    test('component renders including event bus', async () => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        var wrapper = shallowMount(Game, { localVue, mocks, attachTo: div })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.findComponent(GameNavbar).exists()).toBe(true)
        expect(wrapper.findComponent(GameBoard).exists()).toBe(true)

        // it's hard to validate the exact arguments, but we can at least prove that it was called
        expect(eventbus.EventBus.$on).toHaveBeenCalledWith(
            'client-toast',
            expect.anything()
        )

        // and we need to make sure that the toast is removed on teardown
        wrapper.destroy()
        expect(eventbus.EventBus.$off).toHaveBeenCalledWith('client-toast')

        store.reset()
    })
})
