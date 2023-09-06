#!/bin/sh
set -eu

echo "WARNING! This script will attempt to download a pre-built bundle of $1 from https://esm.sh. This is error-prone, but it is convenient when it works."

echo ""

mkdir -p vendor/$(dirname "$1")

TOP=$(curl -L "https://esm.sh/$1?bundle" | cut -sd '"' -f2)

read MODULE <<< $TOP
curl -L "https://esm.sh$MODULE" -o vendor/$1.js
