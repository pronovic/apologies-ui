import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import RightSlide from 'Components/board/RightSlide.vue'

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
    id: 'testslide',
    x: 10,
    y: 20,
    color: 'zzz',
    length: 30,
}

describe('Components/board/RightSlide.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(RightSlide, {
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
        // Note: I haven't come up with a way to test the triangle rendering that is simple enough to be worth the effort
        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testslide'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().x).toBe(
            '10'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().y).toBe(
            '20'
        )
        expect(wrapper.findComponent({ ref: 'box' }).attributes().id).toBe(
            'testslide-box'
        )
        expect(wrapper.findComponent({ ref: 'box' }).attributes().width).toBe(
            '30'
        )
        expect(wrapper.findComponent({ ref: 'box' }).attributes().fill).toBe(
            'zzz'
        )
        expect(wrapper.findComponent({ ref: 'circle' }).attributes().id).toBe(
            'testslide-circle'
        )
        expect(wrapper.findComponent({ ref: 'circle' }).attributes().x).toBe(
            '28'
        ) // 30-2
        expect(wrapper.findComponent({ ref: 'circle' }).attributes().fill).toBe(
            'zzz'
        )
        expect(wrapper.findComponent({ ref: 'triangle' }).attributes().id).toBe(
            'testslide-triangle'
        )
        expect(
            wrapper.findComponent({ ref: 'triangle' }).props().config.fill
        ).toBe('zzz')
    })
})
