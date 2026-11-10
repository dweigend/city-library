// REVISED PROPOSAL ONLY: exact dyadic cost order; published-distance aggregation; no freeze.
import assert from "node:assert/strict";
import { Graph, type Edge } from "city-library";
const close = (actual: number | undefined, expected: number) => { assert.notEqual(actual, undefined); assert.ok(Math.abs(actual! - expected) < 1e-12); };
type Node = { name: string };
const graph = Graph.create<Node, { cost: number }>({ parallel: true, selfLoops: true, edgeState: { cost: 1 } });
const a = graph.nodes.add({ name: "a" }), b = graph.nodes.add({ name: "b" }), c = graph.nodes.add({ name: "c" }), d = graph.nodes.add({ name: "isolate" });
const edges = [
  graph.edges.add({ from: a, to: b, directed: true, state: { cost: 2 } }),
  graph.edges.add({ from: a, to: b, directed: true, state: { cost: 7 } }),
  graph.edges.add({ from: b, to: c, directed: true, state: { cost: 3 } }),
  graph.edges.add({ from: a, to: c, directed: true, state: { cost: 10 } }),
  graph.edges.add({ from: b, to: b, directed: true, state: { cost: 0.25 } }),
];
const seen: Edge<Node, { cost: number }>[] = [];
const outgoing = graph.analyze({ measure: "closeness", cost: (edge: Edge<Node, { cost: number }>) => { seen.push(edge); return edge.cost; } });
assert.deepEqual(seen, edges);
assert.deepEqual([...outgoing.keys()], [a, b, c, d]);
close(outgoing.get(a), 2 / 7); close(outgoing.get(b), 1 / 3); close(outgoing.get(c), 0); close(outgoing.get(d), 0);
const cost = (edge: Edge<Node, { cost: number }>) => edge.cost;
const incoming = graph.analyze({ measure: "closeness", direction: "in", cost });
close(incoming.get(a), 0); close(incoming.get(b), 1 / 2); close(incoming.get(c), 1 / 4); close(incoming.get(d), 0);
const discounted = graph.analyze({ measure: "closeness", disconnected: "discount", cost });
close(discounted.get(a), 4 / 21); close(discounted.get(b), 1 / 9);
const discountedIn = graph.analyze({ measure: "closeness", disconnected: "discount", direction: "in", cost });
close(discountedIn.get(b), 1 / 6); close(discountedIn.get(c), 1 / 6);
edges[0]!.cost = 1;
close(graph.analyze({ measure: "closeness", cost }).get(a), 2 / 5);
close(outgoing.get(a), 2 / 7); // No cross-query weight cache or live score map.
// Native original Star5 raw closeness: center1, each leaf4/7 (inverse average, not inverse sum).
const star = Graph.create<Node>(); const center = star.nodes.add({ name: "center" });
const leaves = Array.from({ length: 4 }, (_, i) => star.nodes.add({ name: `leaf${i}` }));
for (const leaf of leaves) star.edges.add({ from: center, to: leaf });
const scores = star.analyze({ measure: "closeness" }); close(scores.get(center), 1);
for (const leaf of leaves) close(scores.get(leaf), 4 / 7);
assert.throws(() => graph.analyze({ measure: "closeness", direction: "all" }), TypeError);
assert.throws(() => graph.analyze({ measure: "closeness", disconnected: "reject" } as never), TypeError);
for (const field of ["normalized", "weight", "damping", "tolerance", "maxIterations"]) {
  assert.throws(() => graph.analyze({ measure: "closeness", [field]: field === "weight" ? () => 1 : 1 } as never), TypeError);
  assert.throws(() => graph.analyze({ measure: "closeness", [field]: undefined } as never), TypeError);
}
for (const invalid of [0, -1]) assert.throws(() => graph.analyze({ measure: "closeness", cost: () => invalid }), RangeError);
for (const invalid of [NaN, Infinity, "1", Promise.resolve(1)]) assert.throws(() => graph.analyze({ measure: "closeness", cost: () => invalid as number }), TypeError);
const sentinel = new Error("cost failure");
assert.throws(() => graph.analyze({ measure: "closeness", cost: () => { throw sentinel; } }), error => error === sentinel);
assert.throws(() => graph.analyze({ measure: "closeness", cost: () => { graph.nodes.add({ name: "intruder" }); return 1; } }));
assert.equal(graph.nodes.size, 4);
// Root provisional numerical closure: explicit failure for nonfinite accumulated distances/sums, no Infinity/clamping.
const huge = Graph.create<Node>(); const x = huge.nodes.add({ name: "x" }), y = huge.nodes.add({ name: "y" }), z = huge.nodes.add({ name: "z" });
huge.edges.add({ from: x, to: y, directed: true }); huge.edges.add({ from: y, to: z, directed: true });
assert.throws(() => huge.analyze({ measure: "closeness", cost: () => 1e308 }), RangeError);
assert.equal(Graph.create().analyze({ measure: "closeness" }).size, 0);
// Published distances follow delivered exact-dyadic routing, then closeness sums
// those published values exactly and rounds the permitted total once.
const precision = Graph.create<Node, { cost: number }>({ edgeState: { cost: 1 } });
const pp = ["s", "a", "b", "c"].map(name => precision.nodes.add({ name }));
for (const [index, amount] of [1e16, 1, 1].entries()) precision.edges.add({ from: pp[index]!, to: pp[index + 1]!, directed: true, state: { cost: amount } });
const exactCost = (edge: Edge<Node, { cost: number }>) => edge.cost;
assert.equal(precision.distances({ from: pp[0]!, cost: exactCost }).get(pp[3]!), 1e16 + 2);
assert.equal(precision.analyze({ measure: "closeness", cost: exactCost }).get(pp[0]!), 1e-16); // rounded published total3e16
// All captured costs must be positive, including disconnected components.
const unreachableA = precision.nodes.add({ name: "unreachableA" }), unreachableB = precision.nodes.add({ name: "unreachableB" });
precision.edges.add({ from: unreachableA, to: unreachableB, directed: true, state: { cost: 0 } });
assert.throws(() => precision.analyze({ measure: "closeness", cost: exactCost }), RangeError);
const totalOverflow = Graph.create<Node>(); const root = totalOverflow.nodes.add({ name: "root" });
for (const name of ["left", "right"]) totalOverflow.edges.add({ from: root, to: totalOverflow.nodes.add({ name }), directed: true });
assert.throws(() => totalOverflow.analyze({ measure: "closeness", cost: () => Number.MAX_VALUE }), RangeError); // individual distances finite; sum not
const ratioOverflow = Graph.create<Node>(); const ra = ratioOverflow.nodes.add({ name: "ra" }), rb = ratioOverflow.nodes.add({ name: "rb" });
ratioOverflow.edges.add({ from: ra, to: rb, directed: true });
assert.throws(() => ratioOverflow.analyze({ measure: "closeness", cost: () => Number.MIN_VALUE }), RangeError);
// Even an overflowing non-improving relaxation candidate must reject.
const discarded = Graph.create<Node, { cost: number }>({ edgeState: { cost: 1 } });
const ds = discarded.nodes.add({ name: "s" }), du = discarded.nodes.add({ name: "u" }), dt = discarded.nodes.add({ name: "t" });
discarded.edges.add({ from: ds, to: dt, directed: true });
discarded.edges.add({ from: ds, to: du, directed: true, state: { cost: Number.MAX_VALUE } });
discarded.edges.add({ from: du, to: dt, directed: true, state: { cost: Number.MAX_VALUE } });
assert.throws(() => discarded.analyze({ measure: "closeness", cost: exactCost }), RangeError);
console.log("analysis proposal02: directed weighted reachable/discount closeness and source Star5");
