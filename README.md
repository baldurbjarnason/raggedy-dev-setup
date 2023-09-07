## Raggedy Dev setup

_The browser is your runtime._

This is an attempt to define a minimalistic setup for web development where the
primary runtime for the project is the browser itself, not node or deno.

Deno is used here to implement some dev tasks but only in a capacity that's
similar to how bash or external command line tools work.

## Tasks

Instead of a task runner this project uses the file system and your shell. Tasks
are in the `tasks` directory and are all executable scripts. Edit the scripts to
configure them (although this is rarely necessary).

## Setup

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

## Testing

Tests are based on mocha.

Running `tasks/serve` will start up a simple `https` web server that hosts the
current directory and an HTML page that runs all test files found in `tests/`
and automatically includes the `import_map.json` file as an import map.

This page will automatically refresh any time something in the current working
directory is changed.

Running `tasks/chrome` or `tasks/firefox` will attempt to launch browser
instances with fresh profiles and, if necessary, exceptions for self-signed
https certificates.

For coverage, use the coverage panel in Chrome's development tools.

To configure the test file (i.e. change mocha's interface or timeout settings),
edit the configuration variables in the `tasks/serve` script itself.

## Linting

Running `tasks/lint` will run deno's linter on the current directory with the
current settings from `deno.jsonc`. The deno VS Code extension should also
automatically lint files in your workspace.

## Formatting

Running `tasks/format` will run deno's formatter on the current directory with
the current settings from `deno.jsonc`. The deno VS Code extension should also
automatically format files in your workspace.

## Type checking

Type checking JS files is disabled by default. You can enable this throughout
the workspaces by setting `checkJS` to `true` in `deno.jsonc` or in individual
files by including `// @ts-check` in the first line of the file.

Running `tasks/check` will run deno's typescript checker on all files in the
`src` directory. You can configure this in the `tasks/check` file.

## Bundling

Running `tasks/check` will bundle `src/index.js` into `dist` using esbuild. It
additionally will fetch modules over the network (or using deno's cache) just
like the browser which means you don't need to install packages locally in any
way. Modules work just like they do in the browser and the bundler will use your
main import map from the `import_map.json` file.

## Visual Studio Code

This setup includes workspace settings to enable the deno extension (if
installed) and set the editor to use it to format on save for the file types
that deno supports.

## `.test` and `tests`

The `.test` directory contains vendored copies of `mocha` and `chai` to simplify
test setup.

I've also included an example `simpletest.js` file that shows how `mocha` and
`chai` are set up by default.
