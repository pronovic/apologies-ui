import store from '../store'
import router from '../router'
import atmosphere from 'atmosphere.js'
import { EventBus } from './eventbus.js'

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

function handleRequestFailed(message) {
    const reason = message.context.reason
    const handle = message.context.handle
    switch (reason) {
        case 'INVALID_PLAYER':
        case 'DUPLICATE_USER':
            console.log('Handle is not available: ' + handle)
            disconnectSocket()
            store.dispatch('handlePlayerNotRegistered')
            if (router.currentRoute.name !== 'HandleUnavailable') {
                router.push({
                    name: 'HandleUnavailable',
                    params: { handle: handle },
                })
            }
            break
        default:
            console.log(
                'Request failed: ' +
                    message.context.reason +
                    ', ' +
                    message.context.comment
            )
            disconnectSocket()
            store.dispatch('handleRequestFailed', message.context)
            store.dispatch('handlePlayerNotRegistered')
            if (router.currentRoute.name !== 'Error') {
                router.push({ name: 'Error' })
            }
            break
    }
}

function handleServerShutdown(message) {
    disconnectSocket()
    store.dispatch('handleServerShutdown')
    store.dispatch('handlePlayerNotRegistered')
    if (router.currentRoute.name !== 'ServerShutdown') {
        router.push({ name: 'ServerShutdown' })
    }
}

function handleWebsocketIdle(message) {
    EventBus.$emit(
        'client-toast',
        'You are idle; you will be disconnected in a little while'
    )
    store.dispatch('handleWebsocketIdle')
}

function handleWebsocketInactive(message) {
    EventBus.$emit(
        'client-toast',
        'You are inactive; expect a disconnect momentarily'
    )
    store.dispatch('handleWebsocketInactive')
}

function handleRegisteredPlayers(message) {
    store.dispatch('handleRegisteredPlayers', message.context)
}

function handleAvailableGames(message) {
    store.dispatch('handleAvailableGames', message.context)
}

function handlePlayerRegistered(message) {
    EventBus.$emit('client-toast', 'Completed registering your handle.')

    const handle = message.context.handle
    const playerId = message.player_id
    console.log(
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

function handlePlayerUnregistered(message) {
    EventBus.$emit('client-toast', 'Completed unregistering your handle.')
    console.log('Completed unregistering handle')
    disconnectSocket()
    store.dispatch('handlePlayerNotRegistered')
    if (router.currentRoute.name !== 'Landing') {
        router.push({ name: 'Landing' })
    }
}

function handlePlayerIdle(message) {
    EventBus.$emit(
        'client-toast',
        'You are idle; you will be disconnected in a little while'
    )
    store.dispatch('handlePlayerIdle')
}

function handlePlayerInactive(message) {
    EventBus.$emit(
        'client-toast',
        'You are inactive; expect a disconnect momentarily'
    )
    store.dispatch('handlePlayerInactive')
}

function handlePlayerMessageReceived(message) {
    store.dispatch('handlePlayerMessageReceived', message.context)
}

function handleGameAdvertised(message) {
    EventBus.$emit('client-toast', 'Your game has been advertised')
    store.dispatch('handleGameAdvertised', message.context)
}

function handleGameInvitation(message) {
    EventBus.$emit('client-toast', 'You have been invited to a game')
    store.dispatch('handleGameInvitation', message.context)
}

function handleGameJoined(message) {
    EventBus.$emit('client-toast', 'You have joined the game')
    store.dispatch('handleGameJoined', message.context)
}

function handleGameStarted(message) {
    EventBus.$emit('client-toast', 'The game has started')
    store.dispatch('handleGameStarted')
}

function handleGameCancelled(message) {
    EventBus.$emit('client-toast', 'The game has been cancelled')
    EventBus.$emit(
        'client-toast',
        message.context.reason + ' - ' + message.context.comment
    )
    store.dispatch('handleGameCancelled')
}

function handleGameCompleted(message) {
    EventBus.$emit('client-toast', 'The game has been completed')
    EventBus.$emit('client-toast', message.context.comment)
    store.dispatch('handleGameCompleted')
}

function handleGameIdle(message) {
    EventBus.$emit(
        'client-toast',
        'The game is idle; it will be cancelled in a little while'
    )
    store.dispatch('handleGameIdle')
}

function handleGameInactive(message) {
    EventBus.$emit(
        'client-toast',
        'The game is inactive; expect it to be cancelled momentarily'
    )
    store.dispatch('handleGameInactive')
}

function handleGamePlayerQuit(message) {
    EventBus.$emit('client-toast', 'You have quit the game')
    store.dispatch('handleGamePlayerQuit')
}

function handleGamePlayerChange(message) {
    store.dispatch('handleGamePlayerChange', message.context)
}

function handleGameStateChange(message) {
    store.dispatch('handleGameStateChange', message.context)
}

function handleGamePlayerTurn(message) {
    store.dispatch('handleGamePlayerTurn', message.context)
}

async function onClose(response) {
    console.log(
        'Websocket connection is closed: ' +
            response.status +
            ', ' +
            response.state
    )

    subsocket = null
    open = false
    store.dispatch('handleGameDisconnected') // once disconnected, you can't rejoin

    if (closeRequested) {
        console.log('Close was expected; no more action needs to be taken')
        closeRequested = false
    } else {
        console.log('Close was unexpected; entering recovery/retry')

        retryDurationMs += reconnectDelayMs
        if (retryDurationMs > serverTimeoutMs) {
            console.log(
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

        console.log('Will reconnect after ' + reconnectDelayMs + 'ms')
        await new Promise((resolve) => setTimeout(resolve, reconnectDelayMs))
        EventBus.$emit('client-toast', 'Server connection lost; retrying now.')

        if (pending) {
            if (pending.playerId) {
                reregisterHandle(pending)
            } else {
                registerHandle(pending.handle)
            }
        } else {
            const handle = store.getters.playerHandle
            const playerId = store.getters.playerId
            reregisterHandle({ handle: handle, playerId: playerId })
        }
    }
}

function onError(response) {
    console.log(
        'Websocket connection error: ' +
            response.status +
            ', ' +
            response.state +
            ', ' +
            response.error
    )
}

function onTransportFailure(errorMsg, request) {
    // the two settings prevent the stupid client from falling back to HTTP when the websocket disconnects
    console.log('Websocket transport failure: ' + errorMsg)
    request.transport = 'websocket'
    request.fallbackTransport = 'websocket'
}

function onReconnect(request, response) {
    // in theory, this never gets called, because we had to turn off auto-reconnect to make things work
    // the two settings prevent the stupid client from falling back to HTTP when the websocket disconnects
    console.log(
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

function onMessage(response) {
    const json = response.responseBody
    console.log('Received JSON data (' + response.status + '): ' + json)

    const message = JSON.parse(json)
    switch (message.message) {
        case 'REQUEST_FAILED':
            handleRequestFailed(message)
            break
        case 'SERVER_SHUTDOWN':
            handleServerShutdown(message)
            break
        case 'REGISTERED_PLAYERS':
            handleRegisteredPlayers(message)
            break
        case 'AVAILABLE_GAMES':
            handleAvailableGames(message)
            break
        case 'PLAYER_REGISTERED':
            handlePlayerRegistered(message)
            break
        case 'PLAYER_UNREGISTERED':
            handlePlayerUnregistered(message)
            break
        case 'WEBSOCKET_IDLE':
            handleWebsocketIdle(message)
            break
        case 'WEBSOCKET_INACTIVE':
            handleWebsocketInactive(message)
            break
        case 'PLAYER_IDLE':
            handlePlayerIdle(message)
            break
        case 'PLAYER_INACTIVE':
            handlePlayerInactive(message)
            break
        case 'PLAYER_MESSAGE_RECEIVED':
            handlePlayerMessageReceived(message)
            break
        case 'GAME_ADVERTISED':
            handleGameAdvertised(message)
            break
        case 'GAME_INVITATION':
            handleGameInvitation(message)
            break
        case 'GAME_JOINED':
            handleGameJoined(message)
            break
        case 'GAME_STARTED':
            handleGameStarted(message)
            break
        case 'GAME_CANCELLED':
            handleGameCancelled(message)
            break
        case 'GAME_COMPLETED':
            handleGameCompleted(message)
            break
        case 'GAME_IDLE':
            handleGameIdle(message)
            break
        case 'GAME_INACTIVE':
            handleGameInactive(message)
            break
        case 'GAME_PLAYER_QUIT':
            handleGamePlayerQuit(message)
            break
        case 'GAME_PLAYER_CHANGE':
            handleGamePlayerChange(message)
            break
        case 'GAME_STATE_CHANGE':
            handleGameStateChange(message)
            break
        case 'GAME_PLAYER_TURN':
            handleGamePlayerTurn(message)
            break
    }
}

function sendRequest(request) {
    const json = JSON.stringify(request, null, 2)
    console.log('Sending JSON data: ' + json)
    subsocket.push(json)
}

function connectSocket(onOpen) {
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

function disconnectSocket() {
    console.log('Closing websocket connection')
    closeRequested = true
    socket.unsubscribe()
    retryDurationMs = 0
    reconnectDelayMs = 0
}

function connectAndSend(request) {
    connectSocket((response) => {
        if (!open) {
            // The stupid library sometimes triggers duplicate onOpen events
            console.log('Connection is open, sending request')
            sendRequest(request) // send the request once the socket is open
            open = true
            closeRequested = false
            retryDurationMs = 0
            reconnectDelayMs = 0
        }
    })
}

function registerHandle(handle) {
    pending = { handle: handle, playerId: null }

    console.log('Client is registering handle: ' + handle)

    const request = {
        message: 'REGISTER_PLAYER',
        context: {
            handle: handle,
        },
    }

    connectAndSend(request)
}

function reregisterHandle(player) {
    pending = player

    console.log(
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

    connectAndSend(request)
}

function unregisterHandle() {
    const handle = store.getters.playerHandle
    const playerId = store.getters.playerId

    console.log(
        'Client is unregistering handle: ' +
            handle +
            ' with player id ' +
            playerId
    )

    const request = {
        message: 'UNREGISTER_PLAYER',
        player_id: playerId,
    }

    sendRequest(request)
}

export { disconnectSocket, registerHandle, reregisterHandle, unregisterHandle }
