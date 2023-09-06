#!/bin/sh
set -eu

rm -rf dist

./.bin/esbuild $* --bundle --outdir=dist --format=esm --splitting --minify --sourcemap