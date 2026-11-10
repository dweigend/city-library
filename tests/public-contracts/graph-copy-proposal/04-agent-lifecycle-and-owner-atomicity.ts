// PROPOSAL ONLY. U3/U4 require complete clone preflight before publishing Agent hooks.
import assert from "node:assert/strict";
import { Agent, Graph, Random, World } from "city-library";
const random = Random.add({ seed: 211 });
const world = World.add({ x: 20, y: 20 }, { random });
const a = world.add(Agent.add({ name: "a" }, { position: { x: 1, y: 2 } }));
const b = world.add(Agent.add({ name: "b" }, { position: { x: 3, y: 4 } }));
const source = Graph.add<typeof a, { values: number[] }>({ edgeState: { values: [1] } });
source.nodes.add(a); source.nodes.add(b);
const original = source.edges.add({ from: a, to: b, directed: true });
const before = random.state;
const first: Graph<typeof a, { values: number[] }> = source.copy({ direction: "reverse" });
const second: Graph<typeof a, { values: number[] }> = source.copy();
assert.deepEqual(random.state, before);
assert.equal(world.tick.value, 0);
assert.equal(world.agents.length, 2);
assert.equal(a.world, world);
assert.equal(b.world, world);
assert.equal([...first.nodes][0], a);
assert.equal([...first.edges][0]!.from, b);
assert.equal(a.x, 1); assert.equal(a.y, 2);
// Copy is a query on its source: an active source reader permits it.
for (const node of source.nodes) {
  const duringRead: Graph<typeof a, { values: number[] }> = source.copy();
  duringRead.nodes.delete(node); // Independent owner, not a source mutation.
  assert.equal(source.hasNode(node), true);
  duringRead.delete(); // Release memberships for this temporary independent graph.
}
const firstEdge = [...first.edges][0]!, secondEdge = [...second.edges][0]!;
first.nodes.delete(b);
assert.equal(firstEdge.alive, false);
assert.equal(original.alive, true);
assert.equal(secondEdge.alive, true);
assert.equal(b.alive, true);
assert.equal(world.agents.length, 2);
b.delete();
assert.equal(original.alive, false);
assert.equal(secondEdge.alive, false);
assert.equal(source.hasNode(b), false);
assert.equal(second.hasNode(b), false);
assert.equal(first.hasNode(a), true);
assert.equal(a.alive, true);
assert.equal(world.agents.length, 1);
assert.deepEqual(random.state, before);
assert.equal(world.tick.value, 0);

const deadReference = Agent.add({ value: 1 });
const withDefaults = Graph.add<typeof a, { reference: typeof deadReference }>({ edgeState: { reference: deadReference } });
withDefaults.nodes.add(a);
deadReference.delete();
assert.throws(() => withDefaults.copy(), TypeError); // U3: defaults are cloned even with no edges.
assert.equal(a.alive, true);
assert.equal(withDefaults.hasNode(a), true);
assert.equal(withDefaults.edges.size, 0);
assert.equal(world.agents.length, 1);
// A later edge may invalidate cloning after an earlier valid edge was inspected.
const failure = Graph.add<typeof a, { data: object }>({ edgeState: { data: {} } });
const c = Agent.add({ name: "c" }), d = Agent.add({ name: "d" });
failure.nodes.add(a); failure.nodes.add(c); failure.nodes.add(d);
const good = failure.edges.add({ from: a, to: c });
const bad = failure.edges.add({ from: c, to: d });
class Unsupported { value = 1; }
bad.data = new Unsupported();
assert.throws(() => failure.copy(), TypeError);
assert.deepEqual([...failure.nodes], [a, c, d]);
assert.deepEqual([...failure.edges], [good, bad]);
assert.equal(good.alive, true);
assert.equal(bad.alive, true);
bad.data = { fixed: true };
const recovered: Graph<typeof a, { data: object }> = failure.copy();
assert.equal(recovered.edges.size, 2);
c.delete();
assert.equal(failure.edges.size, 0);
assert.equal(recovered.edges.size, 0);
assert.equal(a.alive, true);
assert.deepEqual(random.state, before);
// Public outcomes above do not directly count private Agent deletion hooks;
// the no-leaked-hook invariant also requires a focused owner integration check.
console.log("copy proposal04: shared Agent lifecycle, independent ownership and clone-failure preflight");
