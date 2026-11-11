import { test, expect } from "bun:test";
import { model } from "./model.ts";

test("fractional flows keep the cash balance and bounded conditions through policy changes", () => {
  const instance = model.create({ taxBase: 1234.5, taxRate: 0.37, serviceCost: 211.3, annualWear: 0.071, maintenanceBudget: 123.4 });
  for (let year = 0; year < 60; year += 1) {
    instance.setPolicy({ repairPriority: year % 3 === 0 ? "preventive" : "worst-first", maintenanceBudget: (year * 37) % 400 });
    instance.advance();
    const state = instance.read();
    expect(Math.abs(state.cashBalanceError)).toBeLessThan(1e-6);
    expect(state.assets.every(asset => asset.condition >= 0 && asset.condition <= 1)).toBe(true);
    expect(state.maintenanceSpending).toBeLessThanOrEqual(state.parameters.maintenanceBudget + 1e-9);
    expect(Math.abs(state.assets.reduce((sum, asset) => sum + asset.repairedThisYear, 0) - state.maintenanceSpending)).toBeLessThan(1e-9);
  }
});

test("policy rejection avoids accessor evaluation and partial writes", () => {
  const city = model.create();
  const before = city.read();
  let calls = 0;
  const changes = { get taxRate() { calls += 1; return 0.2; } };
  expect(() => city.setPolicy(changes)).toThrow(TypeError);
  expect(() => model.create(changes)).toThrow(TypeError);
  expect(calls).toBe(0);
  expect(city.read()).toEqual(before);
  city.setPolicy({});
  expect(city.read()).toEqual(before);
  expect(() => city.setPolicy({ [Symbol("taxRate")]: 0.2 } as never)).toThrow(TypeError);
});

test("zero wear on fully repaired assets ends repair spending", () => {
  const instance = model.create({ annualWear: 0, maintenanceBudget: 10000, taxBase: 100000 });
  instance.advance();
  expect(instance.read().backlog).toBe(0);
  instance.advance();
  expect(instance.read().maintenanceSpending).toBe(0);
  expect(instance.read().meanCondition).toBe(1);
});

test("a repair that starts below the threshold costs double per condition point", () => {
  const instance = model.create({ annualWear: 0.2, maintenanceBudget: 0 });
  instance.advance(1);
  const poor = instance.read().assets.find(asset => asset.isPoor)!;
  expect(poor.repairCost).toBeCloseTo((1 - poor.condition) * 2 * 1000, 9);
});
