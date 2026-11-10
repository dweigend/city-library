// PROPOSAL ONLY. U3 proposes per-state clone sessions and copied owner defaults.
import assert from "node:assert/strict";
import { Agent, Graph } from "city-library";
type Node = { name: string };
const reference = Agent.create({ value: 4 });
const alias = { tags: ["initial"] };
const cycle: { self?: unknown; alias: typeof alias } = { alias };
cycle.self = cycle;
const buffer = new ArrayBuffer(4);
new Uint8Array(buffer).set([1, 2, 3, 4]);
const state = {
  alias, same: alias, cycle,
  map: new Map<object, unknown>([[alias, cycle], [reference, reference]]),
  set: new Set<object>([alias, reference]),
  bytes: new Uint8Array(buffer), view: new DataView(buffer), reference, frameworkRefs: [] as object[],
};
const source = Graph.create<Node, typeof state>({ edgeState: state });
const a = source.nodes.add({ name: "a" }), b = source.nodes.add({ name: "b" }), c = source.nodes.add({ name: "c" });
const ab = source.edges.add({ from: a, to: b });
const bc = source.edges.add({ from: b, to: c });
ab.frameworkRefs = [source, bc, reference];
alias.tags.push("caller changed");
const copied: Graph<Node, typeof state> = source.copy();
const [first, second] = [...copied.edges];
assert.ok(first && second);
assert.notEqual(first.id, ab.id);
assert.equal(first.graph, copied);
assert.equal(first.alias, first.same);
assert.notEqual(first.alias, ab.alias);
assert.notEqual(first.alias, second.alias);
assert.equal(first.cycle.self, first.cycle);
assert.equal(first.cycle.alias, first.alias);
assert.equal(first.map.get(first.alias), first.cycle);
assert.equal(first.map.get(reference), reference);
assert.equal(first.set.has(first.alias), true);
assert.equal(first.set.has(reference), true);
assert.equal(first.reference, reference); // Living framework identities remain shared.
assert.deepEqual(first.frameworkRefs, [source, bc, reference]);
assert.notEqual(first.frameworkRefs, ab.frameworkRefs);
assert.notEqual(first.bytes.buffer, ab.bytes.buffer);
assert.equal(first.bytes.buffer, first.view.buffer);
first.bytes[0] = 99;
assert.equal(first.view.getUint8(0), 99);
assert.equal(ab.bytes[0], 1);
first.alias.tags.push("copy changed");
assert.deepEqual(ab.alias.tags, ["initial"]);
assert.deepEqual(second.alias.tags, ["initial"]);
ab.alias.tags.push("source edge changed");
const newInCopy = copied.edges.add({ from: a, to: c });
const newInSource = source.edges.add({ from: a, to: c });
assert.deepEqual(newInCopy.alias.tags, ["initial"]);
assert.deepEqual(newInSource.alias.tags, ["initial"]);
assert.notEqual(newInCopy.alias, newInSource.alias);
assert.notEqual(newInCopy.alias, first.alias);
reference.value = 8;
assert.equal(first.reference.value, 8);
assert.equal(ab.reference.value, 8);
assert.equal(bc.alive, true);
assert.equal(first.path, undefined);
const again: Graph<Node, typeof state> = copied.copy();
assert.notEqual([...again.edges][0], first);
assert.equal([...again.nodes][0], a);
console.log("copy proposal03: cycles, aliases, Maps/Sets, shared buffers and framework references");
