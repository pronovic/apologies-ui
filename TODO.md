## TODO List

This is a list of things I want to accomplish, in no particular order:

- [x] Add an application dependency on babel, now that I'm not using Typescript?
- [x] Go through the Vue.js tutorial, which is supposed to take around a day.
- [x] Figure out how to save state (specifically, handle and player id) to HTML 5 local storage.
- [x] Connect Atmosphere to the websockets server.  Understand how to handle automatic reconnects, etc.
- [x] Consider whether it should be possible to reconnect to a game after being disconnected from it
- [x] Lay out a simple UI.  Needs at least the following:
   - [x] Some sort of landing page to advertise what the game is, with a "register now" link
   - [x] Some sort of main page for the user once logged in (very spare - with menus and space in the middle for canvas)
   - [x] A way to register a handle (or to tell that a handle is still registered, via integration with local storage)
   - [x] Notification for game invitations (could be as simple as "you have an invitition, check game list")
   - [x] Notification for other import events (you were disconnected, player joined/left, game cancelled, etc.)
   - [x] A way to see which games can be joined, and to choose one off the list
   - [x] Some sort of visible hint that a game has been joined, the game state (started, etc.), and a way to quit it
   - [x] A way to advertise a game, and start and cancel it once advertised (the advertiser has slightly different options)
   - [x] A rudimentary way to view game state and choose a move before the game board canvas is written
- [ ] Implement the game canvas using Konva
   - [x] Figure out what size the board will be 
   - [x] Render the player's hand of cards
   - [x] Render the static portions of the board
   - [x] Render the game state, including moving pawns between locations ("teleporting" ok at this stage)
   - [x] Figure out a better mechanism to animate pawn movement, to make game play more intelligible
   - [ ] Render a hint or instructions for a card (hover?  tooltip?  new section?)
   - [ ] A way for a player to pick their card in adult mode
   - [ ] A way for a player to pick pick the pawns associated with a move
   - [ ] A way to validate a player's move (this means mapping their action - cards and pawns - to one the legal actions)
   - [ ] Decide how a player's move is final - just move the pawn and if it's legal we submit?
- [ ] Figure out test patterns and implement tests
   - [ ] Unit tests for individual Vue.js components
   - [ ] Integration tests for component interations (maybe?) 
   - [ ] Some sort of E2E functional test suite to cover the entire application (which isn't really that large)
   - [ ] Figure out how (or even if) we can write unit test or E2E tests for game board (might not be fully possible)
- [ ] Add JSDoc comments to the codebase so it's more legible
