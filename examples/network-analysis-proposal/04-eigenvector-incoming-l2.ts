// PROPOSAL ONLY: all-zero weighted adjacency behavior is explicit unresolved U4.
import assert from "node:assert/strict";
import { Graph, type Edge } from "city-library";
const close = (actual: number | undefined, expected: number, tolerance = 1e-10) => { assert.notEqual(actual, undefined); assert.ok(Math.abs(actual! - expected) <= tolerance, `${actual} != ${expected}`); };
type Node = { name: string };
const graph = Graph.add<Node, { weight: number }>({ parallel: true, edgeState: { weight: 1 } });
const a = graph.nodes.add({ name: "a" }), b = graph.nodes.add({ name: "b" });
const edges = [
  graph.edges.add({ from: a, to: b, directed: true, state: { weight: 0.75 } }),
  graph.edges.add({ from: a, to: b, directed: true, state: { weight: 1.25 } }),
  graph.edges.add({ from: b, to: a, directed: true, state: { weight: 0.5 } }),
];
const seen: Edge<Node, { weight: number }>[] = [];
// Incoming A=[[0,.5],[2,0]], principal right vector is (1,2)/sqrt5.
// (A+I) maps the uniform start onto that vector in one update; second update
// meets iterate-difference stopping, not merely the eigen-equation residual.
const result = graph.analyze({ measure: "eigenvector", weight: (edge: Edge<Node, { weight: number }>) => { seen.push(edge); return edge.weight; }, tolerance: 1e-12, maxIterations: 2 });
assert.deepEqual(seen, edges); assert.deepEqual([...result.keys()], [a, b]);
close(result.get(a), 1 / Math.sqrt(5)); close(result.get(b), 2 / Math.sqrt(5));
close([...result.values()].reduce((sum, value) => sum + value * value, 0), 1);
assert.throws(() => graph.analyze({ measure: "eigenvector", weight: (edge: Edge<Node, { weight: number }>) => edge.weight, tolerance: 1e-12, maxIterations: 1 }), Error);
const star = Graph.add<Node>(); const center = star.nodes.add({ name: "center" });
const leaves = Array.from({ length: 4 }, (_, i) => star.nodes.add({ name: `leaf${i}` }));
for (const leaf of leaves) star.edges.add({ from: center, to: leaf });
const nativeTopologyScores = star.analyze({ measure: "eigenvector", tolerance: 1e-12 });
close(nativeTopologyScores.get(center), 1 / Math.sqrt(2));
for (const leaf of leaves) close(nativeTopologyScores.get(leaf), 1 / (2 * Math.sqrt(2)));
// Source Star5 uses center1/leaf.5; normalize by L2 to compare this connected fixture.
const isolate = star.nodes.add({ name: "isolate" });
const scores = star.analyze({ measure: "eigenvector", tolerance: 1e-12, maxIterations: 1000 });
close(scores.get(center), 1 / Math.sqrt(2)); for (const leaf of leaves) close(scores.get(leaf), 1 / (2 * Math.sqrt(2)));
close(scores.get(isolate), 0); // Global L2 dominant component, unlike observed Web isolate score1.
const emptyEdges = Graph.add<Node>(); const lonely = emptyEdges.nodes.add({ name: "lonely" });
assert.equal(emptyEdges.analyze({ measure: "eigenvector" }).get(lonely), 0);
assert.equal(Graph.add().analyze({ measure: "eigenvector" }).size, 0);
// U4 proposal: "edgeless" means zero structural edges. Existing edges with all
// zero weights have A=0, so (A+I) leaves the equal unit-L2 start unchanged.
const zero = graph.analyze({ measure: "eigenvector", weight: () => 0, tolerance: 1e-12, maxIterations: 1 });
close(zero.get(a), 1 / Math.sqrt(2)); close(zero.get(b), 1 / Math.sqrt(2));
for (const field of ["direction", "normalized", "disconnected", "cost", "damping"]) assert.throws(() => graph.analyze({ measure: "eigenvector", [field]: field === "cost" ? () => 1 : 1 } as never), TypeError);
for (const tolerance of [0, -1, NaN, Infinity]) assert.throws(() => graph.analyze({ measure: "eigenvector", tolerance }));
for (const maxIterations of [0, -1, 1.5, Infinity, NaN]) assert.throws(() => graph.analyze({ measure: "eigenvector", maxIterations }));
assert.throws(() => graph.analyze({ measure: "eigenvector", weight: () => -1 }), RangeError);
assert.throws(() => graph.analyze({ measure: "eigenvector", weight: () => NaN }), TypeError);
let invocations = 0;
assert.throws(() => graph.analyze({ measure: "eigenvector", direction: "out", weight: () => { invocations++; return 1; } } as never), TypeError);
assert.equal(invocations, 0); // U1 proposed options preflight before callbacks.
assert.throws(() => graph.analyze({ measure: "eigenvector", weight: () => { edges[0]!.delete(); return 1; } }));
assert.equal(graph.edges.size, 3);
console.log("analysis proposal04: incoming weighted L2 eigenvector, convergence and edgeless distinction");
