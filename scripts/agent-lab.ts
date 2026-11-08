import { watch } from "node:fs";
import { readdir as readDirectory, stat } from "node:fs/promises";
import { resolve, relative, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const entryRoot = resolve(root, "experiments");
export interface DiscoveredEntry {
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly modelPath: string;
  readonly uiPath: string;
  readonly error?: string;
}
export async function discoverEntries(
  directory = entryRoot,
): Promise<readonly DiscoveredEntry[]> {
  const result: DiscoveredEntry[] = [];
  for (const child of await readDirectory(directory, { withFileTypes: true })) {
    if (!child.isDirectory() || child.isSymbolicLink()) continue;
    const modelPath = resolve(directory, child.name, "model.ts");
    const uiPath = resolve(directory, child.name, "ui.ts");
    const hasModel = await Bun.file(modelPath).exists();
    const hasUI = await Bun.file(uiPath).exists();
    if (!hasModel && !hasUI) continue;
    try {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(child.name))
        throw new Error("Entry directory must be a lowercase URL slug.");
      if (!hasModel || !hasUI)
        throw new Error("Entry requires both model.ts and ui.ts.");
      const updated = (await stat(modelPath)).mtimeMs;
      const imported: unknown = await import(
        `${pathToFileURL(modelPath).href}?metadata=${updated}`
      );
      if (!imported || typeof imported !== "object" || !("model" in imported))
        throw new Error("model.ts must export model.");
      const model: unknown = imported.model;
      if (
        !model ||
        typeof model !== "object" ||
        !("title" in model) ||
        typeof model.title !== "string" ||
        !("create" in model) ||
        typeof model.create !== "function" ||
        !("inputs" in model) ||
        !model.inputs ||
        typeof model.inputs !== "object"
      )
        throw new Error("Invalid headless model definition.");
      result.push({
        slug: child.name,
        title: model.title,
        description:
          "description" in model && typeof model.description === "string"
            ? model.description
            : undefined,
        modelPath,
        uiPath,
      });
    } catch (error) {
      result.push({
        slug: child.name,
        title: child.name,
        modelPath,
        uiPath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return result.sort((a, b) => a.title.localeCompare(b.title));
}

/** Shared literal lazy-import module for the Bun and Vite hosts. */
export function createCatalogModule(
  entries: readonly DiscoveredEntry[],
  version: string,
  importPath: (entry: DiscoveredEntry) => string = (entry) => entry.uiPath,
): string {
  return `export const version=${JSON.stringify(version)};export const catalog=[${entries.map((entry) => `{slug:${JSON.stringify(entry.slug)},title:${JSON.stringify(entry.title)},description:${JSON.stringify(entry.description)},error:${JSON.stringify(entry.error)},load:async()=>{${entry.error ? `throw new Error(${JSON.stringify(entry.error)});` : `const module=await import(${JSON.stringify(importPath(entry))});return module.ui;`}}}`).join(",")}];`;
}

async function serve() {
  const portText = process.env.CITY_LIBRARY_UI_PORT ?? "3100";
  if (
    !/^\d+$/.test(portText) ||
    Number(portText) < 1 ||
    Number(portText) > 65535
  )
    throw new RangeError(
      "CITY_LIBRARY_UI_PORT must be an integer from 1 to 65535.",
    );
  const assets = new Map<string, Blob>();
  let version = "";
  let building = false;
  let queued = false;
  async function build() {
    if (building) {
      queued = true;
      return;
    }
    building = true;
    try {
      const entries = await discoverEntries();
      const nextVersion = String(Date.now());
      const code = createCatalogModule(entries, nextVersion);
      const built = await Bun.build({
        entrypoints: [resolve(root, "ui/agent-lab/app.ts")],
        target: "browser",
        format: "esm",
        splitting: true,
        outdir: "agent-lab-output",
        naming: {
          entry: "app.js",
          chunk: "chunks/[name]-[hash].js",
          asset: "assets/[name]-[hash].[ext]",
        },
        plugins: [
          {
            name: "agent-lab-catalog",
            setup(builder) {
              builder.onResolve({ filter: /^agent-lab-catalog$/ }, () => ({
                path: "catalog",
                namespace: "lab",
              }));
              builder.onLoad({ filter: /.*/, namespace: "lab" }, () => ({
                contents: code,
                loader: "ts",
                resolveDir: root,
              }));
            },
          },
        ],
      });
      if (!built.success)
        throw new AggregateError(built.logs, "Agent Lab bundle failed.");
      const next = new Map<string, Blob>();
      for (const output of built.outputs) {
        const path = relative(
          resolve(root, "agent-lab-output"),
          resolve(output.path),
        ).replaceAll("\\", "/");
        next.set(`/${path}`, output);
      }
      next.set("/", Bun.file(resolve(root, "ui/agent-lab/index.html")));
      next.set(
        "/styles.css",
        Bun.file(resolve(root, "ui/agent-lab/styles.css")),
      );
      // Existing sessions retain their lazy chunks until the development server restarts.
      for (const [path, value] of next) assets.set(path, value);
      version = nextVersion;
      for (const entry of entries)
        if (entry.error) console.error(`${entry.slug}: ${entry.error}`);
      console.log(`Agent Lab: ${entries.length} catalog entries built.`);
    } catch (error) {
      console.error(error);
    } finally {
      building = false;
      if (queued) {
        queued = false;
        void build();
      }
    }
  }
  await build();
  const server = Bun.serve({
    hostname: process.env.CITY_LIBRARY_UI_HOST ?? "127.0.0.1",
    port: Number(portText),
    fetch(request) {
      if (!["GET", "HEAD"].includes(request.method))
        return new Response("Method not allowed", {
          status: 405,
          headers: { Allow: "GET, HEAD" },
        });
      const path = new URL(request.url).pathname;
      if (path === "/build-version")
        return new Response(version, {
          headers: { "Cache-Control": "no-store" },
        });
      if (path === "/favicon.ico") return new Response(null, { status: 204 });
      const asset = assets.get(path);
      if (!asset) return new Response("Not found", { status: 404 });
      const type =
        path === "/"
          ? "text/html; charset=utf-8"
          : path.endsWith(".css")
            ? "text/css; charset=utf-8"
            : path.endsWith(".js")
              ? "text/javascript; charset=utf-8"
              : asset.type;
      return new Response(request.method === "HEAD" ? null : asset, {
        headers: {
          "Content-Type": type,
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    },
  });
  let debounce: ReturnType<typeof setTimeout> | undefined;
  for (const directory of ["ui", "experiments", "src"])
    watch(resolve(root, directory), { recursive: true }, () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => void build(), 120);
    });
  console.log(`Agent Lab: ${server.url}`);
}
if (import.meta.main) await serve();
