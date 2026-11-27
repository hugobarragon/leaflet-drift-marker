// jsdom has no ResizeObserver, which Leaflet 2's map uses.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
