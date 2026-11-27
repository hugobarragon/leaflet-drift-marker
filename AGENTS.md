# AGENTS.md

Guidance for AI coding agents (and humans) working in this repo.

## What this is

`leaflet-drift-marker` is a Leaflet `Marker` subclass that animates to a new position instead of jumping. It is a TypeScript port of [Leaflet.Marker.SlideTo](https://gitlab.com/IvanSanchez/Leaflet.Marker.SlideTo) and is framework-agnostic. The React wrapper lives in a separate repo, `react-leaflet-drift-marker`, which depends on this package.

Public API (keep it stable):

- `new DriftMarker(latlng, markerOptions?)`: same as `L.Marker`.
- `.slideTo(latlng, { duration, keepAtCenter? })`: fires `movestart` / `moveend`, returns `this`.
- `.slideCancel()`: stops the animation and restores map interaction.
- Default export and named `DriftMarker` export; `window.DriftMarker` is set for `<script>` usage.

## Layout

- `src/index.ts`: the whole library.
- `src/index.test.ts`: Vitest + jsdom tests against a real Leaflet map, with faked `requestAnimationFrame` and `performance`.
- `tsup.config.ts`: builds `dist/` as ESM (`index.js`), CJS (`index.cjs`), IIFE (`index.global.js`, reads Leaflet from global `L`) plus `.d.ts`.
- `docs/`: README assets.

## Commands

```bash
npm ci
npm test            # vitest run
npm run typecheck   # tsc --noEmit
npm run lint        # eslint + prettier --check
npm run format      # prettier --write
npm run build       # tsup -> dist/
```

Run `lint`, `typecheck`, `test` and `build` before calling a change done; CI runs the same on Node 22 and 24 (the dev tools need Node 22+; the published package has no Node requirement).

## Conventions

- `leaflet` is a peer dependency (`>=1.2`); never bundle it. Tests run against the devDependency version (1.9.x).
- Leaflet cannot load in Node without a DOM, so anything that touches Leaflet is tested under jsdom.
- Bug fixes start with a failing test in `src/index.test.ts`.
- Leaflet internals (`_map`) are accessed through the `MarkerInternals` cast in `src/index.ts`; keep that the only place.
- Private slide state is prefixed `_slide` to avoid clashing with `L.Marker` internals.
- Update `CHANGELOG.md` for every user-visible change.

## Releasing

1. Bump `version` in `package.json` and add a `CHANGELOG.md` entry.
2. `npm publish` (runs `prepublishOnly`: lint, typecheck, test, build). Publishing is done by the maintainer, not by agents.
3. Tag `vX.Y.Z` and create a GitHub release.
