import { test, expect } from "bun:test";
import { Random } from "city-library";
import { create as expectedValue } from "../models/expected-value/model.ts";
import { create as partition } from "../models/partition-permutation-distribution/model.ts";
import { create as centralLimit } from "../models/central-limit-theorem/model.ts";
import { create as combinations } from "../models/random-combinations-and-permutations/model.ts";
import { create as mandelbrot } from "../models/mandelbrot/model.ts";

test("Partition live target reduction preserves signed draws and rejected trial ticks", () => {
  const m = partition({ seed: 1 });
  m.advance();
  const total = m.read().runningTotal;
  expect(total).toBeGreaterThan(2);
  m.setRules({ targetTotal: 2 });
  m.advance(20);
  expect(m.read().tick).toBe(21);
  expect(m.read().runningTotal).toBe(total);
  expect(m.read().successCount).toBe(0);
  expect(
    m
      .read()
      .addends.slice(1)
      .some((n) => n < 0),
  ).toBe(true);
  expect(m.read().addends).toHaveLength(21);
  m.setRules({ targetTotal: total });
  m.advance();
  expect(m.read().successCount).toBe(1);
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
  expect(m.read().runCount).toBe(1);
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
    successCount: 100,
    diminishingSampleSpace: false,
    seed: 17,
  });
  m.advance(10000);
  const s = m.read();
  expect(s.successCount).toBe(100);
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
  const m = partition({ targetTotal: 72, successCount: 100, seed: 13 });
  m.advance(10000);
  const s = m.read();
  expect(s.successCount).toBe(100);
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
  expect(m.read().sampleCount).toBe(3);
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
  expect(m.read().sampleCount).toBe(0);
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
  expect(m.read().attemptCount).toBe(0);
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
  expect(s.attemptCount).toBe(1000);
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
  expect(s.stepCount).toBe(0);
  expect(s.combiSamples).toEqual([]);
  expect(s.attemptCount).toBeGreaterThan(0);
});
test("Mandelbrot only visits occupied patches and preserves c set at setup", () => {
  const empty = mandelbrot({ agentCount: 0 });
  empty.advance(4);
  expect(empty.read().tick).toBe(4);
  expect(empty.read().computedFieldCount).toBe(0);
  const m = mandelbrot({ agentCount: 1, seed: 17, throw: 0 });
  m.advance();
  let s = m.read();
  expect(s.iterationCount).toBe(1);
  expect(s.computedFieldCount).toBe(1);
  const p = s.fields.find((p) => p.counter > 0)!;
  expect(p.zReal).toBe(p.cReal);
  expect(p.zImaginary).toBe(p.cImaginary);
  m.setRules({ scaleFactor: 10 });
  m.advance(10);
  s = m.read();
  expect(s.setupScale).toBe(100);
  expect(
    s.fields.every((p) => p.cReal === p.x / 100 && p.cImaginary === p.y / 100),
  ).toBe(true);
  expect(
    s.agents.every(
      (t) => t.x >= -150.5 && t.x < 150.5 && t.y >= -150.5 && t.y < 150.5,
    ),
  ).toBe(true);
  m.hideAgents();
  expect(m.read().agents.every((t) => t.hidden)).toBe(true);
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

test("Canonical Expected Value grid, sampler membership and wrapped movement share one authority", () => {
  const m = expectedValue({ setupApart: false, seed: 17 });
  expect(m.grid.fields).toHaveLength(225);
  expect(m.world.grids).toHaveLength(1);
  expect(Object.is(m.world.grids[0], m.grid)).toBe(true);
  expect(m.world.agents).toHaveLength(1);
  const sampler = m.world.agents[0]!;
  expect(sampler.world).toBe(m.world);
  sampler.move({ to: { x: 7, y: 0 } });
  sampler.rotate({ towards: { x: 8, y: 0 } });
  sampler.move(1);
  expect(sampler.x).toBeCloseTo(-7, 10);
  const field = m.grid.fieldAt(sampler)!;
  expect(m.grid.agentsAt(field)).toEqual([sampler]);
  expect(m.grid.neighbors(field, { neighborhood: "faces" })).toHaveLength(4);
  expect(m.read().walker.x).toBe(sampler.x);
  const before = m.read();
  m.read();
  expect(m.read()).toEqual(before);
  m.advance(2);
  expect(m.world.tick.value).toBe(2);
  expect(m.read().tick).toBe(2);
  expect(m.grid.agentsAt(m.grid.fieldAt(sampler)!)).toEqual([sampler]);
});

test("Canonical CLT reset deletes actual Agents and retains the canonical Grid", () => {
  const m = centralLimit({ sampleSize: 1 });
  expect(m.grid.fields).toHaveLength(961);
  expect(m.world.grids).toHaveLength(1);
  expect(Object.is(m.world.grids[0], m.grid)).toBe(true);
  m.drawYourOwnPeople(0, 0);
  const person = m.world.agents[0]!;
  const first = m.grid.fieldAt(person)!;
  expect(m.grid.agentsAt(first)).toEqual([person]);
  person.move({ to: { x: 2, y: 3 } });
  expect(m.grid.agentsAt(first)).toEqual([]);
  expect(m.grid.agentsAt(m.grid.fieldAt(person)!)).toEqual([person]);
  expect(m.read().people[0]!.x).toBe(2);
  m.advance(2);
  expect(m.world.tick.value).toBe(2);
  expect(m.read().means).toEqual([17, 17]);
  m.setup();
  expect(person.alive).toBe(false);
  expect(person.world).toBeUndefined();
  expect(m.world.agents).toHaveLength(0);
  expect(m.grid.agentsAt(m.grid.fieldAt({ x: 2, y: 3 })!)).toEqual([]);
  expect(m.world.tick.value).toBe(0);
  expect(m.world.grids).toHaveLength(1);
  expect(Object.is(m.world.grids[0], m.grid)).toBe(true);
  m.drawYourOwnPeople(0, 0);
  expect(m.world.agents[0]!.id).not.toBe(person.id);
  expect(m.read().people[0]!.id).toBe("0"); // Source/display label, not identity.
});

test("Canonical Mandelbrot eagerly initializes every Field and shares moving occupancy", () => {
  const m = mandelbrot({ agentCount: 2, throw: 0 });
  expect(m.grid.fields).toHaveLength(90601);
  expect(m.world.grids).toHaveLength(1);
  expect(Object.is(m.world.grids[0], m.grid)).toBe(true);
  expect(
    m.grid.fields.every(
      (p) =>
        p.grid === m.grid &&
        p.counter === 0 &&
        p.zReal === 0 &&
        p.zImaginary === 0 &&
        p.cReal === p.x / 100 &&
        p.cImaginary === p.y / 100,
    ),
  ).toBe(true);
  expect(m.world.agents).toHaveLength(2);
  expect(m.world.agents.every((t) => t.world === m.world)).toBe(true);
  const [first, second] = m.world.agents;
  first!.move({ to: { x: 0, y: 0 } });
  second!.move({ to: { x: 0, y: 0 } });
  const field = m.grid.fieldAt(first!)!;
  expect(m.grid.agentsAt(field)).toEqual([first!, second!]);
  first!.move({ to: { x: 1, y: 0 } });
  expect(m.grid.agentsAt(field)).toEqual([second!]);
  expect(m.grid.agentsAt(m.grid.fieldAt(first!)!)).toEqual([first!]);
  m.advance();
  expect(m.world.tick.value).toBe(1);
  expect(m.read().tick).toBe(1);
});

test("Mandelbrot snapshots eligible occupants before shared-patch counter updates", () => {
  const m = mandelbrot({ agentCount: 3, throw: 0 });
  for (const agent of m.world.agents) agent.move({ to: { x: 0, y: 0 } });
  const field = m.grid.fieldAt({ x: 0, y: 0 })!;
  field.counter = 114;
  m.advance();
  expect(field.counter).toBe(117);
  expect(m.read().fields.find((p) => p.x === 0 && p.y === 0)!.counter).toBe(
    117,
  );
});

test("Mandelbrot hard-boundary jump rejects its destination before Agent mutation", () => {
  const m = mandelbrot({ agentCount: 1, throw: 10 });
  const agent = m.world.agents[0]!;
  agent.move({ to: { x: 149, y: 0 } });
  agent.rotate({ towards: { x: 150, y: 0 } });
  m.advance();
  expect(agent.x).toBeCloseTo(150, 10);
  expect(agent.y).toBeCloseTo(0, 10);
  expect(m.grid.agentsAt(m.grid.fieldAt(agent)!)).toEqual([agent]);
});

test("Partition and symbolic combination own only a public World clock", () => {
  const p = partition({ successCount: 0 });
  p.advance(20);
  expect(p.world.tick.value).toBe(0);
  p.setRules({ successCount: 100 });
  p.advance(3);
  expect(p.read().tick).toBe(p.world.tick.value);
  expect(p.world.tick.value).toBe(3);
  const c = combinations({ dice: false });
  c.createCombi();
  c.finishCombi();
  c.advance(120);
  expect(c.read().attemptCount).toBe(120);
  expect(c.read().tick).toBe(c.world.tick.value);
  expect(c.world.tick.value).toBe(0);
  expect(c.world.agents).toHaveLength(0);
  expect(c.world.grids).toHaveLength(0);
});

test("Mandelbrot preflight relocates at clipped and exact-positive-edge source endpoints", () => {
  for (const x of [150.4, 149.5]) {
    const m = mandelbrot({ agentCount: 1, throw: 0, seed: 17 });
    const agent = m.world.agents[0]!;
    agent.move({ to: { x, y: 0 } });
    agent.rotate({ towards: { x: x + 1, y: 0 } });
    const expected = Random.create({ seed: 17 });
    expected.state = m.read().randomState;
    const nextX = expected.number() * 301 - 150.5,
      nextY = expected.number() * 301 - 150.5;
    m.advance();
    expect(agent.x).toBe(nextX);
    expect(agent.y).toBe(nextY);
    expect(m.grid.agentsAt(m.grid.fieldAt(agent)!)).toEqual([agent]);
  }
});

test("Mandelbrot preflight rejects a negative epsilon escape without the former distance tolerance", () => {
  const m = mandelbrot({ agentCount: 1, throw: 0, seed: 17 });
  const agent = m.world.agents[0]!;
  agent.move({ to: { x: -149.50000000005, y: 0 } });
  agent.rotate({ towards: { x: -150.50000000005, y: 0 } });
  const expected = Random.create({ seed: 17 });
  expected.state = m.read().randomState;
  const nextX = expected.number() * 301 - 150.5;
  const nextY = expected.number() * 301 - 150.5;
  m.advance();
  expect(agent.x).toBe(nextX);
  expect(agent.y).toBe(nextY);
  expect(agent.x).not.toBe(-150.5);
  expect(m.grid.agentsAt(m.grid.fieldAt(agent)!)).toEqual([agent]);
  expect(m.world.tick.value).toBe(1);
});

test("Mandelbrot preflight accepts each exact negative endpoint without relocation draws", () => {
  for (const axis of ["x", "y"] as const) {
    const m = mandelbrot({ agentCount: 1, throw: 0, seed: 17 });
    const agent = m.world.agents[0]!;
    agent.move({
      to: axis === "x" ? { x: -149.5, y: 0 } : { x: 0, y: -149.5 },
    });
    agent.rotate({
      towards: axis === "x" ? { x: -150.5, y: 0 } : { x: 0, y: -150.5 },
    });
    const expected = Random.create({ seed: 17 });
    expected.state = m.read().randomState;
    // With one turtle, only wiggle draws: no shuffle draw or random relocation.
    expected.number();
    expected.number();
    m.advance();
    expect(agent[axis]).toBe(-150.5);
    expect(m.read().randomState).toEqual(expected.state);
    expect(m.grid.agentsAt(m.grid.fieldAt(agent)!)).toEqual([agent]);
    expect(m.world.tick.value).toBe(1);
  }
});
