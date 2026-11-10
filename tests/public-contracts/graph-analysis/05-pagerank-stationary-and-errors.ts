// REVISED PROPOSAL ONLY: root provisional stable transition and two-loop-arc closures; no freeze.
import assert from "node:assert/strict";
import { Graph, type Edge } from "city-library";
const close = (actual: number | undefined, expected: number, tolerance = 1e-10) => { assert.notEqual(actual, undefined); assert.ok(Math.abs(actual! - expected) <= tolerance, `${actual} != ${expected}`); };
type Node = { name: string };
const graph = Graph.create<Node, { weight: number }>({ parallel: true, edgeState: { weight: 1 } });
const a = graph.nodes.add({ name: "a" }), b = graph.nodes.add({ name: "b" }), c = graph.nodes.add({ name: "c" });
const edges = [
  graph.edges.add({ from: a, to: b, directed: true, state: { weight: 1 } }),
  graph.edges.add({ from: a, to: b, directed: true, state: { weight: 2 } }),
  graph.edges.add({ from: a, to: c, directed: true, state: { weight: 1 } }),
  graph.edges.add({ from: b, to: a, directed: true, state: { weight: 1 } }),
  graph.edges.add({ from: c, to: a, directed: true, state: { weight: 0 } }),
];
const seen: Edge<Node, { weight: number }>[] = [];
const scores = graph.analyze({ measure: "page-rank", damping: 0.5, tolerance: 1e-12, maxIterationCount: 1000, weight: (edge: Edge<Node, { weight: number }>) => { seen.push(edge); return edge.weight; } });
assert.deepEqual(seen, edges); assert.deepEqual([...scores.keys()], [a, b, c]);
// Exact stationary balance with A->B probability3/4, A->C1/4, B->A1,
// C dangling: vector (12,11,8)/31. This is an algebraic oracle, not an iteration mirror.
close(scores.get(a), 12 / 31); close(scores.get(b), 11 / 31); close(scores.get(c), 8 / 31);
close([...scores.values()].reduce((sum, value) => sum + value, 0), 1);
close(scores.get(a), 1 / 6 + scores.get(b)! / 2 + scores.get(c)! / 6);
close(scores.get(b), 1 / 6 + 3 * scores.get(a)! / 8 + scores.get(c)! / 6);
close(scores.get(c), 1 / 6 + scores.get(a)! / 8 + scores.get(c)! / 6);
const weight = (edge: Edge<Node, { weight: number }>) => edge.weight;
assert.throws(() => graph.analyze({ measure: "page-rank", weight, damping: 0.5, tolerance: 1e-12, maxIterationCount: 1 }), Error);
const uniform = graph.analyze({ measure: "page-rank", weight: () => 0 });
for (const node of [a, b, c]) close(uniform.get(node), 1 / 3); // Zero-weight outgoing edges remain dangling.
edges[4]!.weight = 1;
const withoutDangling = graph.analyze({ measure: "page-rank", weight, damping: 0.5, tolerance: 1e-12 });
// C now returns entirely to A: a=4/9, b=1/3, c=2/9.
close(withoutDangling.get(a), 4 / 9); close(withoutDangling.get(b), 1 / 3); close(withoutDangling.get(c), 2 / 9);
close(scores.get(a), 12 / 31);
const edgeless = Graph.create<Node>(); const first = edgeless.nodes.add({ name: "first" }), second = edgeless.nodes.add({ name: "second" });
for (const node of [first, second]) close(edgeless.analyze({ measure: "page-rank" }).get(node), 1 / 2);
const singleton = Graph.create<Node>(); const one = singleton.nodes.add({ name: "one" });
close(singleton.analyze({ measure: "page-rank" }).get(one), 1);
assert.equal(Graph.create().analyze({ measure: "page-rank" }).size, 0);
for (const field of ["direction", "normalized", "disconnected", "cost"]) {
  assert.throws(() => graph.analyze({ measure: "page-rank", [field]: field === "cost" ? () => 1 : 1 } as never), TypeError);
  assert.throws(() => graph.analyze({ measure: "page-rank", [field]: undefined } as never), TypeError);
}
for (const damping of [0, 1, -0.1, 1.1, NaN, Infinity]) assert.throws(() => graph.analyze({ measure: "page-rank", damping }));
for (const tolerance of [0, -1, NaN, Infinity]) assert.throws(() => graph.analyze({ measure: "page-rank", tolerance }));
for (const maxIterationCount of [0, -1, 0.5, NaN, Infinity]) assert.throws(() => graph.analyze({ measure: "page-rank", maxIterationCount }));
assert.throws(() => graph.analyze({ measure: "page-rank", weight: () => -1 }), RangeError);
assert.throws(() => graph.analyze({ measure: "page-rank", weight: () => Promise.resolve(1) as unknown as number }), TypeError);
const sentinel = new Error("weight failure");
assert.throws(() => graph.analyze({ measure: "page-rank", weight: () => { throw sentinel; } }), error => error === sentinel);
assert.throws(() => graph.analyze({ measure: "page-rank", weight: () => { graph.delete(); return 1; } }));
assert.equal(graph.nodes.size, 3); assert.equal(graph.edges.size, 5);
// Undirected loop carries two outgoing arcs relative to the other incident edge.
// A transitions2/3 toA and1/3 toB; B returns toA. With damping1/2,
// exact stationary mass is(9/14,5/14), NOT the one-loop-arc result(3/5,2/5).
const loops = Graph.create<Node>({ selfLoops: true });
const la = loops.nodes.add({ name: "la" }), lb = loops.nodes.add({ name: "lb" });
loops.edges.add({ from: la, to: la }); loops.edges.add({ from: la, to: lb });
const loopScores = loops.analyze({ measure: "page-rank", damping: 0.5, tolerance: 1e-12 });
close(loopScores.get(la), 9 / 14); close(loopScores.get(lb), 5 / 14);
// Max-row-weight scaling must normalizeMAX+MAX without falsely overflowing.
const huge = Graph.create<Node, { weight: number }>({ edgeState: { weight: Number.MAX_VALUE } });
const ha = huge.nodes.add({ name: "ha" }), hb = huge.nodes.add({ name: "hb" }), hc = huge.nodes.add({ name: "hc" });
huge.edges.add({ from: ha, to: hb, directed: true }); huge.edges.add({ from: ha, to: hc, directed: true });
huge.edges.add({ from: hb, to: ha, directed: true }); huge.edges.add({ from: hc, to: ha, directed: true });
const hugeScores = huge.analyze({ measure: "page-rank", damping: 0.5, tolerance: 1e-12, weight: (edge: Edge<Node, { weight: number }>) => edge.weight });
close(hugeScores.get(ha), 4 / 9); close(hugeScores.get(hb), 5 / 18); close(hugeScores.get(hc), 5 / 18);
close([...hugeScores.values()].reduce((sum, value) => sum + value, 0), 1);
console.log("analysis proposal05: weighted PageRank balance, dangling mass, convergence and closed domains");
