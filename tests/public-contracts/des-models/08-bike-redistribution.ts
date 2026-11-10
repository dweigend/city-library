import assert from "node:assert/strict";
import { model } from "../../../models/des-bike-redistribution/model.ts";

const bikes = model.create();
assert.deepEqual(bikes.read().stations.map((station) => station.bikeCount), [6, 0, 0]);
assert.deepEqual(bikes.read(), bikes.read());
for (let minute = 1; minute <= 4; minute++) {
  bikes.advance();
  const state = bikes.read();
  assert.equal(state.totalBikeCount, 6);
  assert.equal(state.stations.reduce((sum, station) => sum + station.bikeCount, state.inTransitBikeCount), 6);
  assert.ok(state.inTransitBikeCount <= 2);
}
assert.deepEqual(bikes.read().stations.map((station) => station.bikeCount), [2, 2, 2]);
assert.deepEqual(bikes.read().trips.map((trip) => trip.arrived), [1, 4]);
assert.equal(bikes.read().deliveredBikeCount, 4);
assert.equal(bikes.read().done, true);
assert.equal(model.create().read().totalBikeCount, 6);
const smallerTruck = model.create({ truckCapacity: 1 });
smallerTruck.advance(10);
assert.deepEqual(smallerTruck.read().stations.map((station) => station.bikeCount), [2, 2, 2]);
assert.equal(smallerTruck.read().totalBikeCount, 6);
assert.throws(() => model.create({ truckCapacity: 0 }), RangeError);
