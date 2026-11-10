import assert from "node:assert/strict";
import { EventTrace, Random, TimeWeighted } from "city-library";

// Occupied desks: 0 for [0,2), 2 for [2,5), 1 for [5,10].
const occupied = TimeWeighted.create({ value: 0 });
occupied.set({ at: 2, value: 2 });
occupied.set({ at: 5, value: 1 });
assert.deepEqual(occupied.read({ until: 10 }), { duration: 10, integral: 11, mean: 1.1 });
assert.deepEqual(occupied.read({ until: 10 }), { duration: 10, integral: 11, mean: 1.1 });
assert.throws(() => occupied.set({ at: 4, value: 0 }));
assert.equal(TimeWeighted.create({ value: 3 }).read({ until: 0 }).mean, undefined);

const trace = EventTrace.create<{ kind: string; customer: number }>({ capacity: 2 });
trace.record({ at: 1, value: { kind: "arrival", customer: 1 } });
trace.record({ at: 2, value: { kind: "service", customer: 1 } });
trace.record({ at: 2, value: { kind: "arrival", customer: 2 } });
assert.deepEqual(trace.read().map(sample => sample.value.kind), ["service", "arrival"]);
assert.throws(() => trace.record({ at: 1, value: { kind: "past", customer: 3 } }));

const random = Random.create({ seed: 17 });
const before = random.state;
assert.equal(random.number({ distribution: "bernoulli", probability: 0 }), 0);
assert.equal(random.number({ distribution: "bernoulli", probability: 1 }), 1);
assert.equal(random.number({ distribution: "triangular", min: 4, mode: 4, max: 4 }), 4);
assert.deepEqual(random.state, before);
const copy = random.copy();
for (let sample = 0; sample < 10; sample++) {
  assert.equal(
    random.number({ distribution: "gamma", shape: 0.7, rate: 2 }),
    copy.number({ distribution: "gamma", shape: 0.7, rate: 2 }),
  );
  const triangular = random.number({ distribution: "triangular", min: 1, mode: 2, max: 5 });
  assert(triangular >= 1 && triangular <= 5);
  assert.equal(triangular, copy.number({ distribution: "triangular", min: 1, mode: 2, max: 5 }));
}
assert.deepEqual(random.state, copy.state);
const checkpoint = random.state;
assert.throws(() => random.number({ distribution: "gamma", shape: 1, rate: 0 }));
assert.throws(() => random.number({ distribution: "bernoulli", probability: 2 }));
assert.deepEqual(random.state, checkpoint);
console.log("DES time-weighted observation, bounded trace and explicit Random continuation passed");
