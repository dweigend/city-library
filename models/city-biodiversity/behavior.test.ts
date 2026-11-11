import { expect, test } from "bun:test";
import { model } from "./model.ts";

test("parameter corners keep every occupancy in [0, 1] and balance gains and losses", () => {
  for (const vegetationQuality of [0, 0.5, 1]) {
    for (const dispersalRate of [0, 1, 3]) {
      for (const extinctionRate of [0, 1]) {
        for (const permeability of [0, 0.3, 1]) {
          const instance = model.create({ vegetationQuality, dispersalRate, extinctionRate, permeability, restorationPlan: "stepping-stone" });
          for (let year = 0; year < 30; year += 1) {
            const before = instance.read();
            instance.advance();
            const state = instance.read();
            for (const patch of state.patches) {
              expect(patch.occupancy).toBeGreaterThanOrEqual(0);
              expect(patch.occupancy).toBeLessThanOrEqual(1);
              const previous = before.patches.find(candidate => candidate.id === patch.id)!.occupancy;
              expect(Math.abs(previous + patch.colonizationGain - patch.extinctionLoss - patch.occupancy)).toBeLessThan(1e-12);
            }
          }
        }
      }
    }
  }
});

test("zero permeability isolates every patch", () => {
  const instance = model.create({ permeability: 0, extinctionRate: 0 });
  instance.advance(20);
  expect(instance.read().eastOccupancy).toBe(0);
  expect(instance.read().patches.every(patch => patch.connectivity === 0)).toBe(true);
});

test("live changes keep previous-year flows and history", () => {
  const instance = model.create();
  instance.advance(3);
  const before = instance.read();
  instance.setPermeability(0.2);
  instance.setRestorationPlan("enlarge-east");
  expect(instance.read().colonizationGain).toBe(before.colonizationGain);
  expect(instance.read().history).toEqual(before.history);
  expect(Object.isFrozen(before.patches[0])).toBe(true);
});
