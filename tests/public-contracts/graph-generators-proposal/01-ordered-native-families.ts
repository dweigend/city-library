// PROPOSAL ONLY: returned edge order/endpoints are explicit U1 proposals, not frozen.
import assert from "node:assert/strict";
import { Graph, type Edge, type GeneratorOptions } from "city-library";
type Node = { index: number };
const expected = {
  path: [[0, 1], [1, 2], [2, 3]],
  cycle: [[0, 1], [1, 2], [2, 3], [3, 0]],
  star: [[0, 1], [0, 2], [0, 3]],
  wheel: [[1, 2], [2, 3], [3, 1], [0, 1], [0, 2], [0, 3]],
  complete: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]],
} as const;
for (const kind of ["path", "cycle", "star", "wheel", "complete"] as const) {
  for (const directed of [false, true]) {
    const graph = Graph.add<Node>();
    const inserted = Array.from({ length: 4 }, (_, index) => graph.nodes.add({ index }));
    const nodes = Object.freeze(inserted.toReversed()); // Explicit author order differs from graph insertion.
    const options: GeneratorOptions<Node> = { kind, nodes, directed };
    const result = graph.generate(options);
    const pairs = result.map((edge: Edge<Node>) => [nodes.indexOf(edge.from), nodes.indexOf(edge.to)]);
    const directedComplete = [[0, 1], [0, 2], [0, 3], [1, 0], [1, 2], [1, 3], [2, 0], [2, 1], [2, 3], [3, 0], [3, 1], [3, 2]];
    assert.deepEqual(pairs, kind === "complete" && directed ? directedComplete : expected[kind]);
    assert.ok(Object.isFrozen(result));
    assert.deepEqual([...graph.edges], result);
    assert.deepEqual([...graph.nodes], inserted);
    for (const edge of result) {
      assert.equal(edge.graph, graph);
      assert.equal(edge.directed, directed);
      assert.equal(edge.alive, true);
      assert.equal(edge.path, undefined);
      assert.ok(nodes.some(node => node === edge.from));
      assert.ok(nodes.some(node => node === edge.to));
      assert.notEqual(edge.from, edge.to);
    }
  }
}
for (const kind of ["path", "cycle", "star", "complete"] as const) {
  const empty = Graph.add<Node>();
  assert.deepEqual(empty.generate({ kind, nodes: [] }), []);
  const one = empty.nodes.add({ index: 0 });
  assert.deepEqual(empty.generate({ kind, nodes: [one] }), []);
}
for (const directed of [false, true]) {
  const graph = Graph.add<Node>();
  const nodes = [graph.nodes.add({ index: 0 }), graph.nodes.add({ index: 1 })];
  const result = graph.generate({ kind: "cycle", nodes, directed });
  assert.deepEqual(result.map((edge: Edge<Node>) => [nodes.indexOf(edge.from), nodes.indexOf(edge.to)]), directed ? [[0, 1], [1, 0]] : [[0, 1]]);
}
const graph = Graph.add<Node>();
const a = graph.nodes.add({ index: 0 }), b = graph.nodes.add({ index: 1 }), c = graph.nodes.add({ index: 2 });
const outside = graph.nodes.add({ index: 3 });
const retained = graph.edges.add({ from: a, to: outside });
const selected = [c, a, b];
const added = graph.generate({ kind: "path", nodes: selected });
assert.equal(added[0]!.from, c); assert.equal(added[0]!.to, a);
assert.equal(added[1]!.from, a); assert.equal(added[1]!.to, b);
assert.deepEqual([...graph.edges], [retained, ...added]);
assert.throws(() => graph.generate({ kind: "star", nodes: selected })); // Selected induced subgraph must initially be edgeless.
const before = [...graph.edges];
for (const options of [
  { kind: "path", nodes: [outside, outside] },
  { kind: "path", nodes: [{ index: 99 }] },
  { kind: "path", nodes: new Set([outside]) },
  { kind: "wheel", nodes: [outside] },
  { kind: "path", nodes: [outside], unknown: undefined },
  { kind: "path", nodes: [outside], probability: undefined },
  { kind: "kleinberg", nodes: [outside] },
]) assert.throws(() => graph.generate(options as never));
assert.deepEqual([...graph.edges], before);
console.log("generator proposal01: five native families, canonical order and selected-region preflight");
