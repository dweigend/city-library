import { expect, test } from "bun:test";
import { createPlayback } from "../ui/playback.ts";

test("playback owns a single cancellable caller timer and stops at model completion", () => {
  let tick: (() => void) | undefined;
  let scheduled = 0;
  let cancelled = 0;
  let steps = 0;
  const changes: boolean[] = [];
  const playback = createPlayback(() => ++steps < 2, (running) => changes.push(running), (callback) => {
    tick = callback;
    scheduled += 1;
    return () => { cancelled += 1; tick = undefined; };
  });
  playback.start();
  playback.start();
  expect(scheduled).toBe(1);
  tick!();
  expect(playback.running).toBe(true);
  tick!();
  expect(steps).toBe(2);
  expect(playback.running).toBe(false);
  expect(cancelled).toBe(1);
  playback.stop();
  expect(cancelled).toBe(1);
  expect(changes).toEqual([true, false]);
  playback.start();
  expect(scheduled).toBe(2);
  playback.stop();
  expect(tick).toBeUndefined();
});
