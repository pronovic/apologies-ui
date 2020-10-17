# Developer Notes

## Development Environment

My primary development environment MacOS, and that is the only environment I
test with regularly.  The code should be portable, and I sometimes spot-check
using my Debian buster development environment.  However, the backend
websockets server does not run on Windows.  I do not do any software
development on Windows, and the development process (code checks & formatting,
etc.) may or may not work as expected there.

## Packaging and Dependencies

This project uses "classic" [Yarn v1](https://yarnpkg.com/) and [Parcel](https://parceljs.org/) to manage packaging and dependencies. Most day-to-day tasks are orchestrated through Yarn.  Initial project configuration was bootstraped via [createapp.dev](https://createapp.dev/parcel).  (Yarn v2 has been released, but I ran into problems and decided to stay with the classic version.)

A coding standard is enforced using [ESLint](https://eslint.org/) in conjunction with [StandardJS](https://standardjs.com/) and [Prettier](https://prettier.io/).  Instead of using the `standard` and `prettier` tools directly, we follow Prettier's [recommended configuration](https://prettier.io/docs/en/integrating-with-linters.html#recommended-configuration) to avoid conflcits between the two tools, and use a combination of [eslint-config-standard](https://github.com/standard/eslint-config-standard), [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier), and [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier).

_Note:_ A consequence of using Parcel instead of Webpack is that not everything
works exactly the same, and some examples you find online may not translate
directly.  For instance, Parcel does not allow the `@` alias that Vue usually
uses for the `src` directory.

## Dependabot Security Updates

Peridically, GitHub's [Dependabot](https://github.com/dependabot) issues
warnings about out-of-date node package dependencies.  

If these are direct dependencies, I update the `dependencies` section of
[`package.json`](package.json).  If the problem is with a transitive
dependency, then the solution is to add a line to the `resolutions` section
instead, like this:

```json
 "resolutions": {
    "**/**/node-forge": "^0.10.0"
  }
```

After running `yarn install`, we get something like this in `yarn.lock`:

```
node-forge@^0.10.0, node-forge@^0.7.1:
  version "0.10.0"
  resolved "https://registry.yarnpkg.com/node-forge/-/node-forge-0.10.0.tgz#32dea2afb3e9926f02ee5ce8794902691a676bf3"
  integrity sha512-PPmu8eEeG9saEUvI97fm4OYxXVB6bFvyNTyiUOBichBpFG8A1Ljw3bY62+5oOjDEMHRnd0Y7HQ+x7uzxOzC6JA==
```

Yarn still recognizes the original dependency as the (vulnerable) v0.7.1, but
overrides it to v0.10.0.

## Developer Tasks

The most common developer tasks are managed with `yarn` via the `scripts` list
in [`package.json`](package.json).  The following scripts are available:

- `yarn checks` - Run the StandardJS and Prettier source code checks (note: `checks`, not `check`)
- `yarn format` - Reformat code based on the StandardJS and Prettier checks
- `yarn clean` - Remove the production bundle in `dist/`
- `yarn rmcache` - Remove the Parcel cache, which is sometimes needed if changes to `.env` are not picked up
- `yarn build` - Build the production bundle in `dist/`
- `yarn server` - Start the development server in hot module reloading mode
- `yarn test` - Run the unit test suite
- `yarn test:c` - Run the unit test suite and gather coverage
- `yarn test:ch` - Run the unit test suite and gather coverage, opening the HTML coverage report

You can pass other arguments (i.e. `--verbose`), and Yarn will provide them to
the underlying command.  

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

## Pre-Commit Hooks

We rely on pre-commit hooks to ensure that the code is properly-formatted and
clean when it's checked in.  Pre-commit hooks are implemented using
[Husky](https://github.com/typicode/husky), which is configured 
using [lint-staged](https://www.npmjs.com/package/lint-staged) to run
the eslint checks on staged code.

If necessary, you can temporarily disable a hook using Git's `--no-verify`
switch.  However, keep in mind that the CI build on GitHub enforces these
checks, so the build will fail.

## Path Aliases

Parcel is configured with aliases for common package locations.  For instance,
to load code from `src/util/constants.js`, import from `Util/constants`.  See
the `alias` key in [`package.json`](package.json).  There is equivalent
configuration in [`jsconfig.json`](jsconfig.json) for VSCode (so code
completion works as expected) and also for Jest under the
`jest.moduleNameMapper` key in `package.json`.  I found 
this [reference](https://medium.com/@justintulk/solve-module-import-aliasing-for-webpack-jest-and-vscode-74007ce4adc9) useful 
when setting up aliases, even though it refers to Webpack instead of Parcel.

## Configuration

Configuration is stored in the [`.env`](.env) file.  At build time, Parcel
introspects this file using [dotenv](https://github.com/motdotla/dotenv)
as described on Parcel's [Environment Variables](https://parceljs.org/env.html)
documentation.  

In theory, you can manage several different environments, and Parcel will 
inject the right configuration into your build as needed.  Right now, I have
only one environment file, which points at the websockets server running
on `http://localhost:8080`.

This is one place where Parcel and Vue.js do not play well together.  Parcel
injects configuration into `process.env`, but that variable is not available
to Vue components.  Instead, we go through a two step process: first `process.env`
is mapped to a config object in [`config.js`](src/store/config.js), and then
that configuration is exposed via a Vuex attribute in the [global store](src/store/index.js).

Since there are not that many configuration items, this works fairly well.
However, it does mean that you have to remember to add configuration in two
different places.  There is a comment in `.env` as a reminder.

One big benefit to exposing configuration via Vuex state is that you can change
it on the fly using the Vue browser plugin.  For instance, you can adjust the
log level or enable display of position numbers on the game board while the
application is running.  These changes will revert to defaults when you refresh
the application.

On the down side, it is sometimes hard to get Parcel to pick up changes to
the `.env` file.  If you make a change to configuration and it's not reflected,
stop the local server and run `yarn clean` and `yarn rmcache`.  That usually
fixes the problem.

## Console Logging

Code should not use `console.log()` directly.  Instead, import `logger`
from [`util.js`](src/utils/util.js) and use one of:

- `logger.error()`
- `logger.warn()`
- `logger.info()`
- `logger.debug()`

These methods standardize how `console.log()` is used.  They respect the log
level in configuration.  This makes it easy to turn up and down the verbosity
just by adjusting configuration in Vuex state using the Vue browser plugin.
They also implement a standardized log message format, including a timestamp
and log level.  This makes the result a little easier to read.  (I've always
found it strange that the console doesn't include a timestamp.)

## Javascript Libaries

### Websockets

I am using the [Atmosphere](https://github.com/Atmosphere/atmosphere-javascript) Javascript
library for websockets communication.  See the [API](https://github.com/Atmosphere/atmosphere/wiki/atmosphere.js-API) reference
for more details.  This library seems to be one of the most commonly-used today.  

It's straightforward to use, but error-handling sometimes leaves a little to be
desired.  For instance, it's hard to force the library to use _only_ websockets
and not fall back to other alternatives.  The only way to do that is to lose
the built-in auto-reconnect logic.  So, we have to jump through more hoops than
we might have wanted.  Also, the websocket connection sometimes also stays open
longer than you might expect, meaning that callbacks might receive messages
from a connection you thought was closed.  As of this writing, I think I've
worked around most of the warts.

### Frontend Layout

I am using [Vue.js v2](https://vuejs.org/) for the frontend layout, along with
the [BootstrapVue](https://bootstrap-vue.org/) library for styling and widgets.

I chose Vue.js based on their
[comparison](https://vuejs.org/v2/guide/comparison.html) document, under the
assumption that it would be easier to learn and deal with for a relatively
small application like this.  Vue.js has relatively good documentation and a
good getting started guide.  I also liked how Vue came with everything I needed
out of the box. For instance, I have implemented routing via [Vue
Router](https://router.vuejs.org/) and central state state management via
[Vuex](https://vuex.vuejs.org/).

### Rendering the Game Canvas

I am using [Vue Konva](https://konvajs.org/docs/vue/index.html) to render the
game board.  [Konva](https://konvajs.org/) is a 2D library used to manage the
[browser canvas](https://www.w3schools.com/tags/ref_canvas.asp).  Vue Konva
adds declarative and reactive bindings on top of Konva, which makes it fairly
easy to integrate with the rest of the Vue application.

Animations (such as bouncing actions or pawns moving around the board) are
implemented with [GreenSock GSAP](https://greensock.com/gsap/).  GSAP is
popular and relatively easy to use.  However, it sometimes interacts a little
strangely with Konva.  For instance, I've found it necessary to manually
re-draw the Konva layer during the GSAP animation loop, which seems like it
shouldn't be necessary.  I can sometimes make animations work without that
step, but it's not clear why - maybe something having to with which Konva layer
the component resides in. 

## Automated Testing

There are 3 kinds of tests:

- Unit tests (single component)
- Integration tests (multi-component)
- End to end (E2E) tests (functional or acceptance tests)

I am using [Jest](https://jestjs.io/en/) for unit and integration testing, and
I intend to use [Cypress](https://www.cypress.io/) for functional acceptance
testing.

There are other options in both cases, but the general recommendation seems be
that these are the best fit for Vue.js as of today.  Both are popular and well
supported and seem to work well.  (The articles [here](https://www.monterail.com/blog/end-to-end-testing-with-cypress) and
[here](https://medium.com/welldone-software/an-overview-of-javascript-testing-7ce7298b9870) were helpful.)

Vue.js has [good support](https://vuejs.org/v2/guide/unit-testing.html) for
Jest, and also provides its own [Vue Test Utils](https://vue-test-utils.vuejs.org/) to 
help with testing.

### Test Limitations

One of my major goals for this effort was to understand how to do testing in a
modern Javascript application.  As a result, there is fairly good coverage.

However, because this was a learning effort for me, the unit tests were written
long after the code was originally written and manually tested.  In some cases,
I decided that the effort required to write complicated tests or refactor
awkward code was not worthwhile.  (If I had been writing the code and tests at
the same time, things probably would have been different.)

### Jest Testing Hints

Jest unit tests are in the `__tests__` directory and are all named with the
`.test.js` extension.  There are several standards for where to place tests,
and this is the one I liked the best.

To run a subset of the tests, you can pass arguments to `yarn test`.  For
instance, this runs a single Jest test (based on the `describe` name),
including verbose results about each test case:

```
$ yarn test --verbose -t 'Components/menu/UnregisterMenuItem.vue'
```

It can sometimes be useful to see the HTML content of the component you're testing.
That's easy to get off the top-level wrapper, or anything other component that you
retrieved via `find()` or `findComponent()`:

```
console.log("HTML: " + wrapper.html())
```

Similarly, it can sometimes be useful to look at properties for the component
you're testing:

```
console.log("Props: " + JSON.stringify(wrapper.props(), null, 2))
```

or attributes for a component:

```
console.log("Attributes: " + JSON.stringify(card.attributes(), null, 2))
```

There are other ways to print an object, but `JSON.stringify()` seems to be
the most convenient.

## Local Browser Testing

Local testing is straightforward.  In addition to this repository, you also need
the [apologies-server](https://github.com/pronovic/apologies-server).  You will
run the websockets server in one terminal window and the Parcel server in
another terminal window.

### Observing Game Play

If you want to observe game play without having to choose moves for yourself,
the easiest way to do this is using the autoplay feature.  Any player can
toggle autoplay via the hamburger menu.  If you advertise a game, enable
autoplay, and then start the game, the server will fill out your game with
computer players, and all of your turns will get the optimal move.  This gives
you a fully automated game.  You can observe any kind of game with any number
of players in other browsers - simply enable autoplay for each player after
joining the game.

### Parcel Javascript Server

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

### Websockets Server

Here is usage information for the websockets server:

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

The very first time you do this, Poetry will install all of the dependencies
for you, which will take a little while.  After that, startup will be much
faster.

The server displays its configuration when it boots.  You can override any of
this configuration using the switches on the `run server` command.   

You can normally start the websockets server and leave it running forever.
If something gets screwed up (like your handle is accidentally in use and
you can't register for it again) just CTRL-C the server and restart it.  No
state is maintained in between, so you'll start over fresh.

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

### Running Jest Tests in VSCode

If you highlight the name of the test and press F5, that should run
the selected test.  This is controlled by the VSCode launch configuration
in [`.vscode/launch.json`](.vscode/launch.json).  See [StackOverflow](https://stackoverflow.com/a/55279902/2907667)
for more details.

### Recommended Plugins

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

### Project Settings

There are some project-specific VSCode settings in [`jsconfig.json`](jsconfig.json) and
[`.vscode/settings.json`](.vscode/settings.json).

### Global Settings

My global `settings.json` looks like this, including the configuration needed
to make Vetur and VSCode Snippets plugins play together nicely:

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
  "files.autoSaveDelay": 1000
}
```



