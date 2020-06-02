import store from '../store'
import router from '../router'
import atmosphere from 'atmosphere.js'

var socket = atmosphere
var subsocket = null
var open = false
var closeRequested = false

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
            if (router.currentRoute.name !== 'Error') {
                router.push({ name: 'Error' })
            }
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
        'Completed registering handle ' +
            handle +
            ' tied to player id ' +
            playerId
    )
    store.dispatch('handlePlayerRegistered', {
        handle: handle,
        playerId: playerId,
    })
    if (router.currentRoute.name !== 'Game') {
        router.push({ name: 'Game' })
    }
}

function handlePlayerUnregistered(message) {
    console.log('Completed unregistering handle')
    disconnectSocket()
    store.dispatch('handlePlayerNotRegistered')
    if (router.currentRoute.name !== 'Landing') {
        router.push({ name: 'Landing' })
    }
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
    if (closeRequested) {
        closeRequested = false
    } else {
        console.log('Close was unexpected.  Reconnecting.')
        const handle = store.getters.playerHandle
        const playerId = store.getters.playerId
        reregisterHandle(handle, playerId)
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
}

function connectAndSend(request) {
    connectSocket((response) => {
        if (!open) {
            // The stupid library sometimes triggers duplicate onOpen events
            console.log('Connection is open, sending request')
            sendRequest(request) // send the request once the socket is open
            open = true
            closeRequested = false
        }
    })
}

function registerHandle(handle) {
    console.log('Client is registering handle: ' + handle)

    const request = {
        message: 'REGISTER_PLAYER',
        context: {
            handle: handle,
        },
    }

    connectAndSend(request)
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
