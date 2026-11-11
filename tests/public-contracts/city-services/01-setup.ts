import assert from "node:assert/strict";
import { model } from "../../../models/city-services/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, { capacityPerKind: 12, maxDistanceKm: 2.5, layout: "central" });
assert.equal(state.households.length, 16);
assert.deepEqual([state.households[0]!.x, state.households[0]!.y], [-3, 1.5]);
assert.deepEqual([state.households[15]!.x, state.households[15]!.y], [3, -1.5]);
assert.deepEqual(state.facilities.map(facility => [facility.id, facility.x, facility.y, facility.capacity]),
  [["school:center", 0, 0, 12], ["clinic:center", 0, 0, 12], ["shop:center", 0, 0, 12]]);
assert.equal(state.requests.length, 0);
assert.equal(state.servedCount, 0);
assert.equal(state.history.length, 1);
console.log("city-services setup passed");
