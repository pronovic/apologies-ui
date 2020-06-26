import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import JoinGameMenuItem from 'Components/menu/JoinGameMenuItem.vue'
import * as client from 'Utils/client'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

jest.mock('Utils/client')

const store = new Store({
    state: {},
    getters: {
        isGameJoined: false,
        playerHandle: 'thehandle',
        availableGames: [],
    },
})

const mocks = {
    $store: store,
}

// Testing a modal is kind of awkward.  I started at this StackOverflow answer: https://stackoverflow.com/a/56582504/2907667
// That led me here: https://github.com/bootstrap-vue/bootstrap-vue/blob/dev/src/components/modal/modal.spec.js
// The 2nd link is what gave me ideas about how to tell whether the modal was open or shut, etc.   The embedded table is
// difficult to test directly (sort of a common problem with these Bootstrap Vue components).  I've settled for testing
// the methods that are used for input into the markup.  Not great, but better than nothing.

describe('Components/menu/JoinGameMenuItem.vue', () => {
    let wrapper
    let dropdown
    let modal

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(JoinGameMenuItem, {
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

    test('check computed properties', async () => {
        store.getters.isGameJoined = false
        store.getters.availableGames = ['a', 'b', 'c']
        await Vue.nextTick()

        expect(wrapper.vm.visible).toBe(true)
        expect(wrapper.vm.rows).toBe(3)
        expect(wrapper.vm.games).toMatchObject(store.getters.availableGames)

        store.getters.isGameJoined = true
        store.getters.availableGames = null
        await Vue.nextTick()

        expect(wrapper.vm.visible).toBe(false)
        expect(wrapper.vm.rows).toBe(0)
        expect(wrapper.vm.games).toStrictEqual([])
    })

    test('check resetModal()', async () => {
        wrapper.vm.sortBy = 'xxx'
        wrapper.vm.sortDesc = 'xxx'
        wrapper.vm.currentPage = 0
        wrapper.vm.filter = 'xxx'

        wrapper.vm.resetModal()

        expect(wrapper.vm.sortBy).toBe('game')
        expect(wrapper.vm.sortDesc).toBe(false)
        expect(wrapper.vm.currentPage).toBe(1)
        expect(wrapper.vm.filter).toBeNull()
        expect(client.listAvailableGames).toHaveBeenCalled()
    })

    test('check join game', async () => {
        dropdown.find('a').trigger('click') // click the embedded link
        await Vue.nextTick()

        wrapper.vm.joinGame('xxx')
        await Vue.nextTick()

        expect(modal.find('div.modal').element.style.display).toEqual('none') // modal is not visible
        expect(client.joinGame).toHaveBeenCalledWith('xxx')
    })
})
