import { mount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'
import StartGameButton from 'Components/StartGameButton.vue'

const store = new Store({
    state: {},
    getters: {
        isGameAdvertised: false,
        isGameStarted: false,
        isGameCompleted: false,
    },
})

const mocks = {
    $store: store,
}

describe('Component', () => {
    test('is a Vue instance', () => {
        const wrapper = mount(StartGameButton, { mocks })
        expect(wrapper.exists()).toBeTruthy()
    })
})
