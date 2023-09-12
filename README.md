# Raggedy Dev setup

_The browser is your runtime._

This is an attempt to define a minimalistic setup for web development where the
primary runtime for the project is the browser itself, not node or deno.

Deno is used here to implement some dev tasks but only in a capacity that's
similar to how bash or external command line tools work. You don't need to have
deno installed to use this, the setup script will download a local copy that'll
be used in just this project.

## All tasks are scripts in the `tasks/` directory

Instead of a task runner this project uses the file system and your shell. Tasks
are in the `tasks/` directory and are all executable scripts. Edit the scripts
to configure them (although this is rarely necessary).

### Run `tasks/setup` first

Running `tasks/setup` will download a pinned version of `deno` into `.bin`. This
is the version that the task scripts will use. There is also a
`.vscode/settings.json` file that tells your deno extension in VS Code to use
the local binary.

This setup doesn't interfere with your shell's `$PATH` in any way.

The `deno.jsonc` configuration file is set up so that deno knows that `js` files
in this project are primarily for the browser. It is also documented with
comments. It will use the provided `import_map.json` file as the project's
primary import map

The setup task will also generate a self-signed certificate that the `serve`
task will then use to provide an `https` server.

### Run `tasks/serve` for unit testing in the browser with mocha

Tests are based on mocha.

Running `tasks/serve` will start up a simple `https` web server that hosts the
current directory and an HTML page that runs all test files found in `tests/`
and automatically includes the `import_map.json` file as an import map.

This server is set up to deliver files with all the necessary headers to enable
[cross-site isolation](https://web.dev/coop-coep/). This means that features
such as `SharedArrayBuffer`, high resolution timers, and `Atomics.wait()`. As a
result cross-origin resources are likely to break. At some point I'll update
this to make this configurable so you can turn isolation off if necessary.

This page will automatically refresh any time something in the current working
directory is changed.

Running `tasks/chrome` or `tasks/firefox` will attempt to launch browser
instances with fresh profiles and, if necessary, exceptions for self-signed
https certificates.

For coverage, use the coverage panel in Chrome's development tools.

To configure the test file (i.e. change mocha's interface or timeout settings),
edit the configuration variables in the `tasks/serve` script itself.

#### `.test` and `tests`

The `.test` directory contains vendored copies of `mocha` and `chai` to simplify
test setup.

I've also included an example `simpletest.js` file that shows how `mocha` and
`chai` are set up by default.

### Run `tasks/lint` to lint your `.js` files

Running `tasks/lint` will run deno's linter on the current directory with the
current settings from `deno.jsonc`. The deno VS Code extension should also
automatically lint files in your workspace.

### Run `tasks/format` to format your `.js` files

Running `tasks/format` will run deno's formatter on the current directory with
the current settings from `deno.jsonc`. The deno VS Code extension should also
automatically format files in your workspace.

### Run `tasks/check` to type check your `.js` files

Type checking JS files is disabled by default. You can enable this throughout
the workspaces by setting `checkJS` to `true` in `deno.jsonc` or in individual
files by including `// @ts-check` in the first line of the file.

Running `tasks/check` will run deno's typescript checker on all files in the
`src` directory. You can configure this in the `tasks/check` file.

### Run `tasks/bundle` to bundle your project

Running `tasks/bundle` will bundle every `.js` file in the root of the project
into `dist` using esbuild. It additionally will fetch modules over the network
(or using deno's cache) just like the browser which means you don't need to
install packages locally in any way. Modules work just like they do in the
browser and the bundler will use your main import map from the `import_map.json`
file.

Code-splitting is enabled so imports that are shared by the root entry points
will be imported as shared chunks.

## Continuous Integration

This setup includes continuous integration. Whenever you push to GitHub it will
run an Action that installs [Playwright](https://playwright.dev/), runs the
Mocha tests in Firefox, WebKit, and Chrome and passes or fails depending on the
results of the Mocha unit tests.

These tests only run in the action and you don't need to have node or a node
version manager to use this setup.

You can include additional integration tests by adding Playwright test files to
`ci/tests`.

## Importing Raggedy Dev projects in other projects

_We don't need no stinking package registry._

If you're using browser-compatible JS modules that fetch over HTTP, you don't
need to publish your project on npm to get users.

Since a Raggedy Dev project is set up to use browser compatible importing, any
content delivery network that lets you fetch files from a GitHub repository will
serve to let you import the project.

For example, to import the sample `raggedy.js` module that's at the root of this
project, you would do something like:

```js
import * as raggedy from "https://esm.sh/gh/baldurbjarnason/raggedy-dev-setup@v1.0.0-RC/raggedy.js";
```

With that you would get the `raggedy.js` entry point in the release tagged
`v1.0.0-RC`.

## Visual Studio Code

This setup includes workspace settings to enable the deno extension (if
installed) and set the editor to use it to format on save for the file types
that deno supports.

## Sublime Text

This setup includes project settings to enable the deno extension (if installed)
and set the editor to use it to format on save for the file types that deno
supports.

It also disables `LSP-typescript` in the project as that seems to conflict with
`LSP-deno`.
