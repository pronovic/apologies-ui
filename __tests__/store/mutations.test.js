import Vue from 'vue'
import mutations from 'VStore/mutations'
import { UserLoadStatus } from 'Utils/constants'

describe('store/mutations.js', () => {
    const vueSet = jest.spyOn(Vue, 'set')

    test('test trackHeaderHeightChange()', async () => {
        var state = { dimensions: { header: { height: 0 } } }
        mutations.trackHeaderHeightChange(state, 200)
        expect(state.dimensions.header.height).toBe(200)
    })

    test('test trackWindowSizeChange()', async () => {
        var state = { dimensions: { window: { height: 0, width: 0 } } }
        window.innerHeight = 200
        window.innerWidth = 300
        mutations.trackWindowSizeChange(state)
        expect(state.dimensions.window.height).toBe(200)
        expect(state.dimensions.window.width).toBe(300)
    })

    test('test trackFailure()', async () => {
        var state = { server: { latestFailure: null } }
        mutations.trackFailure(state, 'context')
        expect(state.server.latestFailure).toBe('context')
    })

    test('test trackLatestStatus()', async () => {
        var state = { server: { latestStatus: null } }
        mutations.trackLatestStatus(state, 'status')
        expect(state.server.latestStatus).toBe('status')
    })

    test('test trackRegisteredPlayers()', async () => {
        var state = { server: 'server' }
        var context = { players: 'players' }
        mutations.trackRegisteredPlayers(state, context)
        expect(vueSet).toHaveBeenCalledWith(
            state.server,
            'registeredPlayers',
            context.players
        )
    })

    test('test trackAvailableGames()', async () => {
        var state = { server: 'server' }
        var context = { games: 'games' }
        mutations.trackAvailableGames(state, context)
        expect(vueSet).toHaveBeenCalledWith(
            state.server,
            'availableGames',
            context.games
        )
    })

    test('test trackPlayerRegistered()', async () => {
        var state = {
            user: {
                loadStatus: null,
                registered: null,
                handle: null,
                playerId: null,
            },
        }
        var player = { handle: 'handle', playerId: 'id' }
        mutations.trackPlayerRegistered(state, player)
        expect(state.user.loadStatus).toBe(UserLoadStatus.LOADED)
        expect(state.user.registered).toBe(true)
        expect(state.user.handle).toBe('handle')
        expect(state.user.playerId).toBe('id')
    })

    test('test trackPlayerNotRegistered()', async () => {
        var state = {
            user: {
                loadStatus: 'x',
                registered: 'x',
                handle: 'x',
                playerId: 'x',
            },
        }
        mutations.trackPlayerNotRegistered(state)
        expect(state.user.loadStatus).toBe(UserLoadStatus.LOADED) // yes - not registered, but loaded
        expect(state.user.registered).toBe(false)
        expect(state.user.handle).toBeNull()
        expect(state.user.playerId).toBeNull()
    })

    test('test trackReceivedMessage()', async () => {
        var state = { server: { messages: [] } }
        mutations.trackReceivedMessage(state, 'message')
        expect(state.server.messages).toStrictEqual(['message'])
    })

    test('test trackAdvertisedGame()', async () => {
        var state = { server: { advertisedGame: null } }
        mutations.trackAdvertisedGame(state, 'context')
        expect(state.server.advertisedGame).toBe('context')
    })

    test('test trackGameInvitation()', async () => {
        var state = { server: { invitations: [] } }
        mutations.trackGameInvitation(state, 'invitatation')
        expect(state.server.invitations).toStrictEqual(['invitatation'])
    })

    test('test trackGameAutoplay()', async () => {
        var state = { game: { autoplay: null } }
        mutations.trackGameAutoplay(state, false)
        expect(state.game.autoplay).toBe(false)
    })

    test('test trackGameTerminated()', async () => {
        var state = { game: { terminated: null } }
        mutations.trackGameTerminated(state, true)
        expect(state.game.terminated).toBe(true)
    })

    test('test trackGameStatus()', async () => {
        var state = { game: { status: null } }
        mutations.trackGameStatus(state, 'status')
        expect(state.game.status).toBe('status')
    })

    test('test trackGameWinner()', async () => {
        var state = { game: { winner: null } }
        mutations.trackGameWinner(state, 'winner')
        expect(state.game.winner).toBe('winner')
    })

    test('test trackGamePlayers()', async () => {
        var context = { players: 'players' }
        var state = { game: { comment: null, players: null } }
        mutations.trackGamePlayers(state, context)
        expect(vueSet).toHaveBeenCalledWith(
            state.game,
            'players',
            context.players
        )
    })

    test('test trackGameDetails()', async () => {
        var context = {
            game_id: 'id',
            name: 'name',
            mode: 'mode',
            advertiser_handle: 'handle',
        }
        var state = {
            game: {
                id: null,
                terminated: null,
                name: null,
                mode: null,
                advertiser: null,
            },
        }
        mutations.trackGameDetails(state, context)
        expect(state.game.id).toBe('id')
        expect(state.game.terminated).toBe(false)
        expect(state.game.name).toBe('name')
        expect(state.game.mode).toBe('mode')
        expect(state.game.advertiser).toBe('handle')
    })

    test('test trackGameState() no history', async () => {
        var state = { game: { playerState: null, previousTurn: null } }
        var context = {
            player: 'player',
            opponents: 'opponents',
            recentHistory: null,
        }
        mutations.trackGameState(state, context)
        expect(vueSet).toHaveBeenCalledWith(
            state.game,
            'opponentStates',
            'opponents'
        )
        expect(state.game.playerState).toBe('player')
        expect(state.game.previousTurn).toBeNull()
    })

    test('test trackGameState() empty history', async () => {
        var state = { game: { playerState: null, previousTurn: null } }
        var context = {
            player: 'player',
            opponents: 'opponents',
            recentHistory: [],
        }
        mutations.trackGameState(state, context)
        expect(vueSet).toHaveBeenCalledWith(
            state.game,
            'opponentStates',
            'opponents'
        )
        expect(state.game.playerState).toBe('player')
        expect(state.game.previousTurn).toBeNull()
    })

    test('test trackGameState() with history, no card', async () => {
        var state = { game: { playerState: null, previousTurn: null } }
        var history = [{ color: 'color', card: null }]
        var context = {
            player: 'player',
            opponents: 'opponents',
            recentHistory: history,
        }
        mutations.trackGameState(state, context)
        expect(vueSet).toHaveBeenCalledWith(
            state.game,
            'opponentStates',
            'opponents'
        )
        expect(state.game.playerState).toBe('player')
        expect(state.game.previousTurn).toBeNull()
    })

    test('test trackGameState() with history, no color', async () => {
        var state = { game: { playerState: null, previousTurn: null } }
        var history = [{ color: null, card: 'card' }]
        var context = {
            player: 'player',
            opponents: 'opponents',
            recentHistory: history,
        }
        mutations.trackGameState(state, context)
        expect(vueSet).toHaveBeenCalledWith(
            state.game,
            'opponentStates',
            'opponents'
        )
        expect(state.game.playerState).toBe('player')
        expect(state.game.previousTurn).toBeNull()
    })

    test('test trackGameState() with history, color and card', async () => {
        var state = { game: { playerState: null, previousTurn: null } }
        var history = [{ color: 'color', card: 'card' }]
        var context = {
            player: 'player',
            opponents: 'opponents',
            recent_history: history,
        }
        mutations.trackGameState(state, context)
        expect(vueSet).toHaveBeenCalledWith(
            state.game,
            'opponentStates',
            'opponents'
        )
        expect(state.game.playerState).toBe('player')
        expect(state.game.previousTurn).toMatchObject(history[0])
    })

    test('test trackPlayerTurn()', async () => {
        var state = { game: { drawnCard: null } }
        var context = { drawn_card: 'card' }
        mutations.trackPlayerTurn(state, context)
        expect(vueSet).toHaveBeenCalledWith(
            state.game,
            'playerMoves',
            context.moves
        )
        expect(state.game.drawnCard).toBe('card')
    })

    test('test clearGame()', async () => {
        var state = {
            server: {
                advertisedGame: 'game',
            },
            game: {
                id: 'x',
                autoplay: 'x',
                terminated: 'x',
                name: 'x',
                mode: 'x',
                advertiser: 'x',
                winner: 'x',
                previousTurn: 'x',
                status: 'x',
                comment: 'x',
                players: 'x',
                playerState: 'x',
                opponentStates: 'x',
                drawnCard: 'x',
                playerMoves: 'x',
            },
        }

        mutations.clearGame(state)

        expect(state.server.advertisedGame).toBeNull()
        expect(state.game.id).toBeNull()
        expect(state.game.autoplay).toBe(false)
        expect(state.game.terminated).toBe(false)
        expect(state.game.name).toBeNull()
        expect(state.game.mode).toBeNull()
        expect(state.game.advertiser).toBeNull()
        expect(state.game.winner).toBeNull()
        expect(state.game.previousTurn).toBeNull()
        expect(state.game.status).toBeNull()
        expect(state.game.comment).toBeNull()
        expect(vueSet).toHaveBeenCalledWith(state.game, 'players', [])
        expect(state.game.playerState).toBeNull()
        expect(vueSet).toHaveBeenCalledWith(state.game, 'opponentStates', [])
        expect(state.game.drawnCard).toBeNull()
        expect(vueSet).toHaveBeenCalledWith(state.game, 'playerMoves', [])
    })

    test('test clearPlayerMove()', async () => {
        var state = { game: { drawnCard: 'card', playerMoves: 'moves' } }
        mutations.clearPlayerMove(state)
        expect(state.game.drawnCard).toBeNull()
        expect(state.game.playerMoves).toStrictEqual([])
    })
})
