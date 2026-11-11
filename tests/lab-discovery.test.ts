import { expect, test } from "bun:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discoverEntries } from "../ui/model-lab/discovery.ts";

test("catalog discovers only entry candidates and reports incomplete pairs without invoking factories", async () => {
  const root = await mkdtemp(join(tmpdir(), "model-lab-catalog-"));
  try {
    for (const folder of ["working", "partial", "assets", "bad-model"])
      await mkdir(join(root, folder));
    await writeFile(join(root, "assets", "source.txt"), "not an entry");
    await writeFile(
      join(root, "working", "model.ts"),
      'export const model={title:"Working",inputs:{},create(){throw new Error("Factory must not run");}};',
    );
    await writeFile(join(root, "working", "ui.ts"), "export const ui={};");
    await writeFile(join(root, "partial", "ui.ts"), "export const ui={};");
    await writeFile(
      join(root, "bad-model", "model.ts"),
      "export const other={};",
    );
    await writeFile(join(root, "bad-model", "ui.ts"), "export const ui={};");
    const entries = await discoverEntries(root);
    expect(entries).toHaveLength(3);
    expect(
      entries.find((entry) => entry.slug === "working")?.error,
    ).toBeUndefined();
    expect(entries.find((entry) => entry.slug === "working")?.title).toBe(
      "Working",
    );
    expect(entries.find((entry) => entry.slug === "partial")?.error).toContain(
      "both model.ts and ui.ts",
    );
    expect(
      entries.find((entry) => entry.slug === "bad-model")?.error,
    ).toContain("export model");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
