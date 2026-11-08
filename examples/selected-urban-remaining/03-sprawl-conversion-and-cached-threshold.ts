import { strict as assert } from "node:assert";
import { create } from "../../experiments/urban-suite-sprawl-effect/model.ts";

const model = create({ population: 1, smoothness: 1, maxAttraction: 0, seekerPatience: 0, waitBetweenSeeking: 5 });
const id = model.read().agents[0]!.id;
assert.equal(model.read().buildThreshold, 0);
model.advance();
assert.deepEqual(model.read().counts, { seekers: 0, houses: 1 });
assert.equal(model.read().agents[0]!.id, id);
assert.equal(model.read().agents[0]!.stayCounter, 4); // new house acts in later phase now
assert.ok(Math.abs(model.read().cells.find(cell => cell.x === 0 && cell.y === 0)!.attraction - 0.05) < 1e-12);
model.setRules({ maxAttraction: 30 });
assert.equal(model.read().buildThreshold, 0); // source cache changes only at setup
model.advance(4);
assert.deepEqual(model.read().counts, { seekers: 1, houses: 0 });
assert.equal(model.read().agents[0]!.id, id);
assert.equal(model.read().agents[0]!.patienceCounter, 0);
assert.equal(model.read().agents[0]!.x, 0);
assert.equal(model.read().agents[0]!.y, 0);
assert.equal(model.read().tick, 5);
model.advance();
assert.deepEqual(model.read().counts, { seekers: 0, houses: 1 });
assert.equal(model.read().agents[0]!.stayCounter, 4);
