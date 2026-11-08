import assert from "node:assert/strict";
import { Graph } from "../../index.ts";
const graph = Graph.add<{ id: string }, { weight: number }>({ parallel: true, edgeState: { weight: 1 } });
const a = graph.nodes.add({ id: "a" }), b = graph.nodes.add({ id: "b" }), c = graph.nodes.add({ id: "c" });
graph.edges.add({ from: a, to: b, directed: true, key: "expensive", state: { weight: 3 } });
const cheap = graph.edges.add({ from: a, to: b, directed: true, key: "cheap", state: { weight: 0 } });
graph.edges.add({ from: b, to: c, directed: true, state: { weight: 2 } });
graph.edges.add({ from: a, to: c, directed: true, state: { weight: 5 } });
let calls = 0;
const first = graph.distances({ from: a, cost: edge => { calls++; return edge.weight; } });
assert.equal(calls, 4);
assert.equal(first.get(a), 0); assert.equal(first.get(b), 0); assert.equal(first.get(c), 2);
assert.equal(graph.distances({ from: c }).size, 1); // No reverse traversal of directed edges.
cheap.weight = 4;
assert.equal(first.get(c), 2); // Result does not become another mutable graph cache.
assert.equal(graph.distances({ from: a, cost: edge => edge.weight, algorithm: "dijkstra" }).get(c), 5);
assert.equal(graph.distances({ from: a }).get(c), 1); // Default unit edge costs.
assert.equal(graph.distances({ from: a, algorithm: "breadth" }).get(b), 1);
