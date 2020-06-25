import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import Pawn from 'Components/board/Pawn.vue'

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
    id: 'testpawn',
    position: { x: 10, y: 20 },
    size: 30,
    color: 'yyy',
    visible: 'zzz',
}

describe('Components/board/Pawn.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(Pawn, {
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
        // Note: I haven't come up with a way to test the pawn rendering that is simple enough to be worth the effort
        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testpawn'
        )
        expect(wrapper.findComponent({ ref: 'pawn' }).props().config.fill).toBe(
            'yyy'
        )
        expect(
            wrapper.findComponent({ ref: 'pawn' }).props().config.visible
        ).toBe('zzz')
    })
})
