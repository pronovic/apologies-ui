import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import PositionNumbers from 'Components/board/PositionNumbers.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueKonva)

const config = {
    SHOW_SQUARE_NUMBERS: false,
}

const store = new Store({
    state: {
        config: config,
    },
    getters: {},
})

const mocks = {
    $store: store,
}

describe('Components/board/PositionNumbers.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(PositionNumbers, {
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
        expect(wrapper.exists()).toBe(true)
    })

    // TODO: stubbed test - implement remaining test cases
})
