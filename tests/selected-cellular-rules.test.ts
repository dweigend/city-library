import { describe, expect, test } from "bun:test";
import {
  create as elementary,
  elementaryTransition,
  listRules,
} from "../experiments/ca-1d-elementary/model.ts";
import {
  create as continuous,
  fractionalPart,
  iteratedMap,
} from "../experiments/ca-continuous/model.ts";
import {
  create as stochastic,
  entropy,
  binaryListToIndex,
} from "../experiments/ca-stochastic/model.ts";
import {
  create as brain,
  brainTransition,
} from "../experiments/brians-brain/model.ts";
import {
  create as cyclic,
  cyclicOffsets,
  presets,
} from "../experiments/cyclic-ca/model.ts";

describe("selected B19 cellular source rules", () => {
  test("Cyclic palette matches base-colors observed in the original Chromium command center", () => {
    const model = cyclic({ width: 5, height: 5, numStates: 14 });
    expect(model.read().colorList).toEqual([5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135]);
  });
  test("all 256 elementary rules match their eight independent bits", () => {
    for (let rule = 0; rule < 256; rule++)
      for (let i = 0; i < 8; i++)
        expect(
          elementaryTransition(
            rule,
            Boolean(i & 4),
            Boolean(i & 2),
            Boolean(i & 1),
          ),
        ).toBe(Boolean((rule >> i) & 1));
    expect(
      listRules(90)
        .filter((r) => r.next)
        .map((r) => r.pattern),
    ).toEqual(["OOI", "OII", "IOO", "IIO"]);
  });
  test("elementary startup switch vector has effective rule105; rule actions synchronize", () => {
    const m = elementary({ width: 9, height: 5 });
    expect(m.read().parameters.rule).toBe(105);
    m.setRuleBit("III", true);
    expect(m.read().parameters.rule).toBe(233);
    m.setRules({ rule: 90 });
    expect(m.read().rules.filter((r) => r.next)).toHaveLength(4);
  });
  test("elementary wraps horizontally and stops before the bottom continuation tick", () => {
    const m = elementary({ width: 5, height: 3, rule: 90 });
    m.advance(3);
    expect(m.read().tick).toBe(2);
    expect(m.read().done).toBe(true);
    m.advance();
    expect(m.read().tick).toBe(3);
    expect(m.read().row).toBe(0);
    expect(m.read().done).toBe(false);
    const a = elementary({ width: 5, height: 3, rule: 90, autoContinue: true });
    a.advance(7);
    expect(a.read().tick).toBe(7);
  });
  test("elementary rule preview stops execution and reset restores initialization", () => {
    const m = elementary({ width: 81, height: 31 });
    m.advance();
    m.showRules();
    const tick = m.read().tick;
    m.advance();
    expect(m.read().tick).toBe(tick);
    expect(m.read().rulesShown).toBe(true);
    m.setupSingle();
    expect(m.read().tick).toBe(0);
    expect(m.read().cells.filter((c) => c.on)).toHaveLength(1);
  });
  test("continuous equation includes self and two parents, precision and fractional part", () => {
    expect(fractionalPart(-1.25)).toBe(-0.25);
    expect(iteratedMap(1, 0, 6)).toBe(0);
    expect(iteratedMap(1 / 3, 0.47, 6)).toBe(0.803333);
    const m = continuous({ width: 5, height: 3, precisionLevel: 6 });
    m.advance();
    const next = m.read().cells.filter((c) => c.y === 0);
    expect(next.map((c) => c.value)).toEqual([
      0.47, 0.803333, 0.803333, 0.803333, 0.47,
    ]);
  });
  test("continuous stopped sweep can continue, preserving ticks and copied row", () => {
    const m = continuous({
      width: 5,
      height: 3,
      addConstant: 0,
      maxValue: 0,
      initialization: "random",
    });
    m.advance(10);
    expect(m.read().tick).toBe(2);
    m.advance();
    expect(m.read().tick).toBe(3);
    expect(m.read().cells.every((c) => c.value === 0)).toBe(true);
  });
  test("stochastic probability-zero rules consume no step RNG; 100 consumes one draw per cell", () => {
    const zero = stochastic({ width: 9, height: 5, density: 0 });
    const rng = zero.read().randomState;
    zero.advance();
    expect(zero.read().randomState).toEqual(rng);
    const full = stochastic({ width: 9, height: 5, density: 0, OOO: 100 });
    const before = full.read().randomState;
    full.advance();
    expect(full.read().randomState).not.toEqual(before);
    expect(full.read().cells.filter((c) => c.y === 1 && c.on)).toHaveLength(9);
  });
  test("four-cell distribution excludes only last starting x, and entropy uses correlation length4", () => {
    const m = stochastic({ width: 9, height: 5, density: 0 });
    expect(m.read().probabilities).toEqual([1, ...Array<number>(15).fill(0)]);
    expect(m.read().entropy).toEqual({ topological: 0, metric: -0 });
    expect(entropy(Array<number>(16).fill(1 / 16))).toEqual({
      topological: 1,
      metric: 1,
    });
    expect(binaryListToIndex([1, 0, 1, 1])).toBe(11);
  });
  test("stochastic absorbing continuation stops without a tick and manual Continue copies bottom", () => {
    const m = stochastic({
      width: 9,
      height: 3,
      density: 0,
      OOO: 0,
      autoContinue: true,
    });
    m.advance(10);
    expect(m.read().tick).toBe(2);
    expect(m.read().absorbing).toBe(true);
    m.continueRun();
    expect(m.read().done).toBe(false);
    m.advance();
    expect(m.read().tick).toBe(3);
  });
  test("stochastic source examples and chart flags have explicit actions", () => {
    const m = stochastic({ width: 9, height: 5, example: 5 });
    m.setupExample();
    expect(m.read().parameters).toMatchObject({
      density: 25,
      III: 0,
      IIO: 100,
      IOI: 0,
      IOO: 66,
      OII: 100,
      OIO: 0,
      OOI: 66,
      OOO: 0,
    });
    m.setRules({ plot: false });
    const history = m.read().history;
    m.advance();
    expect(m.read().history).toEqual(history);
    m.setupRandom();
    expect(m.read().tick).toBe(0);
  });
  test("Brian's Brain has eight-neighbor toroidal birth and mandatory refractory phase", () => {
    expect(brainTransition(0, 2)).toBe(1);
    expect(brainTransition(1, 2)).toBe(2);
    expect(brainTransition(2, 2)).toBe(0);
    const m = brain({ width: 5, height: 5, initialization: "blank" });
    m.setCells(
      m.read().cells.map((c) => (c.x === -2 && Math.abs(c.y) === 1 ? 1 : 0)),
    );
    m.advance();
    expect(m.read().cells.find((c) => c.x === 2 && c.y === 0)!.state).toBe(1);
  });
  test("Brian brush chooses erase or paint at begin, retains stroke intent, and has no tick", () => {
    const m = brain({ width: 5, height: 5, initialization: "blank" });
    m.setDrawing(true, 2);
    m.beginBrush({ x: 0, y: 0 });
    m.moveBrush({ x: 1, y: 0 });
    m.endBrush();
    expect(m.read().counts.refractory).toBe(2);
    m.beginBrush({ x: 0, y: 0 });
    m.moveBrush({ x: 1, y: 0 });
    m.endBrush();
    expect(m.read().counts.refractory).toBe(0);
    expect(m.read().tick).toBe(0);
  });
  test("cyclic source presets and both radius geometries are distinct", () => {
    expect(cyclicOffsets(2, "Moore")).toHaveLength(24);
    expect(cyclicOffsets(2, "von Neumann")).toHaveLength(12);
    expect(Object.keys(presets)).toHaveLength(20);
    const m = cyclic({ width: 9, height: 9, preset: "diamond spirals" });
    expect(m.read().parameters).toMatchObject({
      radius: 1,
      threshold: 1,
      numStates: 14,
      neighborhood: "von Neumann",
    });
    expect(m.read().colorList).toHaveLength(14);
  });
  test("cyclic updates synchronously and impossible threshold freezes source states", () => {
    const m = cyclic({
      width: 5,
      height: 5,
      preset: "custom",
      radius: 1,
      numStates: 3,
      threshold: 9,
    });
    const before = m.read();
    m.advance();
    expect(m.read().cells).toEqual(before.cells);
    expect(m.read().warning).not.toBe("");
    m.setThreshold(1);
    m.setCells(m.read().cells.map((c) => (c.x === 2 && c.y === 0 ? 1 : 0)));
    m.advance();
    expect(m.read().cells.find((c) => c.x === -2 && c.y === 0)!.state).toBe(1);
  });
  test("invalid live updates and fixtures are atomic, observations leave RNG/time untouched", () => {
    const models = [
      elementary({ width: 9, height: 5 }),
      continuous({ width: 9, height: 5 }),
      stochastic({ width: 9, height: 5 }),
      brain({ width: 5, height: 5 }),
      cyclic({ width: 5, height: 5 }),
    ];
    for (const m of models) {
      const before = m.read();
      expect(m.read()).toEqual(before);
      expect(() => m.advance(-1)).toThrow();
      expect(m.read()).toEqual(before);
    }
    const b = brain({ width: 5, height: 5 });
    const before = b.read();
    expect(() => b.setCells(Array(25))).toThrow();
    expect(b.read()).toEqual(before);
    const e = elementary({ width: 9, height: 5 });
    const old = e.read();
    expect(() => e.setRules({ rule: 256 })).toThrow();
    expect(e.read()).toEqual(old);
  });
});
