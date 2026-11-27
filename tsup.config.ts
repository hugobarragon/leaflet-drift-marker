import { defineConfig, type Options } from "tsup";

// lib/index.js stays the <script> build, as in 2.0.0, so existing CDN URLs keep working.
const shared: Options = {
  entry: ["src/index.ts"],
  outDir: "lib",
  target: "es2020",
  sourcemap: true,
  external: ["leaflet"],
};

export default defineConfig([
  {
    ...shared,
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    outExtension: ({ format }) => ({ js: format === "esm" ? ".mjs" : ".cjs" }),
  },
  {
    ...shared,
    format: ["iife"],
    outExtension: () => ({ js: ".js" }),
    minify: true,
    globalName: "DriftMarker",
    // The <script> build exposes the class itself as window.DriftMarker.
    footer: { js: "DriftMarker=DriftMarker.default;" },
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
