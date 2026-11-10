import assert from "node:assert/strict";
import { create as autumn } from "../../../models/autumn/model.ts";
import { create as membrane } from "../../../models/membrane-formation/model.ts";

const tree = autumn({ seed: 1, numberOfLeaves: 12, startSugarMean: 50, startSugarStddev: 0, temperature: 5, rainIntensity: 0, windFactor: 0, sunIntensity: 0 });
assert.equal(tree.read().leaves.length, 12);
const initial = tree.read();
assert.ok(initial.leaves.every(leaf => leaf.sugarLevel === 49 && leaf.anthocyanin === 1));
tree.advance();
assert.equal(tree.read().tick, 1);
assert.equal(tree.read().leaves.length, 12);
assert.equal(tree.read().raindrops.length, 0);
assert.ok(tree.read().leaves.every(leaf => leaf.sugarLevel === 47.5 && leaf.anthocyanin === 2));
assert.ok(tree.read().leaves.every(leaf => leaf.chlorophyll >= 0 && leaf.chlorophyll <= 100));

const solution = membrane({ seed: 2, numWater: 10, numLipids: 4 });
assert.equal(solution.read().agents.filter(agent => agent.breed === "water").length, 14);
assert.equal(solution.read().agents.filter(agent => agent.breed === "oil").length, 4);
assert.equal(solution.read().edges.length, 4);
const waterPartners = solution.read().edges.map(edge => edge.waterId);
assert.equal(new Set(waterPartners).size, 4);
solution.setParameters({ randomForce: 0, waterWaterForce: 0, waterOilForce: 0, tooCloseForce: 0 });
solution.advance(3);
assert.equal(solution.read().tick, 3);
assert.equal(solution.read().agents.length, 18);
assert.equal(solution.read().edges.length, 4);
assert.ok(Number.isFinite(solution.read().hydrophobicIsolation));
