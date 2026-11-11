import assert from "node:assert/strict";
import { model } from "../../../models/city-finance/model.ts";

for (const options of [{ taxRate: 1.5 }, { annualWear: 0.3 }, { replacementValue: 0 }, { maintenanceBudget: -1 }]) assert.throws(() => model.create(options), RangeError);
assert.throws(() => model.create({ repairPriority: "random" as never }), RangeError);
assert.throws(() => model.create({ initialBacklog: 10 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setPolicy({ taxRate: 0.2, maintenanceBudget: undefined }), TypeError);
assert.throws(() => instance.setPolicy({ taxRate: 2 }), RangeError);
assert.throws(() => instance.setPolicy({ repairPriority: "newest" as never }), RangeError);
assert.throws(() => instance.setPolicy({ serviceCost: 1 } as never), TypeError);
assert.throws(() => instance.setPolicy(Object.defineProperty({}, "taxRate", { get: () => 0.2, enumerable: true })), TypeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
try { (snapshot.assets[0] as { condition: number }).condition = 0; } catch { /* Frozen is allowed. */ }
assert.equal(instance.read().assets[0]!.condition, 1);
const first = model.create({ annualWear: 0.08 });
const second = model.create({ annualWear: 0.08 });
first.advance(15);
for (let year = 0; year < 15; year += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-finance validation and snapshots passed");
