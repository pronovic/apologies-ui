import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import AdvertiseGameMenuItem from 'Components/menu/AdvertiseGameMenuItem.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const store = new Store({
    state: {},
    getters: {
        isGameJoined: false,
    },
})

const mocks = {
    $store: store,
}

// Testing a modal is kind of awkward.  I started at this StackOverflow answer: https://stackoverflow.com/a/56582504/2907667
// That led me here: https://github.com/bootstrap-vue/bootstrap-vue/blob/dev/src/components/modal/modal.spec.js
// The 2nd link is what gave me ideas about how to tell whether the modal was open or shut, etc.

describe('Components/menu/AdvertiseGameMenuItem.vue', () => {
    let wrapper
    let dropdown
    let modal

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(AdvertiseGameMenuItem, {
            localVue,
            mocks,
            attachTo: div,
            propsData: { unittest: true },
        })
        dropdown = wrapper.findComponent({ ref: 'dropdown' })
        modal = wrapper.findComponent({ ref: 'modal' })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component visible if there is no game', async () => {
        store.getters.isGameJoined = false
        await Vue.nextTick()
        expect(dropdown.exists()).toBe(true)
        expect(modal.find('div.modal').element.style.display).toEqual('none') // modal is not visible
    })

    test('component hidden if there is a game', async () => {
        store.getters.isGameJoined = true
        await Vue.nextTick()
        expect(dropdown.exists()).toBe(false)
        expect(modal.find('div.modal').element.style.display).toEqual('none') // modal is not visible
    })

    test('modal opens on dropdown click', async () => {
        dropdown.find('a').trigger('click') // click the embedded link
        await Vue.nextTick()
        expect(modal.find('div.modal').element.style.display).not.toEqual(
            'none'
        ) // modal is visible
    })
})
