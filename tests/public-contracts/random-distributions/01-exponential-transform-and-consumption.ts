// PROPOSAL ONLY: standard Mulberry profile; no native NetLogo bit-parity claim.
import assert from "node:assert/strict";
import { Random } from "city-library";
for (const mean of [Number.MIN_VALUE, 1, 2 / Math.LN2, 10, Number.MAX_VALUE]) {
  const actual = Random.create({ seed: 7 }), control = actual.copy();
  const uniform = control.number();
  const expected = -mean * Math.log(1 - uniform);
  assert.ok(Number.isFinite(expected));
  assert.equal(actual.number({ distribution: "exponential", mean }), expected);
  assert.deepEqual(actual.state, control.state); // Exactly one stream draw, including finite underflow.
  assert.equal(actual.number(), control.number());
}
const defaultMean = Random.create({ seed: 8 }), explicitMean = defaultMean.copy();
assert.equal(defaultMean.number({ distribution: "exponential" }), explicitMean.number({ distribution: "exponential", mean: 1 }));
assert.deepEqual(defaultMean.state, explicitMean.state);
const undefinedMean = Random.create({ seed: 8 }), omittedMean = undefinedMean.copy();
assert.equal(undefinedMean.number({ distribution: "exponential", mean: undefined }), omittedMean.number({ distribution: "exponential" })); // U4.
assert.deepEqual(undefinedMean.state, omittedMean.state);
const zero = Random.create({ seed: 7 }), unchanged = zero.state;
assert.equal(zero.number({ distribution: "exponential", mean: 0 }), 0);
assert.deepEqual(zero.state, unchanged);
const overflow = Random.create({ seed: 2 }), consumed = overflow.copy();
const highUniform = consumed.number();
assert.ok(highUniform > 1 - Math.exp(-1));
assert.equal(Number.isFinite(-Number.MAX_VALUE * Math.log(1 - highUniform)), false);
assert.throws(() => overflow.number({ distribution: "exponential", mean: Number.MAX_VALUE }));
assert.deepEqual(overflow.state, consumed.state); // Output overflow consumes its draw; no rollback.
console.log("distribution proposal01: exponential formula, defaults, zero, underflow and overflow continuation");
