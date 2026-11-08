// PROPOSAL ONLY. Unit draws use the existing public Random; no hidden stream.
import assert from "node:assert/strict";
import { Graph, Random, World, type Edge } from "city-library";
type Node = { index: number };
for (const directed of [false, true]) {
  const graph = Graph.add<Node>();
  const count = directed ? 3 : 4;
  const nodes = Array.from({ length: count }, (_, index) => graph.nodes.add({ index }));
  const random = Random.add({ seed: 1 }), control = random.copy();
  for (let draw = 0; draw < 6; draw++) control.number();
  const result = graph.generate({ kind: "random", nodes, directed, probability: 0.5, random });
  assert.deepEqual(result.map((edge: Edge<Node>) => [edge.from.index, edge.to.index]), directed ? [[0, 2], [2, 1]] : [[0, 2], [2, 3]]);
  assert.deepEqual(random.state, control.state);
}
for (const probability of [0, 1]) {
  const graph = Graph.add<Node>();
  const nodes = Array.from({ length: 4 }, (_, index) => graph.nodes.add({ index }));
  const random = Random.add({ seed: 42 }), control = random.copy();
  for (let draw = 0; draw < 6; draw++) control.number();
  const result = graph.generate({ kind: "random", nodes, probability, random });
  assert.equal(result.length, probability === 0 ? 0 : 6);
  assert.deepEqual(random.state, control.state); // Endpoint probabilities still consume every candidate draw.
}
const random = Random.add({ seed: 91 }), worldRandom = Random.add({ seed: 7 });
const world = World.add({ random: worldRandom }), graph = Graph.add<Node>();
const nodes = [graph.nodes.add({ index: 0 }), graph.nodes.add({ index: 1 })];
const before = random.state, worldBefore = worldRandom.state;
for (const probability of [-0.01, 1.01, NaN, Infinity]) assert.throws(() => graph.generate({ kind: "random", nodes, probability, random }));
assert.throws(() => graph.generate({ kind: "random", nodes: [nodes[0]!, nodes[0]!], probability: 1, random }));
assert.throws(() => graph.generate({ kind: "random", nodes, probability: 1, random: { number: () => 0.5 } } as never)); // Proposed U4: library-issued Random.
assert.deepEqual(random.state, before);
assert.equal(graph.edges.size, 0);
graph.generate({ kind: "random", nodes, probability: 1, random });
assert.deepEqual(worldRandom.state, worldBefore); assert.equal(world.tick.value, 0);
const already = random.state;
assert.throws(() => graph.generate({ kind: "random", nodes, probability: 0, random }));
assert.deepEqual(random.state, already); // Induced-edgeless preflight precedes any draw.
// The edge cap is NOT a candidate-pair cap. There are1000405 candidate pairs,
// but p=0 creates zero edges and must remain valid under the1e6 generated-edge cap.
const zeroGraph = Graph.add<Node>();
const many = Array.from({ length: 1415 }, (_, index) => zeroGraph.nodes.add({ index }));
const zeroRandom = Random.add({ seed: 1 }), zeroControl = zeroRandom.copy();
for (let draw = 0; draw < 1000405; draw++) zeroControl.number();
assert.deepEqual(zeroGraph.generate({ kind: "random", nodes: many, probability: 0, random: zeroRandom }), []);
assert.deepEqual(zeroRandom.state, zeroControl.state);
console.log("generator proposal03: lexicographic Bernoulli pairs, endpoint draws and explicit RNG continuation");
