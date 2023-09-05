#!/bin/sh
set -eu
platform=$(uname -ms)

mkdir -p .bin

echo ""
echo "Downloading Biome"

# Download the binary for biome for the current platform
case $platform in
  'Darwin arm64') curl -L "https://github.com/biomejs/biome/releases/download/cli%2Fv1.0.0/biome-darwin-arm64"  -o .bin/biome;;
  'Darwin x86_64') curl -L "https://github.com/biomejs/biome/releases/download/cli%2Fv1.0.0/biome-darwin-x64"  -o .bin/biome;;
  'Linux arm64' | 'Linux aarch64') curl -L "https://github.com/biomejs/biome/releases/download/cli%2Fv1.0.0/biome-linux-arm64"  -o .bin/biome;;
  'Linux x86_64') curl -L "https://github.com/biomejs/biome/releases/download/cli%2Fv1.0.0/biome-linux-x64"  -o .bin/biome;;
  *) echo "error: Unsupported platform: $platform"; exit 1
esac

chmod a+x .bin/biome

dir=$(mktemp -d)
tgz="$dir/esbuild-0.19.2.tgz"

echo ""
echo "Downloading esbuild"


# Download the binary executable for the current platform
case $platform in
  'Darwin arm64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.19.2.tgz";;
  'Darwin x86_64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.19.2.tgz";;
  'Linux arm64' | 'Linux aarch64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.19.2.tgz";;
  'Linux x86_64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.19.2.tgz";;
  'NetBSD amd64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.19.2.tgz";;
  'OpenBSD amd64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.19.2.tgz";;
  *) echo "error: Unsupported platform: $platform"; exit 1
esac

# Extract the binary executable to the current directory
tar -xzf "$tgz" -C "$dir" package/bin/esbuild
mv "$dir/package/bin/esbuild" .bin
rm "$tgz"

echo ""
echo "Generating key and cert files for https test server"
openssl req -x509 -newkey rsa:4096 -keyout $PWD/.bin/dev.key -out $PWD/.bin/dev.cert -days 9999 -nodes -subj /CN=127.0.0.1 &> /dev/null

echo "Setup done"