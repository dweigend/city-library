import assert from "node:assert/strict";
import { Random } from "city-library";

const random = Random.add({ seed: 1 });
assert.deepEqual([random.number(), random.number(), random.number()], [
  0.6270739405881613, 0.002735721180215478, 0.5274470399599522,
]);
const integer = Random.add({ seed: 1 });
assert.deepEqual(Array.from({ length: 3 }, () => integer.number({ min: -2, max: 3, integer: true })), [1, -2, 0]);
const ranged = Random.add({ seed: 1 });
assert.equal(ranged.number({ distribution: "uniform", min: 10, max: 20 }), 10 + 10 * 0.6270739405881613);
const raw = Random.add({ seed: 1 });
assert.equal(raw.raw({ kind: "double" }), Random.add({ seed: 1 }).number());
const checkpoint = integer.state;
assert.throws(() => integer.number({ min: 2, max: 2 }));
assert.deepEqual(integer.state, checkpoint);
console.log("seeded-draws: exact Mulberry fixtures, integer bounds, atomic invalid draws");
