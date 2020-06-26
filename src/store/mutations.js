import Vue from 'vue'
import Vuex from 'vuex'

import { logger } from 'Utils/util'
import { UserLoadStatus } from 'Utils/constants'
Vue.use(Vuex)

const mutations = {
    trackHeaderHeightChange(state, headerHeight) {
        logger.debug('Header height: ' + headerHeight + ' px')
        state.dimensions.header.height = headerHeight
    },
    trackWindowSizeChange(state) {
        logger.debug(
            'Window size: ' +
                window.innerHeight +
                'x' +
                window.innerWidth +
                ' px'
        )
        state.dimensions.window.height = window.innerHeight
        state.dimensions.window.width = window.innerWidth
    },
    trackFailure(state, context) {
        state.server.latestFailure = context
    },
    trackLatestStatus(state, status) {
        state.server.latestStatus = status
    },
    trackRegisteredPlayers(state, context) {
        Vue.set(state.server, 'registeredPlayers', context.players)
    },
    trackAvailableGames(state, context) {
        Vue.set(state.server, 'availableGames', context.games)
    },
    trackPlayerRegistered(state, player) {
        state.user.loadStatus = UserLoadStatus.LOADED
        state.user.registered = true
        state.user.handle = player.handle
        state.user.playerId = player.playerId
    },
    trackPlayerNotRegistered(state) {
        state.user.loadStatus = UserLoadStatus.LOADED
        state.user.registered = false
        state.user.handle = null
        state.user.playerId = null
    },
    trackReceivedMessage(state, context) {
        state.server.messages.push(context)
    },
    trackAdvertisedGame(state, context) {
        state.server.advertisedGame = context
    },
    trackGameInvitation(state, context) {
        state.server.invitations.push(context)
    },
    trackGameAutoplay(state, value) {
        state.game.autoplay = value
    },
    trackGameTerminated(state, value) {
        state.game.terminated = value
    },
    trackGameStatus(state, status) {
        state.game.status = status
    },
    trackGameWinner(state, winner) {
        state.game.winner = winner
    },
    trackGamePlayers(state, context) {
        state.game.comment = context.comment
        Vue.set(state.game, 'players', context.players)
    },
    trackGameDetails(state, context) {
        state.game.id = context.game_id
        state.game.terminated = false // just in case it's left over
        state.game.name = context.name
        state.game.mode = context.mode
        state.game.advertiser = context.advertiser_handle
    },
    trackGameState(state, context) {
        state.game.playerState = context.player
        Vue.set(state.game, 'opponentStates', context.opponents)
        state.game.previousTurn = null
        if (context.recent_history && context.recent_history.length > 0) {
            const last =
                context.recent_history[context.recent_history.length - 1]
            if (last.color && last.card) {
                state.game.previousTurn = last
            }
        }
    },
    trackPlayerTurn(state, context) {
        state.game.drawnCard = context.drawn_card
        Vue.set(state.game, 'playerMoves', context.moves)
    },
    clearGame(state) {
        state.server.advertisedGame = null
        state.game.id = null
        state.game.autoplay = false
        state.game.terminated = false
        state.game.name = null
        state.game.mode = null
        state.game.advertiser = null
        state.game.winner = null
        state.game.status = null
        state.game.comment = null
        Vue.set(state.game, 'players', [])
        state.game.playerState = null
        Vue.set(state.game, 'opponentStates', [])
        state.game.drawnCard = null
        Vue.set(state.game, 'playerMoves', [])
        state.game.previousTurn = null
    },
    clearPlayerMove(state) {
        state.game.drawnCard = null
        state.game.playerMoves = []
    },
}

export default mutations
