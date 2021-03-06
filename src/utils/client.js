// The code structure here is not ideal, but there's also not an easy fix.  Ideally, both
// for legibility and for unit test purposes, I would prefer to split this code up into
// public interface functions, event handlers, and the websocket client functionality
// itself.  That way, we could test all of them independently.
//
// Unfortunately, there are cross-references betweeen each of those sections of code.  The
// public interface functions need access to websockets client functions to open/close
// connections and send data.  The event handlers need access to both public interface
// functions (i.e. to trigger an optimal move) and websocket client functions (to close
// connections for error handling).  And the websockets client functions need access to
// the event handlers to dispatch messages that are received.  So, to avoid problematic
// circular import references, they need to all be in the same module.
//
// I suspect that my lack of experience with Javascript applications like this is leading
// me to miss some obvious solution.  But, until I see it, splitting the code up isn't
// practical.  And, until I can split up the code, it's very difficult to unit test,
// because every test needs to stub and validate the entire stack of functionality.  In
// Python, I would solve this by partially mocking the module (i.e. mock the websocket
// client functions when testing the public interface functions), but Jest does not seem
// to support this sort of partial mocking.  So, I have heavily tested this code manually
// through the browser, and that's the best I can do for now.

import store from 'VStore'
import router from 'Router'
import atmosphere from 'atmosphere.js'

import { EventBus } from 'Utils/eventbus'
import { logger, sleep } from 'Utils/util'
import { PlayerColor } from 'Utils/constants'
import { updateLocations } from 'Utils/movement'

var socket = atmosphere
var subsocket = null
var open = false

var closeRequested = false
var retryDurationMs = 0
var reconnectDelayMs = 0
var pending = null

var serverTimeoutMs = store.state.config.SERVER_TIMEOUT_MS
var initialReconnectDelayMs = store.state.config.INITIAL_RECONNECT_DELAY_MS
var maxReconnectDelayMs = store.state.config.MAX_RECONNECT_DELAY_MS
var reconnectDelayFactor = store.state.config.RECONNECT_DECAY_FACTOR

/** Message processing queue. */
class MessageQueue {
    // This message queue forces messages to be processed sequentially, one after another.
    // Especially in games where there are automated players, status updates arrive
    // stacked very tightly together, within milliseconds.  Without this message queue,
    // they all get processed more-or-less simultaneously, with the effect that you really
    // only see the result of the last event and not any of the intermediate events.  By
    // processing the messages sequentially, we have the opportunity to slow down game
    // play so that individual state changes are comprehensible.

    constructor() {
        this.q = []
        this.locked = false
    }

    async add(json) {
        this.q.push(json)

        while (this.locked) {
            await sleep(100)
        }

        await this.dispatch()
    }

    async dispatch() {
        this.locked = true

        let json
        while ((json = this.q.shift())) {
            const message = JSON.parse(json)
            logger.info('Processing ' + message.message)
            logger.debug(json)
            await dispatchMessage(message)
        }

        this.locked = false
    }
}

/** The queue that messages are placed into. */
var queue = new MessageQueue()

/** Dispatch a message to the correct handler function. */
async function dispatchMessage(message) {
    switch (message.message) {
        case 'REQUEST_FAILED':
            await handleRequestFailed(message)
            break
        case 'SERVER_SHUTDOWN':
            await handleServerShutdown(message)
            break
        case 'REGISTERED_PLAYERS':
            await handleRegisteredPlayers(message)
            break
        case 'AVAILABLE_GAMES':
            await handleAvailableGames(message)
            break
        case 'PLAYER_REGISTERED':
            await handlePlayerRegistered(message)
            break
        case 'PLAYER_UNREGISTERED':
            await handlePlayerUnregistered(message)
            break
        case 'WEBSOCKET_IDLE':
            await handleWebsocketIdle(message)
            break
        case 'WEBSOCKET_INACTIVE':
            await handleWebsocketInactive(message)
            break
        case 'PLAYER_IDLE':
            await handlePlayerIdle(message)
            break
        case 'PLAYER_INACTIVE':
            await handlePlayerInactive(message)
            break
        case 'PLAYER_MESSAGE_RECEIVED':
            await handlePlayerMessageReceived(message)
            break
        case 'GAME_ADVERTISED':
            await handleGameAdvertised(message)
            break
        case 'GAME_INVITATION':
            await handleGameInvitation(message)
            break
        case 'GAME_JOINED':
            await handleGameJoined(message)
            break
        case 'GAME_STARTED':
            await handleGameStarted(message)
            break
        case 'GAME_CANCELLED':
            await handleGameCancelled(message)
            break
        case 'GAME_COMPLETED':
            await handleGameCompleted(message)
            break
        case 'GAME_IDLE':
            await handleGameIdle(message)
            break
        case 'GAME_INACTIVE':
            await handleGameInactive(message)
            break
        case 'GAME_PLAYER_QUIT':
            await handleGamePlayerQuit(message)
            break
        case 'GAME_PLAYER_CHANGE':
            await handleGamePlayerChange(message)
            break
        case 'GAME_STATE_CHANGE':
            await handleGameStateChange(message)
            break
        case 'GAME_PLAYER_TURN':
            await handleGamePlayerTurn(message)
            break
    }
}

/** Handle the REQUEST_FAILED event. */
async function handleRequestFailed(message) {
    const reason = message.context.reason
    const handle = message.context.handle

    if (store.getters.isGameTerminated) {
        logger.warn(
            'Ignoring error because game has been terminated: ' + reason
        )
    } else {
        switch (reason) {
            case 'INVALID_PLAYER':
            case 'DUPLICATE_USER':
                logger.info('Handle is not available: ' + handle)
                await disconnectSocket()
                store.dispatch('handlePlayerNotRegistered')
                if (router.currentRoute.name !== 'HandleUnavailable') {
                    router.push({
                        name: 'HandleUnavailable',
                        params: { handle: handle },
                    })
                }
                break
            default:
                logger.error(
                    'Request failed: ' +
                        message.context.reason +
                        ', ' +
                        message.context.comment
                )
                await disconnectSocket()
                store.dispatch('handleRequestFailed', message.context)
                store.dispatch('handlePlayerNotRegistered')
                if (router.currentRoute.name !== 'Error') {
                    router.push({ name: 'Error' })
                }
                break
        }
    }
}

/** Handle the SERVER_SHUTDOWN event. */
async function handleServerShutdown(message) {
    await disconnectSocket()
    store.dispatch('handleServerShutdown')
    store.dispatch('handlePlayerNotRegistered')
    if (router.currentRoute.name !== 'ServerShutdown') {
        router.push({ name: 'ServerShutdown' })
    }
}

/** Handle the WEBSOCKET_IDLE event. */
async function handleWebsocketIdle(message) {
    EventBus.$emit(
        'client-toast',
        'You are idle; you will be disconnected in a little while'
    )
    store.dispatch('handleWebsocketIdle')
}

/** Handle the WEBSOCKET_INACTIVE event. */
async function handleWebsocketInactive(message) {
    logger.warn('Websocket is inactive; disconnecting')

    store.dispatch('handleWebsocketInactive')
    store.dispatch('handlePlayerNotRegistered')
    store.dispatch('handleGameClear')

    if (router.currentRoute.name !== 'Inactive') {
        router.push({ name: 'Inactive' })
    }

    await disconnectSocket()
}

/** Handle the REGISTERED_PLAYERS event. */
async function handleRegisteredPlayers(message) {
    store.dispatch('handleRegisteredPlayers', message.context)
}

/** Handle the AVAILABLE_GAMES event. */
async function handleAvailableGames(message) {
    store.dispatch('handleAvailableGames', message.context)
}

/** Handle the PLAYER_REGISTERED event. */
async function handlePlayerRegistered(message) {
    EventBus.$emit('client-toast', 'Completed registering your handle.')

    const handle = message.context.handle
    const playerId = message.player_id
    logger.info(
        'Completed registering handle ' +
            handle +
            ' tied to player id ' +
            playerId
    )

    pending = null
    store.dispatch('handlePlayerRegistered', {
        handle: handle,
        playerId: playerId,
    })

    if (router.currentRoute.name !== 'Game') {
        router.push({ name: 'Game' })
    }
}

/** Handle the PLAYER_UNREGISTERED event. */
async function handlePlayerUnregistered(message) {
    EventBus.$emit('client-toast', 'Completed unregistering your handle.')

    logger.info('Completed unregistering handle')
    store.dispatch('handlePlayerNotRegistered')

    // we only want to redirect to landing if we're in a "normal" place to take this action
    if (
        router.currentRoute.name === 'UnregisterHandle' ||
        router.currentRoute.name === 'Game'
    ) {
        router.push({ name: 'Landing' })
    }

    await disconnectSocket()
}

/** Handle the PLAYER_IDLE event. */
async function handlePlayerIdle(message) {
    EventBus.$emit(
        'client-toast',
        'You are idle; you will be disconnected in a little while'
    )
    store.dispatch('handlePlayerIdle')
}

/** Hand the PLAYER_INACTIVE event. */
async function handlePlayerInactive(message) {
    logger.warn('Player is inactive; disconnecting')

    store.dispatch('handlePlayerInactive')
    store.dispatch('handlePlayerNotRegistered')
    store.dispatch('handleGameClear')

    if (router.currentRoute.name !== 'Inactive') {
        router.push({ name: 'Inactive' })
    }

    await disconnectSocket()
}

/** Handle the PLAYER_MESSAGE_RECEIVED event */
async function handlePlayerMessageReceived(message) {
    store.dispatch('handlePlayerMessageReceived', message.context)
}

/** Handle the GAME_ADVERTISED event. */
async function handleGameAdvertised(message) {
    EventBus.$emit('client-toast', 'Your game has been advertised')
    store.dispatch('handleGameAdvertised', message.context)
}

/** Handle the GAME_INVITATION event. */
async function handleGameInvitation(message) {
    EventBus.$emit('client-toast', 'You have been invited to a game')
    store.dispatch('handleGameInvitation', message.context)
}

/** Handle the GAME_JOINED event. */
async function handleGameJoined(message) {
    EventBus.$emit('client-toast', 'You have joined the game')
    store.dispatch('handleGameJoined', message.context)
}

/** Handle the GAME_STARTED event. */
async function handleGameStarted(message) {
    EventBus.$emit('client-toast', 'The game has started')
    store.dispatch('handleGameStarted')
}

/** Handle the GAME_CANCELLED event. */
async function handleGameCancelled(message) {
    EventBus.$emit('client-toast', 'The game has been cancelled')
    store.dispatch('handleGameCancelled')
}

/** Handle the GAME_COMPLETED event. */
async function handleGameCompleted(message) {
    EventBus.$emit('client-toast', message.context.comment)
    store.dispatch('handleGameCompleted', message.context.winner)
}

/** Handle the GAME_IDLE event. */
async function handleGameIdle(message) {
    EventBus.$emit(
        'client-toast',
        'The game is idle; it will be cancelled in a little while'
    )
    store.dispatch('handleGameIdle')
}

/** Handle the GAME_INACTIVE event. */
async function handleGameInactive(message) {
    EventBus.$emit(
        'client-toast',
        'The game is inactive; expect it to be cancelled momentarily'
    )
    store.dispatch('handleGameInactive')
}

/** Handle the GAME_PLAYER_QUIT event. */
async function handleGamePlayerQuit(message) {
    EventBus.$emit('client-toast', 'You have quit the game')
    store.dispatch('handleGamePlayerQuit')
}

/** Handle the GAME_PLAYER_CHANGE event. */
async function handleGamePlayerChange(message) {
    store.dispatch('handleGamePlayerChange', message.context)
}

/** Handle the GAME_STATE_CHANGE event. */
async function handleGameStateChange(message) {
    // This is one of the few places in the system where the UI isn't updated
    // reactively.  We want the locations of the pawns to be updated via an
    // animation, rather than the pawn "teleporting" to its new location.  We
    // also need to carefully coordinate the updates so that only one pawn moves
    // at a time.
    //
    // It's important to update the locations in the right order, otherwise
    // the game is less intelligible.  For instance, if red lands on a green
    // slide to kick another pawn back to start, it makes more sense if red
    // moves onto the slide first, and then the other pawn moves back to start.
    // It's not strictly necessary, but makes the game easier to follow visually.

    store.dispatch('handleGameStateChange', message.context)

    if (!store.getters.previousTurn || !store.getters.previousTurn.color) {
        await updateLocations(PlayerColor.RED, store.getters.redPawns)
        await updateLocations(PlayerColor.YELLOW, store.getters.yellowPawns)
        await updateLocations(PlayerColor.BLUE, store.getters.bluePawns)
        await updateLocations(PlayerColor.GREEN, store.getters.greenPawns)
    } else {
        if (store.getters.previousTurn.color === PlayerColor.RED) {
            await updateLocations(PlayerColor.RED, store.getters.redPawns)
            await updateLocations(PlayerColor.YELLOW, store.getters.yellowPawns)
            await updateLocations(PlayerColor.BLUE, store.getters.bluePawns)
            await updateLocations(PlayerColor.GREEN, store.getters.greenPawns)
        } else if (store.getters.previousTurn.color === PlayerColor.YELLOW) {
            await updateLocations(PlayerColor.YELLOW, store.getters.yellowPawns)
            await updateLocations(PlayerColor.BLUE, store.getters.bluePawns)
            await updateLocations(PlayerColor.GREEN, store.getters.greenPawns)
            await updateLocations(PlayerColor.RED, store.getters.redPawns)
        } else if (store.getters.previousTurn.color === PlayerColor.BLUE) {
            await updateLocations(PlayerColor.BLUE, store.getters.bluePawns)
            await updateLocations(PlayerColor.GREEN, store.getters.greenPawns)
            await updateLocations(PlayerColor.RED, store.getters.redPawns)
            await updateLocations(PlayerColor.YELLOW, store.getters.yellowPawns)
        } else {
            await updateLocations(PlayerColor.GREEN, store.getters.greenPawns)
            await updateLocations(PlayerColor.RED, store.getters.redPawns)
            await updateLocations(PlayerColor.YELLOW, store.getters.yellowPawns)
            await updateLocations(PlayerColor.BLUE, store.getters.bluePawns)
        }
    }
}

/** Handle the GAME_PLAYER_TURN event. */
async function handleGamePlayerTurn(message) {
    store.dispatch('handleGamePlayerTurn', message.context)
    if (store.getters.isAutoplayEnabled) {
        logger.info('Autoplay is enabled; executing optimal move')
        await optimalMove()
        store.dispatch('handleMovePlayed')
    }
}

/** Handle a websocket close event. */
async function onClose(response) {
    logger.info(
        'Websocket connection is closed: ' +
            response.status +
            ', ' +
            response.state
    )

    subsocket = null
    open = false
    store.dispatch('handleGameDisconnected') // once disconnected, you can't rejoin

    if (closeRequested) {
        logger.info('Close was expected; no more action needs to be taken')
        closeRequested = false
    } else {
        logger.debug('Close was unexpected; entering recovery/retry')

        retryDurationMs += reconnectDelayMs
        if (retryDurationMs > serverTimeoutMs) {
            logger.info(
                'Retry duration exceeded: ' +
                    retryDurationMs +
                    'ms > ' +
                    serverTimeoutMs +
                    'ms'
            )

            retryDurationMs = 0
            reconnectDelayMs = 0
            pending = null
            store.dispatch('handlePlayerNotRegistered')

            if (router.currentRoute.name !== 'Error') {
                router.push({ name: 'Error' })
            }

            return // give up
        }

        if (reconnectDelayMs === 0) {
            reconnectDelayMs = initialReconnectDelayMs
        } else {
            // decay off our reconnect attempts
            reconnectDelayMs *= reconnectDelayFactor
            if (reconnectDelayMs > maxReconnectDelayMs) {
                reconnectDelayMs = maxReconnectDelayMs
            }
        }

        logger.debug('Will reconnect after ' + reconnectDelayMs + 'ms')
        await sleep(reconnectDelayMs)
        EventBus.$emit('client-toast', 'Server connection lost; retrying now.')

        if (pending) {
            if (pending.playerId) {
                await reregisterHandle(pending)
            } else {
                await registerHandle(pending.handle)
            }
        } else {
            const handle = store.getters.playerHandle
            const playerId = store.getters.playerId
            await reregisterHandle({ handle: handle, playerId: playerId })
        }
    }
}

/** Handle a websocket error. */
async function onError(response) {
    // In practice, an error usually seems to come along with a disconnect, so we just log it. */
    logger.error(
        'Websocket connection error: ' +
            response.status +
            ', ' +
            response.state +
            ', ' +
            response.error
    )
}

/** Handle a websocket transport failure. */
async function onTransportFailure(errorMsg, request) {
    // These two settings prevent the stupid client from falling back to HTTP when the websocket disconnects
    logger.error('Websocket transport failure: ' + errorMsg)
    request.transport = 'websocket'
    request.fallbackTransport = 'websocket'
}

/** Handle a websocket reconnect event. */
async function onReconnect(request, response) {
    // In theory, this never gets called, because we had to turn off auto-reconnect to make things work
    // These two settings prevent the stupid client from falling back to HTTP when the websocket disconnects
    logger.warn(
        'Websocket connection is reconnecting: ' +
            response.status +
            ', ' +
            response.state +
            ', ' +
            response.error
    )
    request.transport = 'websocket'
    request.fallbackTransport = 'websocket'
}

/** Handle a message received from the websocket. */
async function onMessage(response) {
    // We handle the message by enqueing it, so messages are processed one at a time without overlap
    await queue.add(response.responseBody)
    await queue.dispatch()
}

/** Send a request to a websocket. */
async function sendRequest(request) {
    // Intermittently, the subsocket is not yet available when we try to send the request.
    // In theory, this shouldn't happen, since we wait for the connection to be up before
    // sending anything.  We'll wait up to 10 seconds for the socket to be established
    // before erroring out.

    let tries = 0
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!subsocket && tries++ < 40) {
        await sleep(250)
    }

    if (!subsocket) {
        logger.error('Timed out waiting for subsocket to be ready')

        store.dispatch('handlePlayerNotRegistered')
        store.dispatch('handleGameClear')

        if (router.currentRoute.name !== 'Error') {
            router.push({ name: 'Error' })
        }

        await disconnectSocket()
    } else {
        const json = JSON.stringify(request, null, 2)
        logger.info('Sending ' + request.message)
        logger.debug(json)
        subsocket.push(json)
    }
}

/** Open the websocket connection. */
async function connectSocket(onOpen) {
    var request = new atmosphere.AtmosphereRequest()

    request.url = store.state.config.WEBSOCKET_API
    request.contentType = 'application/json'

    // without this, onOpen() is never invoked
    // but now for some reason it's invoked twice, ugh
    // see: https://github.com/Atmosphere/atmosphere-javascript/issues/174
    request.enableProtocol = false

    // set up so CORS is allowed (different websockets server and content server)
    request.enableXDR = true
    request.readResponsesHeaders = false

    // force the stupid client to never fall back to HTTP requests, which we don't support
    request.transport = 'websocket'
    request.fallbackTransport = 'websocket'
    request.reconnectOnServerError = false
    request.maxReconnectOnClose = 0

    // set up event handlers
    request.onOpen = onOpen // passed in from the caller
    request.onClose = onClose
    request.onError = onError
    request.onTransportFailure = onTransportFailure
    request.onReconnect = onReconnect
    request.onMessage = onMessage

    // note that this socket is useless until the onOpen() event has been processed
    subsocket = socket.subscribe(request)
}

/** Disconnect the websocket. */
async function disconnectSocket() {
    // Note that this is a little misleading.  Even if we unsubscribe, it sometimes takes
    // a while to complete.  So, it's possible to receive messages after unsubscribing.  I
    // think I've worked around most of the odd corner cases that result.
    logger.info('Closing websocket connection')
    closeRequested = true
    socket.unsubscribe()
    retryDurationMs = 0
    reconnectDelayMs = 0
}

/** Open the websocket connection and send a message as soon as the connection is ready. */
async function connectAndSend(request) {
    connectSocket(async (response) => {
        if (!open) {
            // The stupid library sometimes triggers duplicate onOpen events
            logger.info('Connection is open, sending request')
            await sendRequest(request) // send the request once the socket is open
            open = true
            closeRequested = false
            retryDurationMs = 0
            reconnectDelayMs = 0
        }
    })
}

/** Register the passed-in handle with the backend. */
async function registerHandle(handle) {
    pending = { handle: handle, playerId: null }

    logger.info('Client is registering handle: ' + handle)

    const request = {
        message: 'REGISTER_PLAYER',
        context: {
            handle: handle,
        },
    }

    await connectAndSend(request)
}

/** Reregister a handle with the backend, using and existing player id. */
async function reregisterHandle(player) {
    pending = player

    logger.info(
        'Client is reregistering handle: ' +
            player.handle +
            ' with player id ' +
            player.playerId
    )

    const request = {
        message: 'REREGISTER_PLAYER',
        player_id: player.playerId,
        context: {
            handle: player.handle,
        },
    }

    await connectAndSend(request)
}

/** Unregister with the backend. */
async function unregisterHandle() {
    const handle = store.getters.playerHandle
    const playerId = store.getters.playerId

    logger.info(
        'Client is unregistering handle: ' +
            handle +
            ' with player id ' +
            playerId
    )

    const request = {
        message: 'UNREGISTER_PLAYER',
        player_id: playerId,
    }

    store.dispatch('markGameTerminated')
    await sendRequest(request)
}

/** Quit an in-progress game. */
async function quitGame() {
    logger.info('Quitting active game')

    const request = {
        message: 'QUIT_GAME',
        player_id: store.getters.playerId,
    }

    store.dispatch('markGameTerminated')
    await sendRequest(request)
}

/** Cancel an in-progress game. */
async function cancelGame() {
    logger.info('Cancelling active game')

    const request = {
        message: 'CANCEL_GAME',
        player_id: store.getters.playerId,
    }

    store.dispatch('markGameTerminated')
    await sendRequest(request)
}

/** Join a game. */
async function joinGame(gameId) {
    logger.info('Joining game: ' + gameId)

    const request = {
        message: 'JOIN_GAME',
        player_id: store.getters.playerId,
        context: {
            game_id: gameId,
        },
    }

    await sendRequest(request)
}

/** Start an advertised game. */
async function startGame(gameId) {
    logger.info('Starting game')

    const request = {
        message: 'START_GAME',
        player_id: store.getters.playerId,
    }

    await sendRequest(request)
}

/** List all available games. */
async function listAvailableGames() {
    logger.info('Listing available games')

    const request = {
        message: 'LIST_AVAILABLE_GAMES',
        player_id: store.getters.playerId,
    }

    await sendRequest(request)
}

/** Advertise a game. */
async function advertiseGame(advertised) {
    logger.info('Advertising new game')

    const request = {
        message: 'ADVERTISE_GAME',
        player_id: store.getters.playerId,
        context: advertised,
    }

    await sendRequest(request)
}

/** Execute a move. */
async function executeMove(move) {
    if (store.getters.isGameTerminated) {
        // Because things happen asynchronously, we sometimes cross streams
        logger.warn(
            'Ignoring execute move request because game has been terminated'
        )
    } else {
        logger.info('Executing move: ' + move.move_id)

        const request = {
            message: 'EXECUTE_MOVE',
            player_id: store.getters.playerId,
            context: {
                move_id: move.move_id,
            },
        }

        await sendRequest(request)
    }
}

/** Ask the server to execute the optimal move, rather than choosing one. */
async function optimalMove(move) {
    if (store.getters.isGameTerminated) {
        // Because things happen asynchronously, we sometimes cross streams
        logger.warn(
            'Ignoring optimal move request because game has been terminated'
        )
    } else {
        logger.info('Executing server-determined optimal move')

        const request = {
            message: 'OPTIMAL_MOVE',
            player_id: store.getters.playerId,
        }

        await sendRequest(request)
    }
}

export {
    disconnectSocket,
    registerHandle,
    reregisterHandle,
    unregisterHandle,
    quitGame,
    cancelGame,
    joinGame,
    startGame,
    listAvailableGames,
    advertiseGame,
    executeMove,
    optimalMove,
}
