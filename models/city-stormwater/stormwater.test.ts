import { describe, expect, test } from "bun:test";
import { model } from "./model.ts";

describe("Urban Stormwater", () => {
  test("soil storage never exceeds its capacity and infiltration falls as it fills", () => {
    const instance = model.create({ rainMmPerHour: 50, infiltrationMmPerHour: 100 });
    const infiltration: number[] = [];
    for (let hour = 0; hour < 3; hour += 1) {
      instance.advance();
      const green = instance.read().plots[1]!;
      expect(green.soilStorageMm).toBeLessThanOrEqual(20);
      infiltration.push(green.intervalInfiltrationMm);
    }
    expect(infiltration[0]).toBe(20); // Capacity, not the 100 mm/h rate, limits the first hour.
    expect(infiltration[1]!).toBeLessThan(infiltration[0]!);
  });

  test("impervious rain always runs off", () => {
    const instance = model.create({ infiltrationMmPerHour: 100 });
    instance.advance();
    // 10 mm on 2000 m² impervious = 20 m³; pervious soil takes all of its 10 mm.
    expect(instance.read().intervalRunoffM3).toBeCloseTo(20, 9);
  });

  test("a zero-capacity basin passes outlet flow and overflows the rest", () => {
    const instance = model.create({ retentionCapacityM3: 0 });
    instance.advance();
    expect(instance.read().storedM3).toBe(0);
    expect(instance.read().intervalDischargedM3).toBe(4);
    expect(instance.read().intervalOverflowM3).toBeCloseTo(24, 9);
  });

  test("bounds and balance hold under alternating fractional rain, infiltration and patterns", () => {
    const instance = model.create({ retentionCapacityM3: 0.123, outletM3PerHour: 0.037 });
    for (let hour = 0; hour < 1000; hour += 1) {
      instance.setRain(hour % 3 === 0 ? 0 : 17.13);
      instance.setInfiltration(hour % 2 === 0 ? 4.59 : 99.9);
      instance.setStormPattern(hour % 5 === 0 ? "double" : "single");
      instance.advance();
      const state = instance.read();
      expect(state.storedM3).toBeGreaterThanOrEqual(0);
      expect(state.storedM3).toBeLessThanOrEqual(0.123 + 1e-12);
      expect(Math.abs(state.balanceErrorM3)).toBeLessThan(1e-8);
    }
  });
});
