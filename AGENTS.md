# AGENTS.md

Guidance for AI coding agents (and humans) working in this repo.

## What this is

`leaflet-drift-marker` is a Leaflet `Marker` subclass that animates to a new position instead of jumping. It is a TypeScript port of [Leaflet.Marker.SlideTo](https://gitlab.com/IvanSanchez/Leaflet.Marker.SlideTo) and is framework-agnostic. The React wrapper lives in a separate repo, `react-leaflet-drift-marker`, which depends on this package.

Public API (keep it stable):

- `new DriftMarker(latlng, markerOptions?)`: same as Leaflet's `Marker`.
- `.slideTo(latlng, { duration, keepAtCenter? })`: fires `movestart` / `moveend`, returns `this`.
- `.slideCancel()`: stops the animation and restores map interaction.
- Default export and named `DriftMarker` export. ESM only, with no global side effects.

## Versions and branches

- `master`: 3.x for Leaflet 2, ESM only, published under the npm `next` tag while Leaflet 2 is in beta (`publishConfig.tag` in `package.json`).
- 2.x for Leaflet 1 (ESM, CommonJS and `<script>` builds) is released from the `v2.x` tags. Fixes for it go on a branch cut from the latest `v2.x` tag, never on `master`.

## Layout

- `src/index.ts`: the whole library.
- `src/index.test.ts`: Vitest + jsdom tests against a real Leaflet 2 map, with faked `requestAnimationFrame` and `performance`.
- `src/test-setup.ts`: stubs `ResizeObserver`, which jsdom lacks and Leaflet 2's map uses.
- `tsup.config.ts`: builds `lib/index.js` (ESM, ES2022, the level Leaflet 2 already requires) plus `.d.ts`.
- `index.html`: live demo, served by GitHub Pages straight from `master` (no build). It still loads 2.x (`leaflet-drift-marker@2`) on Leaflet 1 through classic `<script>` tags, so it changes only when a 2.x version is published.
- `docs/`: README assets.

## Commands

```bash
npm ci
npm test            # vitest run
npm run typecheck   # tsc --noEmit
npm run lint        # eslint + prettier --check
npm run format      # prettier --write
npm run build       # tsup -> lib/
```

Run `lint`, `typecheck`, `test` and `build` before calling a change done; CI runs the same on Node 22 and 24 (the dev tools need Node 22+; the published package has no Node requirement).

## Conventions

- `leaflet` is a peer dependency (`^2.0.0-beta.5`); never bundle it. Tests run against the exact devDependency version.
- Use Leaflet 2's API: classes (`new LatLng()`, `new LeafletMap()`), not the removed factories (`latLng()`, `map()`); native `requestAnimationFrame`; `pinchZoom`, not `touchZoom`.
- Leaflet cannot load in Node without a DOM, so anything that touches Leaflet is tested under jsdom.
- Bug fixes start with a failing test in `src/index.test.ts`.
- Leaflet internals (`_map`) are accessed through the `MarkerInternals` cast in `src/index.ts`; keep that the only place.
- Private slide state is prefixed `_slide` to avoid clashing with `Marker` internals.
- `src/index.ts` must not touch `window` or other globals at import time; `package.json` declares `"sideEffects": false`.
- After changing exports or the build, check the README's import-map page locally against `lib/index.js` with Leaflet 2 from unpkg and confirm the marker slides.
- Update `CHANGELOG.md` for every user-visible change.

## Releasing

1. Bump `version` in `package.json` and `package-lock.json`, update the `leaflet-drift-marker@X.Y.Z` URLs in `README.md`, and add a `CHANGELOG.md` entry.
2. `npm publish` (runs `prepublishOnly`: lint, typecheck, test, build; 3.x goes to the `next` tag). Publishing is done by the maintainer, not by agents.
3. Tag `vX.Y.Z` and create a GitHub release.
4. When Leaflet 2.0 is stable: switch `peerDependencies` to `^2.0.0`, remove `publishConfig.tag`, and release 3.0.0 as `latest`.
