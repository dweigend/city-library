import assert from "node:assert/strict";
import { model } from "../../../models/city-finance/model.ts";

const r = (value: number, digits = 4) => Number(value.toFixed(digits));

// Experiment A: same budget, preventive repair order.
const preventive = model.create();
preventive.setPolicy({ repairPriority: "preventive" });
preventive.advance(10);
assert.equal(r(preventive.read().backlog, 2), 5100);
assert.equal(r(preventive.read().meanCondition), 0.6583);
assert.equal(preventive.read().poorAssetCount, 1);
preventive.advance(20);
assert.equal(r(preventive.read().meanCondition), 0.6625);
assert.equal(preventive.read().poorAssetCount, 3);
assert.equal(r(preventive.read().backlog, 2), 7050);
assert.equal(preventive.read().cumulativeMaintenanceSpending, 15000);

// Experiment B: defer maintenance for five years, then restore it.
const deferred = model.create();
deferred.setPolicy({ maintenanceBudget: 0, repairPriority: "preventive" });
deferred.advance(5);
assert.equal(r(deferred.read().backlog, 2), 9300);
assert.equal(deferred.read().poorAssetCount, 4);
assert.equal(deferred.read().cash, 3100);
deferred.setPolicy({ maintenanceBudget: 500 });
deferred.advance(25);
assert.equal(r(deferred.read().meanCondition), 0.5129);
assert.equal(deferred.read().poorAssetCount, 6);
console.log("city-finance repair priority and deferral passed");
