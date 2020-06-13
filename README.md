# Apologies UI

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://github.com/pronovic/apologies-ui/workflows/Test%20Suite/badge.svg)

[Apologies UI](https://github.com/pronovic/apologies-ui) is a browser user
interface written on top of the [Apologies
Server](https://github.com/pronovic/apologies-server) websocket server and its
associated [Apologies](https://github.com/pronovic/apologies) Python library.
It implements a game similar to the [Sorry](https://en.wikipedia.org/wiki/Sorry!_(game)) board game,
with a few different modes of play based on variations of that game.

It was written as a learning exercise and technology demonstration effort,
primarily focused on asynchronous and reactive application design using
[websockets](https://en.wikipedia.org/wiki/WebSocket) and
[Vue.js](https://vuejs.org/).  It also serves example of how to manage a 
Javascript project, including style checks, code formatting, etc.

As of this writing, the application is only partially complete.  User
registration works, and users across multiple browsers can advertise, join,
cancel and quit a game and see each other's state.  There is also an autoplay
mode that can be used to observe a fully-automated game played against the
backend websocket server.  However, the functionality for users to interact
with game state has not yet been written, so there is no way for users to
choose which move they would like to play when it is their turn.  There is a
[TODO list](TODO.md) for the remaining tasks.

Developer documentation is found in [DEVELOPER.md](DEVELOPER.md). See that file
for notes about how the code is structured, how to set up a development
environment, etc.
