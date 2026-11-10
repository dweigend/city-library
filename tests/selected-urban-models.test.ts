import { expect, test } from "bun:test";
import { Random } from "city-library";
import { create as awareness } from "../models/urban-suite-awareness/model.ts";
import { create as pollution } from "../models/urban-suite-pollution/model.ts";
import { create as recycling } from "../models/urban-suite-recycling/model.ts";

test("Awareness freezes senders but reselects recipients and excludes transient negative awareness", () => {
  const model = awareness({ people: 0, centers: 0 });
  model.setPeople([11, 10, 1, 0].map(value => ({ x: 0, y: -0.5, heading: 0, awareness: value })));
  model.advance();
  // After black-land losses only the first person sends. The second reaches10,
  // but cannot send in this phase; the fourth's temporary−1 excludes it.
  expect(model.read().people.map(person => person.awareness)).toEqual([10, 10, 1, 0]);
  expect(model.read().counts).toEqual({ activists: 0, wellInformed: 2, aware: 0, unaware: 2, centers: 0 });
});

test("Awareness uses the even-height half-cell torus and moves before changing heading", () => {
  const model = awareness({ people: 0, centers: 0 });
  model.setPeople([{ x: 0, y: 18.75, heading: 0, awareness: 0 }]);
  model.setCenters([{ x: 0, y: -18.5, kind: "original", nonUsage: 100 }]);
  model.advance();
  expect(model.read().people[0]!.x).toBe(0);
  expect(model.read().people[0]!.y).toBe(-18.25);
  expect(model.read().people[0]!.awareness).toBe(5);
  expect(model.read().cells.find(field => field.center !== null)?.nonUsage).toBe(0);
  const before = model.read();
  expect(() => model.placeCenter({ x: 0, y: 0 })).toThrow();
  expect(model.read()).toEqual(before);
});

test("Awareness center expiry is strict, painting retains age and empty means are explicit", () => {
  const model = awareness({ people: 0, centers: 0, nonUsageLimit: 5 });
  model.setCenters([{ x: 0, y: 0.5, kind: "created", nonUsage: 4 }]);
  model.advance();
  expect(model.read().counts.centers).toBe(1);
  expect(model.read().meanNonUsage).toBe(5);
  const rng = model.read().randomState;
  model.placeCenter({ x: 0, y: 0.5 });
  expect(model.read().cells.find(field => field.x === 0 && field.y === 0.5)).toMatchObject({ center: "original", nonUsage: 5 });
  expect(model.read().randomState).toEqual(rng);
  model.advance();
  expect(model.read().meanNonUsage).toBeNull();
  expect(model.read().meanAwareness).toBeNull();
  expect(model.read().done).toBe(false);
});

test("Pollution new people wait until next tick, while newly planted trees immediately clean", () => {
  // Independent Mulberry draws from seed13 are .5663,.3601,.07059,.04817:
  // two turns, successful birth<.2, successful planting<.1.
  const model = pollution({ seed: 13, initialPopulation: 0, powerPlants: 0, birthRate: 0.2, plantingRate: 0.1 });
  model.setPeople([{ x: 0, y: 0, heading: 0, health: 5 }]);
  model.setEnvironment(model.read().cells.map(() => ({ pollution: 0.5, powerPlant: false })));
  model.advance();
  const observed = model.read();
  expect(observed.counts).toEqual({ people: 2, trees: 1, powerPlants: 0 });
  expect(observed.people.map(person => person.health)).toEqual([4.9, 5]);
  expect(observed.trees[0]!.health).toBe(4.9);
  expect(observed.people[0]!.x).toBe(observed.people[1]!.x);
  expect(observed.trees[0]!.x).toBe(observed.people[0]!.x);
  const local = observed.cells.find(field => Math.abs(field.x - observed.trees[0]!.x) < 0.5 && Math.abs(field.y - observed.trees[0]!.y) < 0.5)!;
  expect(local.pollution).toBe(0);
  expect(observed.totalPollution).toBeCloseTo(4473 * 0.5 - 9 * 0.5, 9);
});

test("Pollution strict exposure and health thresholds preserve whole-person ordering", () => {
  for (const [concentration, expected] of [[0.5, 0.9], [0.500001, 0.8499999]] as const) {
    const model = pollution({ initialPopulation: 0, powerPlants: 0, birthRate: 0, plantingRate: 0 });
    model.setPeople([{ x: 0, y: 0, heading: 0, health: 1 }]);
    model.setEnvironment(model.read().cells.map(() => ({ pollution: concentration, powerPlant: false })));
    model.advance();
    expect(model.read().people[0]!.health).toBeCloseTo(expected, 12);
  }
  // Same successful-birth seed as above; health after walking is4, so no birth.
  const threshold = pollution({ seed: 13, initialPopulation: 0, powerPlants: 0, birthRate: 0.2, plantingRate: 0 });
  threshold.setPeople([{ x: 0, y: 0, heading: 0, health: 4.1 }]);
  threshold.advance();
  expect(threshold.read().counts.people).toBe(1);
});

test("Pollution deaths still allow planting and final-tick cleanup, then preflight freezes everything", () => {
  // Seed2149: third draw .2414, so use seed13's third .07059 for planting
  // after birth is skipped because the parent health has already expired.
  const model = pollution({ seed: 13, initialPopulation: 0, powerPlants: 0, plantingRate: 0.1 });
  model.setPeople([{ x: 0, y: 0, heading: 0, health: 0.1 }]);
  model.setEnvironment(model.read().cells.map(() => ({ pollution: 0.5, powerPlant: false })));
  model.advance();
  expect(model.read().counts).toEqual({ people: 0, trees: 1, powerPlants: 0 });
  expect(model.read().trees[0]!.health).toBe(4.9);
  expect(model.read().tick).toBe(1);
  const final = model.read();
  model.advance(20);
  expect(model.read()).toEqual(final);
});

test("Pollution Moore diffusion wraps an impulse and live plant rates wait for the next plant phase", () => {
  const model = pollution({ initialPopulation: 0, powerPlants: 0, birthRate: 0, plantingRate: 0 });
  model.setPeople([{ x: 10, y: 10, heading: 0, health: 5 }]);
  model.setEnvironment(model.read().cells.map(field => ({ pollution: field.x === 35 && field.y === 31 ? 8 : 0, powerPlant: false })));
  model.advance();
  const result = model.read();
  expect(result.totalPollution).toBeCloseTo(8, 12);
  expect(result.cells.find(field => field.x === -35 && field.y === -31)!.pollution).toBeCloseTo(0.8, 12);
  model.setEnvironment(result.cells.map(field => ({ pollution: 0, powerPlant: field.x === 0 && field.y === 0 })));
  model.setRules({ pollutingRate: 5 });
  expect(model.read().totalPollution).toBe(0);
  model.advance();
  expect(model.read().totalPollution).toBe(5);
});

test("Recycling quantizes regeneration and preserves the conditional waste draw", () => {
  const restored = recycling({ seed: 183, numRecyclers: 0, numWastefuls: 0, resourceRegeneration: 25 });
  restored.setResources(restored.read().cells.map(field => field.x === 0 && field.y === 0 ? "recycled" : "new"));
  restored.advance();
  // First draw .027219: integer100=2<2.5 passes, continuous2.7219 would fail.
  expect(restored.read().landPercentages.new).toBe(100);

  const waste = recycling({ seed: 2149, numRecyclers: 0, numWastefuls: 0, resourceRegeneration: 25 });
  waste.setResources(waste.read().cells.map(field => field.x === 0 && field.y === 0 ? "waste" : "new"));
  waste.advance();
  // First integer5=0; second draw .025202 gives integer100=2, also passing.
  expect(waste.read().landPercentages.new).toBe(100);

  const noTrial = recycling({ seed: 1, numRecyclers: 0, numWastefuls: 0 });
  noTrial.setResources(noTrial.read().cells.map(field => field.x === 0 && field.y === 0 ? "waste" : "new"));
  noTrial.advance();
  const stream = Random.create({ seed: 1 });
  expect(stream.number()).toBeGreaterThan(0.2);
  expect(noTrial.read().randomState).toEqual(stream.state); // first trial fails; no second draw
  expect(noTrial.read().landPercentages.waste).toBeCloseTo(100 / 1225, 12);
});

test("Recycling zero regeneration still consumes source trials and empty populations keep ticking", () => {
  const model = recycling({ seed: 183, numRecyclers: 0, numWastefuls: 0, resourceRegeneration: 0 });
  model.setResources(model.read().cells.map(field => field.x === 0 && field.y === 0 ? "recycled" : "new"));
  model.advance();
  const stream = Random.create({ seed: 183 }); stream.number();
  expect(model.read().randomState).toEqual(stream.state);
  expect(model.read().landPercentages.recycled).toBeCloseTo(100 / 1225, 12);
  expect(model.read().tick).toBe(1);
  expect(model.read().done).toBe(false);
});

test("Recycling seeking crosses the torus, harvests origin first and refuses over-cap consumption", () => {
  const model = recycling({ numRecyclers: 0, numWastefuls: 0, resourceRegeneration: 0, agentsSeekResources: true });
  model.setResources(model.read().cells.map(field => field.x === -17 && field.y === 0 ? "new" : "waste"));
  model.setPeople([{ kind: "wasteful", x: 17, y: 0, heading: 0, energy: 1 }]);
  model.advance();
  expect(model.read().people[0]).toMatchObject({ x: -17, y: 0, heading: 90, energy: 0 });
  expect(model.read().cells.find(field => field.x === -17 && field.y === 0)!.resource).toBe("new");

  model.setPeople([{ kind: "wasteful", x: 0, y: 0, heading: 0, energy: 49 }]);
  model.setResources(model.read().cells.map(() => "new"));
  model.advance();
  expect(model.read().people[0]!.energy).toBe(48);
  expect(model.read().landPercentages.new).toBe(100);
});

test("Urban models isolate pure detached observations and retain setup plus the latest1000 ticks", () => {
  for (const model of [awareness({ people: 0, centers: 0 }), recycling({ numRecyclers: 0, numWastefuls: 0 })]) {
    const before = model.read();
    expect(model.read()).toEqual(before);
    expect(Object.isFrozen(before.cells[0])).toBe(true);
    model.advance(1002);
    expect(before.tick).toBe(0);
    expect(model.read().history.length).toBe(1001);
    expect(model.read().history[0]!.tick).toBe(0);
    expect(model.read().history[1]!.tick).toBe(3);
    expect(model.read().history.at(-1)!.tick).toBe(1002);
  }
});

test("Urban fixtures and live updates reject malformed data atomically without running accessors", () => {
  const a = awareness(), p = pollution(), r = recycling();
  let invoked = false;
  const getter = Object.defineProperty({}, "nonUsageLimit", { enumerable: true, get() { invoked = true; return 5; } });
  const mutations = [
    () => a.setRules(getter),
    () => a.setPeople([{ x: 0, y: 0, heading: 0, awareness: 5 }, { x: 0, y: 19, heading: 0, awareness: 5 }]),
    () => a.setCenters([{ x: 0, y: 0.5, kind: "original", nonUsage: 0 }, { x: 0, y: 0.5, kind: "created", nonUsage: 0 }]),
    () => p.setTrees([{ x: 0, y: 0, heading: 0, health: 5 }, { x: 0, y: Infinity, heading: 0, health: 5 }]),
    () => p.setEnvironment(Array.from({ length: 4473 }, () => ({ pollution: Number.MAX_VALUE, powerPlant: false }))),
    () => r.setPeople([{ kind: "recycler", x: 0.5, y: 0, heading: 0, energy: 5 }]),
    () => r.setResources(new Array(1225)),
    () => r.setRules({ maxStoredEnergy: 11 }),
    () => r.advance(-1),
  ];
  for (const mutate of mutations) {
    const before = [a.read(), p.read(), r.read()];
    expect(mutate).toThrow();
    expect([a.read(), p.read(), r.read()]).toEqual(before);
  }
  expect(invoked).toBe(false);
});
