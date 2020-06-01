const UserLoadStatus = {
    NOT_LOADED: 'Not Loaded',
    LOADED: 'Loaded',
    UNAVAILABLE: 'Handle Unavailable',
    ERROR: 'Error',
}

// TODO: should probably be a true Javascript class?
const user = {
    loadStatus: UserLoadStatus.NOT_LOADED,
    registered: false,
    player: null,
}

function clearPlayer() {
    localStorage.removeItem('player')
}

function persistPlayer(player) {
    localStorage.setItem('player', JSON.stringify(player))
}

function loadPlayer() {
    var stored = localStorage.getItem('player')
    if (stored == null) {
        return null
    } else {
        try {
            return JSON.parse(stored)
        } catch (e) {
            return null
        }
    }
}

export { UserLoadStatus, user, clearPlayer, persistPlayer, loadPlayer }
