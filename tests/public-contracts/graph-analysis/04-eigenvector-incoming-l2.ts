// REVISED PROPOSAL ONLY: root provisional structural-edge, two-loop-arc and whole-operator scaling closures.
import assert from "node:assert/strict";
import { Graph, type Edge } from "city-library";
const close = (actual: number | undefined, expected: number, tolerance = 1e-10) => { assert.notEqual(actual, undefined); assert.ok(Math.abs(actual! - expected) <= tolerance, `${actual} != ${expected}`); };
type Node = { name: string };
const graph = Graph.create<Node, { weight: number }>({ parallel: true, edgeState: { weight: 1 } });
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
const result = graph.analyze({ measure: "eigenvector", weight: (edge: Edge<Node, { weight: number }>) => { seen.push(edge); return edge.weight; }, tolerance: 1e-12, maxIterationCount: 2 });
assert.deepEqual(seen, edges); assert.deepEqual([...result.keys()], [a, b]);
close(result.get(a), 1 / Math.sqrt(5)); close(result.get(b), 2 / Math.sqrt(5));
close([...result.values()].reduce((sum, value) => sum + value * value, 0), 1);
assert.throws(() => graph.analyze({ measure: "eigenvector", weight: (edge: Edge<Node, { weight: number }>) => edge.weight, tolerance: 1e-12, maxIterationCount: 1 }), Error);
const star = Graph.create<Node>(); const center = star.nodes.add({ name: "center" });
const leaves = Array.from({ length: 4 }, (_, i) => star.nodes.add({ name: `leaf${i}` }));
for (const leaf of leaves) star.edges.add({ from: center, to: leaf });
const nativeTopologyScores = star.analyze({ measure: "eigenvector", tolerance: 1e-12 });
close(nativeTopologyScores.get(center), 1 / Math.sqrt(2));
for (const leaf of leaves) close(nativeTopologyScores.get(leaf), 1 / (2 * Math.sqrt(2)));
// Source Star5 uses center1/leaf.5; normalize by L2 to compare this connected fixture.
const isolate = star.nodes.add({ name: "isolate" });
const scores = star.analyze({ measure: "eigenvector", tolerance: 1e-12, maxIterationCount: 1000 });
close(scores.get(center), 1 / Math.sqrt(2)); for (const leaf of leaves) close(scores.get(leaf), 1 / (2 * Math.sqrt(2)));
close(scores.get(isolate), 0); // Global L2 dominant component, unlike observed Web isolate score1.
const emptyEdges = Graph.create<Node>(); const lonely = emptyEdges.nodes.add({ name: "lonely" });
assert.equal(emptyEdges.analyze({ measure: "eigenvector" }).get(lonely), 0);
assert.equal(Graph.create().analyze({ measure: "eigenvector" }).size, 0);
// Root provisional closure: "edgeless" means zero structural edges. Existing edges with all
// zero weights have A=0, so (A+I) leaves the equal unit-L2 start unchanged.
const zero = graph.analyze({ measure: "eigenvector", weight: () => 0, tolerance: 1e-12, maxIterationCount: 1 });
close(zero.get(a), 1 / Math.sqrt(2)); close(zero.get(b), 1 / Math.sqrt(2));
for (const field of ["direction", "normalized", "disconnected", "cost", "damping"]) {
  assert.throws(() => graph.analyze({ measure: "eigenvector", [field]: field === "cost" ? () => 1 : 1 } as never), TypeError);
  assert.throws(() => graph.analyze({ measure: "eigenvector", [field]: undefined } as never), TypeError);
}
for (const tolerance of [0, -1, NaN, Infinity]) assert.throws(() => graph.analyze({ measure: "eigenvector", tolerance }));
for (const maxIterationCount of [0, -1, 1.5, Infinity, NaN]) assert.throws(() => graph.analyze({ measure: "eigenvector", maxIterationCount }));
assert.throws(() => graph.analyze({ measure: "eigenvector", weight: () => -1 }), RangeError);
assert.throws(() => graph.analyze({ measure: "eigenvector", weight: () => NaN }), TypeError);
let invocations = 0;
assert.throws(() => graph.analyze({ measure: "eigenvector", direction: "out", weight: () => { invocations++; return 1; } } as never), TypeError);
assert.equal(invocations, 0); // Root provisional closure: preflight before callbacks.
assert.throws(() => graph.analyze({ measure: "eigenvector", weight: () => { edges[0]!.delete(); return 1; } }));
assert.equal(graph.edges.size, 3);
// An undirected loop supplies TWO incoming contributions: A=[[2,1],[1,0]].
// Its principal unit-L2 vector is(cos(pi/8),sin(pi/8)), unlike a one-loop-arc matrix.
const loops = Graph.create<Node>({ selfLoops: true });
const la = loops.nodes.add({ name: "la" }), lb = loops.nodes.add({ name: "lb" });
loops.edges.add({ from: la, to: la }); loops.edges.add({ from: la, to: lb });
const loopScores = loops.analyze({ measure: "eigenvector", tolerance: 1e-12 });
close(loopScores.get(la), Math.cos(Math.PI / 8)); close(loopScores.get(lb), Math.sin(Math.PI / 8));
// Stable whole-operator scaling must not overflow on aggregate2*MAX_VALUE,
// and stable L2 normalization must not square huge intermediates directly.
const enormous = Graph.create<Node, { weight: number }>({ parallel: true, edgeState: { weight: Number.MAX_VALUE } });
const ea = enormous.nodes.add({ name: "ea" }), eb = enormous.nodes.add({ name: "eb" });
for (let copy = 0; copy < 2; copy++) {
  enormous.edges.add({ from: ea, to: eb, directed: true }); enormous.edges.add({ from: eb, to: ea, directed: true });
}
const hugeScores = enormous.analyze({ measure: "eigenvector", weight: (edge: Edge<Node, { weight: number }>) => edge.weight, tolerance: 1e-12, maxIterationCount: 1 });
close(hugeScores.get(ea), 1 / Math.sqrt(2)); close(hugeScores.get(eb), 1 / Math.sqrt(2));
// Scaling onlyA then addingI changes the specified iteration and wrongly converges
// here. Scaling the entire(A+I) preserves its near-bipartite oscillation at this
// finite iteration budget, so a partial/false-converged vector must not escape.
const oscillating = Graph.create<Node, { weight: number }>({ edgeState: { weight: 1 } });
const xa = oscillating.nodes.add({ name: "xa" }), xb = oscillating.nodes.add({ name: "xb" });
oscillating.edges.add({ from: xa, to: xb, directed: true, state: { weight: 1e300 } });
oscillating.edges.add({ from: xb, to: xa, directed: true, state: { weight: 2.5e299 } });
assert.throws(() => oscillating.analyze({ measure: "eigenvector", weight: (edge: Edge<Node, { weight: number }>) => edge.weight, tolerance: 1e-12, maxIterationCount: 100 }), Error);
// Preserve parallel contributions before operator scaling: independently
// rounding each tiny weight/MAX ratio would yield3MIN instead of the final2MIN.
const tiny = Graph.create<Node, { weight: number }>({ parallel: true, selfLoops: true, edgeState: { weight: 2 ** -51 } });
const tinyA = tiny.nodes.add({ name: "dominant" }), tinyB = tiny.nodes.add({ name: "tiny" });
tiny.edges.add({ from: tinyA, to: tinyA, directed: true, state: { weight: Number.MAX_VALUE } });
for (let copy = 0; copy < 3; copy++) tiny.edges.add({ from: tinyA, to: tinyB, directed: true });
const tinyScores = tiny.analyze({ measure: "eigenvector", weight: (edge: Edge<Node, { weight: number }>) => edge.weight, tolerance: 1e-12, maxIterationCount: 2 });
assert.equal(tinyScores.get(tinyA), 1);
assert.equal(tinyScores.get(tinyB), 2 * Number.MIN_VALUE);
console.log("analysis proposal04: incoming weighted L2 eigenvector, convergence and edgeless distinction");
