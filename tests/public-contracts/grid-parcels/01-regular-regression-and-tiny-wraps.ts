import assert from "node:assert/strict";
import { Grid, topology } from "city-library";

// The new topology entry must coexist with the original regular-grid contract.
assert.equal(topology.square({ columns: 1, rows: 1 }).cells.length, 1);
const regular = Grid.create({ x: 3, y: 3 }, { state: { temperature: 0 } });
const center = regular.fields[4]!;
assert.equal(regular.cellSize, 1);
assert.equal(regular.space.dimensions, 2);
assert.deepEqual(regular.neighbors(center), [0, 1, 2, 3, 5, 6, 7, 8].map(index => regular.fields[index]));
assert.deepEqual(regular.neighbors(center, { neighborhood: "faces" }), [1, 3, 5, 7].map(index => regular.fields[index]));
assert.equal(regular.fieldAt({ x: 1.5, y: 1.5 }), regular.fields[8]);
assert.equal(regular.fieldAt({ x: 1.5001, y: 0 }), undefined);

const one = Grid.create({ x: 1, y: 1, boundary: "wrap" }, { state: { temperature: 8 } });
assert.deepEqual(one.neighbors(one.fields[0]!), []);
one.diffuse("temperature", { rate: 1 });
assert.equal(one.fields[0]!.temperature, 8);
const narrow = Grid.create({ x: 1, y: 2, boundary: "wrap" }, { state: { temperature: 0 } });
narrow.fields[0]!.temperature = 8;
assert.deepEqual(narrow.neighbors(narrow.fields[0]!), [narrow.fields[1]]);
narrow.diffuse("temperature", { rate: 1, neighborhood: "faces" });
assert.deepEqual(narrow.fields.map(field => field.temperature), [4, 4]);
const tiny = Grid.create({ x: 2, y: 2, boundary: "wrap" }, { state: { temperature: 0 } });
tiny.fields[0]!.temperature = 8;
tiny.diffuse("temperature", { rate: 1, neighborhood: "moore" });
assert.deepEqual(tiny.fields.map(field => field.temperature), [0, 2, 2, 4]);
assert.equal(Grid.create().fields.length, 1600);
assert.throws(() => Grid.create({ x: 3, y: 3 }, { cellSize: 2 }), RangeError);
