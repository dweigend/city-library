import assert from "node:assert/strict";
import { model } from "../../../models/city-economy/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, { householdCount: 30, firmCount: 3, wage: 10, spendingFraction: 0.4, externalDemand: 90, hiringLimit: 1 });
assert.equal(state.employedCount, 15);
assert.equal(state.unemployedCount, 15);
assert.deepEqual(state.firms.map(firm => firm.employeeCount), [5, 5, 5]);
assert.equal(state.households[0]!.employerId, "firm:1");
assert.equal(state.households[14]!.employerId, "firm:3");
assert.equal(state.households[15]!.employerId, null);
assert.equal(state.nextOrders, 150);
assert.equal(state.moneyBalanceError, 0);
assert.equal(state.history.length, 1);
console.log("city-economy setup passed");
