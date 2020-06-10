# Design Notes

I expect this UI piece to be substantially harder for me than the backend work
that I already completed.  I have less experience with the language as well as
with the general design and architecture principles.  

_Reminder to self:_ this is going to be a long process, and I need to be
willing to do it incrementally, and back off when I'm tired or it's becoming
frustrating.

## Libraries

### Websockets

My intent is to use the [Atmosphere](https://github.com/Atmosphere/atmosphere-javascript) Javascript
library for Websockets.  See the [API](https://github.com/Atmosphere/atmosphere/wiki/atmosphere.js-API)
reference for more details.  It sounds like you can do websockets natively in
the browser, but that a framework is useful for better error handling, etc.
This library seems to be one of the most common today.  I'm hoping it will be
straightforward to wire its callbacks into varius UI handlers.

### Frontend Layout

My intent is to use [Vue.js](https://vuejs.org/v2) for the frontend layout,
along with [BootstrapVue](https://bootstrap-vue.org/) for styling and
widgets.

I chose Vue.js based on their [comparison](https://vuejs.org/v2/guide/comparison.html) document, 
under the assumption that it will be easier to learn and deal with for a
relatively small application like this.  Vue.js is supposed to have relatively
good documentation and a good getting started guide that someone can get
through in a day of study.  

### Rendering the Game Board

My intent is to use [Vue Konva](https://konvajs.org/docs/vue/index.html) for
rendering the game board.  Konva is a canvas library. Since it has Vue
integration, the canvas widgets are reactive.

### Testing

We need to cover three kinds of tests:

- Unit tests (single component)
- Integration tests (multi-component)
- End to end (E2E) tests (functional or acceptance tests)

Vue.js has [good support](https://vuejs.org/v2/guide/unit-testing.html) for
several common frameworks and its own [Vue Test
Utils](https://vue-test-utils.vuejs.org/) that help with testing.  

My intent is to use [Cypress](https://www.cypress.io/) for functional testing
and [Jest](https://jestjs.io/en/) for unit and integration testing.  There are
other options in both cases, but the general recommendation seems be that these
are the best fit for Vue.js as of today.  Both are popular and well supported
and seem to work well.  Cypress only supports Chrome, but it seems like that's
probably ok for my purposes.  (The articles [here](https://www.monterail.com/blog/end-to-end-testing-with-cypress) and
[here](https://medium.com/welldone-software/an-overview-of-javascript-testing-7ce7298b9870) were helpful.)

Since the Vue Konva library works much like the rest of Vue, my expectation
is that I can unit test it the same way.  

## TODO List

This is a list of things I need to accomplish, in no particular order:

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
   - [x] A rudimentary way to view game state and choose a move before the game board canvast is written
- [ ] Figure out test patterns and implement tests
   - [ ] Unit tests for individual Vue.js components
   - [ ] Integration tests for component interations (maybe?) 
   - [ ] Some sort of E2E functional test suite to cover the entire application (which isn't really that large)
- [ ] Implement the game canvas using Konva
   - [x] Figure out what size the board will be 
   - [x] Render the player's hand of cards
   - [x] Render the static portions of the board
   - [ ] Render the game state, including animation of pawns 
   - [ ] Let the player pick a move
   - [ ] Validate the player's move (this means mapping their action - cards and pawns - to one the legal actions)
   - [ ] Figure out how we'll decide that a player's move is final - just move the pawn and if it's legal we submit?
   - [ ] Figure out how (or even if) we can write unit test or E2E tests for game board (might not be fully possible)
