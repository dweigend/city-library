import assert from "node:assert/strict";
import { model } from "../../../models/city-finance/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, {
  initialCash: 100, taxBase: 10000, taxRate: 0.1, serviceCost: 400, maintenanceBudget: 500,
  replacementValue: 12000, annualWear: 0.05, repairPriority: "worst-first",
});
assert.equal(state.assets.length, 12);
assert.equal(state.assets[0]!.condition, 1);
assert.equal(Number(state.assets[11]!.condition.toFixed(10)), 0.45);
assert.equal(Number(state.meanCondition.toFixed(10)), 0.725);
assert.equal(Number(state.backlog.toFixed(6)), 3300);
assert.equal(state.poorAssetCount, 0);
assert.equal(state.cash, 100);
assert.equal(state.history.length, 1);
console.log("city-finance setup passed");
