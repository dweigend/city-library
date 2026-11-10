import assert from "node:assert/strict";
import { Grid } from "city-library";

const grid = Grid.create({ x: 3, y: 3 }, { state: { heat: 0 } });
grid.fieldAt({ x: 0, y: 0 })!.heat = 8;
grid.diffuse("heat", { rate: 1, neighborhood: "faces" });
assert.deepEqual(grid.fields.map(field => field.heat), [0, 2, 0, 2, 0, 2, 0, 2, 0]);
assert.equal(grid.fields.reduce((sum, field) => sum + field.heat, 0), 8);
const before = grid.fields.map(field => field.heat);
assert.throws(() => grid.diffuse("heat", { rate: 2 }), RangeError);
assert.deepEqual(grid.fields.map(field => field.heat), before);
const single = Grid.create({ x: 1, y: 1, boundary: "wrap" }, { state: { heat: 7 } });
single.diffuse("heat", { rate: 1 });
assert.equal(single.fields[0]!.heat, 7);
