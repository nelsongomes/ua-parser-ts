#!/usr/bin/env bash

CJS_SRC="dist/cjs/main/ua-parser.js"
ESM_SRC="dist/esm/main/ua-parser.js"
BROWSER_IIFE="dist/ua-parser.iife.js"
MIN_PATH="dist/ua-parser.min.js"
PACK_PATH="dist/ua-parser.pack.js"
MIN_PATH_MJS="dist/ua-parser.min.mjs"
PACK_PATH_MJS="dist/ua-parser.pack.mjs"

# compile TypeScript (CJS)
npx tsc -p tsconfig.cjs.json

# compile TypeScript (ESM)
npx tsc -p tsconfig.esm.json

# browser bundle (IIFE, global UAParser) via esbuild
# --footer unwraps the named export: { UAParser: fn } -> fn
IIFE_FOOTER='UAParser=UAParser.UAParser;'

echo "Generate ${MIN_PATH}"
npx esbuild src/main/ua-parser.ts --bundle --platform=browser --format=iife --global-name=UAParser --legal-comments=inline --minify "--footer:js=${IIFE_FOOTER}" --outfile=$MIN_PATH

echo "Generate ${PACK_PATH}"
npx esbuild src/main/ua-parser.ts --bundle --platform=browser --format=iife --global-name=UAParser --legal-comments=inline --minify "--footer:js=${IIFE_FOOTER}" --outfile=$PACK_PATH

# ESM minified
echo "Generate ${MIN_PATH_MJS}"
npx esbuild src/main/ua-parser.ts --bundle --platform=browser --format=esm --legal-comments=inline --minify --outfile=$MIN_PATH_MJS

echo "Generate ${PACK_PATH_MJS}"
cp $MIN_PATH_MJS $PACK_PATH_MJS
