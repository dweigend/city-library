import assert from "node:assert/strict";
import { model } from "../../../models/preferential-attachment/model.ts";

assert.equal("document" in globalThis, false);
assert.equal(model.inputs.seed.default, 1);
const first = model.create({ seed: 7 });
const second = model.create({ seed: 7 });
assert.equal(first.read().nodeCount, 2);
assert.equal(first.read().edgeCount, 1);
first.advance(8);
assert.equal(first.read().tick, 8);
assert.equal(first.read().nodeCount, 10);
assert.equal(first.read().edgeCount, 9);
assert.equal(first.read().nodes.reduce((sum, node) => sum + node.degree, 0), 18);
assert.equal(second.read().tick, 0);
second.advance(8);
assert.deepEqual(first.read().nodes.map(node => node.degree), second.read().nodes.map(node => node.degree));
assert.deepEqual(first.read().randomState, second.read().randomState);
assert.throws(() => model.create({ seed: Number.NaN }));
const before = first.read();
for (const invalid of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
  assert.throws(() => first.advance(invalid));
  assert.deepEqual(first.read(), before);
}
