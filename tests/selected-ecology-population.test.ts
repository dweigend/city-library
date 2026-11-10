import { test, expect } from "bun:test";
import { create as birth } from "../models/simple-birth-rates/model.ts";
import { create as daisy } from "../models/daisyworld/model.ts";
import { create as termites } from "../models/termites/model.ts";
import { create as shepherds } from "../models/shepherds/model.ts";
import { create as rabbits } from "../models/rabbits-grass-weeds/model.ts";

test("birth source odd-capacity split, empty go and experiment restart", () => {
  const m = birth({ carryingCapacity: 1, redFertility: 0, blueFertility: 0 });
  expect(m.read().blueCount).toBe(1);
  m.advance(4);
  expect(m.read().tick).toBe(4);
  m.advanceUntilRestart();
  expect(m.read().tick).toBe(0);
  expect(m.read().output).toEqual(["red extinct after 5 generations"]);
  expect(m.read().blueCount).toBe(1);
});
test("birth mortality is independent sampling rather than exact culling", () => {
  const sizes = new Set<number>();
  for (let seed = 1; seed <= 10; seed++) {
    const m = birth({ carryingCapacity: 20, seed });
    m.advance();
    sizes.add(m.read().redCount + m.read().blueCount);
  }
  expect(sizes.size).toBeGreaterThan(1);
});
test("daisy source setup counts and captured albedo; interventions preserve tick", () => {
  const m = daisy();
  expect(m.read().blackCount).toBe(168);
  expect(m.read().whiteCount).toBe(168);
  const b = m.read().daisies.find((a) => a.kind === "black")!;
  m.setRules({ albedoBlacks: 0.9 });
  expect(m.read().daisies.find((a) => a.id === b.id)!.albedo).toBe(0.25);
  m.removeAllDaisies();
  m.paint(0, 0, "add-black");
  expect(m.read().daisies[0]!.albedo).toBe(0.9);
  expect(m.read().tick).toBe(0);
  m.paint(0, 0, "add-white");
  expect(m.read().whiteCount).toBe(0);
  m.paint(0, 0, "remove");
  expect(m.read().blackCount).toBe(0);
});
test("daisy nonpositive absorbed energy branch and scenario tick timing", () => {
  const m = daisy({ initialBlackDaisyCount: 0, initialWhiteDaisyCount: 0, albedoSurface: 1 });
  expect(m.read().globalTemperature).toBe(40);
  m.advance();
  expect(m.read().globalTemperature).toBe(60);
  const scenario = daisy({
    initialBlackDaisyCount: 0,
    initialWhiteDaisyCount: 0,
    scenario: "ramp-up-ramp-down",
  });
  scenario.advance(200);
  expect(scenario.read().parameters.solarLuminosity).toBe(0.8);
  scenario.advance();
  expect(scenario.read().parameters.solarLuminosity).toBe(0.805);
  expect(scenario.read().history.at(-1)!.luminosity).toBe(0.8);
});
test("termites conserve chips including carried chips on empty/full and default landscapes", () => {
  for (const density of [0, 20, 100]) {
    const m = termites({ termiteCount: 5, density, seed: 10 });
    const total = m.read().chipCount;
    m.advance(100);
    expect(m.read().chipCount + m.read().carryingCount).toBe(total);
    expect(m.read().tick).toBeNull();
    expect(m.read().work).toBe(100);
    for (const a of m.read().termites) {
      expect(a.x).toBeGreaterThanOrEqual(-100.5);
      expect(a.x).toBeLessThan(100.5);
    }
  }
});
test("shepherd carries same unique sheep, never deletes populations, samples efficiency at fifty", () => {
  const m = shepherds({ seed: 4 });
  const setup = m.read();
  m.advance(49);
  const s = m.read();
  expect(s.sheep.length).toBe(150);
  expect(s.shepherds.length).toBe(30);
  expect(s.history.length).toBe(1);
  expect(s.herdingEfficiency).toBe(setup.herdingEfficiency);
  const ids = s.shepherds.flatMap((a) =>
    a.carriedSheep ? [a.carriedSheep] : [],
  );
  expect(new Set(ids).size).toBe(ids.length);
  expect(s.sheep.filter((a) => a.hidden).length).toBe(ids.length);
  for (const p of s.shepherds) {
    if (p.carriedSheep) {
      const sheep = s.sheep.find((a) => a.id === p.carriedSheep)!;
      expect([sheep.x, sheep.y]).toEqual([p.x, p.y]);
    }
  }
  m.advance();
  expect(m.read().history.at(-1)!.tick).toBe(50);
});
test("rabbits stop before growth when extinct and die only below zero", () => {
  const empty = rabbits({ rabbitCount: 0 });
  empty.advance(10);
  expect(empty.read().tick).toBe(0);
  const m = rabbits({ rabbitCount: 3, grassGrowRate: 0, weedsGrowRate: 0, seed: 4 });
  m.advance(30);
  expect(m.read().rabbits.length).toBe(0);
  expect(m.read().tick).toBeLessThanOrEqual(19);
});
test("rabbits use per-thousand growth and grass overwrites new weeds", () => {
  const m = rabbits({
    rabbitCount: 0,
    grassGrowRate: 20,
    weedsGrowRate: 20,
    seed: 99,
  });
  const s = m.read();
  expect(s.cells.filter((c) => c.cover === "grass").length).toBeGreaterThan(0);
  expect(s.cells.filter((c) => c.cover === "grass").length).toBeLessThan(100);
  expect(s.history[0]!.grassFieldCount).toBe(
    s.cells.filter((c) => c.cover === "grass").length / 4,
  );
});
test("observations are detached and do not draw RNG; live validation is atomic", () => {
  for (const m of [
    birth({ carryingCapacity: 5 }),
    daisy(),
    termites({ termiteCount: 1 }),
    shepherds({ sheepCount: 5 }),
    rabbits({ rabbitCount: 5 }),
  ]) {
    const s = m.read();
    expect(m.read()).toEqual(s);
  }
  const m = rabbits();
  const before = m.read();
  expect(() => m.setRules({ grassGrowRate: 21 })).toThrow();
  expect(m.read()).toEqual(before);
  expect(() => m.advance(-1)).toThrow();
  expect(m.read()).toEqual(before);
});
