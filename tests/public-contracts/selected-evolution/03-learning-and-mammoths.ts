import assert from 'node:assert/strict';
import { create as baldwin, fitnessOf } from '../../../models/baldwin-effect/model.ts';
import { create as mammoths } from '../../../models/mammoths/model.ts';

assert.equal(fitnessOf([1, 0, 1, 0], [1, 1, 1, 1], 0.5), 0.5);
assert.equal(fitnessOf([1, 0, 1, 0], [1, 1, 1, 1], 0.49), 0);
assert.equal(fitnessOf([1, 1, 1, 1], [1, 1, 1, 1], 0), 1);
const b = baldwin({ seed: 31, populationSize: 20, geneLength: 4, trialCount: 2, plasticity: 0, mutationRate: 0, smoothness: 1 });
const initial = b.read();
assert.equal(initial.nonLearners.length, 20);
assert.equal(initial.randomLearners.length, 20);
assert.equal(initial.smartLearners.length, 20);
assert.ok(initial.nonLearners.every(a => a.genotype.every(allele => allele !== 'x')));
b.advance();
const after = b.read();
assert.equal(after.tick, 1);
for (const group of [after.nonLearners, after.randomLearners, after.smartLearners]) {
  assert.equal(group.length, 20);
  assert.ok(group.every(a => a.genotype.length === 4 && a.phenotype.length === 4));
  assert.ok(group.every(a => a.fitness >= 0 && a.fitness <= 1));
}
assert.equal(initial.tick, 0);
assert.deepEqual(b.read(), after);

// Native map import supplies domain land; it is not a decorative approximation.
const m = mammoths({ seed: 32, numberOfMammoths: 10, numberOfHumans: 0, climateChangeDecayChance: 100, mammothBirthRate: 0 });
const setup = m.read();
assert.equal(setup.mammoths.length, 10);
assert.equal(setup.humans.length, 0);
assert.ok(setup.cells.some(cell => cell.terrain === 'land'));
assert.ok(setup.cells.some(cell => cell.terrain === 'ocean'));
assert.equal(setup.mammothsKilledByHumans, 0);
assert.equal(setup.mammothsKilledByClimateChange, 0);
m.advance();
assert.equal(m.read().tick, 1);
assert.ok(m.read().cells.every(cell => cell.terrain !== 'land'));
assert.equal(m.read().mammothsKilledByHumans, 0);
assert.equal(setup.tick, 0);
const empty = mammoths({ numberOfMammoths: 0, numberOfHumans: 0 });
empty.advance();
assert.equal(empty.read().tick, 1); // source does not stop at extinction
console.log('fitness threshold, populations and imported terrain/climate passed');
