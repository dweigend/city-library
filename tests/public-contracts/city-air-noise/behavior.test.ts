import { expect, test } from "bun:test";
import { model } from "../../../models/city-air-noise/model.ts";

test("fractional flows conserve mass across bounded transport and decay policies", () => {
  for (const transportFraction of [0, 0.1, 0.5, 1]) {
    for (const decayFraction of [0, 0.25, 0.9, 1]) {
      const instance = model.create({ trafficVehiclesPerHour: 17.5, transportFraction, decayFraction });
      instance.advance(50);
      instance.setTraffic(6000);
      instance.advance(50);
      const state = instance.read();
      const balance = state.retainedMassMicrograms + state.decayedMassMicrograms + state.exitedMassMicrograms;
      expect(Math.abs(balance - state.emittedMassMicrograms) / state.emittedMassMicrograms).toBeLessThan(1e-12);
      for (const receptor of state.receptors) {
        expect(receptor.massMicrograms).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(receptor.concentrationExposureMicrogramMinutesPerCubicMeter)).toBe(true);
      }
    }
  }
});

test("noise sums source intensities energetically above the background", () => {
  const instance = model.create();
  const backgroundIntensity = 1e-8;
  const before = instance.read().receptors[1]!;
  // Street receptor at x = 150 m: source 0 m along the street, source 100 m along the street, both 10 m away laterally.
  const expected = 10 * 1e6 * 1e-12 * (100 / 100 + 100 / (100 ** 2 + 100));
  expect((before.intensityWattsPerSquareMeter - backgroundIntensity) / expected).toBeCloseTo(1, 12);
  instance.setTraffic(300);
  const after = instance.read().receptors[1]!;
  expect((before.intensityWattsPerSquareMeter - backgroundIntensity) / (after.intensityWattsPerSquareMeter - backgroundIntensity)).toBeCloseTo(2, 12);
  expect(before.noiseDecibels - after.noiseDecibels).toBeGreaterThan(2.99);
  expect(before.noiseDecibels - after.noiseDecibels).toBeLessThan(3.02);
});

test("the upwind box stays clean whatever the ventilation", () => {
  for (const transportFraction of [0, 0.3, 1]) {
    const instance = model.create({ transportFraction });
    instance.advance(30);
    expect(instance.read().receptors[0]!.concentrationMicrogramsPerCubicMeter).toBe(0);
  }
});

test("a live edit changes instantaneous sound but cannot rewrite prior exposure", () => {
  const instance = model.create();
  instance.advance(4);
  const saved = instance.read();
  instance.setTraffic(0);
  expect(instance.read().receptors[0]!.noiseExposureJoulesPerSquareMeter).toBe(saved.receptors[0]!.noiseExposureJoulesPerSquareMeter);
  expect(Object.isFrozen(saved.receptors)).toBe(true);
  expect(Object.isFrozen(saved.receptors[0])).toBe(true);
  expect(Object.isFrozen(saved.history[0]!.values)).toBe(true);
  instance.advance(2);
  expect(instance.read().receptors[0]!.noiseExposureJoulesPerSquareMeter
    - saved.receptors[0]!.noiseExposureJoulesPerSquareMeter).toBeCloseTo(0.0000012, 14);
  expect(saved.tick).toBe(4);
});
