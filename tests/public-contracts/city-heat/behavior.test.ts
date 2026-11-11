import { describe, expect, test } from "bun:test";
import { model } from "../../../models/city-heat/model.ts";

describe("Urban Heat boundary behavior", () => {
  test("rejects policy accessors without invoking them and preserves both values", () => {
    const instance = model.create();
    const before = instance.read();
    let invoked = false;
    const changes = { get shadeFraction() { invoked = true; return 1; } };
    expect(() => instance.setPolicy(changes)).toThrow(TypeError);
    expect(invoked).toBe(false);
    expect(instance.read()).toEqual(before);
    expect(() => instance.setPolicy({ shadeFraction: NaN })).toThrow(RangeError);
    expect(() => instance.setPolicy({ waterAvailability: "1" } as never)).toThrow(TypeError);
    expect(instance.read()).toEqual(before);
  });

  test("no-op policy keeps state and observations are frozen", () => {
    const instance = model.create();
    const before = instance.read();
    instance.setPolicy({});
    expect(instance.read()).toEqual(before);
    expect(Object.isFrozen(before.blocks[0])).toBe(true);
    expect(() => { (before.blocks[0] as { temperatureC: number }).temperatureC = 80; }).toThrow(TypeError);
    instance.advance();
    expect(before.blocks[0]!.temperatureC).toBe(22);
  });

  test("without sun the surfaces follow the air cycle and history drops only oldest samples", () => {
    const instance = model.create({ solarFluxWm2: 0, initialTemperatureC: 26 });
    instance.advance(170);
    const state = instance.read();
    // All blocks see the same forcing; only heat capacity separates them.
    expect(state.blocks.every(block => Math.abs(block.temperatureC - 26) <= 5)).toBe(true);
    expect(state.irrigationWaterKg).toBe(0);
    expect(state.history[0]!.tick).toBe(170 - 48);
    expect(state.history.at(-1)!.tick).toBe(170);
  });

  test("sealed surfaces stay warmer than planted ones every night", () => {
    const instance = model.create();
    instance.advance(24);
    for (let hour = 0; hour < 72; hour += 1) {
      instance.advance();
      const state = instance.read();
      if (state.solarNowWm2 === 0) expect(state.blocks[0]!.temperatureC).toBeGreaterThan(state.blocks[2]!.temperatureC);
    }
  });

  // Equilibrium bounds: air ± 5 °C, minus at most 300/20 = 15 K of evaporative cooling,
  // plus at most 1200 × 0.8 / 20 = 48 K of solar heating.
  test("all extreme forcings and initial temperatures remain bounded throughout", () => {
    for (const airTemperatureC of [-20, 45]) {
      for (const initialTemperatureC of [-20, 60]) {
        for (const solarFluxWm2 of [0, 1200]) {
          for (const shadeFraction of [0, 1]) {
            for (const waterAvailability of [0, 1]) {
              const instance = model.create({ airTemperatureC, initialTemperatureC, solarFluxWm2, shadeFraction, waterAvailability });
              for (let hour = 0; hour < 200; hour += 1) {
                instance.advance();
                const state = instance.read();
                expect(state.blocks.every(block => Number.isFinite(block.temperatureC) && block.temperatureC >= -40 && block.temperatureC <= 100)).toBe(true);
                expect(Math.abs(state.balanceResidualJ)).toBeLessThan(0.05);
              }
            }
          }
        }
      }
    }
  });
});
