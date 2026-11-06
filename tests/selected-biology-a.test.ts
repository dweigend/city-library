import { describe, expect, test } from "bun:test";
import { create as createChloroplasts } from "../experiments/chloroplasts-and-food/model.ts";
import { create as createSlime } from "../experiments/slime/model.ts";
import { create as createFur } from "../experiments/fur/model.ts";
import { create as createHoneycomb } from "../experiments/honeycomb/model.ts";
import { create as createBlood } from "../experiments/blood-sugar-regulation/model.ts";

describe("selected biology A source mechanisms", () => {
  test("Slime deposition, diffusion and evaporation conserve the declared mass", () => {
    const model = createSlime({ population: 10, seed: 7 });
    let total = 0;
    for (let tick = 1; tick <= 12; tick++) {
      model.advance();
      total = (total + 20) * 0.9;
      expect(model.read().chemicalTotal).toBeCloseTo(total, 9);
    }
    const before = model.read();
    model.read();
    expect(model.read()).toEqual(before);
    expect(
      before.agents.every(
        (agent) =>
          agent.x >= -40.5 &&
          agent.x < 40.5 &&
          agent.y >= -40.5 &&
          agent.y < 40.5,
      ),
    ).toBe(true);
    expect(() => model.setParameters({ sniffAngle: 181 })).toThrow(RangeError);
    expect(() => model.advance(0.5)).toThrow(RangeError);
  });

  test("Honeycomb's diffusion cadence starts at preincrement tick zero", () => {
    const model = createHoneycomb({ numBees: 1, seed: 1 });
    model.advance();
    expect(model.read().chemicalTotal).toBeCloseTo(1.8, 10);
    model.advance(9);
    expect(model.read().chemicalTotal).toBeCloseTo(19.8, 10);
    model.advance();
    expect(model.read().chemicalTotal).toBeCloseTo(19.62, 10);
    const before = model.read();
    model.hideBees();
    expect(model.read().agents.every((agent) => agent.hidden)).toBe(true);
    expect(model.read().tick).toBe(before.tick);
    expect(model.read().chemicalTotal).toBe(before.chemicalTotal);
    model.showBees();
    expect(model.read().agents.every((agent) => !agent.hidden)).toBe(true);
  });

  test("Fur preserves the source's uninitialized new-color tie behavior", () => {
    const skin = createFur({ initialDensity: 100, ratio: 29 / 84 });
    expect(skin.read().whiteCount).toBe(3721);
    skin.advance();
    expect(skin.read().whiteCount).toBe(0);
    skin.setParameters({ initialDensity: 100, ratio: 0 });
    skin.restart();
    skin.advance();
    expect(skin.read().whiteCount).toBe(3721);
    skin.setParameters({ ratio: 29 / 84 });
    skin.advance();
    expect(skin.read().whiteCount).toBe(3721);
    skin.restart();
    expect(skin.read().tick).toBe(0);
    expect(() => createFur({ innerRadiusX: 0 })).toThrow(RangeError);
  });

  test("Chloroplast water inlet is the actual left boundary, with canonical flow ties", () => {
    const cell = createChloroplasts({
      seed: 1,
      initialChloroplasts: 0,
      intensityOfLight: 0,
      waterflowThroughLeaf: 50,
    });
    cell.advance(200);
    const state = cell.read();
    expect(
      state.agents.filter((agent) => agent.breed === "water").length,
    ).toBeGreaterThan(0);
    expect(state.flowLinks.length).toBe(
      state.agents.filter((agent) => agent.breed === "water").length,
    );
    expect(state.oxygen).toBe(0);
    expect(state.glucoseProduced).toBe(0);
    expect(state.carbonDioxide).toBe(100);
    expect(state.tick).toBe(200);
  });

  test("Natural photosynthesis creates oxygen and glucose and preserves source counts", () => {
    const cell = createChloroplasts({ seed: 1 });
    cell.advance(1000);
    const state = cell.read();
    expect(state.oxygen).toBeGreaterThan(0);
    expect(state.glucoseProduced).toBeGreaterThan(0);
    expect(state.carbonDioxide).toBe(
      state.agents.filter((agent) => agent.breed === "co2").length,
    );
    expect(state.atpSites.length).toBe(18);
    expect(
      state.carbonDioxide +
        state.agents.filter((agent) => agent.breed === "carbon").length +
        state.glucoseProduced * 6,
    ).toBe(100);
    cell.setParameters({ autoStop: true, stopAt: 1000 });
    cell.advance(20);
    expect(cell.read().tick).toBe(1000);
    expect(cell.read().stopped).toBe(true);
  }, 20000);

  test("Blood Sugar requires real Poisson/exponential draws and rounds meal creation to 412", () => {
    const body = createBlood({ seed: 1, metabolicRate: 0 });
    const initial = body.read();
    expect(initial.glucoseCount).toBe(4356);
    expect(initial.insulinCount).toBe(363);
    expect(initial.glucagonCount).toBe(363);
    expect(initial.liverCells.length).toBe(792);
    expect(initial.pancreaticCells.length).toBe(297);
    expect(
      initial.liverCells.every(
        (cell) => Number.isInteger(cell.glucoseStore) && cell.glucoseStore >= 0,
      ),
    ).toBe(true);
    body.advance(2);
    expect(body.read().totalGlucose).toBe(initial.totalGlucose);
    body.eat();
    body.eat();
    body.advance();
    expect(body.read().totalGlucose).toBe(initial.totalGlucose + 412);
    expect(body.read().eatTime).toBe(33);
    body.setParameters({ metabolicRate: 100 });
    body.advance();
    expect(body.read().totalGlucose).toBe(initial.totalGlucose + 724);
  });
});
