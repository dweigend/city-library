import { dirname, relative, resolve } from "node:path";
import { normalizePath, type Plugin } from "vite";
import { createCatalogModule, discoverEntries } from "./agent-lab.ts";

const moduleId = "agent-lab-catalog";
const resolvedId = `\0${moduleId}`;

/** Adapt existing discovery to Vite without creating or importing model instances. */
export function agentLabCatalog(
  root: string,
  options: { readonly runtime: "legacy" | "svelte"; readonly legacyEntries: readonly string[] },
): Plugin {
  const publicEntry = resolve(root, "ui/index.ts");
  const experimentRoot = resolve(root, "experiments");
  let version = String(Date.now());
  return {
    name: "agent-lab-catalog",
    enforce: "pre",
    resolveId(id, importer) {
      if (id === moduleId) return resolvedId;
      if (options.runtime !== "svelte" || !importer) return;
      const cleanImporter = importer.split("?")[0]!.replace(/^\/@fs\/?/, "/");
      const owner = relative(experimentRoot, cleanImporter).split(/[\\/]/)[0];
      if (!owner || owner === ".." || options.legacyEntries.includes(owner)) return;
      const cleanId = id.replace(/^\/@fs\/?/, "/");
      const target = cleanId.startsWith(".")
        ? resolve(dirname(cleanImporter), cleanId)
        : cleanId.startsWith("/") ? resolve(cleanId) : undefined;
      if (target === publicEntry) return resolve(root, "ui/svelte/index.ts");
    },
    async load(id) {
      if (id !== resolvedId) return;
      const entries = await discoverEntries(resolve(root, "experiments"));
      const code = createCatalogModule(entries, version, (entry) =>
        `/@fs/${normalizePath(entry.uiPath)}`,
      );
      const legacyEntries = options.runtime === "svelte" ? options.legacyEntries : [];
      return `${code}export const legacyEntries=Object.freeze(${JSON.stringify(legacyEntries)});`;
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (options.runtime === "legacy")
          return html.replace('src="/app.js"', 'src="/app.ts"');
        return html
          .replace('<link rel="stylesheet" href="/styles.css" />', "")
          .replace('src="/app.js"', `src="/@fs/${normalizePath(resolve(root, "ui/svelte/app.ts"))}"`)
          .replace(/<body>[\s\S]*<\/body>/, '<body><div id="app"></div></body>');
      },
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?")[0] !== "/build-version") return next();
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(version);
      });
      const sourceRoots = ["ui", "experiments", "src"].map((path) =>
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
