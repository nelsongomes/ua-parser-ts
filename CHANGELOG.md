# ua-parser-ts Changelog

## v1.0.0 — 2026-06-01

### Fork origin

This package is a TypeScript fork of [`ua-parser-js`](https://github.com/faisalman/ua-parser-js) v2.0.10, authored by Faisal Salman. The original project is licensed under AGPLv3.

This fork converts the entire codebase to TypeScript with strict typing, applies several correctness and performance improvements, and removes a number of vulnerable or unnecessary dev dependencies.

### Security fixes

| Advisory | Package | Change | CVSS |
|---|---|---|---|
| GHSA-x3m3-4wpv-5vgc | `requirejs` | Upgraded 2.3.2 → 2.3.8 | 10.0 (Critical) |
| GHSA-w5hq-g745-h8pq | `uuid` | Added `overrides` entry pinning to `≥11.1.1` | High |
| — | `mocha` | Removed (pulled in vulnerable transitive deps) | — |
| — | `jshint` | Removed (no longer needed) | — |
| — | `uglify-js` | Removed (replaced by esbuild) | — |

### TypeScript conversion

- All source files converted from `.js`/`.mjs` to `.ts`
- `UAParserInstance` interface exported from `ua-parser.ts`, eliminating `as any` casts in submodule files (`bot-detection`, `browser-detection`, `device-detection`)
- All module-level `var` declarations converted to `const`/`let`
- `==` strict-equality fixes in `ua-parser-extensions.ts`
- `Object.prototype.hasOwnProperty.call()` replacing unsafe `.hasOwnProperty()` direct calls
- Removed stale `// TODO : test!` comments from `ua-parser-enums.ts`

### Performance improvements

Benchmark: 2,076 UA strings × 10 runs × 20 measured iterations + 2 warmup, Node.js, Apple Silicon.  
Baseline taken from `ua-parser-js` v2.0.10 after TypeScript conversion, before any optimizations.

#### UA strings (2,076 samples × 10 runs = 20,760 parses/iter)

| Version | ops/s (mean) | ns/op (mean) | Delta |
|---|---|---|---|
| Baseline (pre-optimization) | 20,284 | 49,299 | — |
| ua-parser-ts v1.0.0 | 218,813 | 4,570 | **+979% (~10.8×)** |
| ua-parser-ts v1.0.0 + CH opt | 261,020 | 3,831 | **+1,186% (~12.9×)** |

#### UA-CH headers (21 samples × 10 runs = 210 parses/iter)

| Version | ops/s (mean) | ns/op (mean) | Delta |
|---|---|---|---|
| Baseline (pre-optimization) | 38,155 | 26,209 | — |
| ua-parser-ts v1.0.0 | 107,809 | 9,276 | **+182% (~2.8×)** |
| ua-parser-ts v1.0.0 + CH opt | 129,025 | 7,750 | **+238% (~3.4×)** |

#### Combined (20,970 parses/iter)

| Version | ops/s (mean) | ns/op (mean) | Delta |
|---|---|---|---|
| Baseline (pre-optimization) | 20,452 | 48,894 | — |
| ua-parser-ts v1.0.0 | 219,389 | 4,558 | **+972% (~10.7×)** |
| ua-parser-ts v1.0.0 + CH opt | 258,242 | 3,872 | **+1,163% (~12.6×)** |

The dominant gain comes from the two-generation LRU cache (`_cacheActive` / `_cacheStale`) which was broken in the initial TypeScript conversion and is now correctly initialized as module-level `let` bindings. After warmup, all 2,076 test UA strings are served from cache, reducing per-parse work from full regex traversal to a single Map lookup.

#### UA strings COLD (cache cleared between iterations, 2,076 parses/iter)

This benchmark measures first-time parse performance — the path where regex matching actually runs.

| Version | ops/s (mean) | ns/op (mean) | Delta |
|---|---|---|---|
| Baseline (pre-optimization) | 20,284 | 49,299 | — |
| ua-parser-ts v1.0.0 (warm, cache active) | 221,473 | 4,515 | **+991%** |
| ua-parser-ts v1.0.0 (cold, trie dispatch) | 25,990 | 38,477 | **+28%** |

Cold-parse improvement comes from the **keyword dispatch trie** (`extractKeyword` + `buildDispatchIndex`): at module init time a dispatch index is built for each of the five regex arrays (browser, cpu, device, engine, os). For each cold parse, the UA string is tokenized and only regex groups whose discriminating keyword appears in the UA are tried; all others are skipped. This reduces regex attempts by ~30–50% depending on the browser.

The warm/cached path is unaffected — cache hits return before `rgxMapper` is ever called.

Additional changes applied in this fork:

- `Array.isArray()` fast-path in `has()` — avoids redundant `lowerize()` loop on every cache-hit `is()` call
- `BotList` per-instance memoization — avoids re-parsing repeated UA strings in `isBot`/`isAICrawler`/`isAIAssistant`
- `isAppleSilicon` / `getDeviceVendor` — eliminated double UAParser construction when input is a string
- `strMapper` — `for...in` replaced with `Object.entries()` for explicit own-property iteration
- `extend` — rewritten using `reduce` for explicit data flow

#### UA-CH header parsing optimizations

Applied to both the UA-CH hot path and all callers of `trim`:

- `UACHData` HTTP path — replaced double `setProps` loop (18 for-in iterations) with 9 direct property assignments, eliminating one full pass that set every property to `undefined` only to overwrite it immediately after
- `normalizeHeaderValue` — inlined the `trim(strip(regex, str), len)` chain into a single `.replace().trimStart()`; the `substring` cap is now conditional (skipped when length ≤ 500, the common case)
- `itemListToArray` — replaced `split(";v=")` per brand token (which allocates a 2-element array) with `indexOf(";v=")` + `substring` arithmetic
- `trim` — `String.prototype.trimStart()` replaces the `/^\s\s*/` regex replacement; this benefits every call site including `setUA`, which trims every UA string on construction
- Header normalization — added a fast-path check that skips the `{}` clone entirely when all header keys are already lowercase (the common case for HTTP/2 and Node.js `IncomingMessage`)
- `parseCH` BROWSER — precomputed `browserHintsLookup` table gives O(1) brand-name mapping instead of `strMapper`'s O(n) `Object.entries` + `lowerize` scan per brand; exercised on every `.withClientHints()` call
