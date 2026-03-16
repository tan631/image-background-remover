#!/bin/bash
set -e
npx @opennextjs/cloudflare build
# Cloudflare Pages needs _worker.js in the assets output dir
if [ -f .open-next/worker.js ]; then
  cp .open-next/worker.js .open-next/assets/_worker.js
  echo "Copied worker.js to assets/_worker.js"
fi
