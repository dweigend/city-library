// PROPOSAL ONLY: lattice node/axis first-occurrence order is proposed U1.
import assert from "node:assert/strict";
import { Graph, type Edge } from "city-library";
type Node = { index: number };
for (const branching of [undefined, 3]) {
  const graph = Graph.create<Node>();
  const nodes = Array.from({ length: 7 }, (_, index) => graph.nodes.add({ index }));
  const result = graph.generate({ kind: "tree", nodes, branching, directed: true });
  const expected = branching === 3 ? [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [1, 6]] : [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  assert.deepEqual(result.map((edge: Edge<Node>) => [edge.from.index, edge.to.index]), expected);
  assert.ok(result.every((edge: Edge<Node>) => edge.directed));
}
const cases = [
  { shape: [3], wrap: true, directed: true, pairs: [[0, 1], [1, 2], [2, 0]] },
  { shape: [2], wrap: true, directed: false, pairs: [[0, 1]] },
  { shape: [2, 2], wrap: false, directed: false, pairs: [[0, 1], [0, 2], [1, 3], [2, 3]] },
  { shape: [2, 2], wrap: true, directed: false, pairs: [[0, 1], [0, 2], [1, 3], [2, 3]] },
  { shape: [2, 2], wrap: true, directed: true, pairs: [[0, 1], [0, 2], [1, 0], [1, 3], [2, 3], [2, 0], [3, 2], [3, 1]] },
  { shape: [2, 2, 2], wrap: false, directed: false, pairs: [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]] },
  { shape: [1, 1, 1], wrap: true, directed: true, pairs: [] },
] as const;
for (const item of cases) {
  const graph = Graph.create<Node>(); // Existing simple graph permits antiparallel directed arcs.
  const count = item.shape.reduce((product: number, axis: number) => product * axis, 1);
  const nodes = Array.from({ length: count }, (_, index) => graph.nodes.add({ index }));
  const result = graph.generate({ kind: "lattice", nodes, shape: item.shape, wrap: item.wrap, directed: item.directed });
  assert.deepEqual(result.map((edge: Edge<Node>) => [edge.from.index, edge.to.index]), item.pairs);
  assert.equal(new Set(result.map((edge: Edge<Node>) => `${edge.from.index}:${edge.to.index}`)).size, result.length);
  assert.ok(result.every((edge: Edge<Node>) => edge.from !== edge.to));
}
assert.deepEqual(Graph.create<Node>().generate({ kind: "tree", nodes: [] }), []);
const bad = Graph.create<Node>(); const nodes = [bad.nodes.add({ index: 0 }), bad.nodes.add({ index: 1 })];
for (const shape of [[], [0], [1.5], [2, 2], [1, 1, 1, 2], [Infinity]]) {
  assert.throws(() => bad.generate({ kind: "lattice", nodes, shape }));
  assert.equal(bad.edges.size, 0);
}
for (const branching of [0, -1, 1.5, Infinity]) assert.throws(() => bad.generate({ kind: "tree", nodes, branching }));
assert.throws(() => bad.generate({ kind: "lattice", nodes, shape: [2], probability: undefined } as never));
assert.equal(bad.edges.size, 0);
// Positive integer branching is not given an invented safe-integer/size cap.
assert.equal(bad.generate({ kind: "tree", nodes, branching: Number.MAX_VALUE }).length, 1);
console.log("generator proposal02: rooted trees and x-fastest 1D/2D/3D wrapped lattice topology");
