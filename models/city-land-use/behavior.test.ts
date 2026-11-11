import { test, expect } from "bun:test";
import { model } from "./model.ts";

test("all feasible targets conserve area and retain protected green in both patterns", () => {
  for (const growthPattern of ["compact", "dispersed"] as const) {
    for (let residentialDemand = 0; residentialDemand <= 48; residentialDemand += 6) {
      for (let commercialDemand = 0; commercialDemand <= 48 - residentialDemand; commercialDemand += 6) {
        const instance = model.create({ residentialDemand, commercialDemand, conversionLimit: 12, growthPattern });
        instance.applyProtectionPlan("corridor");
        instance.advance(6);
        const state = instance.read();
        expect(state.residentialAreaHa + state.commercialAreaHa + state.greenAreaHa).toBe(48);
        expect(state.parcels.filter(parcel => parcel.column === 1).every(parcel => parcel.use === "green")).toBe(true);
        expect(state.largestGreenPatchHa).toBeLessThanOrEqual(state.greenAreaHa);
        if (residentialDemand + commercialDemand <= 42) {
          expect(state.residentialAreaHa).toBe(residentialDemand);
          expect(state.commercialAreaHa).toBe(commercialDemand);
        }
      }
    }
  }
});

test("zero conversion budget advances time without reallocating land", () => {
  const instance = model.create({ conversionLimit: 0 });
  instance.advance(3);
  expect(instance.read().tick).toBe(3);
  expect(instance.read().residentialAreaHa).toBe(4);
  expect(instance.read().unmetResidentialDemand).toBe(20);
  expect(instance.read().convertedParcelCount).toBe(0);
});

test("protecting developed land prevents restoration until released", () => {
  const instance = model.create({ residentialDemand: 0, commercialDemand: 0, conversionLimit: 12 });
  instance.setProtection("parcel:18", true);
  instance.advance(10);
  expect(instance.read().residentialAreaHa).toBe(1);
  instance.setProtection("parcel:18", false);
  instance.advance();
  expect(instance.read().greenAreaHa).toBe(48);
  expect(instance.read().largestGreenPatchHa).toBe(48);
  expect(instance.read().urbanEdgeKm).toBe(0);
});

test("unknown and accessor demand changes fail atomically", () => {
  const instance = model.create();
  const before = instance.read();
  expect(() => instance.setDemand({ conversionLimit: 0 } as never)).toThrow(TypeError);
  expect(() => instance.setDemand(Object.defineProperty({}, "residentialDemand", { get() { throw new Error("Must not read accessor"); }, enumerable: true }))).toThrow(TypeError);
  expect(instance.read()).toEqual(before);
});
