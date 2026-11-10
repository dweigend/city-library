import { describe, expect, test } from "bun:test";
import { model as energy } from "../models/household-energy-demand/model.ts";
import { model as crossing } from "../models/pedestrian-crossing-phases/model.ts";
import { model as zoning } from "../models/zoning-scenario-comparison/model.ts";
import { model as heat } from "../models/neighborhood-heat-intervention/model.ts";
import { model as battery } from "../models/solar-battery-microgrid/model.ts";
import { model as stormwater } from "../models/stormwater-retention/model.ts";
import { model as trees } from "../models/urban-tree-watering/model.ts";
import { model as recycling } from "../models/household-recycling-behavior/model.ts";
import { model as membership } from "../models/workplace-household-membership/model.ts";

const models = [energy, crossing, zoning, heat, battery, stormwater, trees, recycling, membership];
describe("original illustrative spatial city models", () => {
  for (const model of models) {
    test(`${model.title}: inert observations and validated execution`, () => {
      const instance = model.create();
      const before = instance.read();
      expect(instance.read()).toEqual(before);
      expect(() => instance.advance(-1)).toThrow(RangeError);
      expect(instance.read()).toEqual(before);
      expect(() => model.create({ unexpected: true } as never)).toThrow(TypeError);
      instance.advance();
      expect(instance.read().tick).toBe(1);
      expect(instance.read()).toEqual(instance.read());
    });
  }

  test("hourly load shifting conserves daily appliance energy and evicts old measurements", () => {
    const evening = energy.create({ households: 10, shiftedShare: 0 });
    const midday = energy.create({ households: 10, shiftedShare: 1 });
    evening.advance(24); midday.advance(24);
    expect(evening.read().energyKwh).toBeCloseTo(midday.read().energyKwh, 12);
    expect(evening.read().energyKwh).toBeCloseTo(99, 12);
    expect(evening.read().history.find(sample => sample.tick === 13)!.values.demandKw).toBe(3);
    expect(midday.read().history.find(sample => sample.tick === 13)!.values.demandKw).toBe(12);
    const before = evening.read();
    expect(() => evening.setShiftedShare(1.1)).toThrow(RangeError);
    expect(evening.read()).toEqual(before);
    evening.advance(110);
    const exported = evening.exportMeasurements();
    expect(exported).toHaveLength(120);
    expect(exported[0]!.tick).toBe(15);
    expect(exported.at(-1)!.tick).toBe(134);
    expect(JSON.parse(JSON.stringify(exported))).toEqual(exported);
  });

  test("crossing commits one cohort state per minute and terminates at arrival", () => {
    const instance = crossing.create({ pedestrians: 4, greenMinutes: 1 });
    instance.advance(3);
    expect(instance.read().waiting).toBe(4);
    instance.advance();
    expect(instance.read().crossing).toBe(4);
    expect(instance.read().arrived).toBe(0);
    instance.advance(100);
    expect(instance.read().arrived).toBe(4);
    expect(instance.read().tick).toBe(5);
    expect(instance.read().done).toBe(true);
  });

  test("zoning compares paired seeds and summarizes replications rather than samples", () => {
    const first = zoning.create({ parcels: 10, seed: 7, baseCap: 2 });
    const second = zoning.create({ parcels: 10, seed: 7, baseCap: 2 });
    first.advance(100); second.advance(100);
    const observation = first.read();
    expect(observation).toEqual(second.read());
    expect(observation.tick).toBe(6);
    expect(observation.completedRuns).toBe(6);
    expect(observation.done).toBe(true);
    expect(observation.summaries).toHaveLength(2);
    expect(observation.summaries.map(summary => summary.replications)).toEqual([3, 3]);
    for (let seed = 0; seed < 3; seed += 1) {
      expect(observation.outcomes[seed + 3]!.slots).toBe(observation.outcomes[seed]!.slots * 2);
    }
    expect(observation.outcomes.every(outcome => outcome.reason === "stop-condition")).toBe(true);
  });

  test("uniform heat stays uniform without cooling, while shade lowers the index", () => {
    const plain = heat.create({ shadeCooling: 0 });
    const shaded = heat.create({ shadeCooling: 1 });
    plain.advance(3); shaded.advance(3);
    expect(plain.read().fields.every(field => field.heatIndex === 30)).toBe(true);
    expect(shaded.read().meanHeat).toBeLessThan(plain.read().meanHeat);
    expect(shaded.read().fields.every(field => field.heatIndex <= 30)).toBe(true);
    const snapshot = shaded.read();
    expect(Object.isFrozen(snapshot.fields[0])).toBe(true);
    shaded.advance();
    expect(snapshot.tick).toBe(3);
    expect(snapshot.fields[0]!.heatIndex).not.toBe(shaded.read().fields[0]!.heatIndex);
  });

  test("battery captures a reserve crossing within the interval once", () => {
    const instance = battery.create({ solarKw: 0, demandKw: 8 });
    instance.advance();
    expect(instance.read().energyKwh).toBe(2);
    expect(instance.read().lastCrossingHour).toBe(0.375);
    expect(instance.read().reserveCrossings).toBe(1);
    expect(instance.read().importedKwh).toBe(5);
    instance.advance(30);
    expect(instance.read().reserveCrossings).toBe(1);
    expect(instance.read().history.every(sample => sample.values.energyKwh! >= 2 && sample.values.energyKwh! <= 10)).toBe(true);
  });

  test("stormwater retains mass and reports the first exact linear capacity crossing", () => {
    const instance = stormwater.create({ rainMmPerHour: 50, capacityM3: 1 });
    instance.advance();
    expect(instance.read().lastCrossingHour).toBeCloseTo(1 / 2.05, 12);
    instance.advance(9);
    const state = instance.read();
    expect(state.capacityCrossings).toBe(1);
    expect(state.storedM3).toBe(1);
    expect(state.storedM3 + state.overflowM3 + state.dischargedM3).toBeCloseTo(state.inflowM3, 11);
    instance.setRain(0); instance.advance(10);
    expect(instance.read().storedM3).toBeCloseTo(0, 12);
    expect(instance.read().overflowM3).toBe(state.overflowM3);
  });

  test("tree watering prioritizes the initial driest tree with stable input ties", () => {
    const instance = trees.create({ trees: 20, dailyLiters: 1, seed: 5 });
    const initial = instance.read().trees;
    const firstDriest = initial.reduce((best, tree, index) => tree.moistureLiters < initial[best]!.moistureLiters ? index : best, 0);
    instance.advance();
    const state = instance.read();
    expect(state.wateredLiters).toBe(1);
    expect(state.totalWaterLiters).toBe(1);
    expect(state.trees[firstDriest]!.receivedLiters).toBe(1);
    expect(state.trees.filter(tree => tree.receivedLiters > 0)).toHaveLength(1);
    expect(() => instance.setDailyLiters(-1)).toThrow(RangeError);
  });

  test("recycling cannot cascade beyond the old adopter's immediate neighbors in one step", () => {
    const first = recycling.create({ households: 10, influence: 1, seed: 9 });
    const second = recycling.create({ households: 10, influence: 1, seed: 9 });
    first.advance(); second.advance();
    const oneStep = first.read();
    expect(oneStep.adopters).toBeLessThanOrEqual(3);
    expect(oneStep.nodes.slice(2, 9).every(node => !node.recycling)).toBe(true);
    first.advance(20); second.advance(20);
    expect(first.read().history).toEqual(second.read().history);
    expect(first.read().nodes.map(node => node.recycling)).toEqual(second.read().nodes.map(node => node.recycling));
  });

  test("reassignment preserves canonical resident IDs and household edges", () => {
    const instance = membership.create({ residents: 4 });
    const initial = instance.read();
    instance.reassign(0);
    const reassigned = instance.read();
    expect(reassigned.tick).toBe(0);
    expect(reassigned.memberships).toBe(8);
    expect(reassigned.nodes).toEqual(initial.nodes);
    expect(reassigned.people[0]!.household).toBe(initial.people[0]!.household);
    expect(reassigned.people[0]!.workplace).not.toBe(initial.people[0]!.workplace);
    expect(initial.people[0]!.workplace).toBe("Workplace A");
    expect(() => instance.reassign(4)).toThrow(RangeError);
    instance.advance(20);
    expect(instance.read().memberships).toBe(8);
    expect(instance.read().people.every(person => person.household.startsWith("Household") && person.workplace.startsWith("Workplace"))).toBe(true);
  });
});
