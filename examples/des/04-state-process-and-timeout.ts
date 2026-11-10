import assert from "node:assert/strict";
import { Agenda, Resource, Signal } from "city-library";

const signal = Signal.create("red");
const wait = signal.wait(value => value === "green");
assert.equal(wait.status, "waiting");
signal.set("green");
assert.equal(wait.status, "satisfied");
signal.cancel(wait);
assert.equal(wait.status, "satisfied");

// Ordinary model state owns the stage; Agenda owns only pending event data.
const agenda = Agenda.create<{ kind: "resume"; generation: number }>();
let stage = 0;
let generation = 0;
let status: "passive" | "scheduled" | "cancelled" = "passive";
let pending: ReturnType<typeof agenda.add> | undefined;
function schedule(at: number): void {
  if (status === "cancelled") throw new Error("The model process was cancelled.");
  if (pending) agenda.delete(pending);
  generation++;
  pending = agenda.add({ at, data: { kind: "resume", generation } });
  status = "scheduled";
}
function passivate(): void {
  if (pending) agenda.delete(pending);
  pending = undefined;
  status = "passive";
}
function dispatch(eventGeneration: number): void {
  if (eventGeneration !== generation || status !== "scheduled") return;
  pending = undefined;
  stage++;
  if (stage === 1) schedule(agenda.time + 3);
  else passivate();
}
schedule(2);
const first = agenda.next({ until: 10 });
assert(first);
dispatch(first.data.generation);
assert.equal(agenda.time, 2);
assert.equal(stage, 1);
assert.equal(status, "scheduled");
// A replacement handle interrupts the pending delay at 5.
schedule(4);
const interrupted = agenda.next({ until: 10 });
assert(interrupted);
assert.equal(interrupted.at, 4);
dispatch(interrupted.data.generation);
assert.equal(stage, 2);
assert.equal(status, "passive");
dispatch(first.data.generation);
assert.equal(stage, 2);
assert.equal(agenda.next({ until: 10 }), undefined);
passivate();
status = "cancelled";
assert.equal(status, "cancelled");
assert.throws(() => schedule(agenda.time));

// At equal time first-dispatched wins. No timer or Promise participates.
const races = Agenda.create<"release" | "timeout">();
const desk = Resource.create<string>({ capacity: 1 });
const holder = desk.request({ owner: "resident A" });
const waiter = desk.request({ owner: "resident B" });
races.add({ at: 1, priority: -1, data: "timeout" });
races.add({ at: 1, data: "release" });
for (let remaining = 2; remaining > 0; remaining--) {
  const event = races.next({ until: 1 });
  assert(event);
  if (event.data === "timeout") desk.cancel(waiter);
  else desk.release(holder);
}
assert.equal(waiter.status, "cancelled");
assert.equal(desk.used, 0);

const releaseFirst = Agenda.create<"release" | "timeout">();
const reverseDesk = Resource.create<string>({ capacity: 1 });
const reverseHolder = reverseDesk.request({ owner: "resident A" });
const reverseWaiter = reverseDesk.request({ owner: "resident B" });
releaseFirst.add({ at: 1, priority: -1, data: "release" });
releaseFirst.add({ at: 1, data: "timeout" });
for (let remaining = 2; remaining > 0; remaining--) {
  const event = releaseFirst.next({ until: 1 });
  assert(event);
  if (event.data === "timeout") {
    // Timeouts apply only while waiting; a completed grant wins the race.
    if (reverseWaiter.status === "waiting") reverseDesk.cancel(reverseWaiter);
  } else reverseDesk.release(reverseHolder);
}
assert.equal(reverseWaiter.status, "granted");
assert.equal(reverseDesk.used, 1);
reverseDesk.release(reverseWaiter);
console.log("DES one-shot state waits, explicit process interruption and timeout race passed");
