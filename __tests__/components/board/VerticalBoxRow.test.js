import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import VerticalBoxRow from 'Components/board/VerticalBoxRow.vue'

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
    id: 'testrow',
    x: 10,
    y: 20,
    color: 'zzz',
    boxes: 0,
}

describe('Components/board/VerticalBoxRow.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(VerticalBoxRow, {
            localVue,
            mocks,
            attachTo: div,
        })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders with null boxes', async () => {
        props.boxes = null
        wrapper.setProps(props)
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testrow'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().x).toBe(
            '10'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().y).toBe(
            '20'
        )
    })

    test('component renders with zero boxes', async () => {
        props.boxes = 0
        wrapper.setProps(props)
        await Vue.nextTick()
        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testrow'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().x).toBe(
            '10'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().y).toBe(
            '20'
        )
    })

    test('component renders with non-zero boxes', async () => {
        props.boxes = 2
        wrapper.setProps(props)
        await Vue.nextTick()

        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testrow'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().x).toBe(
            '10'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().y).toBe(
            '20'
        )

        var box1 = wrapper.find('#testrow-box-1')
        expect(box1.attributes().fill).toBe('zzz')

        var box2 = wrapper.find('#testrow-box-2')
        expect(box2.attributes().fill).toBe('zzz')
    })
})
