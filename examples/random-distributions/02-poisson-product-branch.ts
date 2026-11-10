// PROPOSAL ONLY: nonboundary product-loop oracles; equality/endpoint policy remains U2.
import assert from "node:assert/strict";
import { Random } from "city-library";
const fixtures = [
  { mean: 0.01, value: 0, draws: 1 },
  { mean: 1, value: 0, draws: 1 },
  { mean: 5, value: 1, draws: 2 },
  { mean: 29.9, value: 25, draws: 26 },
];
for (const { mean, value, draws } of fixtures) {
  const actual = Random.create({ seed: 7 }), control = actual.copy();
  let product = 1, previous = 1;
  for (let index = 0; index < draws; index++) {
    previous = product;
    product *= control.number();
  }
  const threshold = Math.exp(-mean);
  assert.ok(previous > threshold && product < threshold); // Strictly separated; < vs <= cannot affect this fixture.
  assert.equal(actual.number({ distribution: "poisson", mean }), value);
  assert.deepEqual(actual.state, control.state);
  assert.equal(actual.number(), control.number());
}
const defaultMean = Random.create({ seed: 8 }), explicitMean = defaultMean.copy();
assert.equal(defaultMean.number({ distribution: "poisson" }), explicitMean.number({ distribution: "poisson", mean: 1 }));
assert.deepEqual(defaultMean.state, explicitMean.state);
const zero = Random.create({ seed: 9 });
const checkpoint = zero.state;
assert.equal(zero.number({ distribution: "poisson", mean: 0 }), 0);
assert.deepEqual(zero.state, checkpoint);
// A small-mean sample has an independently known mass at zero, exp(-mean).
const sample = Random.create({ seed: 123 });
let zeros = 0;
for (let index = 0; index < 12000; index++) {
  const value = sample.number({ distribution: "poisson", mean: 1 });
  assert.ok(Number.isSafeInteger(value) && value >= 0);
  if (value === 0) zeros++;
}
assert.ok(Math.abs(zeros / 12000 - Math.exp(-1)) < 0.03);
console.log("distribution proposal02: low-mean product stopping, stream trace, zero mass and default mean");
