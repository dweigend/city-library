import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { agentLabCatalog } from "./scripts/agent-lab-vite.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const portText = process.env.CITY_LIBRARY_UI_PORT ?? "3101";
if (!/^\d+$/.test(portText) || Number(portText) < 1 || Number(portText) > 65535)
  throw new RangeError("CITY_LIBRARY_UI_PORT must be an integer from 1 to 65535.");

const runtime = process.env.CITY_LIBRARY_UI_RUNTIME ?? "legacy";
if (runtime !== "legacy" && runtime !== "svelte")
  throw new RangeError("CITY_LIBRARY_UI_RUNTIME must be legacy or svelte.");

export default defineConfig({
  root: `${root}ui/agent-lab`,
  plugins: [agentLabCatalog(root, { runtime, legacyEntries: ["taxi-cabs"] }), svelte({ configFile: `${root}svelte.config.js` }), tailwindcss()],
  resolve: {
    dedupe: ["svelte"],
    alias: {
      "city-library": `${root}index.ts`,
      $lib: `${root}ui`,
      $ui: `${root}ui`,
    },
  },
  optimizeDeps: { include: ["bits-ui"] },
  server: {
    host: process.env.CITY_LIBRARY_UI_HOST ?? "127.0.0.1",
    port: Number(portText),
    strictPort: true,
    // Reload is an explicit user action; HMR must not reset an active experiment.
    hmr: false,
    fs: { allow: [root] },
  },
  preview: {
    host: process.env.CITY_LIBRARY_UI_HOST ?? "127.0.0.1",
    port: Number(portText),
    strictPort: true,
  },
  build: { outDir: `${root}agent-lab-output/svelte`, emptyOutDir: true },
});
