# Changelog

## 3.0.0

### Breaking

- ESM only: ships `dist/index.js` (ES2020) with TypeScript types. `require()` is no longer supported.
- `window.DriftMarker` is no longer set. In the browser, use `<script type="module">` with an import map (see README).

### Fixed

- Map dragging, double-click zoom, touch zoom and scroll-wheel zoom are re-enabled after a `keepAtCenter` slide ends.
- `slideCancel()` restores map interaction and returns `this`.
- Calling `setLatLng` during a slide cancels the slide instead of being overwritten by it.

### Changed

- Adds a named `DriftMarker` export and a `SlideOptions` type.
- Built with TypeScript 5 and tested with Leaflet 1.9.

## 2.0.0

- React component moved to `react-leaflet-drift-marker`.
