import assert from 'node:assert/strict';
import { create as perceptron } from '../../../models/artificial-neural-net-perceptron/model.ts';
import { create as multilayer } from '../../../models/artificial-neural-net-multilayer/model.ts';

// The signed perceptron has a strict zero threshold and no hidden units.
const p = perceptron({seed: 7, learningRate: .5, examplesPerEpoch: 1, targetFunction: 'or'});
p.setScenario({weights: [0, 0, 0], inputs: [1, -1]});
assert.equal(p.test(1, -1).output, -1);
assert.equal(p.test(1, -1).expected, 1);
const before = p.read();
p.advance();
const after = p.read();
assert.equal(after.tick, 1);
const target = after.activations[1] === 1 || after.activations[2] === 1 ? 1 : -1;
assert.equal(after.epochError, (target + 1) ** 2 * .5); // signed squared error, not error proportion.
assert.equal(after.weights[0], .5 * (target + 1));
assert.equal(after.weights[1], .5 * (target + 1) * after.activations[1]!);
assert.equal(after.weights[2], .5 * (target + 1) * after.activations[2]!);
assert.deepEqual(p.read(), after); // observation must not draw or mutate.
assert.equal(before.tick, 0);
for (const f of ['or','xor','and','nor','nand'] as const) {
  p.setParameters({targetFunction: f});
  const expected = f === 'or' || f === 'and' ? 1 : -1;
  assert.equal(p.test(1,1).expected, expected);
}
assert.equal(p.read().tick, 1);

// All zero weights isolate the exact sigmoid derivatives and OLD-weight barrier.
const n = multilayer({seed: 8, learningRate: .5, examplesPerEpoch: 1, targetFunction: 'or'});
n.setScenario({weights: Array(9).fill(0), inputs: [0,0]});
assert.equal(n.test(0,0).output, 0); // sigmoid(.0)=.5; strict >.5 step.
n.advance();
const s = n.read();
assert.equal(s.tick, 1);
assert.equal(s.epochError, .25);
const sign = s.activations[1] === 1 || s.activations[2] === 1 ? 1 : -1;
assert.deepEqual(s.weights.slice(0,2), [0,0]);
assert.deepEqual(s.weights.slice(3,7), [0,0,0,0]); // hidden deltas zero before new output weights.
assert.equal(s.weights[2], sign * .0625);
assert.equal(s.weights[7], sign * .03125);
assert.equal(s.weights[8], sign * .03125);
assert.equal(s.activations[5], .5); // activation from BEFORE final update.
assert.equal(n.test(1,0).expected, 1);
assert.equal(n.read().tick, 1);
console.log('neural equations, phase barrier, truth functions and non-ticking tests passed');
