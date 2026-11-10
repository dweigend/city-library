import assert from "node:assert/strict";
import { create } from "../../../models/taxi-cabs/model.ts";

const model = create({ seed: 7 });
model.advance(5);
const before = model.read();
const random = model.world.random.state;
for (let index = 0; index < 4; index++) {
  const state = model.read();
  assert.equal(typeof state.occupiedCabCount, "number");
  assert.equal(typeof state.totalIncome, "number");
  assert.deepEqual(state, before);
}
assert.equal(model.world.tick.value, before.tick);
assert.deepEqual(model.world.random.state, random);
model.advance();
assert.equal(before.tick, 5);
assert.equal(before.occupiedCabCount, before.cabs.filter((cab) => !cab.vacancy).length);
assert.equal(before.totalIncome, before.cabs.reduce((sum, cab) => sum + cab.totalIncome, 0));
