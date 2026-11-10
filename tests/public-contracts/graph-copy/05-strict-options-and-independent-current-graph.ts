// PROPOSAL ONLY. U4/U5 propose descriptor-safe dense arrays and ordinary undefined defaults.
import assert from "node:assert/strict";
import { Graph } from "city-library";
type Node = { index: number };
const source = Graph.create<Node>();
const a = source.nodes.add({ index: 0 }), b = source.nodes.add({ index: 1 });
const edge = source.edges.add({ from: a, to: b, directed: true });
// Invalid JavaScript inputs deliberately cross the static API boundary.
for (const options of [null, [], 1, "copy", new Date(), { direction: "in" }, { direction: null }, { unknown: undefined }, { nodes: new Set([a]) }, { edges: [a] }, { nodes: [null] }]) {
  assert.throws(() => source.copy(options as never), TypeError);
}
let calls = 0;
const getterOptions = Object.defineProperty({}, "direction", { get() { calls++; return "original"; } });
assert.throws(() => source.copy(getterOptions), TypeError);
const indexedGetter: Node[] = [];
Object.defineProperty(indexedGetter, "0", { get() { calls++; return a; } });
assert.throws(() => source.copy({ nodes: indexedGetter }), TypeError);
const sparse = new Array<Node>(1);
assert.throws(() => source.copy({ nodes: sparse }), TypeError);
const extra = Object.assign([a], { extra: true });
assert.throws(() => source.copy({ nodes: extra }), TypeError);
const symbolOptions = { [Symbol("foreign")]: true };
assert.throws(() => source.copy(symbolOptions as never), TypeError);
assert.equal(calls, 0);
Object.defineProperty(edge, "invalidGetter", { configurable: true, get() { calls++; return 1; } });
assert.throws(() => source.copy(), TypeError);
assert.equal(calls, 0);
Reflect.deleteProperty(edge, "invalidGetter");
const copied: Graph<Node> = source.copy({ nodes: undefined, edges: undefined, direction: undefined });
assert.deepEqual([...copied.nodes], [a, b]);
assert.equal(copied.edges.size, 1);
// The result is the actual current Graph receiver, not a fabricated ReadonlyGraph.
assert.equal(copied.connected(), true);
assert.equal(copied.distances({ from: a }).get(b), 1);
assert.equal(copied.analyze({ measure: "degree" }).get(a), 1);
assert.deepEqual(copied.neighbors(a), [b]);
copied.delete({ edgesOnly: true });
assert.equal(copied.edges.size, 0);
assert.equal(source.edges.size, 1);
const generated = copied.generate({ kind: "path", nodes: [a, b], directed: true });
assert.equal(generated.length, 1);
assert.notEqual(generated[0], edge);
const sibling: Graph<Node> = source.copy();
sibling.delete();
assert.equal(sibling.nodes.size, 0);
assert.equal(source.nodes.size, 2);
assert.equal(copied.nodes.size, 2);
// Copy does not inherit the generator's 100000-node cap.
const large = Graph.create<Node>();
const many = Array.from({ length: 100001 }, (_, index) => large.nodes.add({ index }));
const largeCopy: Graph<Node> = large.copy();
assert.equal(largeCopy.nodes.size, 100001);
assert.equal([...largeCopy.nodes][0], many[0]);
assert.equal([...largeCopy.nodes].at(-1), many.at(-1));
assert.equal(largeCopy.edges.size, 0);
largeCopy.delete();
assert.equal(large.nodes.size, 100001);
assert.deepEqual([...source.edges], [edge]);
console.log("copy proposal05: strict descriptors, valid current Graph operations and no generator cap");
