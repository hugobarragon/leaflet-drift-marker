# Changelog

## 3.0.0-beta.1

### Fixed

- An invalid `duration` (such as `NaN`) is treated as 0 instead of throwing and leaving the map locked.
- Retargeting a `keepAtCenter` slide with a slide that doesn't use it unlocks the map right away.
- Moving a sliding marker to another map unlocks the map it was locked on.

## 2.1.1

### Fixed

- An invalid `duration` (such as `NaN`) is treated as 0 instead of throwing and leaving the map locked.
- Retargeting a `keepAtCenter` slide with a slide that doesn't use it unlocks the map right away.
- Moving a sliding marker to another map unlocks the map it was locked on.

## 3.0.0-beta.0

### Breaking

- Requires Leaflet 2 (`^2.0.0-beta.5`); Leaflet 1 stays on 2.x.
- ESM only: ships `lib/index.js` (ES2022) with TypeScript types. CommonJS and the `<script>` build are removed, and `window.DriftMarker` is no longer set.
- Removes the deprecated `slideOptions` type; use `SlideOptions`.

### Changed

- Uses Leaflet 2's API: `LatLng` instead of `latLng()`, native `requestAnimationFrame`, and `pinchZoom` instead of `touchZoom` for `keepAtCenter`.
- Published under the npm `next` tag while Leaflet 2 is in beta.

## 2.1.0

### Fixed

- Map dragging, double-click zoom, touch zoom and scroll-wheel zoom return to their previous settings after a `keepAtCenter` slide.
- `slideCancel()` restores map interaction and returns `this`.
- Calling `setLatLng` during a slide cancels the slide instead of being overwritten by it.
- Removing the marker during a `keepAtCenter` slide no longer leaves the map locked.
- A slide started from a `moveend` handler keeps its own `keepAtCenter` lock.
- `duration: 0` moves the marker straight to the target instead of throwing.

### Changed

- Ships ESM (`lib/index.mjs`), CommonJS (`lib/index.cjs`) and a `<script>` build (`lib/index.js`, the same path as 2.0.0) with TypeScript types. Existing `<script>` URLs keep working, and the `var exports = {}` workaround is no longer needed.
- `window.DriftMarker` is set by the `<script>` build only; bundler imports no longer write to `window`.
- Adds a named `DriftMarker` export and a `SlideOptions` type; `slideOptions` stays as a deprecated alias.
- `peerDependencies` now caps Leaflet below 2.0.
- Built with TypeScript 5 and tested with Leaflet 1.9.

## 2.0.0

- React component moved to `react-leaflet-drift-marker`.
