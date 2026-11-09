import assert from "node:assert/strict";
import { create as fruit, genomeTraits } from "../../models/fruit-wars/model.ts";
import { create as bar, predictAttendance } from "../../models/el-farol/model.ts";
// Source genome partitions: intelligence=min(A,B), speed=|A-B|, strength=60-max(A,B).
assert.deepEqual(genomeTraits(Array(240).fill(0)), { intelligence: 0, speed: 0, strength: 60, reactiveAggression: 0, proactiveAggression: 0 });
assert.deepEqual(genomeTraits(Array(240).fill(1)), { intelligence: 60, speed: 0, strength: 0, reactiveAggression: 60, proactiveAggression: 60 });
const f = fruit({ initialForagers: 1, initialFruitBushes: 0, bushGrowthChance: 0, maxAge: 1, seed: 1 });
assert.equal(f.read().foragers.length, 1);
f.advance(); assert.equal(f.read().tick, 1); assert.equal(f.read().foragers.length, 1);
f.advance(); assert.equal(f.read().tick, 2); assert.equal(f.read().foragers.length, 0);
f.advance(); assert.equal(f.read().tick, 2); // empty-population preflight does not tick
assert.equal(f.read().ageDeathCount, 1);
// El Farol has an intercept weighted by 100 and does not clamp predictions.
assert.equal(predictAttendance([0.5, 1, -1], [30, 10]), 70);
assert.equal(predictAttendance([-1, -1], [100]), -200);
const e = bar({ seed: 1 });
assert.equal(e.read().people.length, 100); assert.equal(e.read().history.length, 10);
e.advance(12);
const s = e.read(); assert.equal(s.tick, 12); assert.equal(s.history.length, 10);
assert.equal(s.attendance, s.people.filter(p => p.attend).length);
assert.equal(s.history[0], s.attendance); assert.equal(s.crowded, s.attendance > 60);
assert.ok(s.attendance >= 0 && s.attendance <= 100);
console.log("foraging-and-attendance: genome, extinction preflight, linear prediction and attendance history");
