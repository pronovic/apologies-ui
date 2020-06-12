/** Clear the player information tracked in HTML 5 local storage. */
function clearPlayer() {
    localStorage.removeItem('player')
}

/** Persist player information in HTML 5 local storage. */
function persistPlayer(handle, playerId) {
    const player = { handle: handle, playerId: playerId }
    localStorage.setItem('player', JSON.stringify(player))
}

/** Load player information from HTML 5 local storage. */
function loadPlayer() {
    try {
        const stored = localStorage.getItem('player')
        return stored == null ? null : JSON.parse(stored)
    } catch (e) {
        return null
    }
}

export { clearPlayer, persistPlayer, loadPlayer }
