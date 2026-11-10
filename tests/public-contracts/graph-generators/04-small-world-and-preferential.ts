// PROPOSAL ONLY: U2 selects eligible node order, one selection draw and retained edge slots.
import assert from "node:assert/strict";
import { Graph, Random, type Edge } from "city-library";
type Node = { index: number };
const pairs = (edges: readonly Edge<Node>[]) => edges.map(edge => [edge.from.index, edge.to.index]);
// n4, neighbors2: four original clockwise ring edges. Each successful rewire
// samples uniformly from current nonself/nonneighbors in supplied node order.
const small = Graph.create<Node>();
const nodes = Array.from({ length: 4 }, (_, index) => small.nodes.add({ index }));
const random = Random.create({ seed: 1 }), control = random.copy();
for (let draw = 0; draw < 8; draw++) control.number();
const rewired = small.generate({ kind: "small-world", nodes, neighbors: 2, probability: 1, random });
assert.deepEqual(pairs(rewired), [[0, 2], [1, 3], [2, 1], [3, 2]]);
assert.deepEqual(random.state, control.state);
assert.equal(rewired.length, 4);
assert.equal(new Set(rewired.map((edge: Edge<Node>) => [edge.from.index, edge.to.index].sort((a, b) => a - b).join(":"))).size, 4);
for (const edge of rewired) assert.equal(edge.directed, false);
for (const [count, probability] of [[4, 0], [3, 1]] as const) {
  const graph = Graph.create<Node>();
  const members = Array.from({ length: count }, (_, index) => graph.nodes.add({ index }));
  const rng = Random.create({ seed: 42 }), expectedRng = rng.copy();
  for (let draw = 0; draw < count; draw++) expectedRng.number();
  const result = graph.generate({ kind: "small-world", nodes: members, neighbors: 2, probability, random: rng });
  assert.deepEqual(pairs(result), count === 4 ? [[0, 1], [1, 2], [2, 3], [3, 0]] : [[0, 1], [1, 2], [2, 0]]);
  assert.deepEqual(rng.state, expectedRng.state); // No eligible endpoint in K3: no selection draw.
}
const preferential = Graph.create<Node>();
const members = Array.from({ length: 6 }, (_, index) => preferential.nodes.add({ index }));
const prefRandom = Random.create({ seed: 7 }), prefControl = prefRandom.copy();
for (let draw = 0; draw < 6; draw++) prefControl.number();
const attached = preferential.generate({ kind: "preferential", nodes: members, edgesPerNode: 2, random: prefRandom });
assert.deepEqual(pairs(attached), [[0, 1], [0, 2], [1, 2], [3, 0], [3, 1], [4, 3], [4, 1], [5, 2], [5, 1]]);
assert.deepEqual(prefRandom.state, prefControl.state);
assert.deepEqual(members.map(node => preferential.neighbors(node).length), [3, 5, 3, 3, 2, 2]);
const invalid = Graph.create<Node>();
const invalidNodes = Array.from({ length: 4 }, (_, index) => invalid.nodes.add({ index }));
const invalidRandom = Random.create({ seed: 91 }), before = invalidRandom.state;
for (const neighbors of [0, 1, 3, 4, 2.5]) assert.throws(() => invalid.generate({ kind: "small-world", nodes: invalidNodes, neighbors, probability: 1, random: invalidRandom }));
for (const edgesPerNode of [0, 4, 1.5]) assert.throws(() => invalid.generate({ kind: "preferential", nodes: invalidNodes, edgesPerNode, random: invalidRandom }));
assert.throws(() => invalid.generate({ kind: "small-world", nodes: invalidNodes, neighbors: 2, probability: 1, random: invalidRandom, directed: undefined } as never));
assert.throws(() => invalid.generate({ kind: "preferential", nodes: invalidNodes, edgesPerNode: 1, random: invalidRandom, directed: true } as never));
assert.deepEqual(invalidRandom.state, before); assert.equal(invalid.edges.size, 0);
console.log("generator proposal04: uniform eligible rewiring and stable degree-proportional attachment");
