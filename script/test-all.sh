#!/usr/bin/env bash

echo '
- run build
'
npm run build || exit 1

echo '
- typecheck
'
npx tsc --noEmit || exit 1

echo '
- test using jest
'
npm run test:jest || exit 1

echo '
- test using playwright
'
npm run test:playwright || exit 1

echo '
- lint lockfile
'
npm run test:lockfile-lint || exit 1

echo '
- lint d.ts files
'
npm run test:dts-lint || exit 1
