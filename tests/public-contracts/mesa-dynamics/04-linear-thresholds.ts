import assert from "node:assert/strict";
import { continuous } from "city-library";

// Litres and minutes; the rate is litres per minute.
const from = 20;
const duration = 4;
const to = continuous.linear({ value: from, rate: 5, duration });
assert.equal(to, 40);
assert.deepEqual(continuous.crossing({ from, to, threshold: 30, duration }), {
  elapsed: 2, value: 30, direction: "rising",
});
assert.equal(continuous.crossing({ from: 30, to: 40, threshold: 30, duration }), undefined);
assert.equal(continuous.crossing({ from: 20, to: 30, threshold: 30, duration })?.elapsed, 4);
assert.equal(continuous.crossing({ from: 40, to: 20, threshold: 30, duration, direction: "rising" }), undefined);
assert.throws(() => continuous.linear({ value: 20, rate: 5, duration: -1 }), RangeError);
