import { resolve } from "node:path";
import { normalizePath, type Plugin } from "vite";
import { createCatalogModule, discoverEntries } from "./discovery.ts";

const moduleId = "model-lab-catalog";
const resolvedId = `\0${moduleId}`;

/** Adapt existing discovery to Vite without creating or importing model instances. */
export function modelLabCatalog(root: string): Plugin {
  let version = String(Date.now());
  return {
    name: "model-lab-catalog",
    enforce: "pre",
    resolveId(id) {
      if (id === moduleId) return resolvedId;
    },
    async load(id) {
      if (id !== resolvedId) return;
      const entries = await discoverEntries(resolve(root, "models"));
      const code = createCatalogModule(entries, version, (entry) =>
        `/@fs/${normalizePath(entry.uiPath)}`,
      );
      return code;
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== "/build-version") return next();
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(version);
      });
      const sourceRoots = ["ui", "models", "library"].map((path) =>
        `${normalizePath(resolve(root, path))}/`,
      );
      server.watcher.add(sourceRoots.map((path) => path.slice(0, -1)));
      server.watcher.on("all", (event, file) => {
        if (!["add", "change", "unlink"].includes(event)) return;
        if (!sourceRoots.some((path) => normalizePath(file).startsWith(path))) return;
        version = String(Date.now());
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "build-version", source: version });
    },
  };
}
