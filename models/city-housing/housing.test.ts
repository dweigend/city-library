import { describe, expect, test } from "bun:test";
import { model } from "./model.ts";

describe("Housing Market boundaries", () => {
  test("excess supply retains vacancies and clamps rent at its floor", () => {
    const market = model.create({ householdCount: 1, initialHomeCount: 5, initialRent: 100,
      targetVacancyRate: 0, rentAdjustmentRate: 1 });
    market.advance(120);
    expect(market.read().rent).toBe(100);
    expect(market.read().housedHouseholdCount).toBe(1);
    expect(market.read().vacantHomeCount).toBe(4);
    expect(market.read().startedThisStepCount).toBe(0);
    expect(market.read().pipelineCount).toBe(0);
  });

  test("rent stays finite and reaches the ceiling", () => {
    const market = model.create({ householdCount: 1, initialHomeCount: 1, maxHomeCount: 1,
      initialRent: 5000, housingAllowance: 5000, targetVacancyRate: 1, rentAdjustmentRate: 1 });
    market.advance(120);
    expect(market.read().rent).toBe(5000);
    expect(market.read().housedHouseholdCount).toBe(1);
  });

  test("construction respects remaining capacity and completes after three months", () => {
    const market = model.create({ householdCount: 40, initialHomeCount: 1, maxHomeCount: 3,
      initialRent: 100, constructionRent: 100, constructionLimit: 10, rentAdjustmentRate: 0 });
    market.advance();
    expect(market.read().startedThisStepCount).toBe(2);
    expect(market.read().pipeline.map(entry => entry.remainingMonths)).toEqual([3, 3]);
    expect(market.read().housedHouseholdCount).toBe(1);
    market.advance(2);
    expect(market.read().homeCount).toBe(1);
    expect(market.read().startedThisStepCount).toBe(0);
    market.advance();
    expect(market.read().completedThisStepCount).toBe(2);
    expect(market.read().housedHouseholdCount).toBe(3);
    expect(market.read().households.filter(household => household.homeId !== null)
      .map(household => household.id)).toEqual(["household-38", "household-39", "household-40"]);
  });

  test("allowance reaches only low-income bids and withdrawal displaces on the next step", () => {
    const market = model.create({ householdCount: 6, initialHomeCount: 6, maxHomeCount: 6,
      initialRent: 500, housingAllowance: 300, rentAdjustmentRate: 0 });
    expect(market.read().households.map(household => household.receivesAllowance))
      .toEqual([true, true, false, false, false, false]);
    // Bids 600, 660 (allowance), 420, 480, 540, 600 against rent 500.
    expect(market.read().housedHouseholdCount).toBe(4);
    market.setHousingAllowance(0);
    expect(market.read().households[0]!.bid).toBe(300);
    market.advance();
    expect(market.read().displacedThisStepCount).toBe(2);
    expect(market.read().households.slice(0, 2).map(household => household.status)).toEqual(["displaced", "displaced"]);
    expect(market.read().searchingHouseholdCount).toBe(4);
  });

  test("invalid action types and setup records cannot mutate an instance", () => {
    const market = model.create();
    const before = market.read();
    for (const value of [undefined, null, "300", {}]) {
      expect(() => market.setHousingAllowance(value as never)).toThrow(TypeError);
    }
    expect(() => model.create(null as never)).toThrow(TypeError);
    expect(() => model.create({ get housingAllowance() { return 1; } })).toThrow(TypeError);
    expect(market.read()).toEqual(before);
    expect(Object.isFrozen(before.history[0]!.values)).toBe(true);
  });
});
