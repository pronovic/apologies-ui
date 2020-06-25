import Vue from 'vue'
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

const props = {
    id: 'testnumbers',
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
            propsData: props,
        })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component not visible when not enabled', async () => {
        store.state.config.SHOW_SQUARE_NUMBERS = false
        await Vue.nextTick()

        // the group should exist
        expect(wrapper.find('#testnumbers').exists()).toBe(true)

        // but none of the other items should exist (we'll just spot-check, it's too much effort to check all of them)
        expect(wrapper.find('#testnumbers-start-RED-1').exists()).toBe(false)
        expect(wrapper.find('#testnumbers-home-GREEN-2').exists()).toBe(false)
        expect(wrapper.find('#testnumbers-safe-BLUE-3').exists()).toBe(false)
        expect(wrapper.find('#testnumbers-safe-YELLOW-4').exists()).toBe(false)
        expect(wrapper.find('#testnumbers-square-1').exists()).toBe(false)
        expect(wrapper.find('#testnumbers-square-10').exists()).toBe(false)
        expect(wrapper.find('#testnumbers-square-45').exists()).toBe(false)
    })

    test('component visible when enabled', async () => {
        store.state.config.SHOW_SQUARE_NUMBERS = true
        await Vue.nextTick()

        expect(wrapper.exists()).toBe(true)

        // the group should exist
        expect(wrapper.find('#testnumbers').exists()).toBe(true)

        // and all of the other items should exist (we'll just spot-check, it's too much effort to check all of them)
        expect(wrapper.find('#testnumbers-start-RED-1').exists()).toBe(true)
        expect(wrapper.find('#testnumbers-home-GREEN-2').exists()).toBe(true)
        expect(wrapper.find('#testnumbers-safe-BLUE-3').exists()).toBe(true)
        expect(wrapper.find('#testnumbers-safe-YELLOW-4').exists()).toBe(true)
        expect(wrapper.find('#testnumbers-square-1').exists()).toBe(true)
        expect(wrapper.find('#testnumbers-square-10').exists()).toBe(true)
        expect(wrapper.find('#testnumbers-square-45').exists()).toBe(true)
    })
})
