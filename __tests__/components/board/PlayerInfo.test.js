import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueKonva from 'vue-konva'

import { Store } from 'vuex-mock-store'

import PlayerInfo from 'Components/board/PlayerInfo.vue'
import { PlayerColor, PlayerState, PlayerType, Colors } from 'Utils/constants'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueKonva)

const store = new Store({
    state: {},
    getters: {
        isAutoplayEnabled: false,
    },
})

const mocks = {
    $store: store,
}

const player = {
    handle: 'theplayer',
    color: PlayerColor.RED,
    type: PlayerType.HUMAN,
    state: null,
    isAdvertiser: false,
    isOpponent: false,
    isWinner: false,
    turns: 0,
    hand: [],
    pawns: [],
}

const props = {
    id: 'testinfo',
    x: 10,
    y: 20,
    player: null,
    opponent: false,
}

describe('Components/board/PlayerInfo.vue', () => {
    let wrapper

    beforeEach(() => {
        const div = document.createElement('div')
        document.body.appendChild(div)
        wrapper = shallowMount(PlayerInfo, { localVue, mocks, attachTo: div })
    })

    afterEach(() => {
        store.reset()
        wrapper.destroy()
    })

    test('component renders with no player', async () => {
        props.player = null
        props.opponent = false

        wrapper.setProps(props)
        await Vue.nextTick()

        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testinfo'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().x).toBe(
            '10'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().y).toBe(
            '20'
        )

        expect(wrapper.findComponent({ ref: 'pawn' }).attributes().id).toBe(
            'testinfo-pawn'
        )
        expect(
            wrapper.findComponent({ ref: 'pawn' }).props().position
        ).toStrictEqual({ x: 0, y: 0 })
        expect(wrapper.findComponent({ ref: 'pawn' }).props().color).toBe(
            Colors.GREY
        )

        expect(wrapper.findComponent({ ref: 'handle' }).attributes().id).toBe(
            'testinfo-handle'
        )
        expect(
            wrapper.findComponent({ ref: 'handle' }).props().config.text
        ).toBe('')

        expect(wrapper.findComponent({ ref: 'status' }).attributes().id).toBe(
            'testinfo-status'
        )
        expect(
            wrapper.findComponent({ ref: 'status' }).props().config.text
        ).toBe('Your Player')

        expect(wrapper.findComponent({ ref: 'hand' }).attributes().id).toBe(
            'testinfo-hand'
        )
        expect(wrapper.findComponent({ ref: 'hand' }).props().player).toBeNull()
    })

    test('component renders with player', async () => {
        props.player = player
        props.opponent = false

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = false
        player.type = PlayerType.HUMAN
        player.state = null

        wrapper.setProps(props)
        await Vue.nextTick()

        expect(wrapper.findComponent({ ref: 'group' }).attributes().id).toBe(
            'testinfo'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().x).toBe(
            '10'
        )
        expect(wrapper.findComponent({ ref: 'group' }).attributes().y).toBe(
            '20'
        )

        expect(wrapper.findComponent({ ref: 'pawn' }).attributes().id).toBe(
            'testinfo-pawn'
        )
        expect(
            wrapper.findComponent({ ref: 'pawn' }).props().position
        ).toStrictEqual({ x: 0, y: 0 })
        expect(wrapper.findComponent({ ref: 'pawn' }).props().color).toBe(
            Colors.RED
        )

        expect(wrapper.findComponent({ ref: 'handle' }).attributes().id).toBe(
            'testinfo-handle'
        )
        expect(
            wrapper.findComponent({ ref: 'handle' }).props().config.text
        ).toBe('theplayer')

        expect(wrapper.findComponent({ ref: 'status' }).attributes().id).toBe(
            'testinfo-status'
        )
        expect(
            wrapper.findComponent({ ref: 'status' }).props().config.text
        ).toBe('Your Player')

        expect(wrapper.findComponent({ ref: 'hand' }).attributes().id).toBe(
            'testinfo-hand'
        )
        expect(
            wrapper.findComponent({ ref: 'hand' }).props().player
        ).toMatchObject(player)
    })

    test('player status for non-opponent player', async () => {
        props.player = player
        props.opponent = false

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = false
        player.type = PlayerType.HUMAN
        player.state = null
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Your Player')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Your Player (Autoplay)')
    })

    test('player status for non-opponent player (winner)', async () => {
        props.player = player
        props.opponent = false

        store.getters.isAutoplayEnabled = false
        player.isWinner = true
        player.isAdvertiser = true
        player.type = PlayerType.HUMAN
        player.state = null
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Winner')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Winner (Autoplay)')
    })

    test('player status for non-opponent player (advertiser)', async () => {
        props.player = player
        props.opponent = false

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = true
        player.type = PlayerType.HUMAN
        player.state = null
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Advertiser')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Advertiser (Autoplay)')
    })

    test('player status for human opponent player', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = false
        player.type = PlayerType.HUMAN
        player.state = null
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Human Opponent')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Human Opponent')
    })

    test('player status for human opponent player (winner)', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = true
        player.isAdvertiser = true
        player.type = PlayerType.HUMAN
        player.state = null
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Winner')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Winner')

        player.state = PlayerState.QUIT

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Winner')

        player.stae = PlayerState.DISCONNECTED

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Winner')
    })

    test('player status for human opponent player (advertiser)', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = true
        player.type = PlayerType.HUMAN
        player.state = null
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Advertiser')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Advertiser')

        player.state = PlayerState.QUIT

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Advertiser')

        player.stae = PlayerState.DISCONNECTED

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Advertiser')
    })

    test('player status for human opponent player (quit)', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = false
        player.type = PlayerType.HUMAN
        player.state = PlayerState.QUIT
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Quit Game (Autoplay)')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Quit Game (Autoplay)')
    })

    test('player status for human opponent player (disconnected)', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = false
        player.type = PlayerType.HUMAN
        player.state = PlayerState.DISCONNECTED
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Disconnected (Autoplay)')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Disconnected (Autoplay)')
    })

    test('player status for computer opponent player', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = false
        player.type = PlayerType.PROGRAMMATIC
        player.state = null
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Computer Opponent')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Computer Opponent')
    })

    test('player status for computer opponent player (winner)', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = true
        player.isAdvertiser = true // shouldn't happen in real life
        player.type = PlayerType.PROGRAMMATIC
        player.state = null
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Winner')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Winner')
    })

    test('player status for computer opponent player (advertiser)', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = true // shouldn't happen in real life
        player.type = PlayerType.PROGRAMMATIC
        player.state = null
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Advertiser')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Game Advertiser')
    })

    test('player status for computer opponent player (quit)', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = false
        player.type = PlayerType.PROGRAMMATIC
        player.state = PlayerState.QUIT // shouldn't happen in real life
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Computer Opponent')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Computer Opponent')
    })

    test('player status for computer opponent player (disconnected)', async () => {
        props.player = player
        props.opponent = true

        store.getters.isAutoplayEnabled = false
        player.isWinner = false
        player.isAdvertiser = false
        player.type = PlayerType.PROGRAMMATIC
        player.state = PlayerState.DISCONNECTED // shouldn't happen in real life
        wrapper.setProps(props)

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Computer Opponent')

        store.getters.isAutoplayEnabled = true

        await Vue.nextTick()
        expect(wrapper.vm.statusText).toBe('Computer Opponent')
    })
})
