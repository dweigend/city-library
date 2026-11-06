import { test, expect } from "bun:test";
import { create as expectedValue } from "../experiments/expected-value/model.ts";
import { create as partition } from "../experiments/partition-permutation-distribution/model.ts";
import { create as centralLimit } from "../experiments/central-limit-theorem/model.ts";
import { create as combinations } from "../experiments/random-combinations-and-permutations/model.ts";
import { create as mandelbrot } from "../experiments/mandelbrot/model.ts";

test("Partition live target reduction preserves signed draws and rejected trial ticks", () => {
  const m = partition({ seed: 1 });
  m.advance();
  const total = m.read().runningTotal;
  expect(total).toBeGreaterThan(2);
  m.setRules({ targetTotal: 2 });
  m.advance(20);
  expect(m.read().tick).toBe(21);
  expect(m.read().runningTotal).toBe(total);
  expect(m.read().successes).toBe(0);
  expect(m.read().addends.slice(1).some((n) => n < 0)).toBe(true);
  expect(m.read().addends).toHaveLength(21);
  m.setRules({ targetTotal: total });
  m.advance();
  expect(m.read().successes).toBe(1);
  expect(m.read().previous).toEqual([total]);
});

test("Expected Value retains setup's empty run and uses the frozen sample size", () => {
  const m = expectedValue({
    ratio0: 0,
    ratio1: 0,
    ratio2: 0,
    ratio3: 1,
    ratio4: 0,
    ratio5: 0,
    ratio6: 0,
    sampleSize: 4,
  });
  expect(m.read().runs).toBe(1);
  expect(m.read().totals).toEqual([0]);
  expect(m.read().expectedValue).toBe(12);
  m.advance(4);
  expect(m.read().totals).toEqual([0, 12, 12, 12, 12]);
  expect(m.read().mean).toBe(9.6);
  expect(m.read().values).toHaveLength(4);
  expect(m.read().populationCounts).toEqual([0, 0, 0, 225, 0, 0, 0]);
  m.clearSelection();
  expect(m.read().cells.every((t) => t.selected === 0)).toBe(true);
  expect(m.read().tick).toBe(4);
});
test("Expected Value tile allocation conserves all225 and the walk uses cardinal adjacent tiles", () => {
  const m = expectedValue({ seed: 17, setupApart: false, sampleSize: 20 });
  const initial = m.read();
  expect(initial.populationCounts.reduce((a, b) => a + b, 0)).toBe(225);
  expect(initial.cells.every((t) => t.value >= 0 && t.value <= 6)).toBe(true);
  m.advance();
  const s = m.read();
  expect(s.cells.reduce((n, t) => n + t.selected, 0)).toBe(20);
  expect(s.sampleTotal).toBe(s.values.reduce((a, b) => a + b, 0));
  expect(s.walker.x).toBeGreaterThanOrEqual(-7);
  expect(s.walker.y).toBeLessThanOrEqual(7);
  expect(() =>
    expectedValue({
      ratio0: 0,
      ratio1: 0,
      ratio2: 0,
      ratio3: 0,
      ratio4: 0,
      ratio5: 0,
      ratio6: 0,
    }),
  ).toThrow("Cannot set all");
});
test("Partition counts rejected overshoots as trials and stops at requested successes", () => {
  const m = partition({
    targetTotal: 2,
    numSuccesses: 100,
    diminishingSampleSpace: false,
    seed: 17,
  });
  m.advance(10000);
  const s = m.read();
  expect(s.successes).toBe(100);
  expect(s.done).toBe(true);
  expect(s.series.reduce((a, b) => a + b, 0)).toBe(s.tick);
  expect(s.addends).toHaveLength(s.tick);
  expect(s.previous.reduce((a, b) => a + b, 0)).toBe(2);
  expect(s.addends.reduce((a, b) => a + b, 0)).toBeGreaterThan(200);
  const before = m.read();
  m.advance();
  expect(m.read()).toEqual(before);
});
test("Diminishing partition sample space accepts every draw and no running total overshoots", () => {
  const m = partition({ targetTotal: 72, numSuccesses: 100, seed: 13 });
  m.advance(10000);
  const s = m.read();
  expect(s.successes).toBe(100);
  expect(s.addends.reduce((a, b) => a + b, 0)).toBe(7200);
  expect(s.current).toEqual([]);
});
test("CLT setup is empty, insufficient sampling does not tick, and presets preserve exact populations", () => {
  const m = centralLimit();
  expect(m.read().population).toBe(0);
  m.advance();
  expect(m.read().tick).toBe(0);
  expect(m.read().message).toContain("not enough");
  m.preset(1);
  expect(m.read().population).toBe(31 * 14);
  expect(m.read().parameters.maxValue).toBe(30);
  expect(m.read().expectedValue).toBe(15);
  m.preset(3);
  expect(m.read().population).toBe(16 * 30);
  expect(m.read().people.some((p) => p.x === -15)).toBe(true);
  m.preset(4);
  expect(m.read().population).toBe(60);
  m.advance(3);
  expect(m.read().numSamples).toBe(3);
  expect(m.read().people.filter((p) => p.chosen)).toHaveLength(10);
  expect(m.read().sums.every((sum, i) => sum === m.read().means[i]! * 10)).toBe(
    true,
  );
});
test("CLT manual population adds one turtle per column click up to ceiling, without reset", () => {
  const m = centralLimit({ sampleSize: 1 });
  for (let i = 0; i < 40; i++) m.drawYourOwnPeople(-2, 1);
  expect(m.read().population).toBe(30);
  m.drawYourOwnPeople(1, -15);
  expect(m.read().population).toBe(30);
  m.advance(3);
  expect(m.read().means).toEqual([13, 13, 13]);
  expect(m.read().stdDevMeans).toBe(0);
  m.createPopulation();
  expect(m.read().tick).toBe(0);
  expect(m.read().numSamples).toBe(0);
});
test("Combination guard, edits, ordered versus multiset matches and source zero ticks", () => {
  const m = combinations({
    seed: 17,
    width: 2,
    height: 1,
    dice: true,
    sampleSize: 100,
  });
  m.advance();
  expect(m.read().attempts).toBe(0);
  expect(m.read().instructions).toContain("pick dice");
  m.createCombi();
  m.assignColorOrImage(0);
  m.assignColorOrImage(1);
  m.assignColorOrImage(1);
  m.finishCombi();
  expect(m.read().original).toEqual([0, 1]);
  m.advance(1000);
  const s = m.read();
  expect(s.tick).toBe(0);
  expect(s.attempts).toBe(1000);
  expect(s.samplesCounter).toBe(10);
  expect(s.combiSamples).toHaveLength(10);
  expect(s.permisSamples.every((n, i) => n >= s.combiSamples[i]!)).toBe(true);
  expect(s.permisMean!).toBeGreaterThan(s.combiMean!);
  m.hideReveal();
  expect(m.read().hidden).toBe(true);
  m.hideReveal();
  expect(m.read().hidden).toBe(false);
  const before = m.read().original;
  m.createCombi();
  m.assignColorOrImage(0);
  expect(m.read().original).toEqual(before);
});
test("Combination single-success preserves source clearing of sample statistics", () => {
  const m = combinations({
    width: 1,
    height: 1,
    dice: false,
    singleSuccess: true,
  });
  m.createCombi();
  m.finishCombi();
  m.advance(100);
  const s = m.read();
  expect(s.done).toBe(true);
  expect(s.instructions).toContain("Congratulations");
  expect(s.countSteps).toBe(0);
  expect(s.combiSamples).toEqual([]);
  expect(s.attempts).toBeGreaterThan(0);
});
test("Mandelbrot only visits occupied patches and preserves c set at setup", () => {
  const empty = mandelbrot({ numTurtles: 0 });
  empty.advance(4);
  expect(empty.read().tick).toBe(4);
  expect(empty.read().computedPatches).toBe(0);
  const m = mandelbrot({ numTurtles: 1, seed: 17, throw: 0 });
  m.advance();
  let s = m.read();
  expect(s.iterations).toBe(1);
  expect(s.computedPatches).toBe(1);
  const p = s.patches.find((p) => p.counter > 0)!;
  expect(p.zReal).toBe(p.cReal);
  expect(p.zImaginary).toBe(p.cImaginary);
  m.setRules({ scaleFactor: 10 });
  m.advance(10);
  s = m.read();
  expect(s.setupScale).toBe(100);
  expect(
    s.patches.every((p) => p.cReal === p.x / 100 && p.cImaginary === p.y / 100),
  ).toBe(true);
  expect(
    s.turtles.every(
      (t) => t.x >= -150.5 && t.x < 150.5 && t.y >= -150.5 && t.y < 150.5,
    ),
  ).toBe(true);
  m.hideTurtles();
  expect(m.read().turtles.every((t) => t.hidden)).toBe(true);
});
test("All five expose independent deterministic detached snapshots and reject invalid step counts", () => {
  for (const create of [
    expectedValue,
    partition,
    centralLimit,
    combinations,
    mandelbrot,
  ]) {
    const a = create({ seed: 17 }),
      b = create({ seed: 17 });
    const before = a.read();
    expect(before).toEqual(b.read());
    a.advance(0);
    expect(a.read()).toEqual(before);
    expect(() => a.advance(-1)).toThrow(RangeError);
    expect(b.read()).toEqual(before);
  }
});
