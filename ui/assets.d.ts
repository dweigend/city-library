declare module "*.css";

declare module "model-lab-catalog" {
  export const catalog: readonly import("./model-lab/catalog.ts").CatalogEntry<import("./definition.ts").BoundEntry>[];
  export const version: string;
}
