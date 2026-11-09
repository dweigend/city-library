import assert from "node:assert/strict";
import { create as flocking } from "../../models/flocking/model.ts";
import { create as fireflies } from "../../models/fireflies/model.ts";
const flock = flocking({ population: 10, vision: 0, seed: 8 });
const before = flock.read().birds.map(b => b.heading);
flock.advance(5);
assert.equal(flock.read().tick, 5);
assert.deepEqual(flock.read().birds.map(b => b.heading), before);
assert.equal(flock.read().birds.length, 10);
const flashes = fireflies({ number: 1, cycleLength: 10, flashLength: 1, flashesToReset: 3, strategy: "delay", seed: 8 });
const clock = flashes.read().fireflies[0]!.clock;
flashes.advance(10);
assert.equal(flashes.read().tick, 10);
assert.equal(flashes.read().fireflies[0]!.clock, clock);
assert.equal(flashes.read().fireflies[0]!.threshold, 1);
const empty = fireflies({ number: 0 });
empty.advance(3);
assert.equal(empty.read().tick, 3); // no extinction stop in source
assert.equal(empty.read().flashingCount, 0);
const observed = flashes.read();
flashes.read();
assert.deepEqual(flashes.read(), observed); // read does not draw RNG or change state
console.log("Unforced headings, flash cycle, empty-world ticking and observation purity verified.");
