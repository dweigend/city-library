import { strict as assert } from "node:assert";
import { stats } from "city-library";
const income = stats.describe([0, 0, 0, 100]);
assert.equal(income.median, 0); // Economic Disparity's source median is not its mean.
assert.equal(income.mean, 25);
const clt = stats.describe([1, 2, 3, 4], { sample: true });
assert.equal(clt.mean, 2.5);
assert.equal(clt.standardDeviation, Math.sqrt(5 / 3));
assert.equal(stats.describe([], { sample: true }).standardDeviation ?? null, null);
