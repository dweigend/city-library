// PROPOSAL ONLY. U1 proposes source insertion order, not selection-array order.
import assert from "node:assert/strict";
import { Graph } from "city-library";
type Node = { name: string };
type State = { value: number };
const source = Graph.add<Node, State>({ edgeState: { value: 0 } });
const [a, b, c, d] = ["a", "b", "c", "d"].map(name => source.nodes.add({ name })) as [Node, Node, Node, Node];
const ab = source.edges.add({ from: a, to: b, directed: true, state: { value: 1 } });
const bc = source.edges.add({ from: b, to: c, state: { value: 2 } });
const cd = source.edges.add({ from: c, to: d, directed: true, state: { value: 3 } });
const whole: Graph<Node, State> = source.copy({ direction: "original" });
assert.deepEqual([...whole.nodes], [a, b, c, d]);
assert.equal(whole.parallel, false);
assert.equal(whole.selfLoops, false);
assert.deepEqual([...whole.edges].map(edge => [edge.from, edge.to, edge.directed, edge.value]), [[a,b,true,1], [b,c,false,2], [c,d,true,3]]);
for (const [index, edge] of [...whole.edges].entries()) {
  assert.notEqual(edge, [ab, bc, cd][index]);
  assert.equal(edge.graph, whole);
  assert.equal(edge.key, undefined);
  assert.equal(edge.path, undefined); // All currently constructible Edges have no path.
  assert.equal(source.edges.has(edge), false);
}
const selectedNodes = [c, a, c, b];
const selectedEdges = [bc, ab, bc];
const explicit: Graph<Node, State> = source.copy({ nodes: selectedNodes, edges: selectedEdges });
assert.deepEqual([...explicit.nodes], [a, b, c]); // U1 proposed closure.
assert.deepEqual([...explicit.edges].map(edge => edge.value), [1, 2]);
selectedNodes.length = 0;
selectedEdges.length = 0;
assert.equal(explicit.nodes.size, 3);
assert.equal(explicit.edges.size, 2);
const induced: Graph<Node, State> = source.copy({ nodes: [c, b] });
assert.deepEqual([...induced.nodes], [b, c]);
assert.deepEqual([...induced.edges].map(edge => edge.value), [2]);
const edgeOnlySelection: Graph<Node, State> = source.copy({ edges: [bc] });
assert.deepEqual([...edgeOnlySelection.nodes], [a, b, c, d]);
assert.equal(edgeOnlySelection.edges.size, 1);
const empty: Graph<Node, State> = source.copy({ nodes: [] });
assert.equal(empty.nodes.size, 0);
assert.equal(empty.edges.size, 0);
assert.throws(() => source.copy({ nodes: [a], edges: [ab] }), TypeError);
assert.throws(() => source.copy({ nodes: [{ name: "foreign" }] }), TypeError);
const other = Graph.add<Node, State>({ edgeState: { value: 9 } });
other.nodes.add(a); other.nodes.add(b);
const foreign = other.edges.add({ from: a, to: b });
assert.throws(() => source.copy({ edges: [foreign] }), TypeError);
const removed = source.edges.add({ from: d, to: a });
removed.delete();
assert.throws(() => source.copy({ edges: [removed] }), TypeError);
whole.nodes.delete(b);
assert.equal(whole.edges.size, 1);
assert.equal(source.nodes.size, 4);
assert.deepEqual([...source.edges], [ab, bc, cd]);
assert.equal(ab.alive, true);
console.log("copy proposal01: canonical membership, induced selection, snapshots and source order");
