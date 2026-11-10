import assert from 'node:assert/strict';
import { create as anisogamy, gameteDiameter, tickAdvanceAmount } from '../../../models/anisogamy/model.ts';
import { create as sexRatio, adultSexRatio } from '../../../models/sex-ratio-equilibrium/model.ts';

assert.equal(gameteDiameter(Math.PI / 4), 1);
assert.equal(tickAdvanceAmount([]), 1);
const maximumDiameter = 2 * Math.sqrt(0.5 / Math.PI);
assert.equal(tickAdvanceAmount([maximumDiameter / 4, maximumDiameter / 2]), 0.25);
const a = anisogamy({ seed: 21, maxAdults: 10, mutationSigma: 0, speedSizeCorrelation: true });
const first = a.read();
assert.equal(first.adults.length, 10);
assert.equal(first.tick, 0);
assert.ok(first.adults.every(adult => adult.gameteSizeTrait === 0.25));
assert.deepEqual(a.read(), first);
a.advance();
assert.equal(a.read().tick, 1);
assert.equal(a.read().wholeTick, true);
assert.equal(first.tick, 0);

// Source numerator counts ALL males; its denominator counts adult turtles.
assert.equal(adultSexRatio([{ sex: 'male', adult: true }, { sex: 'male', adult: false }, { sex: 'female', adult: true }]), 100);
assert.equal(adultSexRatio([]), 0);
const s = sexRatio({ seed: 22, initialPopulationSize: 20, initialAdultSexRatio: 25, matingChance: 0 });
assert.equal(s.read().males.length, 5);
assert.equal(s.read().females.length, 15);
assert.equal(s.read().adultSexRatio, 25);
assert.equal(s.read().runningAverageAdultSexRatio, 'NA');
const before = s.read();
s.advance();
assert.equal(s.read().tick, 1);
assert.equal(s.read().adultSexRatioHistory.length, 1);
assert.equal(before.adultSexRatioHistory.length, 0);
const empty = sexRatio({ initialPopulationSize: 0 });
empty.advance();
assert.equal(empty.read().tick, 0); // pre-step extinction gate
console.log('B08 gamete geometry, partial ticks and source sex-ratio reporter passed');
