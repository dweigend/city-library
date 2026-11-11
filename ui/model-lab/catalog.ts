export interface CatalogEntry<T> {
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly error?: string;
  readonly load: () => Promise<T>;
}
/** A newer selection always wins, even if an earlier import resolves later. */
export function createCatalogLoader<T extends { readonly mount: unknown }>(
  changed: (entry: T, slug: string) => void,
  failed: (message: string) => void,
) {
  let generation = 0;
  return {
    async load(entry: CatalogEntry<T>) {
      const request = ++generation;
      try {
        if (entry.error) throw new Error(entry.error);
        const loaded = await entry.load();
        if (request !== generation) return;
        if (!loaded || typeof loaded.mount !== "function")
          throw new TypeError("Entry must export a bound ui definition.");
        changed(loaded, entry.slug);
      } catch (error) {
        if (request === generation)
          failed(error instanceof Error ? error.message : String(error));
      }
    },
    dispose() {
      generation += 1;
    },
  };
}
