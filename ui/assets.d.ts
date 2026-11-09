declare module "*.css";

declare module "agent-lab-catalog" {
  export const catalog: readonly import("./agent-lab/catalog.ts").CatalogEntry<import("./definition.ts").BoundEntry>[];
  export const version: string;
}
