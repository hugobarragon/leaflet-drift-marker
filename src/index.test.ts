import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type * as LeafletNS from "leaflet";

// Leaflet captures requestAnimationFrame at import time, so fake timers go in first.
vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });

let L: typeof LeafletNS;
let DriftMarker: typeof import("./index").default;

beforeAll(async () => {
  L = await import("leaflet");
  DriftMarker = (await import("./index")).default;
});

let map: LeafletNS.Map;

beforeEach(() => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  map = L.map(container).setView([0, 0], 5);
});

afterEach(() => {
  map.remove();
  document.body.innerHTML = "";
});

function finishSlide() {
  vi.advanceTimersByTime(1100);
}

describe("DriftMarker", () => {
  it("is a Leaflet marker", () => {
    expect(new DriftMarker([0, 0])).toBeInstanceOf(L.Marker);
  });

  it("slides to the target and fires movestart/moveend", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    const movestart = vi.fn();
    const moveend = vi.fn();
    marker.on("movestart", movestart).on("moveend", moveend);

    marker.slideTo([10, 10], { duration: 1000 });
    expect(movestart).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);
    const mid = marker.getLatLng();
    expect(mid.lat).toBeGreaterThan(0);
    expect(mid.lat).toBeLessThan(10);
    expect(moveend).not.toHaveBeenCalled();

    finishSlide();
    expect(marker.getLatLng()).toEqual(L.latLng(10, 10));
    expect(moveend).toHaveBeenCalledTimes(1);
  });

  it("does nothing when not on a map", () => {
    const marker = new DriftMarker([0, 0]);
    marker.slideTo([10, 10], { duration: 1000 });
    finishSlide();
    expect(marker.getLatLng()).toEqual(L.latLng(0, 0));
  });

  it("re-enables map dragging after a keepAtCenter slide", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    expect(map.dragging.enabled()).toBe(true);

    marker.slideTo([10, 10], { duration: 1000, keepAtCenter: true });
    expect(map.dragging.enabled()).toBe(false);

    finishSlide();
    expect(map.dragging.enabled()).toBe(true);
    expect(map.doubleClickZoom.enabled()).toBe(true);
  });

  it("keeps dragging disabled after the slide if it was disabled before", () => {
    map.dragging.disable();
    const marker = new DriftMarker([0, 0]).addTo(map);

    marker.slideTo([10, 10], { duration: 1000, keepAtCenter: true });
    finishSlide();
    expect(map.dragging.enabled()).toBe(false);
  });

  it("slideCancel stops the slide and restores dragging", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    marker.slideTo([10, 10], { duration: 1000, keepAtCenter: true });
    vi.advanceTimersByTime(500);

    marker.slideCancel();
    const stopped = marker.getLatLng();
    finishSlide();

    expect(marker.getLatLng()).toEqual(stopped);
    expect(map.dragging.enabled()).toBe(true);
  });

  it("an external setLatLng cancels the running slide", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    marker.slideTo([10, 10], { duration: 1000 });
    vi.advanceTimersByTime(500);

    marker.setLatLng([-5, -5]);
    finishSlide();

    expect(marker.getLatLng()).toEqual(L.latLng(-5, -5));
  });

  it("has no global side effects", () => {
    expect("DriftMarker" in window).toBe(false);
  });

  it("jumps to the target when duration is 0", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    const moveend = vi.fn();
    marker.on("moveend", moveend);

    expect(() => marker.slideTo([10, 10], { duration: 0 })).not.toThrow();
    expect(marker.getLatLng()).toEqual(L.latLng(10, 10));
    expect(moveend).toHaveBeenCalledTimes(1);
  });

  it("unlocks the map when the marker is removed mid-slide", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    marker.slideTo([10, 10], { duration: 1000, keepAtCenter: true });
    vi.advanceTimersByTime(500);

    marker.remove();
    finishSlide();

    expect(map.dragging.enabled()).toBe(true);
    expect(map.options.touchZoom).toBe(true);
  });

  it("keeps the map locked for a keepAtCenter slide started from moveend", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    marker.once("moveend", () => {
      marker.slideTo([20, 20], { duration: 1000, keepAtCenter: true });
    });

    marker.slideTo([10, 10], { duration: 1000, keepAtCenter: true });
    finishSlide();
    expect(map.dragging.enabled()).toBe(false);

    finishSlide();
    expect(marker.getLatLng()).toEqual(L.latLng(20, 20));
    expect(map.dragging.enabled()).toBe(true);
  });

  it("restores each map interaction setting to its value before the slide", () => {
    map.doubleClickZoom.disable();
    map.options.scrollWheelZoom = "center";
    const marker = new DriftMarker([0, 0]).addTo(map);

    marker.slideTo([10, 10], { duration: 1000, keepAtCenter: true });
    finishSlide();

    expect(map.dragging.enabled()).toBe(true);
    expect(map.doubleClickZoom.enabled()).toBe(false);
    expect(map.options.scrollWheelZoom).toBe("center");
    expect(map.options.touchZoom).toBe(true);
  });

  it("retargets cleanly when slideTo is called mid-slide", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    marker.slideTo([10, 10], { duration: 1000, keepAtCenter: true });
    vi.advanceTimersByTime(500);

    marker.slideTo([-10, -10], { duration: 1000, keepAtCenter: true });
    finishSlide();

    expect(marker.getLatLng()).toEqual(L.latLng(-10, -10));
    expect(map.dragging.enabled()).toBe(true);
  });

  it("slideCancel is harmless with no slide running", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    expect(marker.slideCancel()).toBe(marker);
    expect(map.dragging.enabled()).toBe(true);
  });

  it("treats an invalid duration as 0 and leaves the map unlocked", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);

    expect(() => marker.slideTo([10, 10], { duration: NaN, keepAtCenter: true })).not.toThrow();
    expect(marker.getLatLng()).toEqual(L.latLng(10, 10));
    expect(map.dragging.enabled()).toBe(true);
  });

  it("unlocks the map when a keepAtCenter slide is retargeted without it", () => {
    const marker = new DriftMarker([0, 0]).addTo(map);
    marker.slideTo([10, 10], { duration: 1000, keepAtCenter: true });
    vi.advanceTimersByTime(500);

    marker.slideTo([-10, -10], { duration: 1000 });
    expect(map.dragging.enabled()).toBe(true);
    expect(map.options.touchZoom).toBe(true);

    finishSlide();
    expect(marker.getLatLng()).toEqual(L.latLng(-10, -10));
  });

  it("unlocks the original map when the marker moves to another map mid-slide", () => {
    const otherContainer = document.createElement("div");
    document.body.appendChild(otherContainer);
    const otherMap = L.map(otherContainer).setView([0, 0], 5);
    otherMap.doubleClickZoom.disable();

    const marker = new DriftMarker([0, 0]).addTo(map);
    marker.slideTo([10, 10], { duration: 1000, keepAtCenter: true });
    vi.advanceTimersByTime(500);

    marker.addTo(otherMap);
    finishSlide();

    expect(map.dragging.enabled()).toBe(true);
    expect(map.doubleClickZoom.enabled()).toBe(true);
    expect(otherMap.doubleClickZoom.enabled()).toBe(false);
    otherMap.remove();
  });
});
