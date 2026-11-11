import { expect, test } from "bun:test";
import {
  createCatalogLoader,
  type CatalogEntry,
} from "../ui/model-lab/catalog.ts";

test("a stale catalog load cannot replace a newer selection", async () => {
  const opened: string[] = [];
  const failures: string[] = [];
  let finish: ((value: { mount(): void }) => void) | undefined;
  const pending = new Promise<{ mount(): void }>((resolve) => {
    finish = resolve;
  });
  const loader = createCatalogLoader<{ mount(): void }>(
    (_entry, slug) => opened.push(slug),
    (message) => failures.push(message),
  );
  const first: CatalogEntry<{ mount(): void }> = {
    slug: "first",
    title: "First",
    load: () => pending,
  };
  const old = loader.load(first);
  await loader.load({
    slug: "second",
    title: "Second",
    load: async () => ({ mount() {} }),
  });
  finish!({ mount() {} });
  await old;
  expect(opened).toEqual(["second"]);
  await loader.load({
    slug: "broken",
    title: "Broken",
    error: "Missing entry",
    load: async () => ({ mount() {} }),
  });
  expect(failures).toEqual(["Missing entry"]);
  expect(opened).toEqual(["second"]);
});

test("disposing a catalog loader invalidates pending imports", async () => {
  let opened = 0;
  let finish: ((value: { mount(): void }) => void) | undefined;
  const loader = createCatalogLoader<{ mount(): void }>(
    () => {
      opened += 1;
    },
    () => {},
  );
  const loading = loader.load({
    slug: "late",
    title: "Late",
    load: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  loader.dispose();
  finish!({ mount() {} });
  await loading;
  expect(opened).toBe(0);
});
