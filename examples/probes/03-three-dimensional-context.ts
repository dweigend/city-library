import { strict as assert } from "node:assert";
import { geometry } from "city-library";
const space = { x: 10, y: 8, z: 6, boundary: { x: "wrap", y: "hard", z: "wrap" } } as const;
assert.deepEqual(geometry.normalize({ x: 5, y: 4, z: 3 }, { space }), { x: -5, y: 4, z: -3 });
assert.equal(geometry.normalize({ x: 5, y: 4, z: 3 }, { space, endpoints: "half-open" }), undefined);
assert.throws(() => geometry.normalize({ x: 0, y: 0 }, { space }), TypeError);
assert.throws(() => geometry.normalize({ x: 0, y: 0, z: 0 }, { space: { x: 10, y: 8 } }), TypeError);
