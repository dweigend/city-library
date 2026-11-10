import { strict as assert } from "node:assert";
import { stats } from "city-library";
assert.deepEqual(stats.describe([]), { valueCount: 0, sum: 0, min: undefined, max: undefined, mean: undefined, median: undefined, variance: undefined, standardDeviation: undefined });
assert.equal(stats.describe([7]).variance, 0);
assert.equal(stats.describe([7], { sample: true }).variance, undefined);
assert.equal(stats.describe([7], { sample: true }).median, 7);
assert.equal(stats.describe([1, 2, 3], { sample: true }).variance, 1);
assert.equal(stats.describe([1, 2, 3], { sample: true }).standardDeviation, 1);
