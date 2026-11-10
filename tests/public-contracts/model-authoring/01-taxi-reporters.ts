import assert from "node:assert/strict";
import { create } from "../../../models/taxi-cabs/model.ts";

const model = create({ seed: 42 });
for (const steps of [0, 1, 9]) {
  model.advance(steps);
  const state = model.read();
  assert.equal(state.occupiedCabs, state.cabs.filter((cab) => !cab.vacancy).length);
  assert.equal(state.totalIncome, state.cabs.reduce((sum, cab) => sum + cab.totalIncome, 0));
  assert.equal(state.occupiedCabs, state.history.at(-1)!.occupiedCabs);
  assert.equal(state.totalIncome, state.history.at(-1)!.totalIncome);
}
assert.equal(model.read().tick, 10);
