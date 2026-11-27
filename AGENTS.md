# AGENTS.md

Guidance for AI coding agents (and humans) working in this repo.

## What this is

`leaflet-drift-marker` is a Leaflet `Marker` subclass that animates to a new position instead of jumping. It is a TypeScript port of [Leaflet.Marker.SlideTo](https://gitlab.com/IvanSanchez/Leaflet.Marker.SlideTo) and is framework-agnostic. The React wrapper lives in a separate repo, `react-leaflet-drift-marker`, which depends on this package.

Public API (keep it stable):

- `new DriftMarker(latlng, markerOptions?)`: same as `L.Marker`.
- `.slideTo(latlng, { duration, keepAtCenter? })`: fires `movestart` / `moveend`, returns `this`.
- `.slideCancel()`: stops the animation and restores map interaction.
- Default export and named `DriftMarker` export. The ESM and CommonJS builds have no global side effects; only the `<script>` build sets `window.DriftMarker`.

## Layout

- `src/index.ts`: the whole library.
- `src/index.test.ts`: Vitest + jsdom tests against a real Leaflet map, with faked `requestAnimationFrame` and `performance`.
- `tsup.config.ts`: builds `dist/` as ESM (`index.js`), CommonJS (`index.cjs`) and a `<script>` build (`index.global.js`, reads Leaflet from the global `L`), plus `.d.ts`/`.d.cts`. All target ES2020.
- `demo/index.html`: live demo published to GitHub Pages by `.github/workflows/pages.yml` on pushes to `master`. It loads the library from `./dist/index.js`.
- `docs/`: README assets.

## Commands

```bash
npm ci
npm test            # vitest run
npm run typecheck   # tsc --noEmit
npm run lint        # eslint + prettier --check
npm run format      # prettier --write
npm run build       # tsup -> dist/
npm run site        # build + demo -> .site/ (what GitHub Pages serves)
```

Run `lint`, `typecheck`, `test` and `build` before calling a change done; CI runs the same on Node 22 and 24 (the dev tools need Node 22+; the published package has no Node requirement).

## Conventions

- `leaflet` is a peer dependency (`>=1.2.0 <2`); never bundle it. Tests run against the devDependency version (1.9.x).
- Leaflet cannot load in Node without a DOM, so anything that touches Leaflet is tested under jsdom.
- Bug fixes start with a failing test in `src/index.test.ts`.
- Leaflet internals (`_map`) are accessed through the `MarkerInternals` cast in `src/index.ts`; keep that the only place.
- Private slide state is prefixed `_slide` to avoid clashing with `L.Marker` internals.
- `src/index.ts` must not touch `window` or other globals at import time. `sideEffects` in `package.json` lists only the `<script>` build.
- Leaflet 1.9 has no `module` field, so bundlers load its UMD build; browsers without a bundler load `dist/leaflet-src.esm.js` through an import map.
- After changing exports or the build, run `npm run site`, serve `.site/` and check the demo, then check both README browser examples locally against `dist/` (the `<script>` page with `index.global.js`, the import-map page with `index.js`) and confirm the marker slides.
- Update `CHANGELOG.md` for every user-visible change.

## Roadmap

- 2.x: Leaflet 1.x, ships ESM, CommonJS and `<script>` builds.
- 3.0 (planned): Leaflet 2.0, ESM only, matching Leaflet 2's removal of the global `L`.

## Releasing

1. Bump `version` in `package.json` and `package-lock.json`, update the `leaflet-drift-marker@X.Y.Z` URLs in `README.md`, and add a `CHANGELOG.md` entry.
2. `npm publish` (runs `prepublishOnly`: lint, typecheck, test, build). Publishing is done by the maintainer, not by agents.
3. Tag `vX.Y.Z` and create a GitHub release.
