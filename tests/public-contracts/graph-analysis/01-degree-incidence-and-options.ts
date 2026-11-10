// REVISED PROPOSAL ONLY: root provisional numerical/domain closures, not frozen.
import assert from "node:assert/strict";
import { Graph, Random, World, type Edge } from "city-library";

type Node = { name: string };
const random = Random.create({ seed: 7 }), world = World.create({ random });
const graph = Graph.create<Node, { weight: number }>({ parallel: true, selfLoops: true, edgeState: { weight: 1 } });
const a = graph.nodes.add({ name: "a" }), b = graph.nodes.add({ name: "b" }), isolated = graph.nodes.add({ name: "isolated" });
const edges = [
  graph.edges.add({ from: a, to: b, state: { weight: 2 } }),
  graph.edges.add({ from: a, to: b, directed: true, state: { weight: 3 } }),
  graph.edges.add({ from: a, to: a, directed: true, state: { weight: 5 } }),
  graph.edges.add({ from: b, to: b, state: { weight: 7 } }),
  graph.edges.add({ from: a, to: b, directed: true, state: { weight: 11 } }),
];
const before = random.state, tick = world.tick.value;
const defaults = graph.analyze({ measure: "degree" });
assert.deepEqual([...defaults.keys()], [a, b, isolated]);
assert.deepEqual([...defaults.values()], [4, 3, 0]);
assert.deepEqual([...graph.analyze({ measure: "degree", direction: "in" }).values()], [2, 5, 0]);
assert.deepEqual([...graph.analyze({ measure: "degree", direction: "all" }).values()], [5, 5, 0]);
assert.deepEqual([...graph.analyze({ measure: "degree", normalized: true }).values()], [2, 1.5, 0]);
for (const [direction, expected] of [["out", [21, 16, 0]], ["in", [7, 30, 0]], ["all", [26, 30, 0]]] as const) {
  const seen: Edge<Node, { weight: number }>[] = [];
  const result = graph.analyze({ measure: "degree", direction, weight: (edge: Edge<Node, { weight: number }>) => { seen.push(edge); return edge.weight; } });
  assert.deepEqual(seen, edges); // Root provisional closure: once per original edge, including loops.
  assert.deepEqual([...result.values()], expected);
  assert.equal([...result.keys()][0], a);
}
edges[0]!.weight = 0;
assert.equal(defaults.get(a), 4); // Previous result is a detached observation.
assert.deepEqual([...graph.analyze({ measure: "degree", weight: (edge: Edge<Node, { weight: number }>) => edge.weight }).values()], [19, 14, 0]);
assert.deepEqual([...graph.analyze({ measure: "degree", direction: undefined, normalized: undefined, weight: undefined }).values()], [4, 3, 0]);
for (const field of ["cost", "disconnected", "damping", "tolerance", "maxIterationCount"]) {
  assert.throws(() => graph.analyze({ measure: "degree", [field]: field === "cost" ? () => 1 : 1 } as never), TypeError);
  assert.throws(() => graph.analyze({ measure: "degree", [field]: undefined } as never), TypeError); // Root provisional closure: disallowed own key rejects even undefined.
}
assert.throws(() => graph.analyze({ measure: "bogus" } as never), TypeError);
assert.throws(() => graph.analyze({ measure: "degree", unknown: undefined } as never), TypeError);
assert.throws(() => graph.analyze({ measure: "degree", direction: "sideways" } as never), TypeError);
assert.throws(() => graph.analyze({ measure: "degree", normalized: 1 } as never), TypeError);
assert.throws(() => graph.analyze({ measure: "degree", weight: () => -1 }), RangeError);
assert.throws(() => graph.analyze({ measure: "degree", weight: () => Infinity }), TypeError);
assert.throws(() => graph.analyze({ measure: "degree", weight: () => Promise.resolve(1) as unknown as number }), TypeError);
let invoked = false;
const accessor = Object.defineProperty({ measure: "degree" }, "weight", { enumerable: true, get() { invoked = true; return () => 1; } });
assert.throws(() => graph.analyze(accessor as never), TypeError);
assert.equal(invoked, false);
assert.deepEqual(random.state, before); assert.equal(world.tick.value, tick);
assert.equal(graph.nodes.size, 3); assert.equal(graph.edges.size, 5);
const singleton = Graph.create<Node>({ selfLoops: true }); const one = singleton.nodes.add({ name: "one" });
singleton.edges.add({ from: one, to: one });
assert.equal(singleton.analyze({ measure: "degree", normalized: true }).get(one), 2);
assert.equal(Graph.create().analyze({ measure: "degree" }).size, 0);
// Exact captured-weight aggregation with one nearest/ties-even publication.
const precise = Graph.create<Node, { weight: number }>({ parallel: true, edgeState: { weight: 1 } });
const pa = precise.nodes.add({ name: "pa" }), pb = precise.nodes.add({ name: "pb" });
precise.nodes.add({ name: "normalization divisor2" });
for (const [index, weight] of [2 ** 53, 1, 1].entries()) {
  precise.edges.add({ from: pa, to: pb, directed: true, state: { weight } });
  if (index === 1) assert.equal(precise.analyze({ measure: "degree", weight: (edge: Edge<Node, { weight: number }>) => edge.weight }).get(pa), 2 ** 53); // nearest/ties-even
}
assert.equal(precise.analyze({ measure: "degree", weight: (edge: Edge<Node, { weight: number }>) => edge.weight }).get(pa), 2 ** 53 + 2);
assert.equal(precise.analyze({ measure: "degree", normalized: true, weight: (edge: Edge<Node, { weight: number }>) => edge.weight }).get(pa), 2 ** 52 + 1);
const divided = Graph.create<Node, { weight: number }>({ parallel: true, edgeState: { weight: 1 } });
const da = divided.nodes.add({ name: "da" }), db = divided.nodes.add({ name: "db" });
divided.nodes.add({ name: "divisor3-a" }); divided.nodes.add({ name: "divisor3-b" });
for (const weight of [2 ** 53, 1]) divided.edges.add({ from: da, to: db, directed: true, state: { weight } });
// Normalize the published finite raw score, not the unrounded exact quotient.
assert.equal(divided.analyze({ measure: "degree", normalized: true, weight: (edge: Edge<Node, { weight: number }>) => edge.weight }).get(da), (2 ** 53) / 3);
assert.notEqual((2 ** 53) / 3, 3002399751580331); // exact(2^53+1)/3 is this integer.
const finiteBoundary = [Number.MAX_VALUE, 1];
const threshold = Graph.create<Node, { weight: number }>({ parallel: true, edgeState: { weight: 1 } });
const ta = threshold.nodes.add({ name: "ta" }), tb = threshold.nodes.add({ name: "tb" }); threshold.nodes.add({ name: "divide2" });
const boundaryEdges = finiteBoundary.map(weight => threshold.edges.add({ from: ta, to: tb, directed: true, state: { weight } }));
const readWeight = (edge: Edge<Node, { weight: number }>) => edge.weight;
assert.equal(threshold.analyze({ measure: "degree", weight: readWeight }).get(ta), Number.MAX_VALUE); // exactMAX+1 rounds finite
boundaryEdges[1]!.weight = 2 ** 970;
assert.throws(() => threshold.analyze({ measure: "degree", weight: readWeight }), RangeError);
assert.throws(() => threshold.analyze({ measure: "degree", normalized: true, weight: readWeight }), RangeError); // reject BEFORE divide2
// Every measure preflights keys/shapes/values before empty-shortcuts or callbacks.
const empty = Graph.create<Node>(); let emptyCalls = 0;
for (const measure of ["degree", "closeness", "betweenness", "eigenvector", "page-rank"] as const) {
  const callbackField = measure === "closeness" || measure === "betweenness" ? "cost" : "weight";
  const prohibited = callbackField === "cost" ? "weight" : "cost";
  const callback = () => { emptyCalls++; return 1; };
  assert.equal(empty.analyze({ measure, [callbackField]: callback } as never).size, 0);
  assert.throws(() => empty.analyze({ measure, [callbackField]: 3 } as never), TypeError);
  assert.throws(() => empty.analyze({ measure, [callbackField]: callback, [prohibited]: undefined } as never), TypeError);
  assert.throws(() => empty.analyze({ measure, unknown: undefined } as never), TypeError);
}
assert.throws(() => empty.analyze({ measure: "page-rank", damping: 1 }));
assert.throws(() => empty.analyze({ measure: "eigenvector", maxIterationCount: 0 }));
assert.equal(emptyCalls, 0);
console.log("analysis proposal01: degree incidence, canonical keys, weights and closed options");
