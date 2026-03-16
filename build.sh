#!/bin/bash
set -e
npx @opennextjs/cloudflare build

# Copy all non-assets files into assets dir so _worker.js can resolve them
cd .open-next
for item in *; do
  if [ "$item" != "assets" ]; then
    cp -r "$item" "assets/$item"
  fi
done

# Rename worker.js to _worker.js
if [ -f assets/worker.js ]; then
  mv assets/worker.js assets/_worker.js
  echo "Renamed worker.js to _worker.js"
fi

echo "Build output ready in .open-next/assets"
