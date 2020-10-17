import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import AdvertiseGameMenuItem from 'Components/menu/AdvertiseGameMenuItem.vue'
import * as client from 'Utils/client'
import { GameMode, GameVisibility } from 'Utils/constants'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

jest.mock('Utils/client')

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
// The 2nd link is what gave me ideas about how to tell whether the modal was open or shut, etc.   The embedded form is
// difficult to test directly (sort of a common problem with these Bootstrap Vue components).  I've settled for testing
// the methods that are used for input into the markup.  Not great, but better than nothing.

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
        store.getters.isGameJoined = false
        dropdown.find('a').trigger('click') // click the embedded link
        await Vue.nextTick()

        expect(modal.find('div.modal').element.style.display).not.toEqual(
            'none'
        ) // modal is visible
    })

    test('modal closes on cancel click', async () => {
        store.getters.isGameJoined = false
        dropdown.find('a').trigger('click') // click the embedded link
        await Vue.nextTick()
        expect(modal.find('div.modal').element.style.display).not.toEqual(
            'none'
        ) // modal is visible

        var buttons = modal.findAll('footer button')
        var cancel = buttons.at(0)
        cancel.trigger('click')
        await Vue.nextTick()

        expect(modal.find('div.modal').element.style.display).toEqual('none') // modal is not visible
    })

    test('confirm modal show behavior', async () => {
        // proves that @show is wired up to clear the form; I'd prefer to trigger('show') but I can't make that work

        wrapper.vm.name = 'xxx'
        wrapper.vm.nameState = 'xxx'
        wrapper.vm.mode = 'xxx'
        wrapper.vm.players = 'xxx'
        wrapper.vm.visibility = 'xxx'
        wrapper.vm.invitedHandles = 'xxx'

        // eslint-disable-next-line vue/custom-event-name-casing
        wrapper.vm.$root.$emit('bv::show::modal', 'advertiseGameModal') // shows the modal
        await Vue.nextTick()

        expect(wrapper.vm.name).toBe('')
        expect(wrapper.vm.nameState).toBeNull()
        expect(wrapper.vm.mode).toBe(GameMode.STANDARD)
        expect(wrapper.vm.players).toBe(4)
        expect(wrapper.vm.visibility).toBe(GameVisibility.PUBLIC)
        expect(wrapper.vm.invitedHandles).toStrictEqual([])
    })

    test('confirm form submit for valid data', async () => {
        // confirms that form validation works as expected; but unfortunately doesn't prove that the modal is wired up properly

        // eslint-disable-next-line vue/custom-event-name-casing
        wrapper.vm.$root.$emit('bv::show::modal', 'advertiseGameModal') // shows the modal
        await Vue.nextTick()

        var bvModalEvt = {
            preventDefault: jest.fn(),
        }

        wrapper.vm.name = 'game'
        wrapper.vm.mode = GameMode.STANDARD
        wrapper.vm.players = 4
        wrapper.vm.visibility = GameVisibility.PUBLIC
        wrapper.vm.invitedHandles = ['a', 'b']

        wrapper.vm.handleOk(bvModalEvt)
        await Vue.nextTick()

        expect(modal.find('div.modal').element.style.display).toEqual('none') // modal is not visible

        expect(bvModalEvt.preventDefault).toHaveBeenCalled()
        expect(wrapper.vm.nameState).toBe(true) // means that input was valid
        expect(client.advertiseGame).toHaveBeenCalledWith({
            name: 'game',
            mode: GameMode.STANDARD,
            players: 4,
            visibility: GameVisibility.PUBLIC,
            invited_handles: ['a', 'b'],
        })
    })

    test('confirm form submit for invalid data', async () => {
        // confirms that form validation works as expected; but unfortunately doesn't prove that the modal is wired up properly

        // eslint-disable-next-line vue/custom-event-name-casing
        wrapper.vm.$root.$emit('bv::show::modal', 'advertiseGameModal') // shows the modal
        await Vue.nextTick()

        var bvModalEvt = {
            preventDefault: jest.fn(),
        }

        wrapper.vm.name = 'a'
        wrapper.vm.mode = GameMode.STANDARD
        wrapper.vm.players = 4
        wrapper.vm.visibility = GameVisibility.PUBLIC
        wrapper.vm.invitedHandles = ['a', 'b']

        wrapper.vm.handleOk(bvModalEvt)
        await Vue.nextTick()

        expect(modal.find('div.modal').element.style.display).not.toEqual(
            'none'
        ) // modal is visible

        expect(bvModalEvt.preventDefault).toHaveBeenCalled()
        expect(wrapper.vm.nameState).toBe(false) // means that input was valid
        expect(client.advertiseGame).toHaveBeenCalledTimes(0)
    })

    test('check form validation', async () => {
        // confirms specific test cases for validation, which are meaningful as long as the test above passes

        wrapper.vm.mode = GameMode.STANDARD
        wrapper.vm.players = 4
        wrapper.vm.visibility = GameVisibility.PUBLIC
        wrapper.vm.invitedHandles = ['a', 'b']

        // valid
        wrapper.vm.name = 'aa'
        expect(wrapper.vm.checkFormValidity()).toBe(true)
        expect(wrapper.vm.nameState).toBe(true)

        // valid
        wrapper.vm.name = '12345678901234567890123456789012345'
        expect(wrapper.vm.checkFormValidity()).toBe(true)
        expect(wrapper.vm.nameState).toBe(true)

        // too short
        wrapper.vm.name = 'a'
        expect(wrapper.vm.checkFormValidity()).toBe(false)
        expect(wrapper.vm.nameState).toBe(false)

        // too long
        wrapper.vm.name = '123456789012345678901234567890123456'
        expect(wrapper.vm.checkFormValidity()).toBe(false)
        expect(wrapper.vm.nameState).toBe(false)
    })
})
