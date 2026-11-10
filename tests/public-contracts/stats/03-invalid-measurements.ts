import assert from "node:assert/strict";
import { stats } from "city-library";
for (const values of [[-1], [Number.NaN], [Number.POSITIVE_INFINITY]]) assert.throws(() => stats.gini(values));
assert.throws(() => stats.gini([Number.MAX_VALUE, Number.MAX_VALUE]));
for (const edges of [[], [0], [1, 1], [1, 0], [0, Number.NaN]]) assert.throws(() => stats.histogram([1], { edges }));
assert.throws(() => stats.histogram([Number.NaN], { edges: [0, 1] }));
