import assert from "node:assert/strict";
import { model } from "../../../models/city-mobility/model.ts";

function peak(changes: Parameters<ReturnType<typeof model.create>["setPolicy"]>[0]) {
  const instance = model.create();
  instance.setPolicy(changes);
  instance.advance(90);
  return instance.read();
}
const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-4, `${actual} != ${expected}`);

// Experiment A: double road capacity attracts car trips; total queueing grows.
const capacity = peak({ carCapacity: 10 });
assert.equal(capacity.carTripCount, 151);
assert.equal(capacity.walkTripCount, 29);
close(capacity.meanCompletedTravelMinutes, 15.9167);
assert.equal(capacity.totalWaitingMinutes, 801);
assert.ok(capacity.links.filter(link => link.route === "main").every(link => link.capacity === 10));

// Experiment B: a faster walking route.
const walking = peak({ walkMinutes: 12 });
assert.equal(walking.carTripCount, 76);
assert.equal(walking.walkTripCount, 104);
close(walking.meanCompletedTravelMinutes, 11.6722);
assert.equal(walking.totalWaitingMinutes, 63);

// Experiment C: a car penalty with the single-field action.
const penalty = model.create();
penalty.setCarPenalty(5);
penalty.advance(90);
assert.equal(penalty.read().carTripCount, 77);
assert.equal(penalty.read().walkTripCount, 103);
close(penalty.read().meanCompletedTravelMinutes, 15.3889);
assert.equal(penalty.read().totalWaitingMinutes, 116);

// No demand, then a manual pulse; lowering capacity retains current holders.
const manual = model.create({ initialTrips: 1000 });
manual.setPolicy({ departuresPerMinute: 0, carCapacity: 1 });
assert.equal(manual.read().links[0]!.used, 5);
manual.advance(2);
assert.ok(manual.read().links.every(link => link.used <= link.capacity || link.id === "home-junction"));
manual.dispatchTrips(4);
assert.equal(manual.read().tripCount, 1004);
manual.advance(400);
assert.equal(manual.read().completedTrips, 1004);
console.log("city-mobility capacity, walking and penalty experiments passed");
