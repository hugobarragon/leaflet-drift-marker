### :warning: From v2 up react project was splited to react-leaflet-drift-marker so this packages can be installed on vue,angular... and serve as base for other platforms.

# leaflet-drift-marker

[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=plastic)](http://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/badge/npm-v2.0.0-green.svg?style=plastic)](https://www.npmjs.com/package/leaflet-drift-marker)

| Support   | Tested |         |
| --------- | ------ | ------- |
| `leaflet` | 1.5.1  | &#9745; |

!["IMG"](./docs/driftmarker.gif "example")

A plugin for leaflet in Typescript to use on react,vue... that allows a marker to move smoothly instead of jump to a new position. Reworked to typescript from [Leaflet.Marker.SlideTo!](https://gitlab.com/IvanSanchez/Leaflet.Marker.SlideTo)

### For more performance use canvas or webgl options!!

## Installation

### Install via NPM

```bash
npm install --save leaflet-drift-marker
```

`leaflet-drift-marker` requires only `leaflet` as [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies)

```bash
npm install --save leaflet
```

## Usage

### Leaflet

[![Edit leaflet_DriftMarker](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/static-bcdhq?fontsize=14)

You can get the build file DriftMarker.js from releases or :

```html
<script>
  <!-- will be fixed on next release -->
  <!-- Include this script if exports does not exists on window or -->
  <!-- the following error "ReferenceError: exports is not defined" -->
  <!-- before the cdn import -->
  var exports = {};
</script>
<script src="https://unpkg.com/leaflet-drift-marker@2.0.0/lib/index.js"></script>
```

Still supports all existing leaflet marker properties [check marker](https://leafletjs.com/reference-1.5.0.html#marker)

This plugin implements two new methods:

- `.slideTo(latlng, slideOptions)`
  - `latlng` : LeafletLatLng , required
  - `slideOptions` : Object , required
    - `duration` : number , required
    - `keepAtCenter` : Boolean , optional
- `.slideCancel()`

#### DriftMarker (with leaflet)

```javascript
import DriftMarker from "leaflet-drift-marker";
//var DriftMarker=require("leaflet-drift-marker")

const marker = new DriftMarker([10, 10]);

marker.slideTo([20, 20], {
  duration: 2000,
  keepAtCenter: true,
});
```

# License

MIT License
