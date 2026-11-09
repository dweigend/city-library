import { strict as assert } from "node:assert";
import { create } from "../../models/urban-suite-structure-from-randomness-2/model.ts";

const model = create({ threshold: 0, seed: 1 });
assert.equal(model.read().counts.activated, 0); // setup leaves patches black
model.setPotentials(model.read().cells.map(() => 10));
model.advance();
assert.equal(model.read().counts.currentAboveThreshold, 16900);
assert.equal(model.read().counts.activated, 16900);
model.setPotentials(model.read().cells.map(() => -10));
const stream = model.read().randomState;
model.setRules({ threshold: 10 });
assert.deepEqual(model.read().randomState, stream);
model.advance();
assert.equal(model.read().counts.currentAboveThreshold, 0);
assert.equal(model.read().counts.activated, 16900); // whitening is persistent
assert.ok(model.read().maxPotential <= -9);
assert.equal(model.read().meanPotentialTimesTen, model.read().meanPotential * 10);
assert.equal(model.read().tick, 2);
assert.equal(model.read().done, false);
