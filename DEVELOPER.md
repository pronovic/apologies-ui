# Developer Notes

## Development Environment

My primary development environment MacOS, and that is the only environment I
test with regularly.  The code should be portable, and I sometimes spot-check
using my Debian buster development environment.  However, the backend
websockets server is only known to run on Linux and MacOS, which may limit
opportunities for local testing on other platforms.  I do not do any software
development on Windows, and the development process (code checks & formatting,
etc.) may or may not work as expected there.

## Packaging and Dependencies

This project uses "classic" [Yarn v1](https://yarnpkg.com/) and [Parcel](https://parceljs.org/) to manage packaging and dependencies. Most day-to-day tasks are orchestrated through Yarn.  Initial project configuration was bootstraped via [createapp.dev](https://createapp.dev/parcel).  (Yarn v2 has been released, but I ran into problems and decided to stay with the classic version.)

A coding standard is enforced using [ESLint](https://eslint.org/) in conjunction with [StandardJS](https://standardjs.com/) and [Prettier](https://prettier.io/).  Instead of using the `standard` and `prettier` tools directly, we follow Prettier's [recommended configuration](https://prettier.io/docs/en/integrating-with-linters.html#recommended-configuration) to avoid conflcits between the two tools, and use a combination of [eslint-config-standard](https://github.com/standard/eslint-config-standard), [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier), and [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier).

_Note:_ A consequence of using Parcel instead of Webpack is that not everything
works exactly the same, and some examples you find online may not translate
directly.  For instance, Parcel does not allow the `@` alias that Vue usually
uses for the `src` directory.

## Pre-Commit Hooks

We rely on pre-commit hooks to ensure that the code is properly-formatted and
clean when it's checked in.  Pre-commit hooks are implemented using
[Husky](https://github.com/typicode/husky), which is configured 
using [lint-staged](https://www.npmjs.com/package/lint-staged) to run
the eslint checks on staged code.

If necessary, you can temporarily disable a hook using Git's `--no-verify`
switch.  However, keep in mind that the CI build on GitHub enforces these
checks, so the build will fail.

## Javascript Libaries

### Websockets

I am using the [Atmosphere](https://github.com/Atmosphere/atmosphere-javascript) Javascript
library for websockets communication.  See the [API](https://github.com/Atmosphere/atmosphere/wiki/atmosphere.js-API) reference
for more details.  This library seems to be one of the most common today.  

It's straightforward to use, but error-handling sometimes leaves a little to be
desired.  For instance, it's hard to force the library to use _only_ websockets
and not fall back to other alternatives.  The only way to do that is to lose
the built-in auto-reconnect logic.  So, we have to jump through more hoops than
we might have wanted.  Also, the websocket connection sometimes also stays open
longer than you might expect, meaning that callbacks might receive messages
from a connection you thought was closed.  As of this writing, I think I've
worked around most of the warts.

### Frontend Layout

I am using [Vue.js](https://vuejs.org/v2) for the frontend layout, along with
the [BootstrapVue](https://bootstrap-vue.org/) library for styling and widgets.

I chose Vue.js based on their
[comparison](https://vuejs.org/v2/guide/comparison.html) document, under the
assumption that it would be easier to learn and deal with for a relatively
small application like this.  Vue.js has relatively good documentation and a
good getting started guide.  I also liked how Vue came with everything I needed
out of the box. For instance, I have implemented routing via [Vue
Router](https://router.vuejs.org/) and central state state management via
[Vuex](https://vuex.vuejs.org/).

## Rendering the Game Canvas

I am using [Vue Konva](https://konvajs.org/docs/vue/index.html) to render the
game board.  [Konva](https://konvajs.org/) is a 2D library used to manage the
[browser canvas](https://www.w3schools.com/tags/ref_canvas.asp).  Vue Konva
adds declarative and reactive bindings on top of Konva, which makes it fairly
easy to integrate with the rest of the Vue application.

Some animations are implemented with [GreenSock GSAP](https://greensock.com/gsap/).
GSAP is popular and relatively easy to use.  However, it sometimes interacts
poorly with Konva.  For instance, it's sometimes necessary to manually re-draw
the Konva canvas during the GSAP animation loop, which is expensive and seems
like it shouldn't be necessary.

I've attempted to use both built-in Konva tween animations and GSAP tween
animations to smoothly move the pawns from position to position on the board.
This works poorly.  Pawns end up in crazy places and move around in a generally
confused and hard-to-follow fashion.  I haven't figured out exactly why, but my
leading theory is that it's tied to timing. There's no obvious way to
synchronously complete one animation before starting the next.  For now, I've
decided to forgoe animation, and pawns simply teleport from their old location
to their new location.

### Testing

One of my major goals for this effort is to understand how to do testing in a
Javascript application like this.  However, I've been focused so far mainly on
learning the frameworks and the general application design paradigms.

I need to cover three kinds of tests:

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

Since the Vue Konva library works much like the rest of Vue, my expectation is
that I can unit test it the same way as everything else.

## Developer Tasks

The most common developer tasks are managed with `yarn` via the `scripts` list
in [`package.json`](package.json).  The following scripts are available:

- `yarn checks` - Run the StandardJS and Prettier source code checks (note: `checks`, not `check`)
- `yarn format` - Reformat code based on the StandardJS and Prettier checks
- `yarn clean` - Remove the production bundle in `dist/bundle.js`
- `yarn rmcache` - Remove the Parcel cache, sometimes needed if changes to `.env` are not picked up
- `yarn build` - Build the production bundle in `dist/bundle.js`
- `yarn server` - Start the development server in hot module reloading mode

## Prequisites

Nearly all prerequisites are managed by Yarn. All you need to do is make sure
that you have Yarn itself installed (see below).  Once you have Yarn installed,
set up your development environment like this:

```
$ yarn 
$ yarn install
```

### MacOS

On MacOS, it's easiest to use [Homebrew](https://brew.sh/) to install Yarn:

```
$ brew install yarn
```

This installs "classic" Yarn 1.22.x, which is what we're using right now.
In the future, we may upgrade to Yarn 2, and having yarn installed this
way will support that transition.


### Debian

On Debian, you have to jump through some hoops, because the packaged
version of `yarn` (in `yarnpkg`) is not new enough to support the package
format we use for this repo. 

First, install `npm`:

```
$ sudo apt-get install npm
```

Then, install `yarn`:

```
$ sudo npm install -g yarn
```

Finally, add the `npm`-installed version of `yarn` to your `$PATH`:

```
$ export $PATH="/usr/local/bin:$PATH"
```

At this point, you have a working version of "classic" Yarn 1.22.x, which is
what we're using right now.  In the future, we may upgrade to Yarn 2, and
having yarn installed this way will support that transition.

## Local Testing

Local testing is straightforward.  In addition to this repository, you also need
the [apologies-server](https://github.com/pronovic/apologies-server).  You will
run the websockets server in one terminal window and the Parcel server in
another terminal window.

### Websockets Server

```
apologies-server $ run server --help
usage: server [-h] [--quiet] [--verbose] [--debug] [--config CONFIG]
              [--logfile LOGFILE] [--override OVERRIDE]

Start the apologies server and let it run forever.

optional arguments:
  -h, --help           show this help message and exit
  --quiet              decrease log verbosity from INFO to ERROR
  --verbose            increase log verbosity from INFO to DEBUG
  --debug              like --verbose but also include websockets logs
  --config CONFIG      path to configuration on disk
  --logfile LOGFILE    path to logfile on disk (default is stdout)
  --override OVERRIDE  override a config parameter as "param:value"

By default, the server writes logs to stdout. If you prefer, you can specify
the path to a logfile, and logs will be written there instead. The default
configuration file is "/Users/kpronovici/.apologiesrc". If the default
configuration file is not found, default values will be set. If you override
the default config file, it must exist. You may override any individual config
parameter with "--override param:value".
```

The simplest way to start the server is with no arguments:

```
apologies-server $ run server
2020-06-10 14:31:39,831Z --> [INFO   ] Apologies server started
2020-06-10 14:31:39,832Z --> [INFO   ] Configuration: {
  "logfile_path": null,
  "server_host": "localhost",
  "server_port": 8080,
  "close_timeout_sec": 10,
  "websocket_limit": 1000,
  "total_game_limit": 1000,
  "in_progress_game_limit": 25,
  "registered_player_limit": 100,
  "websocket_idle_thresh_min": 2,
  "websocket_inactive_thresh_min": 5,
  "player_idle_thresh_min": 15,
  "player_inactive_thresh_min": 30,
  "game_idle_thresh_min": 10,
  "game_inactive_thresh_min": 20,
  "game_retention_thresh_min": 2880,
  "idle_websocket_check_period_sec": 120,
  "idle_websocket_check_delay_sec": 300,
  "idle_player_check_period_sec": 120,
  "idle_player_check_delay_sec": 300,
  "idle_game_check_period_sec": 120,
  "idle_game_check_delay_sec": 300,
  "obsolete_game_check_period_sec": 300,
  "obsolete_game_check_delay_sec": 300
}
2020-06-10 14:31:39,832Z --> [INFO   ] Adding signal handlers...
2020-06-10 14:31:39,832Z --> [INFO   ] Scheduling tasks...
2020-06-10 14:31:39,832Z --> [INFO   ] Completed starting websocket server
```

The server displays its configuration when it boots.  You can override any of
this configuration using the switches on the `run server` command.   

You can normally start the websockets server and leave it running forever.
If something gets screwed up (like your handle is accidentally in use and
you can't register for it again) just CTRL-C the server and restart it.  No
state is maintained in between, so you'll start over fresh.

### Parcel Server

The Javascript application is served by Parcel in hot module reloading mode:

```
apologies-ui $ yarn server
yarn run v1.22.4
$ parcel serve src/index.html
Server running at http://localhost:1234 
✨  Built in 12.08s.
```

This example shows what happens with a fresh cache (a built time of around 12
seconds on my MacBook).  The server starts much faster after the cache has been
built.

Changes to the source tree are picked up automatically.  This usually works ok,
but sometimes things can get a little confused, depending on what changes you
made.  If necessary, CTRL-C the server and restart it.

### Browser Testing

Once the websockets server and the Parcel server are both running, you can
test in the browser at: http://localhost:1234

Some types of changes to the source tree are reflected immediately due to
Parcel's hot reloading.  For instance, if you change Vue properties like colors
or locations, those often appear on screen as soon as you save your code.

Other changes won't be reflected until the application is reloaded.  When in
doubt, just refresh the browser window.  The code to manage registration state
is robust, so this typically works fairly well, and a refresh leaves you still
logged in and at an empty game window.  Refreshing disconnects your websocket,
which cancels any game you're in the middle of, so you won't have lots of junk
left around in the websockets server.

The Vue browser plugin is quite helpful for understanding the state of the
application.  I have used it for two browsers:

- [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

Once installed, the plugin is available under the browser's developer tools.
It lets you introspect state for Vue components that have rendered on the
screen.  It also lets you introspect _and change_ Vuex state.  It auto-detects
whether a Vue application is available.

The plugin's functionality for Vuex is particularly useful, because changes
made manually to Vuex state flow reactively to components that rely on that
state.  For instance, if you've registered a game, you can change
`state.game.winner` to your handle (i.e. `"Ken"`) and see your pawn bounce up
and down as if you won the game.

## Visual Studio Code

I have been using [VSCode](https://code.visualstudio.com/) for my IDE.  I
have limited experience with VSCode, so this section just documents how
I'm using it.

I have the following plugins installed:

- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
- [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

The Vetur and Vue VSCode Snippets plugins conflict slightly, and you need
to adjust configuration to minimize that (see below).

I find the ESLint and Prettier plugins to be fairly distracting, because they
show a lot of warnings that can usually be fixed automatically and don't seem
to require my attention.  Right now, I have these plugins turned off.  Instead,
I periodically run `yarn format` from the terminal to check and fix the code.

There are no project-specific VSCode settings.  All of my settings are
maintained globally.  For reference, here is my `settings.json`:

```json
{
  "vetur.validation.template": false,
  "vetur.completion.scaffoldSnippetSources": {
    "workspace": "",
    "user": "",
    "vetur": ""
  },
  "editor.tabCompletion": "onlySnippets",
  "editor.formatOnSave": true,
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "workbench.colorTheme": "Night Owl Light (No Italics)",
  "editor.minimap.enabled": false,
  "files.autoSave": "afterDelay",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "explorer.confirmDelete": false,
  "files.autoSaveDelay": 2500
}
```
