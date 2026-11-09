import { test, expect } from "bun:test";
import { create as sandpile } from "../models/sandpile/model.ts";
import { create as ising } from "../models/ising/model.ts";
import { create as sand } from "../models/sand/model.ts";
import { create as solid } from "../models/solid-diffusion/model.ts";

test("sandpile deterministic open avalanche oracle and pure exploration", () => {
  const model = sandpile({
    width: 3,
    height: 3,
    initial: "uniform",
    grainsPerField: 3,
    dropLocation: "center",
  });
  const state = model.read();
  const result = model.exploreAt(0, 0);
  expect(result.size).toBe(9);
  expect(result.lifetime).toBe(3);
  expect(model.read().randomState).toEqual(state.randomState);
  model.advance();
  expect(model.read().cells.map((c) => c.n)).toEqual([
    1, 3, 1, 3, 0, 3, 1, 3, 1,
  ]);
  expect(model.read().total).toBe(16);
  expect(model.read().average).toBe(16 / 9);
  const snapshot = model.read();
  expect(() => model.dropAt(10, 0)).toThrow();
  expect(model.read()).toEqual(snapshot);
});

test("Ising exact energy branches and default widgets", () => {
  const defaults = ising({ width: 3, height: 3 });
  expect(defaults.read().parameters.temperature).toBe(2.27);
  expect(defaults.read().parameters.probabilityOfSpinUp).toBe(50);
  const m = ising({
    width: 3,
    height: 3,
    temperature: 0,
    probabilityOfSpinUp: 100,
  });
  const before = m.read().randomState;
  expect(m.updateAt(0, 0)).toBe(false);
  expect(m.read().randomState).toEqual(before);
  const values = m.read().cells.map((c) => (c.x === 0 && c.y === 0 ? -1 : 1));
  m.setSpins(values);
  expect(m.updateAt(0, 0)).toBe(true);
  expect(m.read().sumOfSpins).toBe(9);
  const saved = m.read();
  expect(() => m.setSpins([0])).toThrow();
  expect(m.read()).toEqual(saved);
  m.advance(2);
  expect(m.read().tick).toBe(2000);
  expect(m.read().magnetization).toBe(1);
});

test("Sand snapshots read old colors, spout precedes movement and dump does not tick", () => {
  const m = sand({ width: 9, height: 9, releaseChance: 0, density: 0 });
  m.setSand([{ x: 0, y: 2 }]);
  m.moveAllSand();
  expect(
    m
      .read()
      .cells.filter((c) => c.status === "sand")
      .map((c) => [c.x, c.y]),
  ).toEqual([[0, 1]]);
  const tick = m.read().tick;
  m.dumpSand();
  expect(m.read().tick).toBe(tick);
  // X wrapping is inherited from public Grid field lookup; grain moves down at edge.
  m.setSand([{ x: 4, y: 2 }]);
  m.moveAllSand();
  expect(m.read().cells.find((c) => c.x === 4 && c.y === 1)!.status).toBe(
    "sand",
  );
  const saved = m.read();
  expect(() => m.setSand([{ x: 0, y: -4 }])).toThrow();
  expect(m.read()).toEqual(saved);
});

test("Solid diffusion preserves canonical atomic identities, species and exclusion", () => {
  const m = solid({ width: 5, height: 3, seed: 22 });
  const before = m.read();
  const ids = before.atoms.map((a) => a.id).sort();
  m.advance(100);
  const after = m.read();
  expect(after.atoms.map((a) => a.id).sort()).toEqual(ids);
  expect(after.atoms.filter((a) => a.color === "green").length).toBe(6);
  expect(after.atoms.filter((a) => a.color === "blue").length).toBe(6);
  expect(after.vacancies).toBe(3);
  expect(new Set(after.atoms.map((a) => `${a.x},${a.y}`)).size).toBe(12);
  m.setAtoms([
    { x: -1, y: 0, color: "green" },
    { x: 2, y: 0, color: "blue" },
  ]);
  m.moveAtomToHere(0, 0);
  expect(m.read().atoms.find((a) => a.color === "green")!.x).toBe(0);
  expect(m.read().tick).toBe(0);
  const state = m.read();
  expect(() =>
    m.setAtoms([
      { x: 0, y: 0, color: "green" },
      { x: 0, y: 0, color: "blue" },
    ]),
  ).toThrow();
  expect(m.read()).toEqual(state);
});

// Source's cellular proposals may merge; a conservation fix would change the model.
test("Sand simultaneous proposals deliberately coalesce competing grains", () => {
  const m = sand({ width: 9, height: 9, releaseChance: 0 });
  m.setSand([
    { x: -1, y: 1 },
    { x: 1, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 2, y: 0 },
  ]);
  m.moveAllSand();
  expect(m.read().cells.filter((c) => c.status === "sand").length).toBe(5);
  expect(m.read().cells.find((c) => c.x === 0 && c.y === 0)!.status).toBe(
    "sand",
  );
});
