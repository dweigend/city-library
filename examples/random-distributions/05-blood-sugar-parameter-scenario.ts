// PROPOSAL ONLY: source parameter/scale scenario, not a port or native baseline.
import assert from "node:assert/strict";
import { Random, World } from "city-library";
const random = Random.create({ seed: 401 });
const world = World.create({ random });
const checkpoint = random.state;
// Original make-liver uses Poisson150; 792 cells is the proposed author scenario.
const stores = Array.from({ length: 792 }, () => world.random.number({ distribution: "poisson", mean: 150 }));
assert.ok(stores.every(value => Number.isSafeInteger(value) && value >= 0));
const total = stores.reduce((sum, value) => sum + value, 0);
assert.ok(Math.abs(total - 792 * 150) < 8 * Math.sqrt(792 * 150));
// Original setup/adjust-hormones uses mean2/ln2, hence exponential half-life2.
const mean = 2 / Math.LN2;
const lives = Array.from({ length: 12000 }, () => world.random.number({ distribution: "exponential", mean }));
assert.ok(lives.every(value => Number.isFinite(value) && value >= 0));
const average = lives.reduce((sum, value) => sum + value, 0) / lives.length;
assert.ok(Math.abs(average - mean) < 8 * mean / Math.sqrt(lives.length));
assert.ok(Math.abs(lives.filter(value => value > 2).length / lives.length - 0.5) < 0.03);
assert.equal(world.tick.value, 0);
assert.equal(world.agents.length, 0); // Distribution requests do not create biological agents.
const final = random.state;
random.state = checkpoint;
assert.deepEqual(Array.from({ length: 792 }, () => world.random.number({ distribution: "poisson", mean: 150 })), stores);
assert.deepEqual(Array.from({ length: 12000 }, () => world.random.number({ distribution: "exponential", mean })), lives);
assert.deepEqual(random.state, final);
assert.equal(world.random, random);
assert.equal(world.tick.value, 0);
console.log("distribution proposal05: actual liver/hormone parameters, moments, half-life and World continuation");
