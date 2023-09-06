#!/bin/sh
set -eu
PORT=8888

./.bin/esbuild --serve=$PORT --servedir=$PWD --keyfile=.bin/dev.key --certfile=.bin/dev.cert
# The below might not be necessary
# trap 'rm -rf .ignore' EXIT INT TERM HUP