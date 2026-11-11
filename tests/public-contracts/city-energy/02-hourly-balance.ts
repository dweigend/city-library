import assert from "node:assert/strict";
import { model } from "../../../models/city-energy/model.ts";

const instance = model.create();
instance.advance();
let state = instance.read();
assert.equal(state.intervalHour, 0);
assert.equal(state.flow.electricityDemandKwh, 5);
assert.equal(state.flow.renewableKwh, 2);
assert.equal(state.flow.batteryDischargeKwh, 3);
assert.equal(state.batteryKwh, 1);
assert.equal(state.flow.electricityNetworkKwh, 0);
assert.equal(state.flow.electricityUnmetKwh, 0);
instance.advance(47);
state = instance.read();
const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-4, `${actual} != ${expected}`);
assert.equal(state.lastDay.unmetKwh, 11);
close(state.lastDay.curtailedKwh, 39.2107);
close(state.lastDay.importKwh, 56.2752);
assert.equal(state.lastDay.demandKwh, 168);
for (const sample of state.history) {
  assert.ok(Math.abs(sample.values.electricityBalanceKwh!) < 1e-9);
  assert.ok(Math.abs(sample.values.heatBalanceKwh!) < 1e-9);
  assert.ok(sample.values.batteryKwh! >= 0 && sample.values.batteryKwh! <= 8);
}
console.log("city-energy hourly balance passed");
