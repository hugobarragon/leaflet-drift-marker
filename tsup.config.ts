import { defineConfig, type Options } from "tsup";

const shared: Options = {
  entry: ["src/index.ts"],
  target: "es2018",
  sourcemap: true,
  external: ["leaflet"],
};

export default defineConfig([
  { ...shared, format: ["esm", "cjs"], dts: true, clean: true },
  {
    ...shared,
    format: ["iife"],
    globalName: "DriftMarkerModule",
    minify: true,
    // In the <script> build, Leaflet comes from the global `L`.
    esbuildPlugins: [
      {
        name: "leaflet-global",
        setup(build) {
          build.onResolve({ filter: /^leaflet$/ }, () => ({
            path: "leaflet",
            namespace: "leaflet-global",
          }));
          build.onLoad({ filter: /.*/, namespace: "leaflet-global" }, () => ({
            contents: "module.exports = window.L;",
            loader: "js",
          }));
        },
      },
    ],
  },
]);
