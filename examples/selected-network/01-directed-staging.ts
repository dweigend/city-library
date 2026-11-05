import assert from "node:assert/strict";
import { create } from "../../experiments/diffusion-on-a-directed-network/model.ts";

const model = create({ gridSize: 3, diffusionRate: 50 });
model.setValues([8, 0, 0, 0, 0, 0, 0, 0, 0]);
model.setActiveLinks([{ from: 0, to: 1 }, { from: 1, to: 2 }]);
const rng = model.read().randomState;
model.advance();
assert.deepEqual(model.read().nodes.map(node => node.value), [4, 4, 0, 0, 0, 0, 0, 0, 0]);
assert.equal(model.read().tick, 1);
assert.equal(model.read().totalValue, 8);
model.advance();
assert.deepEqual(model.read().nodes.map(node => node.value), [2, 4, 2, 0, 0, 0, 0, 0, 0]);
assert.equal(model.read().totalValue, 8);
assert.deepEqual(model.read().randomState, rng);
assert.equal(model.read().done, false);
