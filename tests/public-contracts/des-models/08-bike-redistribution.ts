import assert from "node:assert/strict";
import { model } from "../../../models/des-bike-redistribution/model.ts";

const bikes = model.create();
assert.deepEqual(bikes.read().stations.map((station) => station.bikes), [6, 0, 0]);
assert.deepEqual(bikes.read(), bikes.read());
for (let minute = 1; minute <= 4; minute++) {
  bikes.advance();
  const state = bikes.read();
  assert.equal(state.totalBikes, 6);
  assert.equal(state.stations.reduce((sum, station) => sum + station.bikes, state.inTransit), 6);
  assert.ok(state.inTransit <= 2);
}
assert.deepEqual(bikes.read().stations.map((station) => station.bikes), [2, 2, 2]);
assert.deepEqual(bikes.read().trips.map((trip) => trip.arrived), [1, 4]);
assert.equal(bikes.read().delivered, 4);
assert.equal(bikes.read().done, true);
assert.equal(model.create().read().totalBikes, 6);
const smallerTruck = model.create({ truckCapacity: 1 });
smallerTruck.advance(10);
assert.deepEqual(smallerTruck.read().stations.map((station) => station.bikes), [2, 2, 2]);
assert.equal(smallerTruck.read().totalBikes, 6);
assert.throws(() => model.create({ truckCapacity: 0 }), RangeError);
