// PROPOSAL ONLY: error existence/purity is asserted; exact exception classes remain U4.
import assert from "node:assert/strict";
import { Random } from "city-library";
const random = Random.create({ seed: 81 });
random.number({ distribution: "normal" });
const cached = random.state;
assert.notEqual(cached.continuation.gaussian, null);
for (const distribution of ["exponential", "poisson"] as const) {
  assert.equal(random.number({ distribution, mean: 0 }), 0);
  assert.deepEqual(random.state, cached);
  for (const mean of [-1, NaN, Infinity, -Infinity, "1", null]) {
    assert.throws(() => random.number({ distribution, mean } as never));
    assert.deepEqual(random.state, cached);
  }
  for (const key of ["min", "max", "integer", "deviation", "shape", "rate", "lambda", "unknown"]) {
    assert.throws(() => random.number({ distribution, [key]: undefined } as never));
    assert.deepEqual(random.state, cached);
  }
}
assert.throws(() => random.number({ distribution: "poisson", mean: 100000.001 }));
assert.deepEqual(random.state, cached);
let getterCalls = 0;
const bad = Object.defineProperty({}, "mean", { get() { getterCalls++; return 1; } });
Object.defineProperty(bad, "distribution", { value: "exponential" });
assert.throws(() => random.number(bad));
assert.equal(getterCalls, 0);
assert.deepEqual(random.state, cached);
const exponentialControl = random.copy();
exponentialControl.number();
random.number({ distribution: "exponential", mean: 1 });
assert.deepEqual(random.state, exponentialControl.state);
assert.equal(random.state.continuation.gaussian, cached.continuation.gaussian);
random.number({ distribution: "poisson", mean: 150 });
assert.equal(random.state.continuation.gaussian, cached.continuation.gaussian); // U3: this family must not use/clear normal cache.
const beforeCachedNormal = random.state;
assert.equal(random.number({ distribution: "normal" }), cached.continuation.gaussian);
assert.equal(random.state.continuation.word, beforeCachedNormal.continuation.word);
assert.equal(random.state.continuation.gaussian, null);
const outer = random.state;
const twin = random.copy();
const localValues = random.local(() => [random.number({ distribution: "poisson", mean: 150 }), random.number({ distribution: "exponential", mean: 2 / Math.LN2 })]);
assert.deepEqual(localValues, [twin.number({ distribution: "poisson", mean: 150 }), twin.number({ distribution: "exponential", mean: 2 / Math.LN2 })]);
assert.deepEqual(random.state, outer);
const sentinel = new Error("local abort");
assert.throws(() => random.local(() => { random.number({ distribution: "poisson", mean: 150 }); throw sentinel; }), error => error === sentinel);
assert.deepEqual(random.state, outer);
console.log("distribution proposal04: rejection before consumption, closed keys, normal cache and local restoration");
