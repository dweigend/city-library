/** Frozen public city-model contract; time is minutes. */
import assert from "node:assert/strict";
import { create as charging } from "../../experiments/des-ev-charging/model.ts";

const ev = charging();
assert.equal(ev.read().waiting, 1);
ev.advance(4);
assert.deepEqual(ev.read().vehicles.map((vehicle) => vehicle.finished), [2, 4, 4]);
assert.equal(ev.read().completed, 3);
assert.equal(ev.read().active, 0);

const independent = charging();
const baseline = independent.read();
assert.throws(() => independent.advance(-1), RangeError);
assert.deepEqual(independent.read(), baseline);
