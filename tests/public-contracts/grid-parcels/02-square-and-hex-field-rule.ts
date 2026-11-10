import assert from "node:assert/strict";
import { Grid, topology, geometry, type Position } from "city-library";

const square = topology.square({ columnCount: 3, rowCount: 3 });
const hex = topology.hex({ columnCount: 3, rowCount: 3 });
const squareGrid = Grid.create({ layout: square, state: { temperature: 1 } });
const hexGrid = Grid.create({ layout: hex, state: { temperature: 1 } });
// Identical synchronous model policy; topology alone determines the neighborhood.
for (const grid of [squareGrid, hexGrid]) {
  const next = grid.fields.map(field => grid.neighbors(field).reduce((sum, neighbor) => sum + neighbor.temperature, 0));
  grid.fields.forEach((field, index) => { field.temperature = next[index]!; });
  assert.equal(grid.fields[0]!.temperature, 2);
  assert.equal(grid.fields[0]!.grid, grid);
  assert.equal(grid.fields[0]!.z, undefined);
  assert.equal("cellSize" in grid, false);
  assert.equal("space" in grid, false);
  assert.equal("diffuse" in grid, false);
}
assert.equal(squareGrid.fields[4]!.temperature, 4);
assert.equal(hexGrid.fields[4]!.temperature, 6);
type Assert<T extends true> = T;
type NoRegularCapabilities = Assert<Extract<"space" | "cellSize" | "diffuse", keyof typeof hexGrid> extends never ? true : false>;
const checkCapabilities: NoRegularCapabilities = true;
assert.equal(checkCapabilities, true);
assert.equal(squareGrid.fieldAt({ x: 1.5, y: 1.5 }), squareGrid.fields[4]);
assert.equal(hexGrid.fieldAt({ x: Math.sqrt(3) * 1.5, y: 1.5 }), hexGrid.fields[4]);
assert.ok(Math.abs(geometry.area({ shape: hex.polygon({ cell: hex.cells[0]! }) }) - 3 * Math.sqrt(3) / 2) < 1e-9);
const flat = topology.hex({ columnCount: 2, rowCount: 2, cellRadius: 2, orientation: "flat" });
const flatCenter: Position = { x: 3, y: Math.sqrt(3) };
assert.equal(flat.cellAt({ position: flatCenter }), flat.cells[1]);
assert.equal(flat.neighbors({ cell: flat.cells[0]! }).length, 2);
assert.equal(square.cellAt({ position: { x: 1, y: 0.5 } }), square.cells[0]);
assert.throws(() => topology.square({ columnCount: 0, rowCount: 1 }), RangeError);
assert.throws(() => topology.hex({ columnCount: 1, rowCount: 1, cellRadius: -1 }), RangeError);
