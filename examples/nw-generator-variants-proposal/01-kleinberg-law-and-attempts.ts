// UNFROZEN PROPOSAL: kind/profile/field names need root approval. No API shim.
import assert from "node:assert/strict";
import { Graph, Random, type Edge } from "city-library";
type Node = { index: number };
const cases = [
  {
    shape: [3, 2] as const,
    exponent: 0,
    wrap: false,
    directed: false,
    seed: 1,
    base: 7,
    pairs: [
      [0, 1],
      [0, 3],
      [1, 2],
      [1, 4],
      [2, 5],
      [3, 4],
      [4, 5],
      [0, 4],
      [2, 3],
      [3, 5],
      [5, 1]
    ]
  },
  {
    shape: [3, 2] as const,
    exponent: 2,
    wrap: false,
    directed: false,
    seed: 1,
    base: 7,
    pairs: [
      [0, 1],
      [0, 3],
      [1, 2],
      [1, 4],
      [2, 5],
      [3, 4],
      [4, 5],
      [2, 4],
      [3, 5]
    ]
  },
  {
    shape: [3, 3] as const,
    exponent: 2,
    wrap: true,
    directed: false,
    seed: 7,
    base: 18,
    pairs: [
      [0, 1],
      [0, 3],
      [1, 2],
      [1, 4],
      [2, 0],
      [2, 5],
      [3, 4],
      [3, 6],
      [4, 5],
      [4, 7],
      [5, 3],
      [5, 8],
      [6, 7],
      [6, 0],
      [7, 8],
      [7, 1],
      [8, 6],
      [8, 2]
    ]
  },
  {
    shape: [2, 2] as const,
    exponent: 0,
    wrap: false,
    directed: true,
    seed: 1,
    base: 4,
    pairs: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [1, 0],
      [2, 1],
      [3, 2]
    ]
  },
];
for (const item of cases) {
  const graph = Graph.add<Node>();
  const nodes = Array.from({ length: item.shape[0] * item.shape[1] }, (_, index) =>
    graph.nodes.add({ index })
  );
  const random = Random.add({ seed: item.seed }),
    control = random.copy();
  for (const _ of nodes) control.number(); // Exactly one topology shortcut attempt/source.
  const edges = graph.generate({
    kind: "kleinberg",
    profile: "nw-web-topology/1",
    nodes,
    shape: item.shape,
    clusteringExponent: item.exponent,
    wrap: item.wrap,
    directed: item.directed,
    random
  });
  assert.deepEqual(
    edges.map((edge: Edge<Node>) => [edge.from.index, edge.to.index]),
    item.pairs
  );
  assert.deepEqual(random.state, control.state);
  assert.equal(Object.isFrozen(edges), true);
  assert.ok(edges.length >= item.base && edges.length <= item.base + nodes.length);
  assert.equal(
    new Set(
      edges.map((edge: Edge<Node>) =>
        item.directed
          ? `${edge.from.index}:${edge.to.index}`
          : [edge.from.index, edge.to.index].sort((a, b) => a - b).join(":")
      )
    ).size,
    edges.length
  );
  assert.ok(
    edges.every((edge: Edge<Node>) => edge.from !== edge.to && edge.directed === item.directed)
  );
  assert.deepEqual([...graph.nodes], nodes);
  if (item.wrap) assert.equal(edges.length, item.base); // All nine attempts hit existing pairs; no redraw.
}
// On the 2x3 corner at r=2 the exact ideal probabilities are
// [18/47,9/94,18/47,9/94,2/47], not uniform nonneighbor probabilities.
// The asserted portable seeded edge ledgers above have independent rational oracles.
const invalid = Graph.add<Node>(),
  nodes = Array.from({ length: 6 }, (_, index) => invalid.nodes.add({ index }));
const random = Random.add({ seed: 1 }),
  before = random.state;
assert.throws(
  () =>
    invalid.generate({
      kind: "kleinberg",
      profile: "nw-web-topology/1",
      nodes,
      shape: [1, 6],
      clusteringExponent: 2,
      random
    }),
  RangeError
);
assert.throws(
  () =>
    invalid.generate({
      kind: "kleinberg",
      profile: "nw-web-topology/1",
      nodes,
      shape: [3, 2],
      clusteringExponent: -1,
      random
    }),
  RangeError
);
assert.throws(
  () =>
    invalid.generate({
      kind: "kleinberg",
      profile: "nw-web-topology/1",
      nodes,
      shape: [3, 2],
      clusteringExponent: NaN,
      random
    }),
  TypeError
);
assert.deepEqual(random.state, before);
assert.equal(invalid.edges.size, 0);
console.log(
  "proposal01: Kleinberg Manhattan law, directed pairs and deduplicated attempts; no native seed parity"
);
