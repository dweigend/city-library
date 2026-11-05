import assert from "node:assert/strict";
import { model } from "../../experiments/preferential-attachment/model.ts";

const instance = model.create({ seed: 19 });
const captured = instance.read();
const random = captured.randomState;
const originalDegree = captured.nodes[0]!.degree;
// An observation can be frozen or mutable detached data; neither allows model writes.
Reflect.set(captured.nodes[0]!, "degree", 999);
assert.equal(instance.read().nodes[0]!.degree, originalDegree);
assert.deepEqual(instance.read().randomState, random);
assert.equal(instance.read().tick, 0);
instance.advance(4);
assert.equal(captured.nodeCount, 2);
assert.equal(captured.nodes.length, 2);
assert.equal(captured.edges.length, 1);
assert.equal(captured.tick, 0);
assert.equal(instance.read().nodeCount, 6);
