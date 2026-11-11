import assert from "node:assert/strict";
import { model } from "../../../models/city-services/model.ts";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-6, `${actual} != ${expected}`);

// Experiment A: same capacity, two smaller facilities instead of one central one.
const distributed = model.create();
distributed.setPolicy({ layout: "distributed" });
distributed.advance();
let state = distributed.read();
assert.deepEqual(state.facilities.filter(facility => facility.kind === "school").map(facility => [facility.x, facility.capacity]), [[-2, 6], [2, 6]]);
assert.equal(state.servedCount, 36);
assert.equal(state.fullCount, 12);
assert.equal(state.tooFarCount, 0);
assert.equal(state.unservedHouseholdCount, 4);
assert.deepEqual(state.households.filter(household => household.servedCount === 0).map(household => household.y), [-1.5, -1.5, -1.5, -1.5]);
close(state.meanDistanceKm, 1.346281);

// Experiment B: keep the central facility but accept longer trips.
const longer = model.create();
longer.setMaxDistanceKm(3.5);
longer.advance();
state = longer.read();
assert.equal(state.servedCount, 36);
assert.equal(state.fullCount, 12);
assert.deepEqual(state.households.filter(household => household.servedCount === 0).map(household => household.id),
  ["household:1", "household:4", "household:13", "household:16"]);
close(state.meanDistanceKm, 1.987397);

// Enough distributed capacity serves everyone; zero capacity makes every reachable request full.
distributed.setPolicy({ capacityPerKind: 16 });
distributed.advance();
assert.equal(distributed.read().servedCount, 48);
distributed.setPolicy({ capacityPerKind: 0 });
distributed.advance();
assert.equal(distributed.read().fullCount, 48);
console.log("city-services layout and catchment experiments passed");
