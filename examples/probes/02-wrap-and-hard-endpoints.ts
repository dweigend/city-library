import { strict as assert } from "node:assert";
import { geometry } from "city-library";
const space = { x: 10, y: 4, boundary: { x: "wrap", y: "hard" } } as const;
assert.deepEqual(geometry.normalize({ x: 18, y: 2 }, { space }), { x: -2, y: 2 });
assert.equal(geometry.normalize({ x: 18, y: 2 }, { space, endpoints: "half-open" }), undefined);
assert.deepEqual(geometry.normalize({ x: 5, y: -2 }, { space, endpoints: "half-open" }), { x: -5, y: -2 });
assert.equal(geometry.normalize({ x: 0, y: -2.1 }, { space }), undefined);
