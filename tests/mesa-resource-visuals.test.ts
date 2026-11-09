import { describe, expect, test } from "bun:test";
import { create as createEnergy } from "../experiments/household-energy-demand/model.ts";
import { create as createBattery } from "../experiments/solar-battery-microgrid/model.ts";
import { create as createBasin } from "../experiments/stormwater-retention/model.ts";
import { create as createTrees } from "../experiments/urban-tree-watering/model.ts";
import { treesData } from "../experiments/urban-tree-watering/ui.ts";

describe("detached observations for city resource visuals", () => {
  test("tree moisture colors use a fixed domain independent of display population", () => {
    const small = createTrees({ seed: 17, trees: 2, dailyLiters: 0 });
    const large = createTrees({ seed: 17, trees: 40, dailyLiters: 0 });
    const first = small.read();
    const larger = large.read();
    expect(larger.trees[0]!.moistureLiters).toBe(first.trees[0]!.moistureLiters);
    expect(treesData(first).agents[0]!.color).toBe(treesData(larger).agents[0]!.color);
    const oldColor = treesData(first).agents[0]!.color;
    small.advance();
    expect(treesData(small.read()).agents[0]!.color).not.toBe(oldColor);
    expect(treesData(first).agents[0]!.color).toBe(oldColor);
    expect(small.read().tick).toBe(1);
  });
  test("household display quantities retain the aggregate load and completed interval", () => {
    const instance = createEnergy({ households: 10, shiftedShare: 1 });
    instance.advance(13);
    const observation = instance.read();
    expect(observation.householdDemandKw * observation.parameters.households).toBeCloseTo(observation.demandKw, 12);
    expect(observation.householdBaseKw).toBe(0.3);
    expect(observation.householdPeakKw).toBe(1.2);
    expect(observation.demandHour).toBe(12);
    expect(instance.read()).toEqual(observation);
    expect(observation.tick).toBe(13);
  });

  test("battery interval flows explain the observed storage change without advancing time", () => {
    const instance = createBattery({ seed: 17 });
    for (let interval = 0; interval < 30; interval += 1) {
      const before = instance.read();
      instance.advance();
      const after = instance.read();
      expect(after.energyKwh - before.energyKwh).toBeCloseTo(
        after.solarKw - after.demandKw + after.intervalImportedKwh - after.intervalExportedKwh, 12,
      );
      expect(after.intervalImportedKwh).toBeGreaterThanOrEqual(0);
      expect(after.intervalExportedKwh).toBeGreaterThanOrEqual(0);
      expect(instance.read()).toEqual(after);
    }
  });

  test("catchment geometry and basin interval flows are detached and conserve volume", () => {
    const instance = createBasin({ capacityM3: 3 });
    const initial = instance.read();
    expect(initial.catchment.fields).toHaveLength(9);
    expect(new Set(initial.catchment.fields.map(field => `${field.x}:${field.y}`)).size).toBe(9);
    expect(initial.catchment.fields.every(field => field.areaM2 === 10 && field.runoffShare === 0.5)).toBe(true);
    expect(Object.isFrozen(initial.catchment.fields[0])).toBe(true);
    expect(() => { (initial.catchment.fields[0] as { x: number }).x = 100; }).toThrow();
    for (let interval = 0; interval < 8; interval += 1) {
      const before = instance.read();
      instance.advance();
      const after = instance.read();
      expect(after.storedM3 - before.storedM3 + after.intervalDischargedM3 + after.intervalOverflowM3)
        .toBeCloseTo(after.intervalInflowM3, 12);
      expect(instance.read()).toEqual(after);
    }
    expect(instance.read().catchment.fields[0]!.x).toBe(initial.catchment.fields[0]!.x);
  });

  test("extra reads preserve seeded battery and tree continuation", () => {
    const readBattery = createBattery({ seed: 17 });
    const untouchedBattery = createBattery({ seed: 17 });
    const readTrees = createTrees({ seed: 17, dailyLiters: 20 });
    const untouchedTrees = createTrees({ seed: 17, dailyLiters: 20 });
    for (let index = 0; index < 20; index += 1) { readBattery.read(); readTrees.read(); }
    readBattery.advance(30); untouchedBattery.advance(30);
    readTrees.advance(30); untouchedTrees.advance(30);
    expect(readBattery.read()).toEqual(untouchedBattery.read());
    const read = readTrees.read();
    const untouched = untouchedTrees.read();
    expect(read.moistureCapacityLiters).toBe(12);
    expect(read.history).toEqual(untouched.history);
    expect(read.trees.map(({ moistureLiters, receivedLiters }) => ({ moistureLiters, receivedLiters })))
      .toEqual(untouched.trees.map(({ moistureLiters, receivedLiters }) => ({ moistureLiters, receivedLiters })));
    expect(read.trees.reduce((sum, tree) => sum + tree.receivedLiters, 0)).toBe(read.wateredLiters);
  });

  test("resource UI imports are inert without browser globals", async () => {
    for (const slug of ["household-energy-demand", "solar-battery-microgrid", "stormwater-retention", "urban-tree-watering"]) {
      const entry = await import(`../experiments/${slug}/ui.ts`);
      expect(typeof entry.ui.mount).toBe("function");
    }
  });
});
