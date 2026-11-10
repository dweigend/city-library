import { strict as assert } from "node:assert";
import { geometry } from "city-library";
const space = { x: 20, y: 20, z: 20 };
assert.equal(geometry.distance({ x: 0, y: 0, z: 0 }, { x: 3, y: 0, z: 4 }, { space }), 5);
assert.throws(() => geometry.distance({ x: 0, y: 0 }, { x: 3, y: 0, z: 4 }, { space }), TypeError);
assert.throws(() => geometry.distance({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 }, { space: { x: 20, y: 20 } }), TypeError);
