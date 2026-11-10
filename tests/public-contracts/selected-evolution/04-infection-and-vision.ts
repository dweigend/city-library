import assert from 'node:assert/strict';
import { create as infection, giveDose } from '../../../models/bacterial-infection/model.ts';
import { create as vision, visionRadius, energyCost } from '../../../models/vision-evolution/model.ts';

assert.equal(giveDose(0, 4, false, 'take-all-doses', 0), true);
assert.equal(giveDose(240, 4, false, 'skip-dose-2', 1), false);
assert.equal(giveDose(241, 4, false, 'take-all-doses', 0), false);
assert.equal(giveDose(240, 4, true, 'take-all-doses', 0), false);
const i = infection({ seed: 41, reproduce: false, autoDoseA: 'skip-all-doses', autoDoseB: 'skip-all-doses' });
assert.deepEqual(i.read().bacteriaCountsRegionA, [4, 4, 4, 4]);
assert.deepEqual(i.read().bacteriaCountsRegionB, [4, 4, 4, 4]);
i.doseRegion('A', 50);
assert.equal(i.read().antibiotics.length, 50);
assert.equal(i.read().doseCountA, 1);
assert.equal(i.read().tick, 0);
const before = i.read();
i.advance();
assert.equal(i.read().tick, 1);
assert.equal(i.read().minutes, 1);
assert.equal(before.tick, 0);
assert.deepEqual(i.read().bacteriaCountsRegionA, [4, 4, 4, 4]);

assert.equal(visionRadius(2, -1, 5), 3.4);
assert.equal(visionRadius(2, 0, 5), 7); // shoreline uses land branch
assert.equal(energyCost(1, 0, -1, 9), 0.5);
assert.equal(energyCost(1, 0, 0, 9), 9.5);
const v = vision({ seed: 42, initialFishCount: 10, initialFoodCount: 0, foodReplenishRate: 0, reproductionRate: 0 });
assert.equal(v.read().fish.length, 10);
assert.ok(v.read().fish.every(f => f.eyeSize === 1 && f.landMobility === 0));
const old = v.read();
v.advance();
assert.equal(v.read().tick, 1);
assert.equal(v.read().food.length, 0);
assert.equal(old.tick, 0);
const extinct = vision({ initialFishCount: 0 });
extinct.advance();
assert.equal(extinct.read().tick, 0);
console.log('dosing cadence, region counts, vision and shoreline energy passed');
