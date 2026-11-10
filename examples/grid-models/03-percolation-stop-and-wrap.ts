import assert from "node:assert/strict";
import { create } from "../../models/percolation/model.ts";

const dry = create({ width: 5, height: 5, porosity: 0 });
dry.setFront([1, 3]);
dry.advance();
assert.equal(dry.read().tick, 1);
assert.equal(dry.read().totalOil, 2);
assert.equal(dry.read().currentRow, 3);
assert.equal(dry.read().counts.front, 0);
assert.equal(dry.read().done, true);
const stopped = dry.read();
dry.advance(10);
assert.deepEqual(dry.read(), stopped);
dry.setRules({ porosity: 99 });
assert.equal(dry.read().done, true);
assert.equal(dry.read().tick, 1);

const wet = create({ width: 3, height: 3, porosity: 99, seed: 42 });
wet.setFront([1]);
wet.advance(2);
const state = wet.read();
assert.equal(state.tick, 2);
assert.equal(state.currentRow, 2);
assert.equal(state.totalOil, 3);
assert.equal(state.counts.front, 1);
assert.deepEqual(state.cells.filter(cell => cell.kind === "oil").map(cell => [cell.column, cell.row]), [[1, 2]]);
assert.equal(state.cells.filter(cell => cell.kind === "saturated").length, 0);
