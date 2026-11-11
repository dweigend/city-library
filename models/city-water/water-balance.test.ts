import { test, expect } from "bun:test";
import { model } from "./model.ts";

test("an empty reservoir with zero demand has neither shortage nor wastewater", () => {
  const instance = model.create({ initialStoredM3: 0, inflowM3PerDay: 0, dryInflowM3PerDay: 0, demandM3PerDay: 0 });
  instance.advance(3);
  const state = instance.read();
  expect(state.requestM3).toBe(0);
  expect(state.shortageM3).toBe(0);
  expect(state.wastewaterM3).toBe(0);
  expect(state.balanceErrorM3).toBe(0);
  expect(state.worstDayCutShare).toBe(0);
});

test("savings apply only on days that begin below the trigger", () => {
  const instance = model.create({ conservationTrigger: 0.799, conservationShare: 0.5, drySpellStartDay: 0 });
  instance.advance();
  expect(instance.read().conservedM3).toBe(0); // Day 1 begins at exactly 0.8.
  instance.advance();
  expect(instance.read().conservedM3).toBe(100);
  expect(instance.read().conservationDayCount).toBe(1);
});

test("zero and full wastewater shares preserve balance without treatment", () => {
  for (const wastewaterShare of [0, 1]) {
    const instance = model.create({ wastewaterShare, treatmentCapacityM3PerDay: 0 });
    instance.advance();
    const state = instance.read();
    expect(state.treatedM3).toBe(0);
    expect(state.untreatedM3).toBe(200 * wastewaterShare);
    expect(state.consumedM3).toBe(200 * (1 - wastewaterShare));
    expect(state.balanceErrorM3).toBe(0);
  }
});

test("fractional transfers conserve water through history eviction and policy changes", () => {
  const instance = model.create({ reservoirCapacityM3: 7.5, initialStoredM3: 3.25,
    inflowM3PerDay: 1.1, dryInflowM3PerDay: 0.2, drySpellStartDay: 30, drySpellDays: 300, demandM3PerDay: 2.3, wastewaterShare: 0.63 });
  for (let day = 0; day < 800; day += 1) {
    if (day === 400) instance.setConservationRule({ conservationTrigger: 0.4, conservationShare: 0.53 });
    instance.advance();
    const state = instance.read();
    expect(state.storedM3).toBeGreaterThanOrEqual(0);
    expect(state.storedM3).toBeLessThanOrEqual(7.5);
    expect(Math.abs(state.balanceErrorM3)).toBeLessThan(1e-8);
    expect(Math.abs(state.suppliedM3 + state.shortageM3 + state.conservedM3 - state.demandM3)).toBeLessThan(1e-12);
    expect(Math.abs(state.consumedM3 + state.treatedM3 + state.untreatedM3 - state.suppliedM3)).toBeLessThan(1e-12);
  }
  expect(instance.read().history.length).toBe(366);
});

test("invalid primitive live values fail without mutation", () => {
  const instance = model.create();
  const before = instance.read();
  for (const action of [instance.setInflow, instance.setTreatmentCapacity, instance.setConservationShare]) {
    // @ts-expect-error Runtime callers can supply unsupported values.
    expect(() => action(undefined)).toThrow(TypeError);
    // @ts-expect-error Runtime callers can supply unsupported values.
    expect(() => action("1")).toThrow(TypeError);
  }
  expect(instance.read()).toEqual(before);
});
