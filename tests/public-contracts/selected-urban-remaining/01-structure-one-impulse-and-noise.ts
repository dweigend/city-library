import { strict as assert } from "node:assert";
import { create } from "../../../models/urban-suite-structure-from-randomness-1/model.ts";

const model = create({ keepAddingRandomness: false, seed: 1 });
model.setActivities(model.read().cells.map(cell => cell.x === -64.5 && cell.y === -64.5 ? 1 : 0));
const stream = model.read().randomState;
model.advance();
const result = model.read();
assert.equal(result.cells.length, 16900);
assert.equal(result.cells.filter(cell => cell.activity === 0.2).length, 5);
assert.equal(result.cells.find(cell => cell.x === 64.5 && cell.y === -64.5)!.activity, 0.2);
assert.equal(result.cells.find(cell => cell.x === 64.5 && cell.y === 64.5)!.activity, 0);
assert.ok(Math.abs(result.totalActivity - 1) < 1e-12);
assert.equal(result.maxAbsoluteActivity, 0.2);
assert.deepEqual(result.activityDistribution.slice(0, 5), Array(5).fill(0.2));
assert.deepEqual(result.randomState, stream); // target omits irrelevant source ask shuffles
model.setActivities(result.cells.map(() => 1));
model.setRules({ keepAddingRandomness: true });
model.advance();
assert.ok(model.read().cells.every(cell => cell.activity === 0 || cell.activity === 2));
assert.equal(model.read().tick, 2);
assert.equal(model.read().done, false);
