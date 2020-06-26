import { random } from 'Utils/util'
import {
    UserLoadStatus,
    GameStatus,
    GameMode,
    PlayerColor,
} from 'Utils/constants'

const getters = {
    displayHeight: (state) => {
        return state.dimensions.window.height - state.dimensions.header.height
    },
    displayWidth: (state) => {
        return state.dimensions.window.width
    },
    playerId: (state) => {
        return state.user.playerId
    },
    playerHandle: (state) => {
        return state.user.handle == null ? '' : state.user.handle
    },
    gameId: (state) => {
        return state.game.id
    },
    availableGames: (state) => {
        return state.server.availableGames
    },
    userLoadStatus: (state) => {
        return state.user.loadStatus
    },
    isUserLoaded: (state) => {
        return state.user.loadStatus === UserLoadStatus.LOADED
    },
    isUserRegistered: (state) => {
        return !!state.user.registered
    },
    isAutoplayEnabled: (state) => {
        return !!state.game.autoplay
    },
    isGameTerminated: (state) => {
        return !!state.game.terminated
    },
    isGameJoined: (state) => {
        return state.game.id != null
    },
    isGameAdvertised: (state) => {
        return state.server.advertisedGame != null
    },
    isGameStarted: (state) => {
        return state.game.status === GameStatus.GAME_STARTED
    },
    isGameCompleted: (state) => {
        switch (state.game.status) {
            case GameStatus.GAME_CANCELLED:
            case GameStatus.GAME_COMPLETED:
            case GameStatus.GAME_INACTIVE:
            case GameStatus.PLAYER_QUIT:
            case GameStatus.DISCONNECTED:
                return true
            default:
                return false
        }
    },
    isPlayerTurn: (state) => {
        // when it is a player's turn, there will always be at least one legal move (which might be a forfeit)
        return (
            state.game.playerMoves &&
            Object.keys(state.game.playerMoves).length > 0
        )
    },
    player: (state, getters) => {
        return getters.playerHandle in getters.players
            ? getters.players[getters.playerHandle]
            : null
    },
    opponents: (state, getters) => {
        return Object.values(getters.players)
            .filter((player) => {
                return player.isOpponent
            })
            .map(({ handle }) => handle)
            .sort()
            .map((handle) => getters.players[handle])
    },
    redPawns: (state, getters) => {
        for (const player of Object.values(getters.players)) {
            if (player.color === PlayerColor.RED) {
                return player.pawns
            }
        }
        return [] // if we can't find the player, just return no pawns
    },
    yellowPawns: (state, getters) => {
        for (const player of Object.values(getters.players)) {
            if (player.color === PlayerColor.YELLOW) {
                return player.pawns
            }
        }
        return [] // if we can't find the player, just return no pawns
    },
    greenPawns: (state, getters) => {
        for (const player of Object.values(getters.players)) {
            if (player.color === PlayerColor.GREEN) {
                return player.pawns
            }
        }
        return [] // if we can't find the player, just return no pawns
    },
    bluePawns: (state, getters) => {
        for (const player of Object.values(getters.players)) {
            if (player.color === PlayerColor.BLUE) {
                return player.pawns
            }
        }
        return [] // if we can't find the player, just return no pawns
    },
    players: (state, getters) => {
        // This merges information from several different events into a single
        // cohesive state for each player, tracked as a map by player handle.
        //
        // Most of the information comes from the player change and game state events.
        // Public information about each opponent's hand is augmented based on the
        // previous turn information tracked via history.  For a standard mode game,
        // the player's hand is augmented based on the game player turn event.
        //
        // Unfortunately, there's no handle in the game state, only a color.  And, we
        // don't have any game state information or any color until after the game has
        // been started and colors have been assigned.  So, we need to jump through
        // some hoops to fill in only the information that is available at the current
        // time.

        var players = {}

        if (state.game.players) {
            for (const player of state.game.players) {
                players[player.handle] = {
                    handle: player.handle,
                    color: player.player_color,
                    type: player.player_type,
                    state: player.player_state,
                    isAdvertiser: false,
                    isOpponent: player.handle !== getters.playerHandle,
                    isWinner: false,
                    turns: 0,
                    hand: [],
                    pawns: [],
                }
            }
        }

        if (state.game.playerState) {
            players[getters.playerHandle].turns = state.game.playerState.turns
            players[getters.playerHandle].hand = state.game.playerState.hand
            players[getters.playerHandle].pawns = state.game.playerState.pawns
        }

        if (state.game.opponentStates) {
            const stateMap = Object.fromEntries(
                state.game.opponentStates.map((e) => [e.color, e])
            )

            for (const player of Object.values(players)) {
                if (player.color in stateMap) {
                    player.turns = stateMap[player.color].turns
                    player.pawns = stateMap[player.color].pawns
                }
            }
        }

        if (state.game.mode === GameMode.STANDARD && state.game.drawnCard) {
            // In a standard mode game, the hand is always empty, so we fill it
            // with the card they most recently played.
            players[getters.playerHandle].hand = [state.game.drawnCard]
        }

        if (state.game.previousTurn) {
            for (const player of Object.values(players)) {
                if (player.isOpponent) {
                    if (player.color === state.game.previousTurn.color) {
                        if (state.game.mode === GameMode.STANDARD) {
                            player.hand = [state.game.previousTurn.card]
                        } else {
                            // Here, we're being cute and pretending they pick from different parts of their hand
                            const index = random(0, 4)
                            const hand = [null, null, null, null, null]
                            hand[index] = state.game.previousTurn.card
                            player.hand = hand
                        }
                    } else {
                        if (state.game.mode === GameMode.STANDARD) {
                            player.hand = []
                        } else {
                            player.hand = [null, null, null, null, null]
                        }
                    }
                }
            }
        }

        if (state.game.winner && state.game.winner in players) {
            players[state.game.winner].isWinner = true
        }

        if (state.game.advertiser && state.game.advertiser in players) {
            players[state.game.advertiser].isAdvertiser = true
        }

        return players
    },
}

export default getters
