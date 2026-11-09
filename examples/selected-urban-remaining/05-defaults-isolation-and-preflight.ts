import { strict as assert } from "node:assert";
import { create as structureOne } from "../../models/urban-suite-structure-from-randomness-1/model.ts";
import { create as structureTwo } from "../../models/urban-suite-structure-from-randomness-2/model.ts";
import { create as sprawl } from "../../models/urban-suite-sprawl-effect/model.ts";
import { create as economic } from "../../models/urban-suite-economic-disparity/model.ts";

const a = structureOne(), b = structureTwo(), c = sprawl(), d = economic();
assert.equal(a.read().cells.length, 16900);
assert.ok(a.read().cells.every(cell => cell.activity === -1 || cell.activity === 1));
assert.equal(b.read().parameters.threshold, 4.5);
assert.equal(b.read().counts.activated, 0);
assert.deepEqual(c.read().counts, { seekers: 200, houses: 0 });
assert.equal(c.read().buildThreshold, 7);
assert.deepEqual(d.read().counts, { rich: 5, poor: 5, jobs: 1 });
assert.equal(d.read().cells.length, 7921);
const untouched = b.read();
const independent = structureTwo(); independent.advance();
assert.deepEqual(b.read(), untouched);
assert.ok(Object.isFrozen(untouched.cells) && Object.isFrozen(untouched.cells[0]));
for (const mutate of [
  () => a.setActivities(a.read().cells.map(() => 0)),
  () => b.setRules({ threshold: 10.1 }),
  () => c.setRules({ seekerSearchAngle: 0 }),
  () => d.setRules({ deathRate: 16 }),
]) {
  const before = [a.read(), b.read(), c.read(), d.read()];
  assert.throws(mutate);
  assert.deepEqual([a.read(), b.read(), c.read(), d.read()], before);
}
