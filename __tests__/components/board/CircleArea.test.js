import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import CircleArea from 'Components/board/CircleArea.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueKonva)

const store = new Store({
    state: {},
    getters: {},
})

const mocks = {
    $store: store,
}

const props = {
    id: 'testcircle',
    x: 10,
    y: 20,
    color: 'zzz',
}

describe('Components/board/CircleArea.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(CircleArea, {
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

    test('component renders', async () => {
        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testcircle'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().x).toBe(
            '10'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().y).toBe(
            '20'
        )
        expect(wrapper.findComponent({ ref: 'circle' }).attributes().id).toBe(
            'testcircle-circle'
        )
        expect(wrapper.findComponent({ ref: 'circle' }).attributes().fill).toBe(
            'zzz'
        )
    })
})
