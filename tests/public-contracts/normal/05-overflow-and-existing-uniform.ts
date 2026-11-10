import { strict as assert } from "node:assert";
import { Random } from "city-library";
const random = Random.add({ seed: 1 });
assert.equal(random.number(), 0.6270739405881613); // accepted existing uniform schedule
const before = random.state;
random.state = { ...before, continuation: { ...before.continuation, gaussian: 2 } };
assert.throws(() => random.number({ distribution: "normal", mean: Number.MAX_VALUE, deviation: Number.MAX_VALUE }), RangeError);
assert.equal(random.state.continuation.gaussian, null); // consumed cache is not silently restored
assert.equal(random.state.continuation.word, before.continuation.word);
const control = Random.add({ seed: 1 }); control.number();
assert.equal(random.number(), control.number());
