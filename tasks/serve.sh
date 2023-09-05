#!/bin/sh
set -eu
PORT=8888

./.bin/esbuild --serve=$PORT --servedir=$PWD --keyfile=.bin/dev.key --certfile=.bin/dev.cert