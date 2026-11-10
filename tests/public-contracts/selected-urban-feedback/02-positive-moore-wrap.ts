import { strict as assert } from "node:assert";
import { create } from "../../../models/urban-suite-positive-feedback/model.ts";

const model = create({ alpha: 1, mooreNeighborhood: true });
model.setActivities(model.read().cells.map(cell => cell.x === 10 && cell.y === 10 ? 1 : 0));
const stream = model.read().randomState;
model.advance();
const result = model.read();
assert.equal(result.cells.filter(cell => cell.activity === 1).length, 9);
assert.equal(result.cells.filter(cell => cell.activity !== 0).length, 9);
assert.equal(result.cells.find(cell => cell.x === -10 && cell.y === -10)!.activity, 1);
assert.equal(result.cells.find(cell => cell.x === 8 && cell.y === 10)!.activity, 0);
assert.equal(result.totalActivity, 9); // average then maximum normalization, not conserved diffusion
assert.deepEqual(result.randomState, stream);
model.setRules({ mooreNeighborhood: false });
const cells = model.read().cells;
model.advance();
assert.deepEqual(model.read().cells, cells);
