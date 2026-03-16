#!/bin/bash
set -e
npx @opennextjs/cloudflare build

cd .open-next

# Copy all runtime dirs into assets so _worker.js can resolve relative imports
for dir in .build cache cloudflare cloudflare-templates dynamodb-provider middleware server-functions; do
  if [ -d "$dir" ]; then
    cp -r "$dir" "assets/$dir"
    echo "Copied $dir"
  fi
done

# Rename worker.js -> _worker.js inside assets
cp worker.js assets/_worker.js
echo "Done. assets/ contents:"
ls assets/
