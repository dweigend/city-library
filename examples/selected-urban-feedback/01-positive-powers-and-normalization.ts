import { strict as assert } from "node:assert";
import { create } from "../../experiments/urban-suite-positive-feedback/model.ts";

const model = create({ alpha: 2, mooreNeighborhood: false });
model.setActivities(model.read().cells.map((_, index) => index === 0 ? 0.25 : index === 1 ? 0.5 : index === 2 ? 1 : 0));
const stream = model.read().randomState;
model.advance();
assert.deepEqual(model.read().cells.slice(0, 4).map(cell => cell.activity), [0.0625, 0.25, 1, 0]);
assert.equal(model.read().totalActivity, 1.3125);
assert.equal(model.read().maxActivity, 1);
assert.deepEqual(model.read().activityDistribution.slice(0, 4), [1, 0.25, 0.0625, 0]);
assert.equal(model.read().tick, 1);
assert.deepEqual(model.read().randomState, stream); // deterministic equations, no random activation needed
model.setRules({ alpha: 1 });
const afterRule = model.read();
model.advance();
assert.deepEqual(model.read().cells, afterRule.cells);
assert.equal(model.read().tick, 2);
assert.equal(model.read().done, false); // stable states still tick
