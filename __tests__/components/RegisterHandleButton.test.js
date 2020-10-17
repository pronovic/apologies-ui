import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue, { BButton, BModal } from 'bootstrap-vue'

import { Store } from 'vuex-mock-store'

import RegisterHandleButton from 'Components/RegisterHandleButton.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.component('b-button', BButton)
localVue.component('b-modal', BModal)

const store = new Store({
    state: {},
    getters: {},
})

const router = {
    push: jest.fn(),
}

const mocks = {
    $store: store,
    $router: router,
}

// Testing a modal is kind of awkward.  I started at this StackOverflow answer: https://stackoverflow.com/a/56582504/2907667
// That led me here: https://github.com/bootstrap-vue/bootstrap-vue/blob/dev/src/components/modal/modal.spec.js
// The 2nd link is what gave me ideas about how to tell whether the modal was open or shut, how to find its buttons, etc.
// Unfortunately, I can't find a good way to directly check behavior for form submit, because clicking the modal's OK
// button does not actually submit the form in these tests, although it works fine in browser testing.  All I can do is
// confirm that the handleOk() and handleSubmit() methods work as intended, and then assume that they're wired up properly.

describe('Components/RegisterHandleButton.vue', () => {
    let wrapper
    let button
    let modal

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = mount(RegisterHandleButton, {
            localVue,
            mocks,
            attachTo: div,
            propsData: { id: 'testmodal' },
        })
        button = wrapper.findComponent({ ref: 'button' })
        modal = wrapper.findComponent({ ref: 'modal' })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('modal closed by default', async () => {
        expect(modal.find('div.modal').element.style.display).toEqual('none') // modal is not visible
    })

    test('modal opens on button click', async () => {
        button.trigger('click')
        await Vue.nextTick()
        expect(modal.find('div.modal').element.style.display).not.toEqual(
            'none'
        ) // modal is visible
    })

    test('modal closes on cancel click', async () => {
        button.trigger('click')
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

        wrapper.vm.handle = 'foo'
        wrapper.vm.handleState = true

        // eslint-disable-next-line vue/custom-event-name-casing
        wrapper.vm.$root.$emit('bv::show::modal', 'testmodal') // shows the modal
        await Vue.nextTick()

        expect(wrapper.vm.handle).toBe('')
        expect(wrapper.vm.handleState).toBeNull()
    })

    test('confirm form submit for valid data', async () => {
        // confirms that form validation works as expected; but unfortunately doesn't prove that the modal is wired up properly

        var bvModalEvt = {
            preventDefault: jest.fn(),
        }

        wrapper.vm.handle = 'aa'
        wrapper.vm.handleState = null

        wrapper.vm.handleOk(bvModalEvt)
        await Vue.nextTick()

        expect(bvModalEvt.preventDefault).toHaveBeenCalled()
        expect(wrapper.vm.handle).toBe('aa')
        expect(wrapper.vm.handleState).toBe(true) // means that input was valid
        expect(router.push).toHaveBeenCalledWith({
            name: 'RegisterHandle',
            params: { handle: 'aa' },
        })
    })

    test('confirm form submit for invalid data', async () => {
        // confirms that form validation works as expected; but unfortunately doesn't prove that the modal is wired up properly

        var bvModalEvt = {
            preventDefault: jest.fn(),
        }

        wrapper.vm.handle = 'a'
        wrapper.vm.handleState = null

        wrapper.vm.handleOk(bvModalEvt)
        await Vue.nextTick()

        expect(bvModalEvt.preventDefault).toHaveBeenCalled()
        expect(wrapper.vm.handle).toBe('a')
        expect(wrapper.vm.handleState).toBe(false) // means that input was valid
        expect(router.push).toHaveBeenCalledTimes(0)
    })

    test('check form validation', async () => {
        // confirms specific test cases for validation, which are meaningful as long as the test above passes

        // valid
        wrapper.vm.handle = 'aa'
        expect(wrapper.vm.checkFormValidity()).toBe(true)
        expect(wrapper.vm.handleState).toBe(true)

        // valid
        wrapper.vm.handle = 'aA1_-'
        expect(wrapper.vm.checkFormValidity()).toBe(true)
        expect(wrapper.vm.handleState).toBe(true)

        // valid
        wrapper.vm.handle = '12345678901234567890'
        expect(wrapper.vm.checkFormValidity()).toBe(true)
        expect(wrapper.vm.handleState).toBe(true)

        // too short
        wrapper.vm.handle = 'a'
        expect(wrapper.vm.checkFormValidity()).toBe(false)
        expect(wrapper.vm.handleState).toBe(false)

        // too long
        wrapper.vm.handle = '123456789012345678901'
        expect(wrapper.vm.checkFormValidity()).toBe(false)
        expect(wrapper.vm.handleState).toBe(false)

        // invalid characters
        wrapper.vm.handle = '12*&!@'
        expect(wrapper.vm.checkFormValidity()).toBe(false)
        expect(wrapper.vm.handleState).toBe(false)
    })
})
