import { strict as assert } from "node:assert";
import { stats } from "city-library";
let iterations = 0;
const source = { *[Symbol.iterator]() { iterations++; assert.equal(iterations, 1); yield 2; yield 8; yield 2; } };
const observed = stats.describe(source);
assert.equal(iterations, 1);
assert.deepEqual(observed, { count: 3, sum: 12, min: 2, max: 8, mean: 4, median: 2, variance: 8, standardDeviation: Math.sqrt(8) });
stats.describe([100, 200]);
assert.equal(observed.median, 2);
