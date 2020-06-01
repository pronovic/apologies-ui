import store from '../store'
import router from '../router'
import atmosphere from 'atmosphere.js'

var socket = atmosphere
var subsocket = null
var open = false

function handleRequestFailed(message) {
    const reason = message.context.reason
    const handle = message.context.handle
    switch (reason) {
        case 'INVALID_PLAYER':
        case 'DUPLICATE_USER':
            console.log('Handle is not available: ' + handle)
            store.dispatch('handlePlayerNotRegistered')
            router.push({
                name: 'HandleUnavailable',
                params: { handle: handle },
            })
            break
        default:
            store.dispatch('handleRequestFailed', message.context)
            router.push({ name: 'Error' })
            break
    }
}

function handleServerShutdown(message) {}

function handleWebsocketIdle(message) {}

function handleWebsocketInactive(message) {}

function handleRegisteredPlayers(message) {}

function handleAvailableGames(message) {}

function handlePlayerRegistered(message) {
    const handle = message.context.handle
    const playerId = message.player_id
    console.log(
        'Registered handle ' + handle + ' tied to player id ' + playerId
    )
    store.dispatch('handlePlayerRegistered', {
        handle: handle,
        playerId: playerId,
    })
    router.push({ name: 'Game' })
}

function handlePlayerUnregistered(message) {
    console.log('Unregistered handle')
    disconnectSocket()
    store.dispatch('handlePlayerNotRegistered')
    router.push({ name: 'Landing' })
}

function handlePlayerIdle(message) {}

function handlePlayerInactive(message) {}

function handlePlayerMessageReceived(message) {}

function handleGameAdvertised(message) {}

function handleGameInvitation(message) {}

function handleGameJoined(message) {}

function handleGameStarted(message) {}

function handleGameCancelled(message) {}

function handleGameCompleted(message) {}

function handleGameIdle(message) {}

function handleGameInactive(message) {}

function handleGamePlayerQuit(message) {}

function handleGamePlayerChange(message) {}

function handleGameStateChange(message) {}

function handleGamePlayerTurn(message) {}

function onClose(response) {
    console.log(
        'Websocket connection is closed: ' +
            response.status +
            ', ' +
            response.state
    )
    subsocket = null
    open = false
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
    store.dispatch('handleWebsocketError')
    router.push({ name: 'Error' })
}

function onTransportFailure(errorMsg, request) {
    console.log('Websocket transport failure: ' + errorMsg)
    request.transport = 'websocket'
    request.fallbackTransport = 'websocket'
}

// TODO: I think I need to do something here so I attempt to reconnect if dropped
// but I'm not sure what.  I think that the onOpen() is screwed up (because it
// won't necessarily know how to re-register), so I would have to fix that - if
// this even gets called.
function onReconnect(request, response) {
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
    socket.unsubscribe()
}

function registerHandle(handle) {
    console.log('Client is registering handle: ' + handle)

    const request = {
        message: 'REGISTER_PLAYER',
        context: {
            handle: handle,
        },
    }

    connectSocket((response) => {
        if (!open) {
            // The stupid library sometimes triggers duplicate onOpen events
            console.log('Connection is open, sending register request')
            sendRequest(request) // send the request once the socket is open
            open = true
        }
    })
}

function reregisterHandle(handle, playerId) {
    console.log(
        'Client is registering handle: ' +
            handle +
            ' with player id ' +
            playerId
    )

    const request = {
        message: 'REREGISTER_PLAYER',
        player_id: playerId,
        context: {
            handle: handle,
        },
    }

    connectSocket((response) => {
        if (!open) {
            // The stupid library sometimes triggers duplicate onOpen events
            console.log('Connection is open, sending reregister request')
            sendRequest(request) // send the request once the socket is open
            open = true
        }
    })
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
