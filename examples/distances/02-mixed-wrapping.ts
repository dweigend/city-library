import { strict as assert } from "node:assert";
import { geometry } from "city-library";
const space = { x: 10, y: 20, boundary: { x: "wrap", y: "hard" } } as const;
const a = { x: 4, y: 9 }, b = { x: -4, y: -9 };
assert.equal(geometry.distance(a, b, { space }), Math.hypot(2, 18));
assert.equal(geometry.distance(a, b, { space, wrap: false }), Math.hypot(8, 18));
assert.equal(geometry.distance(a, b, { space }), geometry.distance(b, a, { space }));
