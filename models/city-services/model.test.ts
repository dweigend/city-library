import { describe, expect, test } from "bun:test";
import { model } from "./model.ts";

describe("Neighborhood Services", () => {
  test("a full nearest facility sends the household to a farther one in reach", () => {
    const instance = model.create({ layout: "distributed", capacityPerKind: 14, maxDistanceKm: 3.5 });
    instance.advance();
    const state = instance.read();
    // West fills with 7; household 14 (x = -1) then reaches the east facility 3.35 km away.
    expect(state.servedCount).toBe(42);
    const crossed = state.requests.filter(request => request.status === "served" &&
      request.facilityId!.endsWith("east") && state.households.find(household => household.id === request.householdId)!.x < 0);
    expect(crossed.length).toBeGreaterThan(0);
  });

  test("too far and full are separate outcomes", () => {
    const tiny = model.create({ maxDistanceKm: 0 });
    tiny.advance();
    expect(tiny.read().tooFarCount).toBe(48);
    const empty = model.create({ capacityPerKind: 0, maxDistanceKm: 10 });
    empty.advance();
    expect(empty.read().fullCount).toBe(48);
  });

  test("demand and capacity are conserved across the policy grid", () => {
    for (const layout of ["central", "distributed"] as const) {
      for (let capacityPerKind = 0; capacityPerKind <= 24; capacityPerKind += 3) {
        for (const maxDistanceKm of [0, 1, 1.5, 2, 2.5, 3, 3.5, 10]) {
          const instance = model.create({ layout, capacityPerKind, maxDistanceKm });
          instance.advance();
          const state = instance.read();
          expect(state.servedCount + state.fullCount + state.tooFarCount).toBe(48);
          expect(state.servedCount).toBeLessThanOrEqual(3 * capacityPerKind);
          for (const facility of state.facilities) expect(facility.used).toBeLessThanOrEqual(facility.capacity);
          expect(state.householdsByServedCount.reduce((sum, count) => sum + count, 0)).toBe(16);
          expect(state.requests.filter(request => request.status === "served").every(request => request.distanceKm! <= maxDistanceKm)).toBe(true);
        }
      }
    }
  });

  test("history stays bounded while totals keep counting", () => {
    const instance = model.create();
    instance.advance(200);
    expect(instance.read().history.length).toBe(120);
    expect(instance.read().totalDemandCount).toBe(200 * 48);
  });
});
