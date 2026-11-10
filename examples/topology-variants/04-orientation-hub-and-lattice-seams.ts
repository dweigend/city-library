// UNFROZEN PROPOSAL. Existing copy/reordering solve some cases without a new variant.
import assert from "node:assert/strict";
import { Graph, type Edge } from "city-library";
type Node = { index: number };
const star = Graph.create<Node>(),
  nodes = Array.from({ length: 4 }, (_, index) => star.nodes.add({ index }));
star.generate({ kind: "star", nodes, directed: true });
const inward = star.copy({ direction: "reverse" });
assert.deepEqual(
  [...inward.edges].map(edge => [edge.from.index, edge.to.index]),
  [
    [1, 0],
    [2, 0],
    [3, 0]
  ]
);
assert.deepEqual([...inward.nodes], nodes); // First canonical node stays the hub.
const storedUndirected = inward.copy({ direction: "undirected" });
assert.deepEqual(
  [...storedUndirected.edges].map(edge => [edge.from.index, edge.to.index]),
  [
    [1, 0],
    [2, 0],
    [3, 0]
  ]
);
assert.ok([...storedUndirected.edges].every(edge => !edge.directed));
for (const spokes of ["in", "out"] as const) {
  const graph = Graph.create<Node>(),
    members = Array.from({ length: 4 }, (_, index) => graph.nodes.add({ index }));
  const edges = graph.generate({
    kind: "wheel",
    profile: "ordered-topology/1",
    nodes: members,
    directed: true,
    spokes
  });
  const expected =
    spokes === "in"
      ? [
          [0, 1],
          [1, 2],
          [2, 0],
          [0, 3],
          [1, 3],
          [2, 3]
        ]
      : [
          [0, 1],
          [1, 2],
          [2, 0],
          [3, 0],
          [3, 1],
          [3, 2]
        ];
  assert.deepEqual(
    edges.map((edge: Edge<Node>) => [edge.from.index, edge.to.index]),
    expected
  );
  assert.deepEqual([...graph.nodes], members); // Birth/insertion identity order is not reordered.
}
const outward = Graph.create<Node>(),
  members = Array.from({ length: 4 }, (_, index) => outward.nodes.add({ index }));
outward.generate({ kind: "wheel", nodes: [members[3]!, ...members.slice(0, 3)], directed: true });
assert.deepEqual(
  [...outward.edges].map(edge => [edge.from.index, edge.to.index]),
  [
    [0, 1],
    [1, 2],
    [2, 0],
    [3, 0],
    [3, 1],
    [3, 2]
  ]
);
assert.notDeepEqual(
  [...outward.copy({ direction: "reverse" }).edges].map(edge => [edge.from.index, edge.to.index]),
  [
    [0, 1],
    [1, 2],
    [2, 0],
    [0, 3],
    [1, 3],
    [2, 3]
  ]
); // Global reversal also reverses the rim.
for (const shape of [
  [2, 2],
  [3, 2]
] as const) {
  const graph = Graph.create<Node>(),
    cells = Array.from({ length: shape[0] * shape[1] }, (_, index) => graph.nodes.add({ index }));
  const edges = graph.generate({
    kind: "lattice",
    profile: "ordered-topology/1",
    nodes: cells,
    shape,
    wrap: true,
    directed: true
  });
  assert.deepEqual(
    edges.map((edge: Edge<Node>) => [edge.from.index, edge.to.index]),
    shape[0] === 2
      ? [
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 3]
        ]
      : [
          [0, 1],
          [0, 3],
          [1, 2],
          [1, 4],
          [2, 0],
          [2, 5],
          [3, 4],
          [4, 5],
          [5, 3]
        ]
  );
}
const generic = Graph.create<Node>(),
  cells = Array.from({ length: 4 }, (_, index) => generic.nodes.add({ index }));
assert.equal(
  generic.generate({ kind: "lattice", nodes: cells, shape: [2, 2], wrap: true, directed: true })
    .length,
  8
); // Existing antiparallel seams survive.
console.log(
  "proposal04: actual copy/reordering plus proposed inward-wheel and two-cell seam variants"
);
