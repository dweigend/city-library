// PROPOSAL ONLY; U1/U2 callback/undefined-field decisions require coordinator acceptance.
import assert from "node:assert/strict";
import { Graph, Random, World, type Edge } from "city-library";

type Node = { name: string };
const random = Random.add({ seed: 7 }), world = World.add({ random });
const graph = Graph.add<Node, { weight: number }>({ parallel: true, selfLoops: true, edgeState: { weight: 1 } });
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
  assert.deepEqual(seen, edges); // Proposed U1: once per original edge, including loops.
  assert.deepEqual([...result.values()], expected);
  assert.equal([...result.keys()][0], a);
}
edges[0]!.weight = 0;
assert.equal(defaults.get(a), 4); // Previous result is a detached observation.
assert.deepEqual([...graph.analyze({ measure: "degree", weight: (edge: Edge<Node, { weight: number }>) => edge.weight }).values()], [19, 14, 0]);
assert.deepEqual([...graph.analyze({ measure: "degree", direction: undefined, normalized: undefined, weight: undefined }).values()], [4, 3, 0]);
for (const field of ["cost", "disconnected", "damping", "tolerance", "maxIterations"]) {
  assert.throws(() => graph.analyze({ measure: "degree", [field]: field === "cost" ? () => 1 : 1 } as never), TypeError);
  assert.throws(() => graph.analyze({ measure: "degree", [field]: undefined } as never), TypeError); // Proposed U2: disallowed own key still rejects.
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
const singleton = Graph.add<Node>({ selfLoops: true }); const one = singleton.nodes.add({ name: "one" });
singleton.edges.add({ from: one, to: one });
assert.equal(singleton.analyze({ measure: "degree", normalized: true }).get(one), 2);
assert.equal(Graph.add().analyze({ measure: "degree" }).size, 0);
console.log("analysis proposal01: degree incidence, canonical keys, weights and closed options");
