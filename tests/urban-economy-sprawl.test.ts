import { describe, expect, test } from "bun:test";
import { create as sprawl } from "../models/urban-suite-sprawl-effect/model.ts";
import { create as economic } from "../models/urban-suite-economic-disparity/model.ts";

const origin = <T extends { readonly x: number; readonly y: number }>(cells: readonly T[]) => cells.find(cell => cell.x === 0 && cell.y === 0)!;

describe("Urban Suite Sprawl Effect public composition", () => {
  test("source patience and phase boundaries retain identity and move half a patch", () => {
    const model = sprawl({ population: 1, smoothness: 1, maxAttraction: 15, seekerPatience: 1, waitBetweenSeeking: 5 });
    model.setAttractions(model.read().cells.map(() => 0));
    model.setAgents([{ kind: "seeker", x: 0, y: 0, heading: 0, patienceCounter: 1, stayCounter: 0 }]);
    const id = model.read().agents[0]!.id;
    model.advance();
    let state = model.read();
    expect(state.agents[0]).toMatchObject({ id, kind: "seeker", x: 0, y: 0.5, patienceCounter: 0 });
    expect(state.totalAttraction).toBeCloseTo(0.01, 14);
    model.advance(); state = model.read();
    expect(state.agents[0]).toMatchObject({ id, kind: "house", x: 0, y: 0.5, stayCounter: 4 });
    expect(state.totalAttraction).toBeCloseTo(0.06, 14);
    model.advance(4); state = model.read();
    expect(state.agents[0]).toMatchObject({ id, kind: "seeker", x: 0, y: 0.5, patienceCounter: 1 });
    expect(state.tick).toBe(6);
  });
  test("house degradation is sequential and <= includes the cap", () => {
    const model = sprawl({ maxAttraction: 0, smoothness: 1, population: 1 });
    model.setAgents([
      { kind: "house", x: 0, y: 0, heading: 0, patienceCounter: 0, stayCounter: 9 },
      { kind: "house", x: 0, y: 0, heading: 90, patienceCounter: 0, stayCounter: 9 },
    ]);
    model.advance();
    expect(origin(model.read().cells).attraction).toBe(0);
    model.setAgents([{ kind: "house", x: 0, y: 0, heading: 0, patienceCounter: 0, stayCounter: 9 }]);
    model.advance(); expect(origin(model.read().cells).attraction).toBe(0.05);
    model.advance(); expect(origin(model.read().cells).attraction).toBe(0);
  });
  test("integer attraction0 versus positive fraction consumes different target continuation", () => {
    const a = sprawl({ population: 1, maxAttraction: 15, smoothness: 1 });
    const b = sprawl({ population: 1, maxAttraction: 15, smoothness: 1 });
    a.setAttractions(a.read().cells.map(() => 0)); b.setAttractions(b.read().cells.map(() => 0.1));
    const fixture = [{ kind: "seeker" as const, x: 0, y: 0, heading: 0, patienceCounter: -1, stayCounter: 0 }];
    a.setAgents(fixture); b.setAgents(fixture);
    expect(a.read().randomState).toEqual(b.read().randomState);
    a.advance(); b.advance();
    expect(a.read().randomState).not.toEqual(b.read().randomState);
    expect(a.read().agents[0]!.kind).toBe("seeker"); expect(b.read().agents[0]!.kind).toBe("seeker");
    expect(a.read().agents[0]!.patienceCounter).toBe(-1);
  });
  test("equal superior side probes choose left, source turn remains a bounded random angle", () => {
    const model = sprawl({ population: 1, smoothness: 1, maxAttraction: 15, seekerSearchAngle: 90 });
    model.setAttractions(model.read().cells.map(cell => cell.y === 0 && Math.abs(cell.x) === 1 ? 3 : 0));
    model.setAgents([{ kind: "seeker", x: 0, y: 0, heading: 0, patienceCounter: 1, stayCounter: 0 }]);
    model.advance(); const person = model.read().agents[0]!;
    expect(person.heading).toBeGreaterThan(270); expect(person.heading).toBeLessThan(360);
    expect(person.x).toBeLessThan(0); expect(person.y).toBeGreaterThan(0);
    expect(person.patienceCounter).toBe(0);
  });
  test("live rules preserve cached threshold; invalid fixtures and pure reads are atomic", () => {
    const model = sprawl({ population: 1, smoothness: 1 });
    model.setRules({ maxAttraction: 0 }); expect(model.read().buildThreshold).toBe(7);
    const before = model.read();
    expect(Object.isFrozen(before.agents[0])).toBe(true); expect(Object.isFrozen(before.cells[0])).toBe(true);
    for (const action of [() => model.setRules({ seekerSearchAngle: 0 }), () => model.setRules({ population: 3 } as never), () => model.setAttractions(before.cells.map(() => -1)), () => model.setAgents([{ kind: "seeker", x: 17.5, y: 0, heading: 0, patienceCounter: 1, stayCounter: 0 }]), () => model.advance(-1)]) {
      expect(action).toThrow(); expect(model.read()).toEqual(before);
    }
    model.advance(0); expect(model.read()).toEqual(before);
  });
});

describe("Urban Suite Economic Disparity public composition", () => {
  test("zero candidate helper STOP still runs complete cumulative land impacts", () => {
    const model = economic({ numberOfTests: 0, poorPerStep: 5, richPerStep: 5 });
    model.setAgents([{ kind: "job", x: 0, y: 0, utility: 0 }]);
    model.setLand(model.read().cells.map(() => ({ price: 40, quality: 40 })));
    model.advance(); const state = model.read();
    expect(state.counts).toEqual({ jobs: 1, rich: 5, poor: 5 }); expect(state.counter).toBe(10);
    expect(state.agents.every(person => person.x === 0 && person.y === 0 && person.utility === 0)).toBe(true);
    expect(origin(state.cells).price).toBeCloseTo(38.914033536687384, 12);
    expect(origin(state.cells).quality).toBe(origin(state.cells).price);
    expect(state.medianTravelDistance).toEqual({ rich: 0, poor: 0 });
    expect(state.tick).toBe(1);
  });
  test("job cap removes one oldest even without births and refreshes offset cache", () => {
    const model = economic({ poorPerStep: 0, richPerStep: 0, maxJobs: 5 });
    model.setAgents(Array.from({ length: 5 }, (_, i) => ({ kind: "job" as const, x: i * 10, y: 0, utility: 0 })));
    const before = model.read().agents.map(person => person.id);
    model.advance(); const state = model.read();
    expect(state.agents.map(person => person.id)).toEqual(before.slice(1)); expect(state.counter).toBe(0);
    expect(origin(state.cells).sdDistance).toBe(10.01);
    expect(state.medianTravelDistance).toEqual({ rich: undefined, poor: undefined });
  });
  test("strict counter boundary creates only after crossing and resets remainder", () => {
    const model = economic({ numberOfTests: 0, poorPerStep: 5, richPerStep: 5, residentsPerJob: 10, deathRate: 0 });
    model.advance(); expect(model.read().counter).toBe(10); expect(model.read().counts.jobs).toBe(1);
    model.advance(); expect(model.read().counter).toBe(0); expect(model.read().counts.jobs).toBe(2);
    expect(model.read().agents.find(person => person.kind === "job" && (person.x !== 0 || person.y !== 0))!.utility).toBe(0);
  });
  test("travel median is Agent weighted actual distance, independent of +.01 cache", () => {
    const model = economic({ poorPerStep: 0, richPerStep: 0 });
    model.setAgents([
      { kind: "job", x: 0, y: 0, utility: 0 },
      { kind: "rich", x: 0, y: 0, utility: 0 }, { kind: "rich", x: 0, y: 0, utility: 0 },
      { kind: "rich", x: 3, y: 4, utility: 0 }, { kind: "poor", x: 3, y: 4, utility: 0 },
    ]);
    expect(model.read().medianTravelDistance).toEqual({ rich: 0, poor: 5 });
    expect(model.read().cells.find(cell => cell.x === 3 && cell.y === 4)!.sdDistance).toBe(5.01);
  });
  test("views preserve scientific land/RNG/time; equal utility range uses native dark bound", () => {
    const model = economic({ poorPricePriority: 1, richQualityPriority: 1 });
    model.setLand(model.read().cells.map(() => ({ price: 40, quality: 40 })));
    const before = model.read();
    for (const mode of ["price", "dist", "poor-utility", "rich-utility", "quality"] as const) {
      model.setViewMode(mode); const after = model.read();
      expect(after.tick).toBe(before.tick); expect(after.randomState).toEqual(before.randomState);
      expect(after.cells.map(cell => [cell.price, cell.quality, cell.sdDistance])).toEqual(before.cells.map(cell => [cell.price, cell.quality, cell.sdDistance]));
      if (mode === "poor-utility") expect(after.cells.every(cell => cell.colorNumber === 90)).toBe(true);
      if (mode === "rich-utility") expect(after.cells.every(cell => cell.colorNumber === 130)).toBe(true);
    }
  });
  test("poor/rich candidate equations preserve factor100 and endpoint priority effects", () => {
    const model = economic();
    const here = origin(model.read().cells);
    expect(here.poorUtility).toBe((1 / (here.sdDistance / 100 + 0.1)) * (1 / here.price));
    expect(here.richUtility).toBe((1 / (here.sdDistance + 0.1)) * here.quality);
    model.setRules({ poorPricePriority: 1, richQualityPriority: 1 });
    const current = origin(model.read().cells);
    expect(current.poorUtility).toBe((1 / current.price) ** 2);
    expect(current.richUtility).toBe(current.quality ** 2);
  });
  test("fixture validation is complete before writes and detached reads consume no stream", () => {
    const model = economic(); const before = model.read();
    expect(Object.isFrozen(before.cells[0])).toBe(true); expect(Object.isFrozen(before.agents[0])).toBe(true);
    let invoked = false;
    const getter = { get price() { invoked = true; return 40; }, quality: 40 };
    for (const action of [() => model.setAgents([]), () => model.setAgents([{ kind: "job", x: 44.5, y: 0, utility: 0 }]), () => model.setLand(before.cells.map((_, i) => i === 0 ? getter : ({ price: 40, quality: 40 }))), () => model.setRules({ deathRate: 16 }), () => model.setViewMode("unknown" as never)]) {
      expect(action).toThrow(); expect(model.read()).toEqual(before);
    }
    expect(invoked).toBe(false); model.advance(0); expect(model.read()).toEqual(before);
  });
});

test("default source mechanisms stay independent, replayable and conserve Sprawl population", () => {
  const a = sprawl(), b = sprawl();
  const c = economic(), d = economic();
  const sprawlValues = (model: ReturnType<typeof sprawl>) => {
    const state = model.read();
    return { tick: state.tick, counts: state.counts, fields: state.cells.map(cell => cell.attraction), people: state.agents.map(({ id, ...person }) => person), stream: state.randomState };
  };
  const economicValues = (model: ReturnType<typeof economic>) => {
    const state = model.read();
    return { tick: state.tick, counts: state.counts, fields: state.cells.map(cell => [cell.price, cell.quality, cell.sdDistance]), people: state.agents.map(({ id, ...person }) => person), stream: state.randomState };
  };
  const untouchedSprawl = b.read(), untouchedEconomic = d.read();
  a.advance(20); c.advance(20);
  expect(b.read()).toEqual(untouchedSprawl); expect(d.read()).toEqual(untouchedEconomic);
  for (let i = 0; i < 20; i++) { b.read(); b.advance(); d.read(); d.advance(); }
  expect(sprawlValues(a)).toEqual(sprawlValues(b)); expect(economicValues(c)).toEqual(economicValues(d));
  expect(a.read().counts.seekers + a.read().counts.houses).toBe(200);
  expect(c.read().cells.every(cell => cell.price === cell.quality && cell.price >= 1 && cell.price <= 100)).toBe(true);
  expect(a.read().cells.every(cell => Number.isFinite(cell.attraction) && cell.attraction >= 0)).toBe(true);
});

test("closed fixture arrays reject extra fields, sparse entries and getters before mutation", () => {
  const a = sprawl({ population: 1, smoothness: 1 }), b = economic();
  const beforeA = a.read(), beforeB = b.read();
  const attractions = Object.assign(beforeA.cells.map(() => 0), { extra: 3 });
  const land = Object.assign(beforeB.cells.map(() => ({ price: 40, quality: 40 })), { extra: 3 });
  const people = Object.assign([{ kind: "job" as const, x: 0, y: 0, utility: 0 }], { extra: 3 });
  const sparse = Array<number>(1225);
  let read = false;
  const getter = beforeA.cells.map(() => 0);
  Object.defineProperty(getter, "1224", { get() { read = true; return 0; } });
  expect(() => a.setAttractions(attractions)).toThrow(); expect(() => a.setAttractions(sparse)).toThrow(); expect(() => a.setAttractions(getter)).toThrow();
  expect(() => b.setLand(land)).toThrow(); expect(() => b.setAgents(people)).toThrow(); expect(read).toBe(false);
  expect(a.read()).toEqual(beforeA); expect(b.read()).toEqual(beforeB);
  const fieldIds = beforeA.cells.map(cell => cell.id);
  a.setAttractions(beforeA.cells.map(() => 0)); expect(a.read().cells.map(cell => cell.id)).toEqual(fieldIds);
  const economicIds = beforeB.cells.map(cell => cell.id);
  b.setLand(beforeB.cells.map(() => ({ price: 40, quality: 40 }))); expect(b.read().cells.map(cell => cell.id)).toEqual(economicIds);
});
