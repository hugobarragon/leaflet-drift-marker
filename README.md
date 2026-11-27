# leaflet-drift-marker

[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/leaflet-drift-marker.svg)](https://www.npmjs.com/package/leaflet-drift-marker)
[![CI](https://github.com/hugobarragon/leaflet-drift-marker/actions/workflows/ci.yml/badge.svg)](https://github.com/hugobarragon/leaflet-drift-marker/actions/workflows/ci.yml)

![DriftMarker example](./docs/driftmarker.gif "example")

A Leaflet marker that moves smoothly to a new position instead of jumping. Written in TypeScript and framework-agnostic, so it works with plain Leaflet, Vue, Angular and others. Ported from [Leaflet.Marker.SlideTo](https://gitlab.com/IvanSanchez/Leaflet.Marker.SlideTo).

Using React? See [react-leaflet-drift-marker](https://github.com/hugobarragon/react-leaflet-drift-marker).

Tested with Leaflet 1.9. For many markers, use Leaflet's canvas renderer for better performance.

## Installation

```bash
npm install leaflet-drift-marker leaflet
```

`leaflet` is a [peer dependency](https://docs.npmjs.com/cli/configuring-npm/package-json#peerdependencies).

## Usage

### With a bundler

```javascript
import DriftMarker from "leaflet-drift-marker";
// or: const { DriftMarker } = require("leaflet-drift-marker");

const marker = new DriftMarker([10, 10]).addTo(map);

marker.slideTo([20, 20], {
  duration: 2000,
  keepAtCenter: true,
});
```

### With a `<script>` tag

Load Leaflet first; the script sets `window.DriftMarker`.

```html
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-drift-marker@2.1.0/dist/index.global.js"></script>
<script>
  const marker = new DriftMarker([10, 10]).addTo(map);
</script>
```

[![Edit leaflet_DriftMarker](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/static-bcdhq?fontsize=14)

## API

`DriftMarker` accepts everything [`L.Marker`](https://leafletjs.com/reference.html#marker) does, and adds:

- `.slideTo(latlng, options)`: animates the marker to `latlng`. Fires `movestart` and `moveend`.
  - `options.duration` (number, required): animation length in ms.
  - `options.keepAtCenter` (boolean, optional): pans the map with the marker and locks dragging and zoom-to-point until the slide ends.
- `.slideCancel()`: stops the current slide and restores map interaction.

Calling `setLatLng` during a slide cancels the slide.

## Contributing

See [AGENTS.md](./AGENTS.md) for layout, commands and conventions.

## License

MIT
