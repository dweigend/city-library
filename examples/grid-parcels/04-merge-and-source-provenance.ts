import assert from "node:assert/strict";
import { geometry, topology, type PlanarPolygon } from "city-library";

const layout = topology.square({ columns: 3, rows: 1 });
const before = layout.cells.map(cell => structuredClone(layout.polygon({ cell })));
const merged = geometry.merge({ layout, cells: [layout.cells[1]!, layout.cells[0]!] });
assert.equal(merged.status, "ok");
if (merged.status !== "ok") throw new Error("Expected a conforming merge.");
assert.deepEqual(merged.sourceCells, [layout.cells[1], layout.cells[0]]);
assert.equal(geometry.area({ shape: merged.shape }), 2);
assert.equal(merged.shape.type, "Polygon");
assert.deepEqual(layout.cells.map(cell => layout.polygon({ cell })), before);
const authored = geometry.merge({ shapes: [before[0]!, before[1]!] });
assert.equal(authored.status, "ok");
if (authored.status !== "ok") throw new Error("Expected authored conforming shapes.");
assert.equal(geometry.area({ shape: authored.shape }), 2);
assert.deepEqual(authored.sourceCells, []);
const disconnected = geometry.merge({ layout, cells: [layout.cells[0]!, layout.cells[2]!] });
assert.equal(disconnected.status, "unsupported");
if (disconnected.status !== "unsupported") throw new Error("Expected retained disconnected inputs.");
assert.equal(disconnected.remainingShapes.reduce((area, shape) => area + geometry.area({ shape }), 0), 2);
assert.ok(disconnected.diagnostics.length > 0);
const nonconforming: PlanarPolygon = { type: "Polygon", coordinates: [[[1, 0], [2, 0], [2, 0.5], [1, 0.5], [1, 0]]] };
const rejected = geometry.merge({ shapes: [before[0]!, nonconforming] });
assert.equal(rejected.status, "unsupported");
if (rejected.status !== "unsupported") throw new Error("Expected retained nonconforming inputs.");
assert.equal(rejected.remainingShapes.reduce((area, shape) => area + geometry.area({ shape }), 0), 1.5);
assert.throws(() => geometry.merge({ layout, cells: [layout.cells[0]!, layout.cells[0]!] }), RangeError);
const holed: PlanarPolygon = { type: "Polygon", coordinates: [
  [[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]],
  [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]],
] };
assert.equal(geometry.area({ shape: holed }), 15);
const separate: PlanarPolygon = { type: "Polygon", coordinates: [[[5, 0], [6, 0], [6, 1], [5, 1], [5, 0]]] };
assert.equal(geometry.area({ shape: { type: "MultiPolygon", coordinates: [holed.coordinates, separate.coordinates] } }), 16);
