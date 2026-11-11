import { describe, expect, test } from "bun:test";
import { model } from "./model.ts";

describe("Urban Employment boundaries", () => {
  test("money balance holds for fractional flows, many firms and live changes", () => {
    const instance = model.create({ householdCount: 37, firmCount: 7, wage: 13, spendingFraction: 0.7 });
    for (let month = 0; month < 60; month += 1) {
      instance.setExternalDemand((month * 37) % 400);
      instance.setHiringLimit(1 + month % 4);
      instance.advance();
      const state = instance.read();
      expect(Math.abs(state.moneyBalanceError)).toBeLessThan(1e-6);
      expect(state.employedCount + state.unemployedCount).toBe(37);
      expect(state.sales).toBeLessThanOrEqual(state.orders);
      expect(state.firms.every(firm => firm.employeeCount <= firm.desiredJobCount)).toBe(true);
    }
  });

  test("zero spending removes the feedback and zero demand releases every worker at once", () => {
    const instance = model.create({ spendingFraction: 0, externalDemand: 0 });
    instance.advance();
    expect(instance.read().employedCount).toBe(0);
    expect(instance.read().firedCount).toBe(15);
    expect(instance.read().orders).toBe(0); // Setup spending also uses spendingFraction 0.
    expect(instance.read().lostOrders).toBe(0);
  });

  test("hiring never exceeds the limit per firm and month", () => {
    const instance = model.create({ externalDemand: 300, hiringLimit: 2 });
    let previous = instance.read().employedCount;
    for (let month = 0; month < 10; month += 1) {
      instance.advance();
      const state = instance.read();
      expect(state.hiredCount).toBeLessThanOrEqual(2 * 3);
      expect(state.employedCount - previous).toBeLessThanOrEqual(6);
      previous = state.employedCount;
    }
    expect(previous).toBe(30); // Demand exceeds the labor force; all households work.
  });

  test("dismissals remove the highest-numbered employees first", () => {
    const instance = model.create({ externalDemand: 30 });
    instance.advance();
    expect(instance.read().firms.map(firm => firm.employeeCount)).toEqual([3, 3, 3]);
    expect(instance.read().households.slice(0, 3).every(household => household.employerId === "firm:1")).toBe(true);
    expect(instance.read().households[3]!.employerId).toBe(null);
  });
});
