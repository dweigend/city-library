import assert from "node:assert/strict";
import { stats } from "city-library";
const values = [-1, 0, 1, 2, 3, 4, 5];
const edges = [0, 2, 4];
assert.deepEqual(stats.histogram(values, { edges }), { edges: [0, 2, 4], counts: [2, 3], underflow: 1, overflow: 1 });
assert.deepEqual(values, [-1, 0, 1, 2, 3, 4, 5]);
assert.deepEqual(edges, [0, 2, 4]);
