import { strict as assert } from "node:assert";
import { geometry } from "city-library";
const point = Object.freeze({ x: 1, y: 2 });
const space = Object.freeze({ x: 10, y: 10, boundary: "hard" as const });
const result = geometry.normalize(point, { space });
assert.deepEqual(result, point); assert.notEqual(result, point); assert.ok(Object.isFrozen(result));
assert.throws(() => geometry.direction({ heading: Infinity }));
assert.throws(() => geometry.direction({ heading: 0, roll: 20 })); // XYZ requires an explicit pitch
assert.throws(() => geometry.normalize(point, { space: { x: 0, y: 10 } }));
let invoked = false;
const bad = Object.defineProperty({}, "heading", { enumerable: true, get() { invoked = true; return 0; } });
assert.throws(() => geometry.direction(bad as { heading: number })); assert.equal(invoked, false);
assert.ok(Number.isFinite(geometry.direction({ heading: Number.MAX_VALUE }).x));
