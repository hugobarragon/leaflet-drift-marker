import {
  LatLng,
  Marker,
  type LatLngExpression,
  type LeafletMap,
  type MarkerOptions,
} from "leaflet";

export interface SlideOptions {
  duration: number;
  keepAtCenter?: boolean;
}

// Leaflet keeps `_map` out of its public types.
type MarkerInternals = { _map?: LeafletMap | null };

interface MapInteraction {
  dragging: boolean;
  doubleClickZoom: boolean;
  pinchZoom: LeafletMap["options"]["pinchZoom"];
  scrollWheelZoom: LeafletMap["options"]["scrollWheelZoom"];
}

class DriftMarker extends Marker {
  private _slideToUntil = 0;
  private _slideToDuration = 1000;
  private _slideToLatLng: LatLng = new LatLng(0, 0);
  private _slideFromLatLng: LatLng = new LatLng(0, 0);
  private _slideKeepAtCenter = false;
  // Map interaction captured before a keepAtCenter slide; null when nothing to restore.
  private _slideSavedInteraction: MapInteraction | null = null;
  private _slideFrame = 0;
  private _slideIsMoving = false;

  constructor(latlng: LatLngExpression, options?: MarkerOptions) {
    super(latlng, options);
    this.on("move", this._onMove, this);
  }

  private get _slideMap() {
    return (this as unknown as MarkerInternals)._map ?? null;
  }

  // 🍂method slideTo(latlng: LatLng, options: Slide Options): this
  // Moves this marker until `latlng`, like `setLatLng()`, but with a smooth
  // sliding animation. Fires `movestart` and `moveend` events.
  slideTo(latlng: LatLngExpression, options: SlideOptions): this {
    const map = this._slideMap;
    if (!map) return this;

    cancelAnimationFrame(this._slideFrame);

    this._slideToDuration = options.duration;
    this._slideToUntil = performance.now() + options.duration;
    this._slideFromLatLng = this.getLatLng();
    this._slideToLatLng = new LatLng(latlng);
    this._slideKeepAtCenter = !!options.keepAtCenter;

    if (this._slideKeepAtCenter) {
      this._slideSavedInteraction ??= {
        dragging: map.dragging.enabled(),
        doubleClickZoom: map.doubleClickZoom.enabled(),
        pinchZoom: map.options.pinchZoom,
        scrollWheelZoom: map.options.scrollWheelZoom,
      };
      map.dragging.disable();
      map.doubleClickZoom.disable();
      map.options.pinchZoom = "center";
      map.options.scrollWheelZoom = "center";
    }

    this.fire("movestart");
    this._slideTo();

    return this;
  }

  // 🍂method slideCancel(): this
  // Cancels the sliding animation from `slideTo`, if applicable.
  slideCancel(): this {
    cancelAnimationFrame(this._slideFrame);
    this._slideRestoreMap();
    return this;
  }

  onRemove(map: LeafletMap): void {
    this.slideCancel();
    super.onRemove(map);
  }

  private _onMove() {
    if (!this._slideIsMoving) this.slideCancel();
  }

  private _slideSetLatLng(latlng: LatLng) {
    this._slideIsMoving = true;
    try {
      this.setLatLng(latlng);
    } finally {
      this._slideIsMoving = false;
    }
  }

  private _slideRestoreMap() {
    const map = this._slideMap;
    const saved = this._slideSavedInteraction;
    this._slideSavedInteraction = null;
    if (!map || !saved) return;

    if (saved.dragging) map.dragging.enable();
    if (saved.doubleClickZoom) map.doubleClickZoom.enable();
    map.options.pinchZoom = saved.pinchZoom;
    map.options.scrollWheelZoom = saved.scrollWheelZoom;
  }

  private _slideTo() {
    const map = this._slideMap;
    if (!map) return;

    const remaining = this._slideToUntil - performance.now();

    if (remaining <= 0) {
      this._slideSetLatLng(this._slideToLatLng);
      // Restore first so a slide started from a moveend handler keeps its own lock.
      this._slideRestoreMap();
      this.fire("moveend");
      return;
    }

    const startPoint = map.latLngToContainerPoint(this._slideFromLatLng);
    const endPoint = map.latLngToContainerPoint(this._slideToLatLng);
    const percentDone = (this._slideToDuration - remaining) / this._slideToDuration;

    const currPoint = endPoint.multiplyBy(percentDone).add(startPoint.multiplyBy(1 - percentDone));
    const currLatLng = map.containerPointToLatLng(currPoint);
    this._slideSetLatLng(currLatLng);

    if (this._slideKeepAtCenter) {
      map.panTo(currLatLng, { animate: false });
    }

    this._slideFrame = requestAnimationFrame(() => this._slideTo());
  }
}

export { DriftMarker };
export default DriftMarker;
