import assert from "node:assert/strict";
import { create } from "../../../models/taxi-cabs/model.ts";

const first = create({ seed: 11 });
const second = create({ seed: 11 });
first.advance(3);
second.advance(3);
const prior = first.read();
const untouched = second.read();
const random = first.world.random.state;
first.setParameters({ firstPassengerCost: prior.parameters.firstPassengerCost + 1 });
const changed = first.read();
assert.equal(changed.tick, prior.tick);
assert.equal(changed.occupiedCabCount, prior.occupiedCabCount);
assert.equal(changed.totalIncome, prior.totalIncome);
assert.equal(typeof changed.totalIncome, "number");
assert.deepEqual(first.world.random.state, random);
assert.deepEqual(second.read(), untouched);
assert.equal(second.read().parameters.firstPassengerCost, prior.parameters.firstPassengerCost);
