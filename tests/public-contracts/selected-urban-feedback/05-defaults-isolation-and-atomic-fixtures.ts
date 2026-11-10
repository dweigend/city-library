import { strict as assert } from "node:assert";
import { create as feedback } from "../../../models/urban-suite-positive-feedback/model.ts";
import { create as path } from "../../../models/urban-suite-path-dependence/model.ts";
import { create as cells } from "../../../models/urban-suite-cells/model.ts";

const f = feedback();
assert.equal(f.read().cells.length, 21 * 21);
assert.equal(f.read().parameters.alpha, 1.1);
assert.equal(f.read().parameters.mooreNeighborhood, false);
assert.ok(f.read().maxActivity < 1); // setup is random and is not maximum-normalized yet
const p = path();
assert.equal(p.read().cells.length, 11 * 11);
assert.deepEqual(p.read().counts, { firms: 200, settled: 0, searching: 200 });
assert.equal(p.read().parameters.regionSize, 0);
const c = cells();
assert.equal(c.read().cells.length, 81 * 81);
assert.equal(c.read().parameters.neighborhood, "von-neumann");
assert.equal(c.read().parameters.countRule, "= 1");
assert.equal(c.read().parameters.ageLimit, 55);

for (const mutate of [
  () => f.setActivities(f.read().cells.map(() => 0)), // undefined source normalization excluded by fixture contract
  () => f.setRules({ alpha: 2.01 }),
  () => p.setQualities([1]),
  () => p.setFirms([{ x: 5.5, y: 0, heading: 0, movedIn: false }]),
  () => c.setCells([{ on: true, onTime: 0, seed: true }]),
  () => c.setRules({ neighborhood: "arbitrary NetLogo program" as "moore" }),
]) {
  const before = [f.read(), p.read(), c.read()];
  assert.throws(mutate);
  assert.deepEqual([f.read(), p.read(), c.read()], before);
}
const frozen = c.read();
assert.ok(Object.isFrozen(frozen) && Object.isFrozen(frozen.cells) && Object.isFrozen(frozen.cells[0]));
const other = cells();
other.advance(2);
assert.deepEqual(c.read(), frozen);
assert.equal(frozen.tick, 0);
