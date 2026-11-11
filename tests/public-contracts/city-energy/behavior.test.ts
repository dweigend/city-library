import { expect, test } from "bun:test";
import { model } from "../../../models/city-energy/model.ts";

test("fractional dispatch preserves carrier balances and storage bounds for 30 days", () => {
  const instance = model.create({ solarCapacityKw: 11.7, windOutputKw: 1.23,
    batteryCapacityKwh: 7.9, initialBatteryKwh: 3.7, batteryPowerKw: 1.31,
    electricityNetworkCapacityKw: 2.42, heatNetworkCapacityKw: 2.17, demandScale: 1.13 });
  let electricityUnmet = 0;
  let heatUnmet = 0;
  for (let hour = 0; hour < 720; hour += 1) {
    const before = instance.read().batteryKwh;
    instance.advance();
    const { flow, batteryKwh } = instance.read();
    expect(Math.abs(flow.electricityBalanceKwh)).toBeLessThan(1e-10);
    expect(Math.abs(flow.heatBalanceKwh)).toBeLessThan(1e-10);
    expect(batteryKwh).toBeGreaterThanOrEqual(-1e-10);
    expect(batteryKwh).toBeLessThanOrEqual(7.9 + 1e-10);
    expect(batteryKwh).toBeCloseTo(before + flow.batteryChargeKwh - flow.batteryDischargeKwh, 10);
    electricityUnmet += flow.electricityUnmetKwh;
    heatUnmet += flow.heatUnmetKwh;
  }
  expect(instance.read().totalElectricityUnmetKwh).toBe(electricityUnmet);
  expect(instance.read().totalHeatUnmetKwh).toBe(heatUnmet);
});

test("full battery curtails surplus without grid charging or export", () => {
  const instance = model.create({ initialBatteryKwh: 8, windOutputKw: 20 });
  instance.advance();
  expect(instance.read().batteryKwh).toBe(8);
  expect(instance.read().flow.curtailedKwh).toBe(15); // Wind 20 minus night demand 5.
  expect(instance.read().flow.electricityNetworkKwh).toBe(0);
  expect(instance.read().flow.batteryChargeKwh).toBe(0);
});

test("live action rejects unknown keys and accessors atomically", () => {
  const instance = model.create();
  const before = instance.read();
  const unknown = { electricityNetworkCapacityKw: 1, solarCapacityKw: 99 };
  expect(() => instance.setNetworkCapacity(unknown)).toThrow(TypeError);
  const accessor = { get electricityNetworkCapacityKw(): number { throw new Error("must not execute"); } };
  expect(() => instance.setNetworkCapacity(accessor)).toThrow(TypeError);
  expect(instance.read()).toEqual(before);
  instance.setNetworkCapacity({ heatNetworkCapacityKw: 1.5 });
  expect(instance.read().parameters.electricityNetworkCapacityKw).toBe(5);
  expect(instance.read().parameters.heatNetworkCapacityKw).toBe(1.5);
});

test("flexible demand keeps the daily total for every share", () => {
  for (const flexibleShare of [0, 0.1, 0.25, 0.5]) {
    const instance = model.create({ demandScale: 1.3 });
    instance.setFlexibleShare(flexibleShare);
    const total = instance.read().demandProfile.reduce((sum, hour) => sum + hour.electricityKwh, 0);
    expect(Math.abs(total - 168 * 1.3)).toBeLessThan(1e-9);
    instance.advance(24);
    expect(Math.abs(instance.read().lastDay.demandKwh - 168 * 1.3)).toBeLessThan(1e-9);
  }
});
