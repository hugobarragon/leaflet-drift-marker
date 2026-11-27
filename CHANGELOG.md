# Changelog

## 2.1.0

### Fixed

- Map dragging, double-click zoom, touch zoom and scroll-wheel zoom are re-enabled after a `keepAtCenter` slide ends.
- `slideCancel()` restores map interaction and returns `this`.
- Calling `setLatLng` during a slide cancels the slide instead of being overwritten by it.
- Loading in a non-browser environment no longer touches `window` at import time.

### Changed

- Ships ESM (`dist/index.js`), CommonJS (`dist/index.cjs`) and a `<script>` build (`dist/index.global.js`) with TypeScript types. The `var exports = {}` workaround for CDN usage is no longer needed.
- Adds a named `DriftMarker` export and a `SlideOptions` type.
- Built with TypeScript 5 and tested with Leaflet 1.9.

## 2.0.0

- React component moved to `react-leaflet-drift-marker`.
