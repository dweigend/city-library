import assert from "node:assert/strict";
import { model } from "../../../models/city-energy/model.ts";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-4, `${actual} != ${expected}`);
function secondDay(options: Parameters<typeof model.create>[0], flexibleShare?: number) {
  const instance = model.create(options);
  if (flexibleShare !== undefined) instance.setFlexibleShare(flexibleShare);
  instance.advance(48);
  return instance.read().lastDay;
}

// Experiment A: twice the solar does not remove the evening shortage, it is curtailed.
const solar = secondDay({ solarCapacityKw: 24 });
assert.equal(solar.unmetKwh, 11);
close(solar.curtailedKwh, 127.6059);
// A bigger battery moves midday surplus into the evening.
assert.equal(secondDay({ batteryCapacityKwh: 16 }).unmetKwh, 3);

// Experiment B: shift flexible evening demand into the sunny hours.
const shifted = model.create();
shifted.setFlexibleShare(0.25);
assert.equal(shifted.read().demandProfile[17]!.electricityKwh, 9);
assert.equal(shifted.read().demandProfile[11]!.electricityKwh, 9);
shifted.advance(48);
assert.equal(shifted.read().lastDay.unmetKwh, 4);
assert.equal(secondDay({}, 0.5).unmetKwh, 0);

// The network limit is live.
const network = model.create();
network.setNetworkCapacity({ electricityNetworkCapacityKw: 20 });
network.advance(48);
assert.equal(network.read().lastDay.unmetKwh, 0);
assert.equal(network.read().parameters.heatNetworkCapacityKw, 3);
console.log("city-energy solar, battery and flexibility experiments passed");
