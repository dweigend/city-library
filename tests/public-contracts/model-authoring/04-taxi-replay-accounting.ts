import assert from "node:assert/strict";
import { create, inputs } from "../../../models/taxi-cabs/model.ts";
import type { TaxiParameters } from "../../../models/taxi-cabs/model.ts";

const noDemand: Partial<TaxiParameters> = Object.fromEntries(
  Object.keys(inputs).filter((key) => key.startsWith("prob-")).map((key) => [key, 0]),
);
const first = create({ ...noDemand, seed: 23 });
const second = create({ ...noDemand, seed: 23 });
first.advance(10);
second.advance(4);
second.advance(6);
const a = first.read();
const b = second.read();
assert.equal(a.occupiedCabs, 0);
assert.equal(a.totalIncome, 0);
assert.equal(a.cabs.length, a.parameters.taxicabCount);
assert.equal(a.tick, 10);
assert.deepEqual(a.history, b.history);
assert.deepEqual(first.world.random.state, second.world.random.state);
assert.equal(a.occupiedCabs, b.occupiedCabs);
assert.equal(a.totalIncome, b.totalIncome);
assert.ok(a.cabs.every((cab) => cab.totalDistanceMiles === cab.businessDistanceMiles + cab.deadheadDistanceMiles));
