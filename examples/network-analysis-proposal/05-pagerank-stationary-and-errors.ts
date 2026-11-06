// PROPOSAL ONLY; U1 callback capture, U2 option presence and U3 numeric closures remain reviewable.
import assert from "node:assert/strict";
import { Graph, type Edge } from "city-library";
const close = (actual: number | undefined, expected: number, tolerance = 1e-10) => { assert.notEqual(actual, undefined); assert.ok(Math.abs(actual! - expected) <= tolerance, `${actual} != ${expected}`); };
type Node = { name: string };
const graph = Graph.add<Node, { weight: number }>({ parallel: true, edgeState: { weight: 1 } });
const a = graph.nodes.add({ name: "a" }), b = graph.nodes.add({ name: "b" }), c = graph.nodes.add({ name: "c" });
const edges = [
  graph.edges.add({ from: a, to: b, directed: true, state: { weight: 1 } }),
  graph.edges.add({ from: a, to: b, directed: true, state: { weight: 2 } }),
  graph.edges.add({ from: a, to: c, directed: true, state: { weight: 1 } }),
  graph.edges.add({ from: b, to: a, directed: true, state: { weight: 1 } }),
  graph.edges.add({ from: c, to: a, directed: true, state: { weight: 0 } }),
];
const seen: Edge<Node, { weight: number }>[] = [];
const scores = graph.analyze({ measure: "pageRank", damping: 0.5, tolerance: 1e-12, maxIterations: 1000, weight: (edge: Edge<Node, { weight: number }>) => { seen.push(edge); return edge.weight; } });
assert.deepEqual(seen, edges); assert.deepEqual([...scores.keys()], [a, b, c]);
// Exact stationary balance with A->B probability3/4, A->C1/4, B->A1,
// C dangling: vector (12,11,8)/31. This is an algebraic oracle, not an iteration mirror.
close(scores.get(a), 12 / 31); close(scores.get(b), 11 / 31); close(scores.get(c), 8 / 31);
close([...scores.values()].reduce((sum, value) => sum + value, 0), 1);
close(scores.get(a), 1 / 6 + scores.get(b)! / 2 + scores.get(c)! / 6);
close(scores.get(b), 1 / 6 + 3 * scores.get(a)! / 8 + scores.get(c)! / 6);
close(scores.get(c), 1 / 6 + scores.get(a)! / 8 + scores.get(c)! / 6);
const weight = (edge: Edge<Node, { weight: number }>) => edge.weight;
assert.throws(() => graph.analyze({ measure: "pageRank", weight, damping: 0.5, tolerance: 1e-12, maxIterations: 1 }), Error);
const uniform = graph.analyze({ measure: "pageRank", weight: () => 0 });
for (const node of [a, b, c]) close(uniform.get(node), 1 / 3); // Zero-weight outgoing edges remain dangling.
edges[4]!.weight = 1;
const withoutDangling = graph.analyze({ measure: "pageRank", weight, damping: 0.5, tolerance: 1e-12 });
// C now returns entirely to A: a=4/9, b=1/3, c=2/9.
close(withoutDangling.get(a), 4 / 9); close(withoutDangling.get(b), 1 / 3); close(withoutDangling.get(c), 2 / 9);
close(scores.get(a), 12 / 31);
const edgeless = Graph.add<Node>(); const first = edgeless.nodes.add({ name: "first" }), second = edgeless.nodes.add({ name: "second" });
for (const node of [first, second]) close(edgeless.analyze({ measure: "pageRank" }).get(node), 1 / 2);
const singleton = Graph.add<Node>(); const one = singleton.nodes.add({ name: "one" });
close(singleton.analyze({ measure: "pageRank" }).get(one), 1);
assert.equal(Graph.add().analyze({ measure: "pageRank" }).size, 0);
for (const field of ["direction", "normalized", "disconnected", "cost"]) assert.throws(() => graph.analyze({ measure: "pageRank", [field]: field === "cost" ? () => 1 : 1 } as never), TypeError);
for (const damping of [0, 1, -0.1, 1.1, NaN, Infinity]) assert.throws(() => graph.analyze({ measure: "pageRank", damping }));
for (const tolerance of [0, -1, NaN, Infinity]) assert.throws(() => graph.analyze({ measure: "pageRank", tolerance }));
for (const maxIterations of [0, -1, 0.5, NaN, Infinity]) assert.throws(() => graph.analyze({ measure: "pageRank", maxIterations }));
assert.throws(() => graph.analyze({ measure: "pageRank", weight: () => -1 }), RangeError);
assert.throws(() => graph.analyze({ measure: "pageRank", weight: () => Promise.resolve(1) as unknown as number }), TypeError);
const sentinel = new Error("weight failure");
assert.throws(() => graph.analyze({ measure: "pageRank", weight: () => { throw sentinel; } }), error => error === sentinel);
assert.throws(() => graph.analyze({ measure: "pageRank", weight: () => { graph.delete(); return 1; } }));
assert.equal(graph.nodes.size, 3); assert.equal(graph.edges.size, 5);
console.log("analysis proposal05: weighted PageRank balance, dangling mass, convergence and closed domains");
