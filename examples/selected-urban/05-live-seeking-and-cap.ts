import { strict as assert } from "node:assert";
import { create } from "../../experiments/urban-suite-recycling/model.ts";

const model = create({ numRecyclers: 0, numWastefuls: 0, resourceRegeneration: 0, agentsSeekResources: false, maxStoredEnergy: 100 });
model.setResources(model.read().cells.map((cell) => cell.x === 1 && cell.y === 0 ? "new" : "waste"));
model.setPeople([{ kind: "wasteful", x: 0, y: 0, heading: 0, energy: 1 }]);
const state = model.read().randomState;
model.setRules({ agentsSeekResources: true });
assert.equal(model.read().tick, 0);
assert.deepEqual(model.read().randomState, state);
model.advance();
const seeker = model.read().people[0]!;
assert.equal(seeker.x, 1);
assert.equal(seeker.y, 0);
assert.equal(seeker.energy, 0); // processing was at old location, before seeking

model.setResources(model.read().cells.map(() => "new"));
model.setPeople([{ kind: "wasteful", x: 0, y: 0, heading: 0, energy: 90 }]);
model.setRules({ maxStoredEnergy: 10, showEnergy: false });
assert.equal(model.read().people[0]!.energy, 90); // no immediate energy rewrite
model.advance();
assert.equal(model.read().people[0]!.energy, 10); // move first, then clamp
assert.equal(model.read().cells.find((cell) => cell.x === 0 && cell.y === 0)!.resource, "new");
assert.equal(model.read().parameters.showEnergy, false);
