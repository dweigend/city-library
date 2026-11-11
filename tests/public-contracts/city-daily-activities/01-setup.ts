import assert from "node:assert/strict";
import { model } from "../../../models/city-daily-activities/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.equal(state.clock, "Day 1 · 00:00");
assert.deepEqual(state.parameters, { householdCount: 6, remoteWork: false, servicesLocation: "central", servicesCloseHour: 18 });
assert.equal(state.residentCount, 12);
assert.equal(state.residents.filter(resident => resident.activity === "home").length, 12);
assert.deepEqual(state.residents.slice(0, 3).map(resident => [resident.id, resident.role, resident.neighborhood]),
  [["0:adult", "adult", "near"], ["0:child", "child", "near"], ["1:adult", "adult", "middle"]]);
assert.deepEqual(state.places.map(place => place.id), ["home:near", "home:middle", "home:far", "work", "school", "services:central", "services:local"]);
assert.equal(state.tripCount, 0);
assert.equal(state.accountedPersonHours, 0);
assert.equal(state.history.length, 1);
console.log("city-daily-activities setup passed");
