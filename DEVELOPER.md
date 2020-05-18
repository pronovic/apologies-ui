# Developer Notes

## Development Environment

My primary development environment MacOS, but the code and the development
process should be portable. I've tested on Windows 10 and on Debian buster.

## Packaging and Dependencies

This project uses [Yarn 2](https://yarnpkg.com/) and [Parcel](https://parceljs.org/) to manage packaging and dependencies. Most day-to-day tasks are orchestrated through Yarn. 

A coding standard is enforced using [ESLint](https://eslint.org/) in conjunction with [StandardJS](https://standardjs.com/) and [Prettier](https://prettier.io/).  Instead of using the `standard` and `prettier` tools directly, we follow Prettier's [recommended configuration](https://prettier.io/docs/en/integrating-with-linters.html#recommended-configuration) and use [eslint-config-standard](https://github.com/standard/eslint-config-standard), [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier), and [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier).

## Pre-Commit Hooks

We rely on pre-commit hooks to ensure that the code is properly-formatted and
clean when it's checked in.  Pre-commit hooks are implemented using
[Husky](https://github.com/typicode/husky), which is configured in
`package.json` to run the `yarn checks` command.

If necessary, you can temporarily disable a hook using Git's `--no-verify`
switch.  However, keep in mind that the CI build on GitHub enforces these
checks, so the build will fail.

## Developer Tasks

The most common developer tasks are managed with `yarn` via the `scripts` list
in [`package.json`](package.json).  The following scripts are available:

- `yarn start` - Start the development server in hot module reloading mode
- `yarn checks` - Run the StandardJS and Prettier source code checks
- `yarn format` - Reformat code based on the StandardJS and Prettier checks
- `yarn build` - Build the production bundle in `dist/bundle.js`
- `yarn clean` - Remove the production bundle in `dist/bundle.js`


## Prequisites

Nearly all prerequisites are managed by Yarn. All you need to do is make sure
that you have Yarn itself installed.  There are notes below for for the MacOS,
Debian, and Windows 10 platforms.

Once you have Yarn installed, set up your development environment like this:

```
$ yarn 
$ yarn install
```

### MacOS

On MacOS, it's easiest to use [Homebrew](https://brew.sh/) to install Yarn:

```
$ brew install yarn
```

This installs "classic" Yarn 1.22.x, which is used to bootstrap the
project-specific version of Yarn 2 that is configured for the project.


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

At this point, you have a working version of "classic" Yarn v1.22.x, which is
used to bootstrap the project-specific version of Yarn 2 that is configured for
the project.
