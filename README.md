# Raggedy Dev setup

_The browser is your runtime._

_The shell is your task runner._

**NOT FOR FRAMEWORKS**.

This is an experiment in defining a minimalistic but full-featured environment
for web development where the primary runtime for the project is the browser
itself, not node or deno.

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

The version is pinned to `v1.36.4`. This can be changed by editing the
`DENO_VERSION` variable and the `DENO_SHA` checksum variable towards the top of
the `tasks/setup` script.

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

### Run `tasks/vendor` to vendor dependencies

The `tasks/vendor` script will save local copies of your project and create an
import map that the test server and the bundler will load automatically.

That means your project will no longer be fetching those dependencies over the
network.

Re-run `tasks/vendor` whenever you modify the `import_map.json` file in the
project root or whenever you add or remove an `http` dependency in your code.

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
(or using deno's cache) just like the browser.

This means you don't need to install packages locally in any way. Modules work
just like they do in the browser and the bundler will use the
`vendor/import_map.json` file if it exist to find modules, which means that
dependencies that have been vendored with `tasks/vendor` should be automatically
supported.

Code-splitting is enabled so imports that are shared by the root entry points
will be imported as shared chunks into the `dist/` directory.

## Experimental dependency-management with import maps

`tasks/add`, `tasks/outdated`, and `tasks/audit` are a first pass at a bare
mininum dependency-management system using import maps.

`tasks/add npm:hash-wasm` will add a `npm:hash-wasm` entry to your import map
`imports` that maps to the latest `esm.sh` url for the `hash-wasm` package. You
can use semantic versioning so `tasks/add npm:hash-wasm@\^4.9 --exact` will
create that entry directly without resolving it.

`tasks/outdated` will resolve the url for the listed entry in the import map and
the latest url for that package and compare the version in the two urls.
Packages whose resolved mapped version is lower than the resolved latest version
are listed.

`tasks/audit` will load the dependency graph, using the graph tools made by the
`deno` team, extract package names and versions from `esm.sh` urls that appear
in the graph, submit those to
[Sonatype's OSSIndex](https://ossindex.sonatype.org/about) and alert you if any
of the packages you list in your import map are importing what looks like a
vulnerable dependency.

(My original plan was to use Github's REST API for global security advisories,
but I couldn't get it to work with insecure scoped packages. They would always
return as if they had no vulnerabilities.)

## Continuous Integration and automated test runs

This setup includes continuous integration. Whenever you push to GitHub it will
run an Action that installs [Playwright](https://playwright.dev/), runs the
Mocha tests in Firefox, WebKit, and Chrome and passes or fails depending on the
results of the Mocha unit tests.

These tests only run in the action and you don't need to have node or a node
version manager to use this setup.

The GitHub Action workflow does this by running `tasks/ci`,
`npx playwright install --with-deps`, and `tasks/ci-test`.

If you already have node setup on your machine, you could use Playwright as a
test runner for mocha with coverage. Just run `tasks/ci` to move the config
files to project root, commit, and finally run
`npx playwright install --with-deps`.

then you can use `tasks/ci-test` to run the tests with coverage.

This is error-prone if your platform isn't well-supported by the Playwright
team. You may have to edit `playwright.config.js` and remove the `webkit`
project for it to run.

### `tasks/ci`

This task will copy the `package.json`, `package-lock.json` and
`playwright.config.js` files from `ci/` into the project root that are necessary
for Playwright tests to run.

You can edit the original files in `ci/` for additional configuration.

### `tasks/ci-test`

Run this task after `tasks/ci` to have Playwright run all of the tests files in
`ci/tests`. You can include additional integration tests by adding Playwright
test files to `ci/tests`. This task will automatically gather coverage
information from Playwright and use the local copy of deno to both report
coverage data to standard out (should be visible in Action logs) and to
`cov_profile.lcov` which can be sent to coverage reporting services by adding
their actions to the workflow.

To automatically gather coverage data from additional integration tests, you
need to import the `pageWithCoverage` fixture from `ci/pageWithCoverage.js` and
use that as the main `page` object for interacting with the page. See
`ci/tests/mocha-spec.js` as an example.

## Importing Raggedy Dev projects in other projects

_This only works if you use URL module specifiers. Bare imports breaks default
compatibility._

_We don't need no stinking package registry._

If you're using browser-compatible JS modules that fetch over HTTP, you don't
need to publish your project on npm to distribute your module.

Since a Raggedy Dev project is set up to use browser compatible importing, any
content delivery network that lets you fetch files from a GitHub repository will
serve to let you import the project.

For this reason, build files in `dist` are _included in the commit_.

`tasks/bundle` now creates two bundles for each entry point:

**.min.js**: a minified bundle of the entry point and all of its dependencies
**.js** (no .min): a bundle of local JS files only, all dependencies are
external.

This should mean that, for example, this should work for importing one of the
main entry points for this sample project:

```js
import * as raggedy from "https://esm.sh/gh/baldurbjarnason/raggedy-dev-setup@v1.1.0/dist/raggedy.js";
```

With that you would get the `raggedy.js` entry point in the release tagged
`v1.1.0`.

If `raggedy.js` imports a dependency from `esm.sh` that's shared with something
else you're importing, then we won't be loading thtat twice any more.

However, if you aren't importing the module to use in your own JS code, but are
instead adding a script to a web page, then the `.min.js` files would be a
better fit as they are bundled to be standalone and minified.

```html
<script type="module" src="https://esm.sh/gh/baldurbjarnason/raggedy-dev-setup@v1.1.0/dist/raggedy.min.js"></script>
```

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
