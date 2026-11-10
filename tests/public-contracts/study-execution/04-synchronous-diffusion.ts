import assert from "node:assert/strict";
import { Agent, Graph, World, run } from "city-library";

const agents = Array.from({ length: 5 }, (_, index) => Agent.create({ index, adopted: index === 0 }));
const world = World.create();
world.add(agents);
const graph = Graph.create<(typeof agents)[number]>();
for (const agent of agents) graph.nodes.add(agent);
for (let index = 1; index < agents.length; index += 1) {
  graph.edges.add({ from: agents[index - 1]!, to: agents[index]!, directed: true });
}
const randomBefore = world.random.state;
function step() {
  const atStart = new Set(agents.filter((agent) => agent.adopted));
  const next = agents.filter((agent) => !agent.adopted && graph.neighbors(agent, { direction: "in" }).some((neighbor) => atStart.has(neighbor)));
  for (const agent of next) agent.adopted = true;
}
function adopted() { return agents.filter((agent) => agent.adopted).map((agent) => agent.index); }
run(world, step);
assert.deepEqual(adopted(), [0, 1]);
assert.equal(world.tick.value, 1);
run(world, step);
assert.deepEqual(adopted(), [0, 1, 2]);
assert.equal(agents[3]!.adopted, false);
run(world, step, 2);
assert.deepEqual(adopted(), [0, 1, 2, 3, 4]);
assert.equal(world.tick.value, 4);
assert.deepEqual(world.random.state, randomBefore);
assert.equal(graph.edges.size, 4);
assert.deepEqual(graph.neighbors(agents[0]!, { direction: "in" }), []);
console.log("synchronous-diffusion: one directed hop per tick, no same-step chain reaction or hidden RNG");
