import { strict as assert } from "node:assert";
import { create as awareness } from "../../../models/urban-suite-awareness/model.ts";
import { create as pollution } from "../../../models/urban-suite-pollution/model.ts";
import { create as recycling } from "../../../models/urban-suite-recycling/model.ts";

const a = awareness();
assert.equal(a.read().cells.length, 37 * 38);
assert.equal(a.read().people.length, 60);
assert.equal(a.read().counts.centerCount, 20);
assert.equal(a.read().meanAwareness, 0);
const p = pollution();
assert.equal(p.read().cells.length, 71 * 63);
assert.deepEqual(p.read().counts, { personCount: 30, treeCount: 0, powerPlantCount: 2 });
assert.equal(p.read().totalPollution, 6);
const r = recycling();
assert.equal(r.read().cells.length, 35 * 35);
assert.deepEqual(r.read().counts, { recyclerCount: 25, wastefulPersonCount: 25 });
assert.ok(r.read().people.every((person) => person.energy === 25));
assert.equal(r.read().landPercentages.new, 100);

const untouched = r.read();
const other = recycling();
other.advance(3);
assert.deepEqual(r.read(), untouched);
for (const mutate of [
  () => a.setCenters([{ x: 0, y: 0.5, kind: "original", nonUsage: -1 }]),
  () => p.setEnvironment([{ pollution: -1, powerPlant: false }]),
  () => r.setResources(["new"]),
  () => a.setRules({ nonUsageLimit: 501 }),
  () => p.setRules({ birthRate: 0.21 }),
  () => r.setRules({ recyclingWasteCost: 0.1 }),
]) {
  const before = [a.read(), p.read(), r.read()];
  assert.throws(mutate);
  assert.deepEqual([a.read(), p.read(), r.read()], before);
}
const snapshot = r.read();
assert.ok(Object.isFrozen(snapshot) && Object.isFrozen(snapshot.people) && Object.isFrozen(snapshot.people[0]));
r.advance();
assert.equal(snapshot.tick, 0);
assert.equal(snapshot.people.length, 50);
