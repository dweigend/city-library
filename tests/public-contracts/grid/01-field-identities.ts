import assert from "node:assert/strict";
import { Grid } from "city-library";

const grid = Grid.add({ x: 3, y: 2 }, { state: { resource: 0, detail: { visits: 0 } } });
assert.equal(grid.fields.length, 6);
assert.deepEqual(grid.fields.map(field => [field.x, field.y]), [
  [-1, -0.5], [0, -0.5], [1, -0.5], [-1, 0.5], [0, 0.5], [1, 0.5],
]);
const first = grid.fields[0]!;
assert.equal(grid.fieldAt(first), first);
assert.equal(first.grid, grid);
first.resource = 10;
first.detail.visits = 1;
assert.equal(grid.fields[1]!.resource, 0);
assert.equal(grid.fields[1]!.detail.visits, 0);
assert.throws(() => Grid.add({ x: 2.5, y: 2 }));
