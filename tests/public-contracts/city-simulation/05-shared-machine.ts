import assert from "node:assert/strict";
import { createWorkshop, reserve, start, cancel, fail, repair, complete, observe, type Workshop } from "../../../models/shared-machine/model.ts";

// Time is in hours. Each job consumes one material unit at start.
// Availability is derived; reservation does not create or consume inventory.
const repairDuration = 1;

const repairedFirst = createWorkshop();
const requestedFirst = createWorkshop();
const cancelled = createWorkshop();
const machineIdentity = repairedFirst.machine;
const untouched = observe(requestedFirst);

const firstReserved = reserve(repairedFirst, "A");
const reservation = observe(repairedFirst);
const competingReservation = reserve(repairedFirst, "B");
const firstStarted = start(repairedFirst, "A");
const runningCancellation = cancel(repairedFirst, "A");
const started = observe(repairedFirst);

repairedFirst.world.tick.advance(1);
const firstFailed = fail(repairedFirst, repairDuration);

const failed = observe(repairedFirst);

const prematureReservation = reserve(repairedFirst, "B");
const prematureRepair = repair(repairedFirst);
const untouchedOtherWorkshop = observe(requestedFirst);

assert.equal(reserve(requestedFirst, "A"), true);
assert.equal(start(requestedFirst, "A"), true);
requestedFirst.world.tick.advance(1);
assert.equal(fail(requestedFirst, repairDuration), true);

repairedFirst.world.tick.advance(1);
requestedFirst.world.tick.advance(1);

// Both scenarios reach hour two, but the operation order differs.
const firstRepaired = repair(repairedFirst);
const secondReserved = reserve(repairedFirst, "B");
const secondStarted = start(repairedFirst, "B");

assert.equal(reserve(requestedFirst, "B"), false);
assert.equal(repair(requestedFirst), true);
assert.equal(requestedFirst.machine.occupant, null);

// A rejected request is definitive; repair does not retry it automatically.
assert.equal(reserve(cancelled, "A"), true);
assert.equal(cancel(cancelled, "A"), true);
assert.deepEqual(observe(cancelled), untouched);

repairedFirst.world.tick.advance(1);
const secondCompleted = complete(repairedFirst, "B");

const final = observe(repairedFirst);

console.log({ failed, final, requestedFirst: observe(requestedFirst) });

assert.equal(firstReserved, true);
assert.equal(competingReservation, false);
assert.equal(firstStarted, true);
assert.equal(runningCancellation, false);
assert.equal(firstFailed, true);
assert.equal(prematureReservation, false);
assert.equal(prematureRepair, false);
assert.equal(firstRepaired, true);
assert.equal(secondReserved, true);
assert.equal(secondStarted, true);
assert.equal(secondCompleted, true);
assert.deepEqual(untouchedOtherWorkshop, untouched);
assert.deepEqual(reservation, {
  tick: 0, inventory: 2, available: 1, consumed: 0,
  phase: "reserved", occupant: "A", readyAt: 0, completed: 0,
});
assert.deepEqual(started, {
  tick: 0, inventory: 1, available: 1, consumed: 1,
  phase: "running", occupant: "A", readyAt: 0, completed: 0,
});
assert.deepEqual(failed, {
  tick: 1, inventory: 1, available: 1, consumed: 1,
  phase: "repair", occupant: null, readyAt: 2, completed: 0,
});
assert.deepEqual(final, {
  tick: 3, inventory: 0, available: 0, consumed: 2,
  phase: "idle", occupant: null, readyAt: 2, completed: 1,
});
assert.equal(repairedFirst.machine, machineIdentity);
assert.notEqual(repairedFirst.machine, requestedFirst.machine);
assert.deepEqual(observe(repairedFirst), final);
assert.deepEqual(observe(repairedFirst), final);
assert.equal(requestedFirst.inventory.quantity, 1);
assert.equal(requestedFirst.inventory.consumed, 1);
assert.equal(requestedFirst.machine.completed, 0);

for (const model of [repairedFirst, requestedFirst, cancelled]) assertBalance(model);

function assertBalance(model: Workshop) {
  const result = observe(model);

  assert.equal(result.inventory + result.consumed, 2);
  assert.ok(result.available >= 0 && result.available <= result.inventory);
  assert.equal(result.occupant !== null, result.phase === "reserved" || result.phase === "running");
}
