import store from '../store'

function disconnectSocket() {
    // TODO: implement actual socket behavior here; this is stubbed
    console.log('Disconnecting websockets connection')
}

function registerHandle(handle) {
    // TODO: implement actual socket behavior here; this is stubbed to just do the state transition
    const playerId = 'bogus' // just a dummy for now, until we have socket code to get the real id
    console.log(
        'Registered handle ' + handle + ' tied to player id ' + playerId
    )
    store.dispatch('handlePlayerRegistered', handle, playerId)
}

function reregisterHandle(handle, playerId) {
    // TODO: implement actual socket behavior here; this is stubbed to just do the state transition
    // If we get back invalid player, then we need to try to just register the handle, and only then can we transition to another state
    console.log(
        'Reregistered handle ' + handle + ' tied to player id ' + playerId
    )
    store.dispatch('handlePlayerRegistered', handle, 'playerId')
}

function unregisterHandle() {
    // TODO: implement actual socket behavior here; this is stubbed to just do the state transition
    console.log('Unregistered handle')
    store.dispatch('handlePlayerNotRegistered').then(() => {
        // TODO: not quite sure how we'll handle this; probably done elsewhere?  no point in keeping socket open if they're
        disconnectSocket()
    })
}

export { disconnectSocket, registerHandle, reregisterHandle, unregisterHandle }
