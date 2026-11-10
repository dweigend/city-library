// PROPOSAL ONLY: U3/U5 define planning guard, preflight ordering and atomic publication.
import assert from "node:assert/strict";
import { Agent, Graph, Random, World, type Edge, type Position } from "city-library";
type Point = { index: number; position: Position };
for (const wrapped of [false, true]) {
  const graph = Graph.create<Point>();
  const nodes = [{ x: -4.9, y: 0 }, { x: 4.9, y: 0 }, { x: 0, y: 0 }].map((position, index) => graph.nodes.add({ index, position }));
  const calls: Point[] = [];
  const result = graph.generate({ kind: "geometric", nodes, radius: 0.25, ...(wrapped ? { space: { x: 10, y: 10, boundary: "wrap" as const } } : {}), position: (node: Point) => { calls.push(node); return node.position; } });
  assert.deepEqual(calls, nodes);
  assert.deepEqual(result.map((edge: Edge<Point>) => [edge.from.index, edge.to.index]), wrapped ? [[0, 1]] : []);
}
const coincident = Graph.create<Point>();
const coincidentNodes = [0, 1].map(index => coincident.nodes.add({ index, position: { x: 0, y: 0 } }));
assert.equal(coincident.generate({ kind: "geometric", nodes: coincidentNodes, radius: 0, position: (node: Point) => node.position }).length, 1);
const xyz = Graph.create<Point>();
const cube = [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 3 }, { x: 0, y: 4, z: 0 }].map((position, index) => xyz.nodes.add({ index, position }));
assert.deepEqual(xyz.generate({ kind: "geometric", nodes: cube, radius: 3, position: (node: Point) => node.position }).map((edge: Edge<Point>) => [edge.from.index, edge.to.index]), [[0, 1]]);
const failing = Graph.create<Point>();
const input = [0, 1, 2].map(index => failing.nodes.add({ index, position: { x: index, y: 0 } }));
const rng = Random.create({ seed: 7 }), control = rng.copy(); control.number();
let externalEffects = 0;
const sentinel = new Error("source position failed");
assert.throws(() => failing.generate({ kind: "geometric", nodes: input, radius: 10, position: (node: Point) => {
  externalEffects++;
  if (node.index === 0) rng.number();
  if (node.index === 1) throw sentinel;
  return node.position;
} }), error => error === sentinel);
assert.equal(externalEffects, 2); assert.deepEqual(rng.state, control.state); // Caller effects/draws are not rolled back.
assert.equal(failing.edges.size, 0);
assert.throws(() => failing.generate({ kind: "geometric", nodes: input, radius: 10, position: (node: Point) => {
  failing.nodes.add({ index: 9, position: { x: 0, y: 0 } }); return node.position;
} }));
assert.equal(failing.nodes.size, 3); assert.equal(failing.edges.size, 0);
const reentrant = Graph.create<{ index: number }>({ parallel: true });
const reentrantNodes = [0, 1, 2].map(index => reentrant.nodes.add({ index }));
const positionFailure = new Error("batch preflight failed");
assert.throws(() => reentrant.generate({ kind: "geometric", nodes: reentrantNodes, radius: 1, position: (node: { index: number }) => {
  assert.equal(reentrant.distances({ from: node }).size, 1); // Reads see the unchanged graph during planning.
  if (node.index === 2) throw positionFailure;
  return { x: node.index, y: 0 };
} }), error => error === positionFailure);
assert.equal(reentrant.edges.size, 0);
assert.deepEqual(reentrant.generate({ kind: "path", nodes: reentrantNodes }).map((edge: Edge<{ index: number }>) => edge.key), ["0", "1"]); // Rejected batches consume no per-graph automatic keys.
for (const value of [NaN, Infinity]) assert.throws(() => failing.generate({ kind: "geometric", nodes: input, radius: 1, position: () => ({ x: value, y: 0 }) }));
assert.throws(() => failing.generate({ kind: "geometric", nodes: input, radius: 1, position: () => Promise.resolve({ x: 0, y: 0 }) as unknown as Position }));
assert.throws(() => failing.generate({ kind: "geometric", nodes: input, radius: 1, position: (node: Point) => node.index === 0 ? { x: 0, y: 0 } : { x: 0, y: 0, z: 0 } }));
assert.throws(() => failing.generate({ kind: "geometric", nodes: input, radius: -1, position: (node: Point) => node.position }));
for (const radius of [NaN, Infinity]) assert.throws(() => failing.generate({ kind: "geometric", nodes: input, radius, position: (node: Point) => node.position }));
assert.throws(() => failing.generate({ kind: "geometric", nodes: input, radius: 1, space: { x: 10, y: 10, z: 10 }, position: (node: Point) => node.position }));
const space = { x: 10, y: 10, boundary: "wrap" as const };
const worldRandom = Random.create({ seed: 42 }), world = World.create(space, { random: worldRandom });
const a = world.add(Agent.create({ name: "a" }, { position: { x: -4.9, y: 0 } }));
const b = world.add(Agent.create({ name: "b" }, { position: { x: 4.9, y: 0 } }));
const graph = Graph.create<typeof a, { nested: { tags: string[] } }>({ edgeState: { nested: { tags: ["base"] } } });
graph.nodes.add(a); graph.nodes.add(b);
const before = worldRandom.state;
assert.deepEqual(graph.generate({ kind: "geometric", nodes: [a, b], radius: 0.25, position: (node: typeof a) => ({ x: node.x, y: node.y }) }), []); // No World-space inference.
const generated = graph.generate({ kind: "geometric", nodes: [a, b], radius: 0.25, space, position: (node: typeof a) => ({ x: node.x, y: node.y }) });
assert.equal(generated[0]!.from, a); assert.equal(generated[0]!.to, b);
assert.equal(generated[0]!.path, undefined);
assert.deepEqual(worldRandom.state, before); assert.equal(world.tick.value, 0);
b.delete();
assert.equal(graph.nodes.size, 1); assert.equal(graph.edges.size, 0); assert.equal(generated[0]!.alive, false);
assert.equal(a.alive, true); assert.equal(world.agents.length, 1);
const defaults = { nested: { tags: ["initial"] } };
const clones = Graph.create<{ index: number }, typeof defaults>({ edgeState: defaults });
const cloneNodes = [0, 1, 2].map(index => clones.nodes.add({ index }));
defaults.nested.tags.push("caller edit");
const cloned = clones.generate({ kind: "path", nodes: cloneNodes });
cloned[0]!.nested.tags.push("edge edit");
assert.deepEqual(cloned[1]!.nested.tags, ["initial"]);
assert.notEqual(cloned[0]!.nested, cloned[1]!.nested);
const laterNodes = [3, 4].map(index => clones.nodes.add({ index }));
assert.deepEqual(clones.generate({ kind: "path", nodes: laterNodes })[0]!.nested.tags, ["initial"]);
const reference = Agent.create({ value: 1 });
const invalidDefaults = Graph.create<{ index: number }, { reference: typeof reference }>({ edgeState: { reference } });
const invalidNodes = [0, 1, 2].map(index => invalidDefaults.nodes.add({ index }));
reference.delete();
assert.throws(() => invalidDefaults.generate({ kind: "path", nodes: invalidNodes }));
assert.equal(invalidDefaults.edges.size, 0); // State cloning/liveness is preflighted before batch publication.
// Required caps only:100000 selected nodes and1000000 actually generated edges.
const capped = Graph.create<{ index: number }>();
const large = Array.from({ length: 100001 }, (_, index) => capped.nodes.add({ index }));
let overCapCallbacks = 0;
assert.throws(() => capped.generate({ kind: "geometric", nodes: large, radius: 0, position: () => { overCapCallbacks++; return { x: 0, y: 0 }; } }));
assert.equal(overCapCallbacks, 0); assert.equal(capped.edges.size, 0);
const atCap = capped.generate({ kind: "path", nodes: large.slice(0, 100000) });
assert.equal(atCap.length, 99999); assert.equal(atCap[0]!.from, large[0]); assert.equal(atCap.at(-1)!.to, large[99999]);
const edgeCap = Graph.create<{ index: number }>();
const completeNodes = Array.from({ length: 1415 }, (_, index) => edgeCap.nodes.add({ index }));
assert.throws(() => edgeCap.generate({ kind: "complete", nodes: completeNodes })); //1000405 edges >1000000
assert.equal(edgeCap.edges.size, 0);
console.log("generator proposal05: explicit spatial context, callback atomicity, cloned defaults, lifecycle and caps");
