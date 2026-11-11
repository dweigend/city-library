import assert from "node:assert/strict";
import { model } from "../../../models/city-economy/model.ts";

function shock(hiringLimit: number) {
  const city = model.create();
  city.setHiringLimit(hiringLimit);
  city.setExternalDemand(30);
  const employed: number[] = [];
  const lost: number[] = [];
  for (let month = 1; month <= 12; month += 1) {
    if (month === 7) city.setExternalDemand(90);
    city.advance();
    employed.push(city.read().employedCount);
    lost.push(city.read().lostOrders);
    if (month === 7 && hiringLimit === 1) assert.equal(city.read().vacancyCount, 3);
  }
  return { city, employed, lost };
}

// Experiment A: slow hiring after a six-month demand drop.
const slow = shock(1);
assert.deepEqual(slow.employed, [9, 7, 6, 5, 5, 5, 8, 11, 13, 14, 15, 15]);
assert.deepEqual(slow.lost.slice(6), [30, 12, 4, 2, 0, 0]);
assert.equal(slow.lost[3], 4);
assert.equal(slow.city.read().cumulativeLostOrders, 52);

// Experiment B: the same shock with symmetric (fast) hiring.
const fast = shock(10);
assert.deepEqual(fast.employed.slice(6, 10), [11, 13, 14, 15]);
assert.equal(fast.city.read().cumulativeLostOrders, 10);
assert.ok(Math.abs(fast.city.read().moneyBalanceError) < 1e-9);
console.log("city-economy demand shock and hiring speed passed");
