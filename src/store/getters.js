import { random } from 'Utils/util'
import {
    UserLoadStatus,
    GameStatus,
    GameMode,
    PlayerColor,
} from 'Utils/constants'

function derivePlayersFromGameState(game, playerHandle) {
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
    //
    // It's important that this always returns at least an empty object, so other
    // getters don't need to do null-checking.

    var players = {}

    if (game.players) {
        for (const player of game.players) {
            players[player.handle] = {
                handle: player.handle,
                color: player.player_color,
                type: player.player_type,
                state: player.player_state,
                isAdvertiser: false,
                isOpponent: player.handle !== playerHandle,
                isWinner: false,
                turns: 0,
                hand: [],
                pawns: [],
            }
        }
    }

    if (game.playerState) {
        players[playerHandle].turns = game.playerState.turns
        players[playerHandle].hand = game.playerState.hand
        players[playerHandle].pawns = game.playerState.pawns
    }

    if (game.opponentStates) {
        const stateMap = Object.fromEntries(
            game.opponentStates.map((e) => [e.color, e])
        )

        for (const player of Object.values(players)) {
            if (player.color in stateMap) {
                player.turns = stateMap[player.color].turns
                player.pawns = stateMap[player.color].pawns
            }
        }
    }

    if (game.mode === GameMode.STANDARD && game.drawnCard) {
        // In a standard mode game, the hand is always empty, so we fill it
        // with the card they most recently played.
        players[playerHandle].hand = [game.drawnCard]
    }

    if (game.previousTurn) {
        for (const player of Object.values(players)) {
            if (player.isOpponent) {
                if (player.color === game.previousTurn.color) {
                    if (game.mode === GameMode.STANDARD) {
                        player.hand = [game.previousTurn.card]
                    } else {
                        // Here, we're being cute and pretending they pick from different parts of their hand
                        const index = random(0, 4)
                        const hand = [null, null, null, null, null]
                        hand[index] = game.previousTurn.card
                        player.hand = hand
                    }
                } else {
                    if (game.mode === GameMode.STANDARD) {
                        player.hand = []
                    } else {
                        player.hand = [null, null, null, null, null]
                    }
                }
            }
        }
    }

    if (game.winner && game.winner in players) {
        players[game.winner].isWinner = true
    }

    if (game.advertiser && game.advertiser in players) {
        players[game.advertiser].isAdvertiser = true
    }

    return players
}

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
        return !!(
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
        return derivePlayersFromGameState(state.game, getters.playerHandle)
    },
}

export default getters
