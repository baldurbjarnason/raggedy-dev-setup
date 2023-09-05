#!/bin/sh
set -eu

FIREFOX_PATHS=( \
  "/opt/homebrew-cask/Caskroom/google-chrome-dev/latest/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/opt/homebrew-cask/Caskroom/google-chrome/latest/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Firefox.app/Contents/MacOS/firefox" \
  "firefox"
)
for i in "${FIREFOX_PATHS[@]}"
do
  if command -v $i &> /dev/null; then
  FIREFOX=$i
  fi
done


DATA_DIR="$(mktemp -d -t 'firefox-unsafe_data_dir.XXXXXXXXXX')"
"${FIREFOX}" -profile $DATA_DIR -no-remote -new-instance \
        https://localhost:8888/ >/dev/null 2>&1 &!
