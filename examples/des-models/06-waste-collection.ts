import assert from "node:assert/strict";
import { model } from "../../experiments/des-waste-collection/model.ts";

const collection = model.create();
const independent = model.create();
assert.deepEqual(collection.read(), collection.read());
for (let minute = 1; minute <= 12; minute++) {
  collection.advance();
  const state = collection.read();
  assert.equal(state.tick, minute);
  assert.equal(state.time, minute);
  assert.equal(state.remaining + state.carried + state.delivered, 12);
  assert.ok(state.carried >= 0 && state.carried <= 4);
}
assert.equal(collection.read().delivered, 12);
assert.equal(collection.read().remaining, 0);
assert.equal(collection.read().carried, 0);
assert.equal(collection.read().depotBusy, 0);
assert.equal(collection.read().done, true);
assert.equal(independent.read().time, 0);
assert.equal(independent.read().remaining, 12);
assert.throws(() => model.create({ loadCapacity: 0 }), RangeError);
const unitTruck = model.create({ loadCapacity: 1 });
unitTruck.advance(36);
assert.equal(unitTruck.read().delivered, 12);
assert.equal(unitTruck.read().done, true);
