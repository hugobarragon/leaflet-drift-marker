// tslint:disable
import { Marker as LeafletMarker, LatLngExpression } from 'leaflet'

declare global {
    interface Window {
        L: {
            Marker: LeafletMarker,
            Util: any
        }
    }
}
let Leaflet_module_marker: LeafletMarker = window.L ? window.L.Marker as LeafletMarker : require("leaflet").Marker as LeafletMarker,
    Leaflet_module_util = window.L ? window.L.Util : require("leaflet").Util

type slideOptions = {
    duration: number
    keepAtCenter?: boolean
}

class SlidingMarker extends Leaflet_module_marker {

    private _slideToUntil = 0
    private _slideToDuration = 1000
    private _slideToLatLng: LatLngExpression = [0, 0]
    private _slideFromLatLng: LatLngExpression = [0, 0]
    private _slideKeepAtCenter = false
    private _slideDraggingWasAllowed = false
    private _slideFrame = 0

    addInitHook = () => {
        this.on('move', this.slideCancel, this);
    }

    // 🍂method slideTo(latlng: LatLng, options: Slide Options): this
    // Moves this marker until `latlng`, like `setLatLng()`, but with a smooth
    // sliding animation. Fires `movestart` and `moveend` events.
    slideTo = (latlng: LatLngExpression, options: slideOptions) => {
        if (!this._map) return;

        this._slideToDuration = options.duration;
        this._slideToUntil = performance.now() + options.duration;
        this._slideFromLatLng = this.getLatLng();
        this._slideToLatLng = latlng;
        this._slideKeepAtCenter = !!options.keepAtCenter;
        this._slideDraggingWasAllowed =
            this._slideDraggingWasAllowed !== undefined ?
                this._slideDraggingWasAllowed :
                this._map.dragging.enabled();

        if (this._slideKeepAtCenter) {
            this._map.dragging.disable();
            this._map.doubleClickZoom.disable();
            this._map.options.touchZoom = 'center';
            this._map.options.scrollWheelZoom = 'center';
        }

        this.fire('movestart');
        this._slideTo();

        return this;
    }

    // 🍂method slideCancel(): this
    // Cancels the sliding animation from `slideTo`, if applicable.
    slideCancel() {
        Leaflet_module_util.cancelAnimFrame(this._slideFrame);
    }

    private _slideTo = () => {
        if (!this._map) return;

        var remaining = this._slideToUntil - performance.now();

        if (remaining < 0) {
            this.setLatLng(this._slideToLatLng);
            this.fire('moveend');
            if (this._slideDraggingWasAllowed) {
                this._map.dragging.enable();
                this._map.doubleClickZoom.enable();
                this._map.options.touchZoom = true;
                this._map.options.scrollWheelZoom = true;
            }
            this._slideDraggingWasAllowed = false;
            return this;
        }

        var startPoint = this._map.latLngToContainerPoint(this._slideFromLatLng);
        var endPoint = this._map.latLngToContainerPoint(this._slideToLatLng);
        var percentDone = (this._slideToDuration - remaining) / this._slideToDuration;

        var currPoint = endPoint.multiplyBy(percentDone).add(
            startPoint.multiplyBy(1 - percentDone)
        );
        var currLatLng = this._map.containerPointToLatLng(currPoint)
        this.setLatLng(currLatLng);

        if (this._slideKeepAtCenter) {
            this._map.panTo(currLatLng, { animate: false })
        }

        this._slideFrame = Leaflet_module_util.requestAnimFrame(this._slideTo, this);
    }

}

export default SlidingMarker