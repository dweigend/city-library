import { expect, test } from "bun:test";
import { Random } from "city-library";
import { create as structureOne } from "../models/urban-suite-structure-from-randomness-1/model.ts";
import { create as structureTwo } from "../models/urban-suite-structure-from-randomness-2/model.ts";

function withoutIds<T extends { readonly cells: readonly { readonly id: string }[] }>(state: T) {
  return { ...state, cells: state.cells.map(({ id: _id, ...cell }) => cell) };
}

test("Structure1 stages the old four-face field and preserves total without normalization", () => {
  const model = structureOne();
  model.setActivities(model.read().cells.map(cell => cell.x === -64.5 && cell.y === -64.5 ? 5 : 0));
  const ids = model.read().cells.map(cell => cell.id), stream = model.read().randomState;
  model.advance();
  const state = model.read();
  expect(state.cells.filter(cell => cell.activity === 1).map(cell => [cell.x, cell.y]).sort())
    .toEqual([[-64.5,-64.5],[-63.5,-64.5],[64.5,-64.5],[-64.5,-63.5],[-64.5,64.5]].sort());
  expect(state.totalActivity).toBe(5);
  expect(state.cells.filter(cell => cell.activity === 1).every(cell => cell.colorNumber === 9.9)).toBe(true);
  expect(state.cells.filter(cell => cell.activity === 0).every(cell => cell.colorNumber === 5)).toBe(true);
  model.advance(7);
  expect(model.read().totalActivity).toBeCloseTo(5, 11);
  expect(model.read().randomState).toEqual(stream);
  expect(model.read().cells.map(cell => cell.id)).toEqual(ids);
  expect(model.read().tick).toBe(8);
});

test("Structure1 naturally reaches a zero recolor error after committing activity but before tick", () => {
  const model = structureOne();
  // A five-color toroidal null mode: self and four faces contain exactly one
  // value4 and four values-1, so the source mean becomes exactly zero everywhere.
  model.setActivities(model.read().cells.map(cell => ((cell.x + 64.5) + 2 * (cell.y + 64.5)) % 5 === 0 ? 4 : -1));
  const prior = model.read();
  expect(() => model.advance()).toThrow("Division by zero");
  const failed = model.read();
  expect(failed.totalActivity).toBe(0);
  expect(failed.cells.every(cell => cell.activity === 0)).toBe(true);
  expect(failed.cells.map(cell => cell.colorNumber)).toEqual(prior.cells.map(cell => cell.colorNumber));
  expect(failed.tick).toBe(0);
  expect(failed.history).toEqual(prior.history); // no invented successful sample
  expect(failed.randomState).toEqual(prior.randomState);
  expect(() => model.advance()).toThrow("Division by zero");
  model.setRules({ keepAddingRandomness: true });
  model.advance();
  expect(model.read().cells.every(cell => Math.abs(cell.activity) === 1)).toBe(true);
  expect(model.read().tick).toBe(1);
});

test("Structure setup/noise consume explicit public choices and pure reads do not", () => {
  const one = structureOne({ seed: 19 }), two = structureTwo({ seed: 19 });
  const stream = Random.add({ seed: 19 });
  for (let i = 0; i < 16900; i++) stream.sample([-1, 1]);
  expect(one.read().randomState).toEqual(stream.state);
  expect(two.read().randomState).toEqual(stream.state);
  const before = one.read(); one.read(); one.advance(0);
  expect(one.read()).toEqual(before);
  one.setActivities(before.cells.map(() => 1));
  one.setRules({ keepAddingRandomness: true });
  one.advance(); two.advance();
  for (let i = 0; i < 16900; i++) stream.sample([1, -1]);
  expect(one.read().randomState).toEqual(stream.state);
  expect(two.read().randomState).toEqual(stream.state);
  expect(one.read().cells.every(cell => cell.activity === 0 || cell.activity === 2)).toBe(true);
});

test("Structure2 distinguishes current strict threshold counts, sticky marks and plot units", () => {
  const model = structureTwo({ threshold: 0 });
  expect(model.read().counts.currentAboveThreshold).toBeGreaterThan(0);
  expect(model.read().counts.activated).toBe(0);
  model.setPotentials(model.read().cells.map(() => 5));
  model.setRules({ threshold: 5 });
  expect(model.read().counts.currentAboveThreshold).toBe(0);
  expect(model.read().meanPotential).toBe(5);
  expect(model.read().meanPotentialTimesTen).toBe(50);
  model.setPotentials(model.read().cells.map(() => 12));
  model.setRules({ threshold: 10 });
  model.advance();
  expect(model.read().counts).toEqual({ currentAboveThreshold: 16900, activated: 16900 });
  model.setPotentials(model.read().cells.map(() => 0));
  const prior = model.read();
  model.advance();
  expect(model.read().counts).toEqual({ currentAboveThreshold: 0, activated: 16900 });
  expect(model.read().cells.every(cell => cell.potential === -1 || cell.potential === 1)).toBe(true);
  expect(model.read().cells.every(cell => cell.colorNumber === 9.9)).toBe(true);
  const stream = model.read().randomState;
  model.setActivations(model.read().cells.map(() => false));
  expect(model.read().counts.activated).toBe(0);
  expect(model.read().randomState).toEqual(stream);
  expect(model.read().tick).toBe(prior.tick + 1);
});

test("Structure2 stages the exact old field before independent signed additions", () => {
  const model = structureTwo({ seed: 6 });
  model.setPotentials(model.read().cells.map(cell => cell.x === -64.5 && cell.y === -64.5 ? 5 : 0));
  model.advance();
  const result = model.read();
  const faceKeys = new Set(["-64.5,-64.5", "-63.5,-64.5", "64.5,-64.5", "-64.5,-63.5", "-64.5,64.5"]);
  expect(result.cells.filter(cell => faceKeys.has(`${cell.x},${cell.y}`)).every(cell => [0,2].includes(cell.potential))).toBe(true);
  expect(result.cells.filter(cell => !faceKeys.has(`${cell.x},${cell.y}`)).every(cell => [-1,1].includes(cell.potential))).toBe(true);
  expect(result.tick).toBe(1);
});

test("Structure fixtures/rules reject unknown, sparse, accessor and invalid data atomically", () => {
  const one = structureOne(), two = structureTwo();
  let invoked = false;
  const accessor = Object.defineProperty({}, "threshold", { enumerable: true, get() { invoked = true; return 1; } });
  const values = one.read().cells.map(() => 1);
  const accessorValues = [...values];
  Object.defineProperty(accessorValues, "100", { get() { invoked = true; return 1; } });
  const mutations = [
    () => one.setActivities(values.map(() => 0)),
    () => one.setActivities(values.slice(1)),
    () => one.setActivities(accessorValues),
    () => one.setActivities(values.map((v,i) => i === 9000 ? NaN : v)),
    () => one.setRules({ seed: 2 } as never),
    () => one.advance(-1),
    () => two.setRules(accessor),
    () => two.setRules({ threshold: 0.15 }),
    () => two.setPotentials(new Array(16900)),
    () => two.setActivations(values as never),
  ];
  for (const mutate of mutations) {
    const beforeOne = one.read(), beforeTwo = two.read();
    expect(mutate).toThrow();
    expect(one.read()).toEqual(beforeOne);
    expect(two.read()).toEqual(beforeTwo);
  }
  expect(invoked).toBe(false);
});

test("Structure replay is independent, chunking invariant and deeply detached", () => {
  const a = structureOne({ seed: 42, keepAddingRandomness: true });
  const b = structureOne({ seed: 42, keepAddingRandomness: true });
  a.advance(3); b.advance(); b.read(); b.advance(2);
  expect(withoutIds(a.read())).toEqual(withoutIds(b.read()));
  const c = structureTwo({ seed: 42 }), d = structureTwo({ seed: 42 });
  c.advance(3); d.advance(); d.read(); d.advance(2);
  expect(withoutIds(c.read())).toEqual(withoutIds(d.read()));
  const prior = d.read(); c.advance();
  expect(d.read()).toEqual(prior);
  expect(Object.isFrozen(prior)).toBe(true);
  expect(Object.isFrozen(prior.cells)).toBe(true);
  expect(Object.isFrozen(prior.cells[0])).toBe(true);
  expect(Object.isFrozen(prior.history[0])).toBe(true);
  expect(Object.isFrozen(prior.history[0]!.counts)).toBe(true);
  expect(Object.isFrozen(prior.parameters)).toBe(true);
  expect(Object.isFrozen(prior.randomState)).toBe(true);
});
