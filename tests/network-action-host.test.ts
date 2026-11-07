import { expect, test } from "bun:test";
import { createRepeatedAction } from "../ui/actions/repeat.ts";
import { createPlayback } from "../ui/playback.ts";

function fixture() {
  const original = { tick: 0, rewires: 0, active: true };
  let current: typeof original | undefined = original;
  let repeatTick = () => {};
  let cancelled = 0;
  let failRead = false;
  let failAction = false;
  const errors: unknown[] = [];
  const changes: boolean[] = [];
  let stopRelated = () => {};
  const action = createRepeatedAction({
    current: () => current,
    enabled(model) {
      if (failRead) throw new Error("Read failed");
      return model.active;
    },
    perform(model) {
      model.rewires++;
      if (failAction) throw new Error("Committed action failed");
    },
    changed: running => changes.push(running),
    failed(error) { errors.push(error); stopRelated(); },
    intervalMs: 200,
    schedule(callback, intervalMs) {
      expect(intervalMs).toBe(200);
      repeatTick = callback;
      return () => { cancelled++; };
    },
  });
  return {
    action, original, errors, changes,
    pulse: () => repeatTick(),
    queued: () => repeatTick,
    replace: () => { current = { tick: 0, rewires: 0, active: true }; return current; },
    remove: () => { current = undefined; },
    readFails: () => { failRead = true; },
    actionFails: () => { failAction = true; },
    related: (stop: () => void) => { stopRelated = stop; },
    cancelled: () => cancelled,
  };
}

test("repetition is tickless and independent of scientific Run/Pause", () => {
  const f = fixture();
  let scientificTick = () => {};
  const playback = createPlayback(() => { f.original.tick++; return true; }, () => {}, tick => {
    scientificTick = tick;
    return () => {};
  });
  f.action.start();
  f.pulse(); f.pulse();
  expect(f.original).toMatchObject({ tick: 0, rewires: 2 });
  playback.start(); scientificTick(); f.pulse();
  expect(f.original).toMatchObject({ tick: 1, rewires: 3 });
  playback.stop(); f.pulse();
  expect(f.original).toMatchObject({ tick: 1, rewires: 4 });
  f.action.stop();
  expect(f.changes).toEqual([true, false]);
});

test("stop/restart rejects already queued callbacks and never writes to replaced instances", () => {
  const f = fixture();
  f.action.start();
  const oldCallback = f.queued();
  f.action.stop(); f.action.start(); oldCallback();
  expect(f.original.rewires).toBe(0);
  f.pulse();
  expect(f.original.rewires).toBe(1);
  const next = f.replace(); f.pulse();
  expect(f.action.running).toBe(false);
  expect(next.rewires).toBe(0);
  expect(f.original.rewires).toBe(1);
  f.action.start(); f.pulse();
  expect(next.rewires).toBe(1);
  f.remove(); f.pulse();
  expect(f.action.running).toBe(false);
});

test("disabled predicates stop repetition and prevent restarting", () => {
  const f = fixture();
  f.action.start();
  f.original.active = false;
  f.action.sync(); f.pulse(); f.action.start();
  expect(f.original.rewires).toBe(0);
  expect(f.cancelled()).toBe(1);
  expect(f.action.running).toBe(false);
});

test("action and read errors stop related playback without retrying a committed action", () => {
  for (const phase of ["action", "read"] as const) {
    const f = fixture();
    const playback = createPlayback(() => true, () => {}, () => () => {});
    f.related(() => playback.stop());
    playback.start(); f.action.start();
    if (phase === "action") f.actionFails(); else f.readFails();
    f.pulse(); f.pulse();
    expect(f.errors).toHaveLength(1);
    expect(f.original.rewires).toBe(phase === "action" ? 1 : 0);
    expect(f.action.running).toBe(false);
    expect(playback.running).toBe(false);
  }
});

test("invalid cadence fails before a scheduler is installed", () => {
  for (const intervalMs of [0, -1, NaN, Infinity]) {
    expect(() => createRepeatedAction({
      current: () => ({}), enabled: () => true, perform() {}, changed() {}, failed() {},
      intervalMs, schedule() { throw new Error("Must not schedule"); },
    })).toThrow("interval must be positive and finite");
  }
});
