import { expect, test } from "bun:test";
import { create } from "../experiments/segregation/model.ts";

test("similarity is weighted by neighbor links, and threshold uses occupied neighbors only", () => {
  const model = create({ width: 7, height: 5, similarWanted: 60 });
  model.setResidents([
    { x: -2, y: 0, group: "blue" },
    { x: -1, y: 0, group: "blue" },
    { x: 0, y: 0, group: "blue" },
    { x: 1, y: 0, group: "orange" },
  ]);
  const state = model.read();
  expect(state.percentSimilar).toBe(100 * 4 / 6);
  expect(state.percentSimilar).not.toBe(62.5);
  expect(state.residents.map(({ happy }) => happy)).toEqual([true, true, false, false]);
  expect(state.counts.unhappy).toBe(2);
});

test("Moore neighborhoods wrap across both edges and isolated residents are happy", () => {
  const model = create({ width: 5, height: 5, similarWanted: 100 });
  model.setResidents([
    { x: -2, y: -2, group: "blue" },
    { x: 2, y: 2, group: "blue" },
    { x: 0, y: 0, group: "orange" },
  ]);
  const state = model.read();
  expect(state.residents.map(({ similarNearby, otherNearby }) => [similarNearby, otherNearby]))
    .toEqual([[1, 0], [1, 0], [0, 0]]);
  expect(state.residents.every(({ happy }) => happy)).toBe(true);
  const rng = state.randomState;
  model.advance(100);
  expect(model.read().tick).toBe(0);
  expect(model.read().randomState).toEqual(rng);
});

test("full unhappy grid reports no-vacancy without moving or consuming RNG", () => {
  const model = create({ width: 3, height: 3, similarWanted: 100 });
  model.setResidents(Array.from({ length: 9 }, (_, index) => ({
    x: index % 3 - 1,
    y: Math.floor(index / 3) - 1,
    group: index % 2 === 0 ? "blue" as const : "orange" as const,
  })));
  const before = model.read();
  expect(before.stopReason).toBe("no-vacancy");
  expect(before.counts.unhappy).toBe(9);
  model.advance(10);
  expect(model.read()).toEqual(before);
  model.setRules({ similarWanted: 0 });
  expect(model.read().stopReason).toBe("all-happy");
  expect(model.read().randomState).toEqual(before.randomState);
});

test("live threshold intervention restarts a stable state and records one sample per tick", () => {
  const model = create({ width: 5, height: 5, similarWanted: 0, seed: 123 });
  model.setResidents([{ x: 0, y: 0, group: "blue" }, { x: 1, y: 0, group: "orange" }]);
  expect(model.read().done).toBe(true);
  model.setRules({ similarWanted: 100 });
  expect(model.read().done).toBe(false);
  expect(model.read().history.length).toBe(1);
  model.advance();
  const state = model.read();
  expect(state.tick).toBe(1);
  expect(state.history.map(({ tick }) => tick)).toEqual([0, 1]);
  expect(state.history.at(-1)?.unhappy).toBe(state.counts.unhappy);
  model.setRules({ similarWanted: 0 });
  expect(model.read().history.map(({ tick }) => tick)).toEqual([0, 1]);
  expect(model.read().history.at(-1)?.unhappy).toBe(0);
});

test("random-walk relocation is repeatable and keeps canonical identities and exclusive cells", () => {
  const first = create({ width: 7, height: 5, seed: 35, similarWanted: 100, density: 50 });
  const second = create({ width: 7, height: 5, seed: 35, similarWanted: 100, density: 50 });
  const initial = first.read();
  first.advance(8);
  second.advance(8);
  const state = first.read();
  expect(state.residents.map(({ id, group }) => [id, group]))
    .toEqual(initial.residents.map(({ id, group }) => [id, group]));
  expect(state.residents.map(({ x, y, group, happy }) => [x, y, group, happy]))
    .toEqual(second.read().residents.map(({ x, y, group, happy }) => [x, y, group, happy]));
  expect(state.randomState).toEqual(second.read().randomState);
  expect(new Set(state.residents.map(({ x, y }) => `${x},${y}`)).size).toBe(state.counts.population);
  expect(state.residents.every(({ x, y }) => Number.isInteger(x) && Number.isInteger(y))).toBe(true);
});

test("invalid interventions are atomic and repeated detached observations consume no RNG", () => {
  const model = create({ width: 4, height: 4 });
  model.setResidents([{ x: -0.5, y: 0.5, group: "blue" }]);
  const before = model.read();
  expect(before.percentSimilar).toBe(0);
  expect(before.percentUnhappy).toBe(0);
  const badInputs: unknown[] = [
    [{ x: 0, y: 0, group: "blue" }],
    [{ x: 99.5, y: 0.5, group: "blue" }],
    [{ x: -0.5, y: 0.5, group: "blue" }, { x: -0.5, y: 0.5, group: "orange" }],
    [{ x: -0.5, y: 0.5, group: "green" }],
    [{ x: -0.5, y: 0.5, get group() { throw new Error("not data"); } }],
    Array(1),
    null,
  ];
  for (const values of badInputs) {
    expect(() => model.setResidents(values as never)).toThrow();
    expect(model.read()).toEqual(before);
  }
  expect(() => model.setRules({ similarWanted: 101 })).toThrow();
  expect(() => model.setRules({ get similarWanted() { return 0; } })).toThrow();
  expect(() => model.setRules({ density: 50 } as never)).toThrow();
  expect(() => model.advance(1.5)).toThrow();
  expect(model.read()).toEqual(before);
  expect(Object.isFrozen(before.residents[0])).toBe(true);
  expect(Object.isFrozen(before.history[0])).toBe(true);
  model.setResidents([]);
  expect(model.read().randomState).toEqual(before.randomState);
  expect(model.read().done).toBe(true);
});
