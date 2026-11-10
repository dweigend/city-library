import assert from "node:assert/strict";
import { Agent, Graph, World, run } from "city-library";

function createNetwork(bridged: boolean, shape: "communities" | "ring" | "hub" = "communities") {
  const agents = Array.from({ length: 8 }, (_, index) => Agent.create({ index, group: index < 4 ? "left" : "right", adopted: index === 0 }));
  const world = World.create();
  world.add(agents);
  const graph = Graph.create<(typeof agents)[number]>();
  for (const agent of agents) graph.nodes.add(agent);
  if (shape === "communities") {
    for (let from = 0; from < agents.length; from += 1) {
      for (let to = from + 1; to < agents.length; to += 1) {
        if (agents[from]!.group === agents[to]!.group) graph.edges.add({ from: agents[from]!, to: agents[to]! });
      }
    }
  } else if (shape === "ring") {
    for (let index = 0; index < agents.length; index += 1) graph.edges.add({ from: agents[index]!, to: agents[(index + 1) % agents.length]! });
  } else {
    for (const agent of agents.slice(1)) graph.edges.add({ from: agents[0]!, to: agent });
  }
  const bridge = bridged && shape === "communities" ? graph.edges.add({ from: agents[3]!, to: agents[4]! }) : undefined;
  function advance(steps: number) {
    run(world, () => {
      const atStart = new Set(agents.filter((agent) => agent.adopted));
      const next = agents.filter((agent) => !agent.adopted && graph.neighbors(agent).some((neighbor) => atStart.has(neighbor)));
      for (const agent of next) agent.adopted = true;
    }, steps);
  }
  return { agents, world, graph, bridge, advance, adopted: () => agents.filter((agent) => agent.adopted).length };
}

const separated = createNetwork(false);
const connected = createNetwork(true);
const cut = createNetwork(true);
cut.bridge!.delete();
separated.advance(5);
connected.advance(5);
cut.advance(5);
assert.equal(separated.adopted(), 4);
assert.equal(cut.adopted(), 4);
assert.equal(connected.adopted(), 8);
assert.equal(separated.graph.edges.size, 12);
assert.equal(connected.graph.edges.size, 13);
assert.equal(cut.graph.edges.size, 12);
assert.equal(cut.bridge!.alive, false);
assert.equal(separated.world.tick.value, 5);
assert.equal(connected.world.tick.value, 5);
assert.ok(separated.agents.filter((agent) => agent.group === "right").every((agent) => !agent.adopted));
assert.ok(connected.agents.every((agent) => agent.adopted));
assert.deepEqual(separated.world.random.state, connected.world.random.state);
assert.equal(separated.graph.hasNode(connected.agents[0]!), false);
const ring = createNetwork(false, "ring");
const hub = createNetwork(false, "hub");
ring.advance(1);
hub.advance(1);
assert.equal(ring.adopted(), 3);
assert.equal(hub.adopted(), 8);
assert.equal(ring.world.tick.value, hub.world.tick.value);
console.log("network-effects: bridges change reach from 4/8 to 8/8; hub spreads faster than ring");
