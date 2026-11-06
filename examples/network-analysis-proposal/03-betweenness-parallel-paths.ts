// REVISED PROPOSAL ONLY: exact dyadic paths, BigInt multiplicities and rational scores until final rounding.
import assert from "node:assert/strict";
import { Graph, type Edge } from "city-library";
const close = (actual: number | undefined, expected: number) => assert.equal(actual, expected); // Final correctly rounded binary64 oracle; no absolute epsilon.
type Node = { name: string };
for (const directed of [true, false]) {
  const graph = Graph.add<Node, { cost: number }>({ parallel: true, selfLoops: true, edgeState: { cost: 1 } });
  const s = graph.nodes.add({ name: "s" }), u = graph.nodes.add({ name: "u" }), v = graph.nodes.add({ name: "v" }), t = graph.nodes.add({ name: "t" });
  const edges = [
    graph.edges.add({ from: s, to: u, directed }), graph.edges.add({ from: s, to: u, directed }),
    graph.edges.add({ from: s, to: v, directed }), graph.edges.add({ from: u, to: t, directed }),
    graph.edges.add({ from: v, to: t, directed }), graph.edges.add({ from: s, to: s, directed }),
  ];
  const seen: Edge<Node, { cost: number }>[] = [];
  const result = graph.analyze({ measure: "betweenness", cost: (edge: Edge<Node, { cost: number }>) => { seen.push(edge); return edge.cost; } });
  assert.deepEqual(seen, edges); assert.deepEqual([...result.keys()], [s, u, v, t]);
  const expected = directed ? [0, 2 / 3, 1 / 3, 0] : [2 / 3, 2 / 3, 1 / 3, 1 / 3];
  for (const [index, node] of [s, u, v, t].entries()) close(result.get(node), expected[index]!);
  const normalized = graph.analyze({ measure: "betweenness", normalized: true });
  const normalizedExpected = directed ? [0, 1 / 9, 1 / 18, 0] : [2 / 9, 2 / 9, 1 / 9, 1 / 9];
  for (const [index, node] of [s, u, v, t].entries()) close(normalized.get(node), normalizedExpected[index]!);
  if (directed) {
    // A direct equal-cost bypass is a fourth distinct shortest path for s->t.
    graph.edges.add({ from: s, to: t, directed: true, state: { cost: 2 } });
    const bypass = graph.analyze({ measure: "betweenness", cost: (edge: Edge<Node, { cost: number }>) => edge.cost });
    close(bypass.get(u), 1 / 2); close(bypass.get(v), 1 / 4);
    close(result.get(u), 2 / 3);
  }
  for (const field of ["direction", "disconnected", "weight", "damping", "tolerance", "maxIterations"]) {
    assert.throws(() => graph.analyze({ measure: "betweenness", [field]: field === "weight" ? () => 1 : 1 } as never), TypeError);
    assert.throws(() => graph.analyze({ measure: "betweenness", [field]: undefined } as never), TypeError);
  }
  assert.throws(() => graph.analyze({ measure: "betweenness", cost: () => 0 }), RangeError);
}
// Actual native Star5 center raw betweenness6 equals six unordered leaf pairs.
const star = Graph.add<Node>(); const center = star.nodes.add({ name: "center" });
for (let index = 0; index < 4; index++) star.edges.add({ from: center, to: star.nodes.add({ name: `leaf${index}` }) });
close(star.analyze({ measure: "betweenness" }).get(center), 6);
close(star.analyze({ measure: "betweenness", normalized: true }).get(center), 1);
// Mixed directions use ordered pairs without wholly-undirected halving.
const mixed = Graph.add<Node>({ parallel: true }); const m = ["s", "u", "v", "t"].map(name => mixed.nodes.add({ name }));
mixed.edges.add({ from: m[0]!, to: m[1]!, directed: true }); mixed.edges.add({ from: m[0]!, to: m[1]!, directed: true });
mixed.edges.add({ from: m[0]!, to: m[2]!, directed: true }); mixed.edges.add({ from: m[1]!, to: m[3]! }); mixed.edges.add({ from: m[2]!, to: m[3]!, directed: true });
const mixedScores = mixed.analyze({ measure: "betweenness" });
for (const [index, value] of [0, 2 / 3, 1 / 3, 1].entries()) close(mixedScores.get(m[index]!), value);
// 2^1099 distinct edge-paths end-to-end exceed binary64 range. Every interior
// vertex still has exactly i*(1099-i) betweenness: path fractions remain one.
// Root provisional closure: no new cap or silent nonfinite result just because raw path counts overflow.
const long = Graph.add<{ index: number }>({ parallel: true });
const nodes = Array.from({ length: 1100 }, (_, index) => long.nodes.add({ index }));
for (let index = 1; index < nodes.length; index++) for (let copy = 0; copy < 2; copy++) long.edges.add({ from: nodes[index - 1]!, to: nodes[index]!, directed: true });
const longScores = long.analyze({ measure: "betweenness" });
for (const node of nodes) close(longScores.get(node), node.index * (1099 - node.index));
// Positive dyadic costs behind a large prefix must not produce a false
// shortest-predecessor cycle from equal published rounded distance Numbers.
const ordered = Graph.add<Node, { cost: number }>({ edgeState: { cost: 1 } });
const os = ordered.nodes.add({ name: "s" }), ou = ordered.nodes.add({ name: "u" }), ov = ordered.nodes.add({ name: "v" });
ordered.edges.add({ from: os, to: ou, directed: true, state: { cost: 1e16 } });
ordered.edges.add({ from: ou, to: ov, directed: true }); ordered.edges.add({ from: ov, to: ou, directed: true });
assert.deepEqual([...ordered.analyze({ measure: "betweenness", cost: (edge: Edge<Node, { cost: number }>) => edge.cost }).values()], [0, 1, 0]);
// Finite-rounded candidate policy allows exactMAX+1 (not a strict magnitude cap).
const boundary = Graph.add<Node, { cost: number }>({ edgeState: { cost: 1 } });
const bs = boundary.nodes.add({ name: "s" }), bu = boundary.nodes.add({ name: "u" }), bt = boundary.nodes.add({ name: "t" });
boundary.edges.add({ from: bs, to: bu, directed: true, state: { cost: Number.MAX_VALUE } });
boundary.edges.add({ from: bu, to: bt, directed: true });
assert.equal(boundary.analyze({ measure: "betweenness", cost: (edge: Edge<Node, { cost: number }>) => edge.cost }).get(bu), 1);
boundary.edges.add({ from: bs, to: bt, directed: true });
// Shortestbs->bt is1, yet theMAX+MAX discarded route must still reject.
const finalEdge = [...boundary.edges][1]!; finalEdge.cost = Number.MAX_VALUE;
assert.throws(() => boundary.analyze({ measure: "betweenness", cost: (edge: Edge<Node, { cost: number }>) => edge.cost }), RangeError);
// Rare-branch oracle from the completed deep advisory. One s->rare->merge
// route (cost1079+1) competes with1080 doubled stages (each cost1).
// sigma(merge)=2^1080+1. Only s can reach rare, so with127 unique tail
// destinations rare's final score is128/(2^1080+1), not a rounded quotient
// multiplied after underflow. The independent Fraction oracle proves it lies
// strictly between1.5*MIN_VALUE and2*MIN_VALUE: nearest Number is2*MIN_VALUE.
const rareGraph = Graph.add<Node, { cost: number }>({ parallel: true, edgeState: { cost: 1 } });
const source = rareGraph.nodes.add({ name: "source" }), rare = rareGraph.nodes.add({ name: "rare" });
let previous = source;
for (let stage = 1; stage <= 1080; stage++) {
  const next = rareGraph.nodes.add({ name: `stage${stage}` });
  for (let copy = 0; copy < 2; copy++) rareGraph.edges.add({ from: previous, to: next, directed: true });
  previous = next;
}
const merge = previous;
rareGraph.edges.add({ from: source, to: rare, directed: true, state: { cost: 1079 } });
rareGraph.edges.add({ from: rare, to: merge, directed: true });
const rareCost = (edge: Edge<Node, { cost: number }>) => edge.cost;
assert.equal(rareGraph.analyze({ measure: "betweenness", cost: rareCost }).get(rare), 0); // true final underflow:1/(2^1080+1)
for (let index = 1; index <= 127; index++) {
  const next = rareGraph.nodes.add({ name: `tail${index}` });
  rareGraph.edges.add({ from: previous, to: next, directed: true }); previous = next;
}
const recovered = rareGraph.analyze({ measure: "betweenness", cost: rareCost }).get(rare);
assert.equal(recovered, 2 * Number.MIN_VALUE); // Exact oracle-backed representable nonzero final score.
assert.ok(recovered! > 0); // An absolute1e-10 tolerance would incorrectly accept zero.
const tiny = Graph.add<Node>(); const one = tiny.nodes.add({ name: "one" });
assert.equal(tiny.analyze({ measure: "betweenness", normalized: true }).get(one), 0);
assert.equal(Graph.add().analyze({ measure: "betweenness" }).size, 0);
console.log("analysis proposal03: parallel-edge shortest-path fractions and finite large counts");
