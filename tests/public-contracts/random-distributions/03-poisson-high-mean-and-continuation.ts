// PROPOSAL ONLY: no exact high-mean trace before U1 selects transformed-rejection details.
import assert from "node:assert/strict";
import { Random } from "city-library";
for (const mean of [30, 150, 100000]) {
  const actual = Random.create({ seed: 2027 }), twin = actual.copy();
  const count = 12000;
  let sum = 0, squaredDeviations = 0;
  for (let index = 0; index < count; index++) {
    const value = actual.number({ distribution: "poisson", mean });
    assert.equal(value, twin.number({ distribution: "poisson", mean }));
    assert.ok(Number.isSafeInteger(value) && value >= 0);
    sum += value;
    squaredDeviations += (value - mean) ** 2;
  }
  assert.deepEqual(actual.state, twin.state);
  assert.ok(Math.abs(sum / count - mean) < 8 * Math.sqrt(mean / count));
  assert.ok(Math.abs(squaredDeviations / count / mean - 1) < 0.15);
}
const random = Random.create({ seed: 778 });
const saved = random.state;
const sequence = [29.9, 30, 150, 100000, 1].map(mean => random.number({ distribution: "poisson", mean }));
const hormone = random.number({ distribution: "exponential", mean: 2 / Math.LN2 });
const finalState = random.state;
random.state = saved;
assert.deepEqual([29.9, 30, 150, 100000, 1].map(mean => random.number({ distribution: "poisson", mean })), sequence);
assert.equal(random.number({ distribution: "exponential", mean: 2 / Math.LN2 }), hormone);
assert.deepEqual(random.state, finalState);
assert.equal(random.state.continuation.revision, "agent-loom-random/1");
console.log("distribution proposal03: branch boundary, liver mean, upper bound, moments and exact self-continuation");
