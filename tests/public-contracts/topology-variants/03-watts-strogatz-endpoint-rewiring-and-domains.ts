// UNFROZEN PROPOSAL: per-side name and unit mapping are explicit review decisions.
import assert from "node:assert/strict";
import { Graph, Random, type Edge } from "city-library";
type Node = { index: number };
for (const directed of [false, true])
  for (const fixture of [
    {
      seed: 1,
      draws: 9,
      pairs: [
        [0, 2],
        [1, 3],
        [2, 1],
        [3, 2]
      ]
    },
    {
      seed: 7,
      draws: 11,
      pairs: [
        [0, 1],
        [1, 3],
        [2, 3],
        [3, 0]
      ]
    },
  ]) {
    const graph = Graph.create<Node>(),
      nodes = Array.from({ length: 4 }, (_, index) => graph.nodes.add({ index }));
    const random = Random.create({ seed: fixture.seed }),
      control = random.copy();
    for (let i = 0; i < fixture.draws; i++) control.number();
    const edges = graph.generate({
      kind: "small-world",
      profile: "ordered-topology/1",
      nodes,
      neighborCountPerSide: 1,
      probability: 1,
      directed,
      random
    });
    assert.deepEqual(
      edges.map((edge: Edge<Node>) => [edge.from.index, edge.to.index]),
      fixture.pairs
    );
    assert.deepEqual(random.state, control.state);
    assert.equal(edges.length, 4);
    assert.ok(edges.every((edge: Edge<Node>) => edge.directed === directed));
    assert.equal(
      new Set(
        edges.map((edge: Edge<Node>) =>
          [edge.from.index, edge.to.index].sort((a, b) => a - b).join(":")
        )
      ).size,
      4
    );
    if (fixture.seed === 7) assert.equal(edges[0]!.to, nodes[1]); // Old endpoint eligible even at probability1.
  }
for (const count of [1, 2]) {
  const graph = Graph.create<Node>(),
    nodes = Array.from({ length: count }, (_, index) => graph.nodes.add({ index }));
  const random = Random.create({ seed: 17 }),
    before = random.state;
  assert.deepEqual(
    graph.generate({
      kind: "small-world",
      profile: "ordered-topology/1",
      nodes,
      neighborCountPerSide: 0,
      probability: 1,
      directed: true,
      random
    }),
    []
  );
  assert.deepEqual(random.state, before);
  assert.equal(graph.nodes.size, count);
}
const graph = Graph.create<Node>(),
  nodes = Array.from({ length: 4 }, (_, index) => graph.nodes.add({ index }));
const random = Random.create({ seed: 1 }),
  control = random.copy();
for (let i = 0; i < 4; i++) control.number();
assert.deepEqual(
  graph
    .generate({
      kind: "small-world",
      profile: "ordered-topology/1",
      nodes,
      neighborCountPerSide: 1,
      probability: 0,
      directed: true,
      random
    })
    .map((edge: Edge<Node>) => [edge.from.index, edge.to.index]),
  [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0]
  ]
);
assert.deepEqual(random.state, control.state);
const invalid = Graph.create<Node>(),
  members = Array.from({ length: 4 }, (_, index) => invalid.nodes.add({ index })),
  before = random.state;
assert.throws(
  () =>
    invalid.generate({
      kind: "small-world",
      profile: "ordered-topology/1",
      nodes: members,
      neighborCountPerSide: 2,
      probability: 0,
      random
    }),
  RangeError
);
assert.throws(
  () =>
    invalid.generate({
      kind: "small-world",
      profile: "ordered-topology/1",
      nodes: [],
      neighborCountPerSide: 0,
      probability: 0,
      random
    }),
  RangeError
);
assert.deepEqual(random.state, before);
assert.equal(invalid.edges.size, 0);
assert.throws(
  () =>
    invalid.generate({
      kind: "small-world",
      nodes: members,
      neighbors: 2,
      probability: 0,
      random,
      directed: true
    } as never),
  TypeError
);
assert.throws(
  () =>
    invalid.generate({ kind: "small-world", nodes: members, neighborCount: 0, probability: 0, random }),
  RangeError
);
const generic = invalid.generate({
  kind: "small-world",
  nodes: members,
  neighborCount: 2,
  probability: 1,
  random: Random.create({ seed: 1 })
});
assert.deepEqual(
  generic.map(edge => [edge.from.index, edge.to.index]),
  [
    [0, 2],
    [1, 3],
    [2, 1],
    [3, 2]
  ]
); // Eight generic draws, not nine profile draws.
console.log("proposal03: per-side WS, persistent rejection buffer, old-target eligibility and k0");
