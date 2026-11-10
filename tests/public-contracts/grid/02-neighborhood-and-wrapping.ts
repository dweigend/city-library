import assert from "node:assert/strict";
import { Grid } from "city-library";

const grid = Grid.create({ x: 3, y: 3, boundary: "wrap" });
const center = grid.fieldAt({ x: 0, y: 0 })!;
assert.deepEqual(grid.neighbors(center).map(field => [field.x, field.y]), [
  [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1],
]);
assert.deepEqual(grid.neighbors(center, { neighborhood: "faces" }).map(field => [field.x, field.y]), [
  [0, -1], [-1, 0], [1, 0], [0, 1],
]);
assert.equal(grid.fieldAt({ x: 1.5, y: 0 }), grid.fieldAt({ x: -1.5, y: 0 }));
const tiny = Grid.create({ x: 2, y: 2, boundary: "wrap" });
assert.equal(tiny.neighbors(tiny.fields[0]!).length, 3);
assert.equal(new Set(tiny.neighbors(tiny.fields[0]!)).size, 3);
const singleton = Grid.create({ x: 1, y: 1, boundary: "wrap" });
assert.deepEqual(singleton.neighbors(singleton.fields[0]!), []);
const hard = Grid.create({ x: 2, y: 2 });
assert.equal(hard.fieldAt({ x: 2, y: 0 }), undefined);
assert.equal(hard.fieldAt({ x: 1, y: 1 }), hard.fields[3]);
