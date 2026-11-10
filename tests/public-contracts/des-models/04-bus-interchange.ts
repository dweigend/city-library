/** Frozen public city-model contract; time is minutes. */
import assert from "node:assert/strict";
import { create as buses } from "../../../models/des-bus-interchange/model.ts";

const interchange = buses();
assert.equal(interchange.read().travelMinutes, 5);
interchange.advance(5);
assert.equal(interchange.read().waiting, 1);
interchange.advance(4);
assert.deepEqual(interchange.read().buses.map((bus) => bus.departed), [7, 9]);
assert.equal(interchange.read().tick, 9);
assert.equal(interchange.read().time, 9);

const independent = buses();
const baseline = independent.read();
assert.throws(() => independent.advance(-1), RangeError);
assert.deepEqual(independent.read(), baseline);
