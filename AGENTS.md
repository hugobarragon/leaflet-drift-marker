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

1. Bump `version` in `package.json` and `package-lock.json` and add a `CHANGELOG.md` entry.
2. Publish (the maintainer does this, not agents; it runs `prepublishOnly`: lint, typecheck, test, build):
   - 3.x while Leaflet 2 is in beta: `npm publish --tag next`. Always pass `--tag next`: npm's default `tag` setting overrides `publishConfig.tag`, and without the flag the beta goes to `latest`.
   - 2.x: from a branch cut from the latest `v2.x` tag, `npm publish --tag v2-latest` once 3.x is `latest`; until then plain `npm publish`.
3. Tag `vX.Y.Z` on the published commit and create a GitHub release with the `CHANGELOG.md` notes. Mark beta versions as prereleases.
4. Check `npm view leaflet-drift-marker dist-tags`: `next` (3.x beta) and `latest` (2.x, until 3.0.0 stable) must point where intended.

## Keep in sync

Update these whenever the related change happens:

- **README version table** (top of `README.md`): a row per supported Leaflet major, with the tested Leaflet version and install command.
- **README CDN URLs**: `leaflet-drift-marker@X.Y.Z` and the `leaflet@...` URLs in the browser example.
- **Leaflet beta bumps**: the exact `leaflet` version in `devDependencies`, the `peerDependencies` range, the README `unpkg.com/leaflet@...` URLs and the "Tested with" column.
- **Demo** (`index.html`): loads `leaflet-drift-marker@2` on Leaflet 1. Move it to 3.x and Leaflet 2 only when 3.0.0 is stable.
- **Leaflet plugin list**: the entry in Leaflet's repo at `docs/_plugins/overlay-animations/leaflet-drift-marker.md` (`compatible-v2`, demo URL, description). Changes go through a PR to `Leaflet/Leaflet`.
- **npm and GitHub metadata**: `description` and `keywords` in `package.json`, and the GitHub repo description, topics and homepage, so they describe the same thing.

When Leaflet 2.0 is stable: set `peerDependencies` to `^2.0.0`, remove `publishConfig.tag`, release 3.0.0 to `latest`, update the README table, the demo and the plugin-list entry.
