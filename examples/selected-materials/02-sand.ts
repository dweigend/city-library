import assert from "node:assert/strict";
import { create } from "../../models/sand/model.ts";
const sand = create({ width: 9, height: 9, releaseChance: 0, density: 0, seed: 3 });
sand.setSand([{ x: 0, y: 2 }]);
sand.moveAllSand();
assert.deepEqual(sand.read().cells.filter(c => c.status === "sand").map(c => [c.x, c.y]), [[0, 1]]);
assert.equal(sand.read().tick, 0);
sand.moveAllSand();
assert.deepEqual(sand.read().cells.filter(c => c.status === "sand").map(c => [c.x, c.y]), [[0, 0]]);
// The old-state/next-state barrier prevents falling twice during one pass.
sand.advance(2);
assert.equal(sand.read().tick, 2);
assert.equal(sand.read().cells.filter(c => c.status === "sand").length, 1);
assert.ok(sand.read().cells.some(c => c.status === "floor"));
sand.dumpSand();
assert.equal(sand.read().tick, 2);
assert.equal(sand.read().cells.filter(c => c.status === "sand").length, 1);
const spouts = create({ width: 9, height: 9, releaseChance: 100, spacing: 3, seed: 1 });
assert.equal(spouts.read().cells.filter(c => c.status === "sand").length, 0);
spouts.advance();
assert.ok(spouts.read().cells.some(c => c.status === "sand")); // birth at tick zero, then movement
assert.equal(spouts.read().tick, 1);
console.log("materials 02: synchronous falling sand and spout ordering passed");
