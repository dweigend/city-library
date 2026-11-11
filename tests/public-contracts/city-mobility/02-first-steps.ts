import assert from "node:assert/strict";
import { model } from "../../../models/city-mobility/model.ts";

const instance = model.create();
instance.advance();
let state = instance.read();
assert.equal(state.tripCount, 3);
assert.equal(state.carTripCount, 3);
assert.ok(state.trips.every(trip => trip.route === "main" && trip.status === "moving"));
instance.advance();
state = instance.read();
assert.equal(state.carTripCount, 6);
assert.equal(state.waitingTrips, 1);
assert.equal(state.totalWaitingMinutes, 1);
assert.equal(state.links[0]!.waiting, 1);
instance.advance(3);
state = instance.read();
assert.equal(state.tripCount, 15);
assert.equal(state.bypassTripCount, 4);
assert.equal(state.waitingTrips, 4);
instance.advance(55);
state = instance.read();
assert.equal(state.tripCount, 180);
assert.equal(state.carTripCount, 83);
assert.equal(state.bypassTripCount, 16);
assert.equal(state.walkTripCount, 97);
instance.advance(30);
state = instance.read();
assert.equal(state.completedTrips, 180);
assert.ok(Math.abs(state.meanCompletedTravelMinutes - 17.05) < 1e-9);
assert.equal(state.totalWaitingMinutes, 461);
assert.equal(state.maximumCarTravelMinutes, 23);
for (const sample of state.history) {
  assert.equal(sample.values.completedTrips! + sample.values.waitingTrips! + sample.values.movingTrips!, sample.values.tripCount!);
}
console.log("city-mobility queueing and morning peak passed");
