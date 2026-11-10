import assert from "node:assert/strict";
import { geometry, type Bounds } from "../../../index.ts";
const from: Bounds = [0, 10, 0, 20], to: Bounds = [0, 100, 0, 100];
assert.deepEqual(geometry.map({ x: 0, y: 0 }, { from, to }), { x: 25, y: 0 });
assert.deepEqual(geometry.map({ x: 10, y: 20 }, { from, to }), { x: 75, y: 100 });
assert.deepEqual(geometry.map({ x: 5, y: 10 }, { from, to }), { x: 50, y: 50 });
assert.deepEqual(geometry.map({ x: 10, y: 20 }, { from, to, mode: "uniform-centered" }), { x: 75, y: 100 });
assert.deepEqual(geometry.map({ x: 10, y: 20 }, { from, to, mode: "independent-axes" }), { x: 100, y: 100 });
