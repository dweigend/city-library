// PROPOSAL ONLY: analytic path-fraction oracles, not exhaustive runtime path enumeration.
import assert from "node:assert/strict";
import { Graph, type Edge } from "city-library";
const close = (actual: number | undefined, expected: number) => { assert.notEqual(actual, undefined); assert.ok(Math.abs(actual! - expected) < 1e-10, `${actual} != ${expected}`); };
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
  for (const [index, node] of [s, u, v, t].entries()) close(normalized.get(node), expected[index]! / (directed ? 6 : 3));
  if (directed) {
    // A direct equal-cost bypass is a fourth distinct shortest path for s->t.
    graph.edges.add({ from: s, to: t, directed: true, state: { cost: 2 } });
    const bypass = graph.analyze({ measure: "betweenness", cost: (edge: Edge<Node, { cost: number }>) => edge.cost });
    close(bypass.get(u), 1 / 2); close(bypass.get(v), 1 / 4);
    close(result.get(u), 2 / 3);
  }
  for (const field of ["direction", "disconnected", "weight", "damping", "tolerance", "maxIterations"]) assert.throws(() => graph.analyze({ measure: "betweenness", [field]: field === "weight" ? () => 1 : 1 } as never), TypeError);
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
// U3: no new cap or silent nonfinite result just because raw path counts overflow.
const long = Graph.add<{ index: number }>({ parallel: true });
const nodes = Array.from({ length: 1100 }, (_, index) => long.nodes.add({ index }));
for (let index = 1; index < nodes.length; index++) for (let copy = 0; copy < 2; copy++) long.edges.add({ from: nodes[index - 1]!, to: nodes[index]!, directed: true });
const longScores = long.analyze({ measure: "betweenness" });
for (const node of nodes) close(longScores.get(node), node.index * (1099 - node.index));
const tiny = Graph.add<Node>(); const one = tiny.nodes.add({ name: "one" });
assert.equal(tiny.analyze({ measure: "betweenness", normalized: true }).get(one), 0);
assert.equal(Graph.add().analyze({ measure: "betweenness" }).size, 0);
console.log("analysis proposal03: parallel-edge shortest-path fractions and finite large counts");
