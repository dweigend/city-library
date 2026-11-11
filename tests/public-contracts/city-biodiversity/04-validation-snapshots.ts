import assert from "node:assert/strict";
import { model } from "../../../models/city-biodiversity/model.ts";

for (const options of [{ initialOccupancy: 1.1 }, { dispersalRate: 4 }, { extinctionRate: -1 }, { permeability: 2 }]) assert.throws(() => model.create(options), RangeError);
assert.throws(() => model.create({ restorationPlan: "park" as never }), RangeError);
assert.throws(() => model.create({ species: 2 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setPermeability(undefined as never), TypeError);
assert.throws(() => instance.setVegetationQuality(undefined as never), TypeError);
assert.throws(() => instance.setVegetationQuality(1.5), RangeError);
assert.throws(() => instance.setRestorationPlan(undefined as never), TypeError);
assert.throws(() => instance.setRestorationPlan("ring" as never), RangeError);
assert.throws(() => instance.setPatchHabitat("lake", false), RangeError);
assert.throws(() => instance.setPatchHabitat("bridge", "no" as never), TypeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
try { (snapshot.patches[0] as { occupancy: number }).occupancy = 0; } catch { /* Frozen is allowed. */ }
assert.equal(instance.read().patches[0]!.occupancy, 1);
const first = model.create({ vegetationQuality: 0.6 });
const second = model.create({ vegetationQuality: 0.6 });
first.advance(25);
for (let year = 0; year < 25; year += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-biodiversity validation and snapshots passed");
