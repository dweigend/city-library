import assert from "node:assert/strict";
import { create as hiv } from "../../../models/hiv/model.ts";
import { create as epidemic } from "../../../models/epidem-basic/model.ts";

const couples = hiv({ seed: 21, initialPeople: 80, averageCouplingTendency: 0, averageTestFrequency: 0 });
assert.equal(couples.read().agents.length, 80);
assert.equal(couples.read().agents.filter(agent => agent.infected).length, 2);
couples.advance(12);
assert.equal(couples.read().tick, 12);
assert.equal(couples.read().agents.filter(agent => agent.infected).length, 2);
assert.ok(couples.read().agents.every(agent => !agent.coupled));
couples.setParameters({ averageCouplingTendency: 5 });
couples.advance(4);
assert.equal(couples.read().tick, 16);
assert.equal(couples.read().agents.length, 80);

const spread = epidemic({ seed: 22, initialPeople: 200, infectionChance: 0, recoveryChance: 100, averageRecoveryTime: 1 });
const initialInfected = spread.read().agents.filter(agent => agent.infected).length;
assert.ok(initialInfected > 0);
spread.advance(20);
assert.equal(spread.read().agents.filter(agent => agent.infected).length, 0);
assert.equal(spread.read().agents.filter(agent => agent.cured).length, initialInfected);
const finalTick = spread.read().tick;
spread.advance(3);
assert.equal(spread.read().tick, finalTick);
assert.ok(finalTick <= 4);
assert.equal(spread.read().agents.length, 200);
console.log("coupling and recovery passed");
