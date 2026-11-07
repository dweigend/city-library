import assert from "node:assert/strict";
import { Agent, Random } from "city-library";

const population = [Agent.add({ weight: 1 }), Agent.add({ weight: 0 }), Agent.add({ weight: 3 })];
const original = [...population];
const random = Random.add({ seed: 1 });
const selected = random.sample(population, { count: 2, weight: (agent) => agent.weight });
assert.deepEqual(selected, [population[2], population[0]]);
assert.equal(selected[0], population[2]);
assert.deepEqual(population, original);
const sourceOrder = Random.add({ seed: 1 }).sample(population, {
  count: 2, weight: (agent) => agent.weight, order: "source",
});
assert.deepEqual(sourceOrder, [population[0], population[2]]);
const replacement = Random.add({ seed: 1 }).sample(population, { count: 4, replace: true, weight: (agent) => agent.weight });
assert.equal(replacement.length, 4);
assert.ok(replacement.every((agent) => agent === population[0] || agent === population[2]));

const idle = random.state;
assert.deepEqual(random.sample(population, { count: 0 }), []);
assert.deepEqual(random.sample([], { count: 4 }), []);
assert.deepEqual(random.sample(population, { weight: () => 0 }), []);
assert.deepEqual(random.state, idle);
const singleton = Random.add({ seed: 1 });
assert.equal(singleton.sample([population[0]!])[0], population[0]);
assert.equal(singleton.number(), 0.002735721180215478);
assert.deepEqual(Random.add({ seed: 1 }).sample(["a", "b", "c", "d"], {
  count: 4, compatibility: "legacy-shuffle",
}), ["d", "b", "a", "c"]);
console.log("population-selection: canonical weighted choices, source order, explicit draw schedules");
