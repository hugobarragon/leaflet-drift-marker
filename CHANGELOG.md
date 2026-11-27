# Changelog

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
