import { strict as assert } from "node:assert";
import { geometry } from "city-library";
const space = { x: 10, y: 10, boundary: "hard" } as const;
assert.equal(geometry.distance({ x: 0, y: 0 }, { x: 3, y: 4 }, { space }), 5);
assert.equal(geometry.distance({ x: 100, y: 0 }, { x: 103, y: 4 }, { space }), 5); // measurement does not clip hard-boundary inputs
assert.equal(geometry.distance({ x: 0, y: 0 }, { x: 0, y: 0 }, { space }), 0);
