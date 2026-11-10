// PROPOSAL ONLY. U2 proposes key preservation and independent automatic counters.
import assert from "node:assert/strict";
import { Graph } from "city-library";
type Node = { name: string };
type State = { label: string };
const source = Graph.create<Node, State>({ edgeState: { label: "default" }, selfLoops: true });
const a = source.nodes.add({ name: "a" }), b = source.nodes.add({ name: "b" });
const ab = source.edges.add({ from: a, to: b, directed: true, state: { label: "forward" } });
const ba = source.edges.add({ from: b, to: a, directed: true, state: { label: "backward" } });
const loop = source.edges.add({ from: a, to: a, directed: true, state: { label: "loop" } });
const reverse: Graph<Node, State> = source.copy({ direction: "reverse" });
assert.equal(reverse.parallel, false);
assert.equal(reverse.selfLoops, true);
assert.deepEqual([...reverse.edges].map(edge => [edge.from, edge.to, edge.directed, edge.label]), [[b,a,true,"forward"], [a,b,true,"backward"], [a,a,true,"loop"]]);
assert.deepEqual([...reverse.edges].map(edge => edge.path), [undefined, undefined, undefined]);
const undirected: Graph<Node, State> = source.copy({ direction: "undirected" });
assert.equal(undirected.parallel, true); // Both opposite arcs survive as distinct edges.
assert.equal(undirected.selfLoops, true);
assert.deepEqual([...undirected.edges].map(edge => [edge.from, edge.to, edge.directed, edge.label]), [[a,b,false,"forward"], [b,a,false,"backward"], [a,a,false,"loop"]]);
assert.deepEqual([...undirected.edges].map(edge => edge.key), ["0", "1", "2"]); // U2.
assert.equal(undirected.edges.between(a, b).length, 2);
assert.equal(undirected.edges.between(a, a).length, 1);
const noCollision: Graph<Node, State> = source.copy({ edges: [ab], direction: "undirected" });
assert.equal(noCollision.parallel, false);
assert.equal([...noCollision.edges][0]!.key, undefined);
const multi = Graph.create<Node, State>({ parallel: true, selfLoops: true, edgeState: { label: "base" } });
multi.nodes.add(a); multi.nodes.add(b);
const first = multi.edges.add({ from: a, to: b, key: "7", state: { label: "undirected" } });
const second = multi.edges.add({ from: a, to: b, directed: true, key: "0", state: { label: "directed" } });
const third = multi.edges.add({ from: a, to: a, key: "loop", state: { label: "self" } });
const emptyMulti: Graph<Node, State> = multi.copy({ nodes: [] });
assert.equal(emptyMulti.parallel, true);
assert.equal(emptyMulti.selfLoops, true);
assert.equal(emptyMulti.edges.size, 0);
const converted: Graph<Node, State> = multi.copy({ direction: "reverse" });
assert.equal(converted.parallel, true);
assert.deepEqual([...converted.edges].map(edge => [edge.from, edge.to, edge.directed, edge.key]), [[a,b,false,"7"], [b,a,true,"0"], [a,a,false,"loop"]]);
const added = converted.edges.add({ from: b, to: b });
assert.equal(added.key, "1"); // U2: fresh cursor starts at 0 and skips retained keys.
assert.equal(multi.edges.size, 3);
converted.edges.between(a, b, { direction: "all" })[0]!.delete();
assert.equal(first.alive, true);
assert.deepEqual([...multi.edges], [first, second, third]);
assert.deepEqual([...source.edges], [ab, ba, loop]);
const history = Graph.create<Node>({ parallel: true });
history.nodes.add(a); history.nodes.add(b);
history.edges.add({ from: a, to: b }).delete(); // Source cursor has advanced past key0.
history.edges.add({ from: a, to: b, key: "7" });
const freshCounter: Graph<Node> = history.copy();
assert.equal(freshCounter.edges.add({ from: a, to: b }).key, "0"); // U2: not inherited cursor1.
assert.equal(history.edges.add({ from: a, to: b }).key, "1");
console.log("copy proposal02: reverse only directed arcs, lossless collapse, loops and keys");
