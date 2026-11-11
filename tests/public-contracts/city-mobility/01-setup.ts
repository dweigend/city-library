import assert from "node:assert/strict";
import { model } from "../../../models/city-mobility/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, { initialTrips: 0, carCapacity: 5, carPenalty: 0, walkMinutes: 18, departuresPerMinute: 3 });
assert.deepEqual(state.nodes.map(node => node.id), ["home", "junction", "jobs"]);
assert.deepEqual(state.links.map(link => [link.id, link.route, link.minutes, link.capacity, link.used, link.waiting]), [
  ["home-junction", "main", 5, 5, 0, 0],
  ["junction-jobs", "main", 5, 5, 0, 0],
  ["car-bypass", "bypass", 12, 3, 0, 0],
  ["walking-path", "walk", 18, 1000, 0, 0],
]);
assert.equal(state.tripCount, 0);
assert.equal(state.peakMinutes, 60);
assert.equal(state.history.length, 1);
console.log("city-mobility setup passed");
