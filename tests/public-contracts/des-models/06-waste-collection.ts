import assert from "node:assert/strict";
import { model } from "../../../models/des-waste-collection/model.ts";

const collection = model.create();
const independent = model.create();
assert.deepEqual(collection.read(), collection.read());
for (let minute = 1; minute <= 12; minute++) {
  collection.advance();
  const state = collection.read();
  assert.equal(state.tick, minute);
  assert.equal(state.time, minute);
  assert.equal(state.remainingWasteUnitCount + state.carriedWasteUnitCount + state.deliveredWasteUnitCount, 12);
  assert.ok(state.carriedWasteUnitCount >= 0 && state.carriedWasteUnitCount <= 4);
}
assert.equal(collection.read().deliveredWasteUnitCount, 12);
assert.equal(collection.read().remainingWasteUnitCount, 0);
assert.equal(collection.read().carriedWasteUnitCount, 0);
assert.equal(collection.read().busyDepotCount, 0);
assert.equal(collection.read().done, true);
assert.equal(independent.read().time, 0);
assert.equal(independent.read().remainingWasteUnitCount, 12);
assert.throws(() => model.create({ loadCapacity: 0 }), RangeError);
const unitTruck = model.create({ loadCapacity: 1 });
unitTruck.advance(36);
assert.equal(unitTruck.read().deliveredWasteUnitCount, 12);
assert.equal(unitTruck.read().done, true);
