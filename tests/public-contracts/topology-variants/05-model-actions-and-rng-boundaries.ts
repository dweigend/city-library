// UNFROZEN PROPOSAL. This author chooses separated streams, NOT native PA interleaving.
import assert from "node:assert/strict";
import { Agent, Graph, Random, World } from "city-library";
const worldRandom = Random.create({ seed: 99 }),
  world = World.create({ x: 20, y: 20 }, { random: worldRandom });
const births = Random.create({ seed: 41 }),
  topology = Random.create({ seed: 7 }),
  blocks = Random.create({ seed: 11 });
topology.number({ distribution: "normal" }); // Pending Gaussian cache must survive topology unit draws.
const graph = Graph.create<
  ReturnType<typeof Agent.create<{ index: number; energy: number; visits: number }>>,
  { nested: { tags: string[] } }
>({ edgeState: { nested: { tags: ["base"] } } });
const old = [-2, -1].map(index => world.add(Agent.create({ index, energy: 0, visits: 0 })));
old.forEach(node => graph.nodes.add(node));
const retained = graph.edges.add({ from: old[0]!, to: old[1]! });
const birthControl = births.copy();
for (let i = 0; i < 4; i++) birthControl.number();
// Birth/state policy is an explicit model action and has completed before generate.
const nodes = Array.from({ length: 4 }, (_, index) =>
  world.add(
    Agent.create({ index, energy: births.number(), visits: 0 }, { position: { x: index, y: 0 } })
  )
);
nodes.forEach(node => graph.nodes.add(node));
assert.deepEqual(births.state, birthControl.state);
const topologyControl = topology.copy();
for (let i = 0; i < 4; i++) topologyControl.number();
const worldBefore = worldRandom.state,
  birthBefore = births.state,
  blockBefore = blocks.state;
const edges = graph.generate({
  kind: "small-world",
  profile: "ordered-topology/1",
  nodes,
  neighborsPerSide: 1,
  probability: 0,
  directed: true,
  random: topology
});
assert.deepEqual(
  edges.map(edge => [edge.from.index, edge.to.index]),
  [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0]
  ]
);
assert.deepEqual(topology.state, topologyControl.state);
assert.deepEqual(worldRandom.state, worldBefore);
assert.deepEqual(births.state, birthBefore);
assert.deepEqual(blocks.state, blockBefore);
assert.equal(world.tick.value, 0);
assert.equal(world.agents.length, 6);
assert.equal(graph.edges.size, 5);
assert.equal(retained.alive, true);
assert.ok(nodes.every(node => node.visits === 0)); // No hidden turtle block, including a no-op shuffle.
assert.deepEqual(
  nodes.map(node => [node.x, node.y]),
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0]
  ]
); // No hidden layout.
edges[0]!.nested.tags.push("edited");
assert.deepEqual(edges[1]!.nested.tags, ["base"]);
const afterTopology = topology.state;
assert.throws(
  () =>
    graph.generate({
      kind: "small-world",
      profile: "ordered-topology/1",
      nodes,
      neighborsPerSide: 1,
      probability: 1,
      directed: true,
      random: topology
    }),
  TypeError
);
assert.deepEqual(topology.state, afterTopology);
assert.equal(graph.edges.size, 5); // Induced-edgeless preflight.
// Explicit caller block order: an existing portable shuffle API, not a native ask-order claim.
const blockControl = blocks.copy();
for (let i = 0; i < 3; i++) blockControl.number();
for (const node of blocks.sample(nodes, { count: nodes.length, algorithm: "fisher-yates-descending" }))
  node.visits++;
assert.deepEqual(blocks.state, blockControl.state);
assert.ok(nodes.every(node => node.visits === 1));
assert.ok(old.every(node => node.visits === 0));
// Explicit deterministic layout action, independent of graph topology and RNG.
for (const [index, node] of nodes.entries()) node.move({ to: { x: index - 2, y: 2 } });
assert.deepEqual(
  nodes.map(node => [node.x, node.y]),
  [
    [-2, 2],
    [-1, 2],
    [0, 2],
    [1, 2]
  ]
);
assert.deepEqual(topology.state, afterTopology);
assert.equal(world.tick.value, 0);
// Clearing a graph is not silently clearing the World or resetting another stream.
graph.delete();
assert.equal(graph.nodes.size, 0);
assert.equal(world.agents.length, 6);
assert.ok(nodes.every(node => node.alive));
for (const node of [...world.agents]) node.delete();
world.tick.reset();
assert.equal(world.agents.length, 0);
const capped = Graph.create<{ index: number }>(),
  many = Array.from({ length: 100001 }, (_, index) => capped.nodes.add({ index }));
const capRandom = Random.create({ seed: 1 }),
  beforeCap = capRandom.state;
assert.throws(
  () =>
    capped.generate({
      kind: "small-world",
      profile: "ordered-topology/1",
      nodes: many,
      neighborsPerSide: 0,
      probability: 0,
      random: capRandom
    }),
  RangeError
);
assert.deepEqual(capRandom.state, beforeCap);
assert.equal(capped.edges.size, 0);
console.log(
  "proposal05: explicit births, append/clear, block/layout streams and unchanged topology caps"
);
