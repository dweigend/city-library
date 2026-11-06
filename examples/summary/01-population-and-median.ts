import { strict as assert } from "node:assert";
import { stats, type Summary } from "city-library";
const values = [4, 1, 3, 2];
const summary: Summary = stats.describe(values);
assert.deepEqual(summary, { count: 4, sum: 10, min: 1, max: 4, mean: 2.5, median: 2.5, variance: 1.25, standardDeviation: Math.sqrt(1.25) });
assert.deepEqual(values, [4, 1, 3, 2]);
assert.ok(Object.isFrozen(summary));
