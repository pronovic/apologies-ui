# Developer Notes

## Development Environment

My primary development environment MacOS, but the code and the development
process should be portable to Linux (I've tested on Debian buster).  As of now,
I do not do any software development on Windows and the development process
(code checks & formatting, etc.) may or may not work as expected there. 

## Packaging and Dependencies

This project uses "classic" [Yarn v1](https://yarnpkg.com/) and [Parcel](https://parceljs.org/) to manage packaging and dependencies. Most day-to-day tasks are orchestrated through Yarn.  Initial project configuration was bootstraped via [createapp.dev](https://createapp.dev/parcel).  (Yarn v2 has been released, but I ran into problems and decided to stay with the classic version.)

A coding standard is enforced using [ESLint](https://eslint.org/) in conjunction with [StandardJS](https://standardjs.com/) and [Prettier](https://prettier.io/).  Instead of using the `standard` and `prettier` tools directly, we follow Prettier's [recommended configuration](https://prettier.io/docs/en/integrating-with-linters.html#recommended-configuration) to avoid conflcits between the two tools, and use a combination of [eslint-config-standard](https://github.com/standard/eslint-config-standard), [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier), and [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier).

_Note:_ A consequence of using Parcel instead of Webpack is that not everything
works exactly the same.  For instance, Parcel does not allow the `@` alias that
Vue usually uses for the `src` directory.  Rather than using `@/components`, we
simply have an alias for `components`.

## Pre-Commit Hooks

We rely on pre-commit hooks to ensure that the code is properly-formatted and
clean when it's checked in.  Pre-commit hooks are implemented using
[Husky](https://github.com/typicode/husky), which is configured 
using [lint-staged](https://www.npmjs.com/package/lint-staged) to run
the eslint checks on staged code.

If necessary, you can temporarily disable a hook using Git's `--no-verify`
switch.  However, keep in mind that the CI build on GitHub enforces these
checks, so the build will fail.

## Developer Tasks

The most common developer tasks are managed with `yarn` via the `scripts` list
in [`package.json`](package.json).  The following scripts are available:

- `yarn checks` - Run the StandardJS and Prettier source code checks (note: `checks`, not `check`)
- `yarn format` - Reformat code based on the StandardJS and Prettier checks
- `yarn serve` - Start the development server in hot module reloading mode
- `yarn clean` - Remove the production bundle in `dist/bundle.js`
- `yarn build` - Build the production bundle in `dist/bundle.js`

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
