import assert from "node:assert/strict";
import { model } from "../../../models/city-daily-activities/model.ts";

function dayWith(setup: (instance: ReturnType<typeof model.create>) => void) {
  const instance = model.create();
  setup(instance);
  instance.advance(96); // Changes made before setup's first day apply on day 1.
  return instance.read().today;
}

// Experiment A: remote work removes commutes but lengthens errand trips.
const remote = dayWith(instance => instance.setRemoteWork(true));
assert.equal(remote.tripCount, 24);
assert.equal(remote.travelPersonHours, 11);
const remoteLocal = dayWith(instance => { instance.setRemoteWork(true); instance.setServicePolicy({ servicesLocation: "local" }); });
assert.equal(remoteLocal.travelPersonHours, 7);
const commuteLocal = dayWith(instance => instance.setServicePolicy({ servicesLocation: "local" }));
assert.equal(commuteLocal.travelPersonHours, 11.5);

// Experiment B: earlier closing makes errands infeasible for some people.
const early = dayWith(instance => instance.setServicePolicy({ servicesCloseHour: 17 }));
assert.equal(early.missedErrandCount, 6);
assert.equal(early.tripCount, 24);
assert.equal(early.travelPersonHours, 10);
const remoteEarly = model.create();
remoteEarly.setRemoteWork(true);
remoteEarly.setServicePolicy({ servicesCloseHour: 17.5 });
remoteEarly.advance(96);
assert.equal(remoteEarly.read().today.missedErrandCount, 2);
assert.deepEqual(remoteEarly.read().residents.filter(resident => resident.missedErrandToday).map(resident => resident.neighborhood), ["far", "far"]);

// Live changes apply from the next day.
const live = model.create();
live.advance(40);
live.setRemoteWork(true);
live.advance(56);
assert.equal(live.read().today.tripCount, 30);
live.advance(96);
assert.equal(live.read().today.tripCount, 24);
console.log("city-daily-activities remote work and service policy passed");
