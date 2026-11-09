import { readdir as readDirectory, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const entryRoot = resolve(root, "models");
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

/** Literal lazy imports for the catalog served and built by Vite. */
export function createCatalogModule(
  entries: readonly DiscoveredEntry[],
  version: string,
  importPath: (entry: DiscoveredEntry) => string = (entry) => entry.uiPath,
): string {
  return `export const version=${JSON.stringify(version)};export const catalog=[${entries.map((entry) => `{slug:${JSON.stringify(entry.slug)},title:${JSON.stringify(entry.title)},description:${JSON.stringify(entry.description)},error:${JSON.stringify(entry.error)},load:async()=>{${entry.error ? `throw new Error(${JSON.stringify(entry.error)});` : `const module=await import(${JSON.stringify(importPath(entry))});return module.ui;`}}}`).join(",")}];`;
}
