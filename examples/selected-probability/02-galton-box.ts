import assert from "node:assert/strict";
import { create as first } from "../../models/galton-box/model.ts";
import { create as second } from "../../models/partition-permutation-distribution/model.ts";

// Frozen before runtime: detached deterministic observations and independent instances.
for (const create of [first, second]) {
  const a = create({ seed: 17 });
  const b = create({ seed: 17 });
  assert.equal(a.read().tick, 0);
  assert.deepEqual(a.read(), b.read());
  const before = a.read();
  assert.deepEqual(a.read(), before);
  a.advance(0);
  assert.deepEqual(a.read(), before);
  assert.throws(() => a.advance(-1), RangeError);
  assert.deepEqual(b.read(), before);
}
const model = first({ seed: 17 });
model.advance();
assert.equal(model.read().tick, 1);
