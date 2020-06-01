function clearPlayer() {
    localStorage.removeItem('player')
}

function persistPlayer(handle, playerId) {
    const player = { handle: handle, playerId: playerId }
    localStorage.setItem('player', JSON.stringify(player))
}

function loadPlayer() {
    try {
        const stored = localStorage.getItem('player')
        return stored == null ? null : JSON.parse(stored)
    } catch (e) {
        return null
    }
}

export { clearPlayer, persistPlayer, loadPlayer }
