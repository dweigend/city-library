import assert from "node:assert/strict";
import { create as repressilator } from "../../../models/repressilator-1d/model.ts";
import { create as switchModel } from "../../../models/genevo-1-genetic-switch/model.ts";

const oscillator = repressilator({ seed: 31, initialTF0s: 10, initialTF1s: 0, initialTF2s: 0, tfsPerMRNA: 0, tfDecayProb: 1 });
assert.deepEqual(oscillator.read().tfCounts, [10, 0, 0]);
assert.deepEqual(oscillator.read().mrnaCounts, [0, 0, 0]);
assert.equal(oscillator.read().signalOn, true);
oscillator.advance(6);
assert.equal(oscillator.read().tick, 6);
assert.deepEqual(oscillator.read().tfCounts, [0, 0, 0]);
assert.equal(oscillator.read().signalOn, true);
assert.equal(oscillator.read().genes.length, 3);
assert.ok(oscillator.read().genes.every(gene => !gene.inhibited));

const cell = switchModel({ seed: 32, rnapNumber: 0, lacINumber: 1, lactose: false, glucose: false });
assert.equal(cell.read().energy, 1000);
assert.equal(cell.read().divisionNumber, 0);
cell.advance(10);
assert.ok(Math.abs(cell.read().energy - 999.9) < 1e-9);
assert.equal(cell.read().tick, 10);
assert.equal(cell.read().lacZCount, 0);
cell.setParameters({ glucose: true });
cell.advance();
assert.ok(Math.abs(cell.read().energy - 1009.89) < 1e-9);
assert.equal(cell.read().divisionNumber, 0);
console.log("B09 regulation and energy passed");
