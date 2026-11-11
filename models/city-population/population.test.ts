import { describe, expect, test } from "bun:test";
import { model } from "./model.ts";

describe("Population and Households boundaries", () => {
  test("open oldest cohort retains every survivor", () => {
    const instance = model.create({ initialPopulation: 100, birthRate: 0, deathRate: 0, elderlyDeathRate: 0, annualMigration: 0 });
    instance.advance(150);
    const state = instance.read();
    expect(state.populationCount).toBe(100);
    expect(state.cohorts[100]!.residentCount).toBe(100);
    expect(state.cohorts.slice(0, 100).every(cohort => cohort.residentCount === 0)).toBe(true);
    expect(state.history.length).toBe(120);
    expect(state.history[0]!.tick).toBe(31);
    expect(state.history.at(-1)!.tick).toBe(150);
  });

  test("newborns avoid the current year's mortality and precede migration", () => {
    const instance = model.create({ initialPopulation: 1000, birthRate: 0.1, deathRate: 1, elderlyDeathRate: 1, annualMigration: 0 });
    instance.advance();
    const state = instance.read();
    expect(state.birthCount).toBe(20);
    expect(state.deathCount).toBe(1000);
    expect(state.populationCount).toBe(20);
    expect(state.cohorts[0]!.residentCount).toBe(20);
    expect(state.accountingError).toBe(0);
    instance.advance();
    expect(instance.read().populationCount).toBe(0);
  });

  test("empty population remains empty with zero migration bound", () => {
    const instance = model.create({ initialPopulation: 0, migrationLimit: 0 });
    instance.advance(10);
    const state = instance.read();
    expect(state.populationCount).toBe(0);
    expect(state.householdCount).toBe(0);
    expect(state.meanHouseholdSize).toBe(0);
    expect(state.householdsBySize.every(group => group.householdCount === 0)).toBe(true);
  });

  test("setup remainder goes to youngest cohorts and household packing conserves all sizes", () => {
    for (let householdSize = 1; householdSize <= 6; householdSize += 1) {
      const instance = model.create({ initialPopulation: 103, householdSize, birthRate: 0, deathRate: 0, elderlyDeathRate: 0, annualMigration: 0 });
      const state = instance.read();
      expect(state.cohorts.slice(0, 3).map(cohort => cohort.residentCount)).toEqual([2, 2, 2]);
      expect(state.householdCount).toBe(Math.ceil(103 / householdSize));
      expect(state.householdsBySize.reduce((sum, group) => sum + group.size * group.householdCount, 0)).toBe(103);
      instance.advance();
      expect(instance.read().populationCount).toBe(103);
    }
  });

  test("policy rejects accessors without invoking them and leaves state unchanged", () => {
    const instance = model.create();
    const before = instance.read();
    let getterCallCount = 0;
    const changes = Object.defineProperty({}, "birthRate", { get() { getterCallCount += 1; return 0; } });
    expect(() => instance.setPolicy(changes)).toThrow(TypeError);
    expect(getterCallCount).toBe(0);
    expect(() => instance.setPolicy({ deathRate: undefined } as never)).toThrow(TypeError);
    expect(() => instance.setPolicy(null as never)).toThrow(TypeError);
    expect(instance.read()).toEqual(before);
  });

  test("old observations stay independent across actions, advances and histories", () => {
    const instance = model.create();
    const before = instance.read();
    instance.setPolicy({ householdSize: 1 });
    expect(instance.read().householdsBySize).toEqual(before.householdsBySize);
    instance.advance();
    expect(instance.read().householdCount).toBe(984);
    expect(before.householdCount).toBe(334);
    expect(before.parameters.householdSize).toBe(3);
    expect(before.history[0]!.values.populationCount).toBe(1000);
    expect(Object.isFrozen(before.history[0]!.values)).toBe(true);
  });
});

describe("Population integer mortality", () => {
  test("long-run deaths track the expected total within one resident", () => {
    const instance = model.create({ initialPopulation: 37, birthRate: 0, annualMigration: 0, deathRate: 0.03, elderlyDeathRate: 0.03 });
    let expectedDeaths = 0;
    for (let year = 0; year < 40; year += 1) {
      expectedDeaths += instance.read().populationCount * 0.03;
      instance.advance();
      const state = instance.read();
      expect(Math.abs(state.cumulativeDeathCount + state.mortalityRemainder - expectedDeaths)).toBeLessThan(1e-6);
    }
  });

  test("a single resident eventually dies instead of staying immortal", () => {
    const instance = model.create({ initialPopulation: 1, birthRate: 0, annualMigration: 0, deathRate: 0.2 });
    instance.advance(5);
    expect(instance.read().populationCount).toBe(0);
    expect(instance.read().cumulativeDeathCount).toBe(1);
  });

  test("deaths never exceed a cohort and full mortality empties every cohort", () => {
    const instance = model.create({ initialPopulation: 333, birthRate: 0, annualMigration: 0, deathRate: 0.97, elderlyDeathRate: 0.97 });
    for (let year = 0; year < 8; year += 1) {
      instance.advance();
      expect(instance.read().cohorts.every(cohort => cohort.residentCount >= 0)).toBe(true);
      expect(instance.read().accountingError).toBe(0);
    }
    instance.setPolicy({ deathRate: 1, elderlyDeathRate: 1 });
    instance.advance();
    expect(instance.read().populationCount).toBe(0);
  });
});
