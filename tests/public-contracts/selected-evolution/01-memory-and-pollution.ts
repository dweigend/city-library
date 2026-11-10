import assert from 'node:assert/strict';
import { create as mimicry, rememberColor, forgetColors, isColorInMemory } from '../../../models/mimicry/model.ts';
import { create as moths } from '../../../models/peppered-moths/model.ts';

// A remembered color starts at age zero; the cutoff is inclusive.
let memory = rememberColor([], 15, 2);
memory = rememberColor(memory, 25, 2);
assert.deepEqual(memory, [[15, 0], [25, 0]]);
memory = rememberColor(memory, 35, 2);
assert.deepEqual(memory, [[25, 0], [35, 0]]);
assert.equal(isColorInMemory(memory, 15), false);
assert.equal(isColorInMemory(memory, 35), true);
assert.deepEqual(forgetColors(forgetColors(memory, 1), 1), []);
assert.deepEqual(forgetColors(memory, 1), [[25, 1], [35, 1]]);
const butterflies = mimicry({ seed: 11 });
assert.equal(butterflies.read().birds.length, 75);
assert.equal(butterflies.read().monarchs.length, 225);
assert.equal(butterflies.read().viceroys.length, 225);
const snapshot = butterflies.read();
assert.deepEqual(butterflies.read(), snapshot);
butterflies.advance();
assert.equal(butterflies.read().tick, 1);
assert.equal(snapshot.tick, 0);

// Pollution actions do not tick or draw. The endpoint flips only on the next call.
const p = moths({ seed: 12, mothCount: 0, speed: 100, cyclePollution: false });
assert.equal(p.read().darkness, 0);
for (let i = 0; i < 8; i++) p.polluteWorld();
assert.equal(p.read().darkness, 8);
assert.equal(p.read().darkening, true);
p.polluteWorld();
assert.equal(p.read().darkness, 8);
assert.equal(p.read().darkening, false);
assert.equal(p.read().envColor, 1);
for (let i = 0; i < 8; i++) p.cleanUpWorld();
p.cleanUpWorld();
assert.equal(p.read().darkness, 0);
assert.equal(p.read().darkening, true);
assert.equal(p.read().tick, 0);
p.advance();
assert.equal(p.read().tick, 1); // no extinction stop in this source
assert.equal(p.read().moths.length, 0);
console.log('memory, inclusive forgetting and pollution endpoints passed');
