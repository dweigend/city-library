import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { create as smoothlife } from "../models/smoothlife/model.ts";
import { create as hex } from "../models/hex-cell-aggregation/model.ts";
import { create as vants } from "../models/vants/model.ts";
import { create as turing } from "../models/turing-machine-2d/model.ts";
import { create as elementary } from "../models/ca-1d-elementary/model.ts";
import { create as continuous } from "../models/ca-continuous/model.ts";
import { create as brain } from "../models/brians-brain/model.ts";
import { create as cyclic } from "../models/cyclic-ca/model.ts";
import { create as stochastic } from "../models/ca-stochastic/model.ts";

// Independent oracle: values read from the actual pinned original running in
// Chromium, after native Enter executed each recorded NetLogo command.
interface Probe {
  observed: {
    sha: string;
    tick: number;
    visibleTurtles: number;
    values: Record<string, { unique: readonly (number | boolean)[]; trueCount: number; min?: number; max?: number }>;
    heads: readonly { x: number; y: number; heading: number; state?: number }[];
    rowOn: readonly number[];
    rowOnCount: number;
    rowCenterValue?: number;
    successorCells?: number;
    probabilities?: readonly number[];
    console: string;
  };
}
const slugs = ["smoothlife", "hex-cell-aggregation", "vants", "turing-machine-2d", "ca-1d-elementary", "ca-continuous", "brians-brain", "cyclic-ca", "ca-stochastic"] as const;
function source(slug: (typeof slugs)[number]): Probe["observed"] {
  const path = new URL(`../models/${slug}/evidence/selected-cellular-evidence/${slug}-source-probe.json`, import.meta.url);
  return (JSON.parse(readFileSync(path, "utf8")) as Probe).observed;
}

describe("selected cellular executed-original probes", () => {
  test("every oracle pins the exact archived original bytes", () => {
    for (const slug of slugs) {
      const bytes = readFileSync(new URL(`../models/${slug}/source.nlogox`, import.meta.url));
      expect(new Bun.CryptoHasher("sha256").update(bytes).digest("hex")).toBe(source(slug).sha);
    }
  });
  test("SmoothLife agrees with original disk/annulus normalizers and integrated uniform value", () => {
    const original = source("smoothlife");
    const model = smoothlife({ width: 25, height: 25 });
    expect(model.read().innerCount).toBe(original.values["inner-count"]!.min!);
    expect(model.read().outerCount).toBe(original.values["outer-count"]!.min!);
    model.setCells(model.read().cells.map(() => 0.4));
    model.advance();
    expect(model.read().tick).toBe(original.tick);
    for (const cell of model.read().cells)
      expect(Math.abs(cell.value - original.values.state!.min!)).toBeLessThan(1e-12);
  });
  test("hex activates the same number of canonical visible cells", () => {
    const model = hex({ width: 9, height: 9 });
    model.advance();
    expect(model.read().tick).toBe(source("hex-cell-aggregation").tick);
    expect(model.read().cells.filter(cell => cell.alive).length).toBe(source("hex-cell-aggregation").visibleTurtles);
  });
  test("Vants agrees with original reversibility without assuming a matching random heading", () => {
    const original = source("vants"), model = vants({ width: 9, height: 9 });
    const initial = model.read().agents.map(agent => [agent.x, agent.y, agent.heading]);
    model.advance(25); model.reverse(25);
    expect(original.console).toContain("observer: true");
    expect(model.read().tick).toBe(original.tick);
    expect(model.read().agents.map(agent => [agent.x, agent.y, agent.heading])).toEqual(initial);
    expect(model.read().agents[0]!.x).toBe(original.heads[0]!.x);
    expect(model.read().agents[0]!.y).toBe(original.heads[0]!.y);
    expect(model.read().cells.every(cell => !cell.on)).toBe(true);
  });
  test("Turing example1 agrees with original tape write, next state and oriented movement", () => {
    const original = source("turing-machine-2d"), model = turing({ width: 9, height: 9, heads: 1 });
    model.setupExample(1); model.advance();
    const head = model.read().agents[0]!;
    const originalHead = original.heads[0]!;
    expect([head.x, head.y, head.heading, head.state]).toEqual([
      originalHead.x, originalHead.y, originalHead.heading, originalHead.state!,
    ]);
    expect(model.read().cells.filter(cell => cell.on).length).toBe(original.values["on?"]!.trueCount);
    expect(model.read().tick).toBe(original.tick);
  });
  test("elementary rule90 has the original two children at the next row", () => {
    const original = source("ca-1d-elementary"), model = elementary({ width: 9, height: 5, rule: 90, initialization: "single" });
    model.advance();
    expect(model.read().cells.filter(cell => cell.y === model.read().row && cell.on).map(cell => cell.x)).toEqual([...original.rowOn]);
    expect(model.read().tick).toBe(original.tick);
  });
  test("continuous mean/map/precision yields the original center value", () => {
    const original = source("ca-continuous"), model = continuous({ width: 9, height: 5, precisionLevel: 6, initialization: "single" });
    model.advance();
    expect(model.read().cells.find(cell => cell.x === 0 && cell.y === model.read().row)!.value).toBe(original.rowCenterValue!);
    expect(model.read().tick).toBe(original.tick);
  });
  test("Brian birth/refractory totals agree with the executed two-parent original", () => {
    const original = source("brians-brain"), model = brain({ width: 5, height: 5, initialization: "blank" });
    model.setCells(model.read().cells.map(cell => cell.y === 0 && Math.abs(cell.x) === 1 ? 1 : 0));
    model.advance();
    expect(model.read().counts.firing).toBe(original.values["firing?"]!.trueCount);
    expect(model.read().counts.refractory).toBe(original.values["refractory?"]!.trueCount);
    expect(model.read().tick).toBe(original.tick);
  });
  test("cyclic single-successor spread agrees with the original synchronous phase", () => {
    const original = source("cyclic-ca"), model = cyclic({ width: 5, height: 5, preset: "custom", radius: 1, numStates: 3, threshold: 1, neighborhood: "Moore" });
    model.setCells(model.read().cells.map(cell => cell.x === 1 && cell.y === 0 ? 1 : 0));
    model.advance();
    expect(model.read().cells.filter(cell => cell.state === 1).length).toBe(original.successorCells!);
    expect(model.read().tick).toBe(original.tick);
  });
  test("stochastic certain OOO rule agrees with the original all-on row and four-cell distribution", () => {
    const original = source("ca-stochastic"), model = stochastic({ width: 9, height: 5, density: 0, OOO: 100 });
    model.advance();
    expect(original.rowOnCount).toBe(161);
    expect(model.read().cells.filter(cell => cell.y === model.read().row && cell.on).length).toBe(model.read().width);
    expect(model.read().probabilities).toEqual(original.probabilities!);
    expect(model.read().tick).toBe(original.tick);
  });
});
