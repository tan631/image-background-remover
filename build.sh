#!/bin/bash
set -e
npx @opennextjs/cloudflare build

# Copy all files (including hidden ones) from .open-next to .open-next/assets
cd .open-next
shopt -s dotglob  # Include hidden files
for item in *; do
  if [ "$item" != "assets" ]; then
    echo "Copying $item to assets/"
    cp -r "$item" "assets/$item"
  fi
done

# Rename worker.js to _worker.js
if [ -f assets/worker.js ]; then
  mv assets/worker.js assets/_worker.js
  echo "Renamed worker.js to _worker.js"
fi

echo "Build output ready in .open-next/assets"
ls -la assets/
