import assert from "node:assert/strict";
import { stats } from "city-library";
assert.equal(stats.gini([]), 0);
assert.equal(stats.gini([0, 0]), 0);
assert.equal(stats.gini([7, 7, 7]), 0);
assert.equal(stats.gini([0, 0, 9]), 2 / 3);
assert.ok(Math.abs(stats.gini([1, 2, 3]) - 2 / 9) < 1e-12);
