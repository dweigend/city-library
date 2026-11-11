import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { modelLabCatalog } from "./ui/model-lab/vite-plugin.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const portText = process.env.CITY_LIBRARY_UI_PORT ?? "3101";
if (!/^\d+$/.test(portText) || Number(portText) < 1 || Number(portText) > 65535)
  throw new RangeError(
    "CITY_LIBRARY_UI_PORT must be an integer from 1 to 65535.",
  );

export default defineConfig({
  root: `${root}ui/model-lab`,
  plugins: [
    modelLabCatalog(root),
    svelte({ configFile: `${root}svelte.config.js` }),
    tailwindcss(),
  ],
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
    // Reload is an explicit user action; HMR must not reset an active model.
    hmr: false,
    fs: { allow: [root] },
  },
  preview: {
    host: process.env.CITY_LIBRARY_UI_HOST ?? "127.0.0.1",
    port: Number(portText),
    strictPort: true,
  },
  build: { outDir: `${root}model-lab-output`, emptyOutDir: true },
});
