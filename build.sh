#!/bin/bash
set -e
npx @opennextjs/cloudflare build
if [ -f .open-next/worker.js ]; then
  mv .open-next/worker.js .open-next/_worker.js
  echo "Renamed worker.js to _worker.js"
fi
