import { loadConfig } from 'VStore/config'
import { UserLoadStatus } from 'Utils/constants'

/** State of a user in the web UI. */
const user = {
    loadStatus: UserLoadStatus.NOT_LOADED,
    registered: false,
    handle: null,
    playerId: null,
}

/** Server state, tracked via events. */
const server = {
    latestFailure: null,
    registeredPlayers: [],
    availableGames: [],
    messages: [],
    advertisedGame: null,
    invitations: [],
}

/** Game state, tracked via events. */
const game = {
    id: null,
    autoplay: false,
    terminated: false,
    name: null,
    mode: null,
    advertiser: null,
    winner: null,
    previousTurn: null,
    status: null,
    comment: null,
    players: [],
    playerState: null,
    opponentStates: [],
    drawnCard: null,
    playerMoves: [],
}

/** Screen dimensions, tracked via an event handler. */
const dimensions = {
    header: {
        height: 0,
    },
    window: {
        height: 0,
        width: 0,
    },
}

/** The overall tracked state */
const state = {
    config: loadConfig(process.env),
    user: user,
    server: server,
    game: game,
    dimensions: dimensions,
}

export default state
