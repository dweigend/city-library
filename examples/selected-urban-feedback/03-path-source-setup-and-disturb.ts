import { strict as assert } from "node:assert";
import { create } from "../../models/urban-suite-path-dependence/model.ts";

// Preserve the actual source's inverted distribute branch; do not repair it silently.
const distributed = create({ initialFirms: 200, distribute: true });
assert.equal(distributed.read().counts.firms, 121);
assert.ok(distributed.read().cells.every(cell => cell.occupants === 1));
const rejectedDistribution = create({ initialFirms: 100, distribute: true });
assert.equal(rejectedDistribution.read().counts.firms, 0);
assert.ok(rejectedDistribution.read().warnings.some(warning => warning.includes("Can't distribute")));

const model = create({ initialFirms: 0, increasingReturns: 0, birth: false, attempts: 20 });
model.setQualities(model.read().cells.map(() => 0));
model.setFirms([{ x: 0, y: 0, heading: 0, movedIn: true }]);
const before = model.read();
model.disturb();
assert.equal(model.read().firms[0]!.movedIn, false);
assert.equal(model.read().tick, before.tick);
assert.deepEqual(model.read().randomState, before.randomState);
model.advance();
assert.equal(model.read().tick, 1);
assert.deepEqual(model.read().counts, { firms: 1, settled: 0, searching: 1 });
assert.equal(model.read().largestPopulation, 1); // source population includes searching firms
assert.equal(model.read().done, false);

// Empty birth is an actual original ASK/NOBODY error, not a no-op or new firm.
const emptyBirth = create({ initialFirms: 0, birth: true });
const empty = emptyBirth.read();
emptyBirth.advance(0);
assert.deepEqual(emptyBirth.read(), empty);
assert.throws(() => emptyBirth.advance(), /parent/i);
assert.deepEqual(emptyBirth.read(), empty);
emptyBirth.setRules({ birth: false });
emptyBirth.advance();
assert.equal(emptyBirth.read().tick, 1);
assert.equal(emptyBirth.read().counts.firms, 0);
