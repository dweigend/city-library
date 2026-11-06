// UNFROZEN POST-ADVISORY PROPOSAL. Exact predicates concern original binary64 values.
// No epsilon, rounded-difference oracle, new API or descriptor policy is prescribed.
import assert from "node:assert/strict";
import { Agent, Grid, Random, World, geometry, type PlanarFeature, type PlanarPolygon } from "city-library";

const feature = (polygon: PlanarPolygon): PlanarFeature => ({ type: "Feature", geometry: polygon, properties: null });
const s = Number.MIN_VALUE;
const subnormal: PlanarPolygon = { type: "Polygon", coordinates: [
  [[0, 0], [4 * s, 0], [4 * s, 4 * s], [0, 4 * s], [0, 0]],
] };
assert.equal(geometry.contains(subnormal, { x: 2 * s, y: 2 * s }, { boundary: "exclude" }), true);
assert.equal(geometry.contains(subnormal, { x: 0, y: 2 * s }, { boundary: "include" }), true);
assert.equal(geometry.contains(subnormal, { x: 0, y: 2 * s }, { boundary: "exclude" }), false);
assert.deepEqual(geometry.bounds([feature(subnormal)]), [0, 4 * s, 0, 4 * s]);

// Exact determinant = u², although the binary64 product subtraction is zero.
const u = 2 ** -52;
assert.equal(1 * 1 - (1 - u) * (1 + u), 0);
const cancellation: PlanarPolygon = { type: "Polygon", coordinates: [
  [[0, 0], [1, 1 - u], [1 + u, 1], [0, 0]],
] };
assert.deepEqual(geometry.bounds([feature(cancellation)]), [0, 1 + u, 0, 1]);
assert.equal(geometry.contains(cancellation, { x: 1, y: 1 - u }, { boundary: "include" }), true);
assert.equal(geometry.contains(cancellation, { x: 1, y: 1 - u }, { boundary: "exclude" }), false);
assert.equal(geometry.contains(cancellation, { x: -1, y: 0 }, { boundary: "exclude" }), false);

// Within the existing containment magnitude cap; eight ULPs per side near 1e9.
const side = 2 ** -20, upper = 1e9, lower = upper - side;
const offsetSquare: PlanarPolygon = { type: "Polygon", coordinates: [
  [[lower, lower], [upper, lower], [upper, upper], [lower, upper], [lower, lower]],
] };
assert.equal(geometry.contains(offsetSquare, { x: lower + side / 2, y: lower + side / 2 }, { boundary: "exclude" }), true);
assert.deepEqual(geometry.bounds([feature(offsetSquare)]), [lower, upper, lower, upper]);

// Identity cannot cache validity: the caller retains a mutable original ring.
const ring: [number, number][] = [[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]];
const mutable: PlanarPolygon = { type: "Polygon", coordinates: [ring] };
const first = geometry.bounds([feature(mutable)]);
assert.deepEqual(first, [0, 4, 0, 4]);
assert.equal(geometry.contains(mutable, { x: 3, y: 3 }, { boundary: "exclude" }), true);
ring[1] = [8, 0]; ring[2] = [8, 4];
assert.deepEqual(geometry.bounds([feature(mutable)]), [0, 8, 0, 4]);
assert.deepEqual(first, [0, 4, 0, 4]);
assert.equal(geometry.contains(mutable, { x: 6, y: 3 }, { boundary: "exclude" }), true);
// Bow-tie after a successful call: both operations must now reject, even outside.
ring[1] = [8, 4]; ring[2] = [0, 4]; ring[3] = [8, 0];
assert.throws(() => geometry.contains(mutable, { x: -100, y: -100 }, { boundary: "exclude" }));
assert.throws(() => geometry.bounds([feature(mutable)]));
ring[1] = [4, 0]; ring[2] = [4, 4]; ring[3] = [0, 4];
assert.equal(geometry.contains(mutable, { x: 2, y: 2 }, { boundary: "exclude" }), true);
assert.deepEqual(geometry.bounds([feature(mutable)]), [0, 4, 0, 4]);
if (first) Reflect.set(first, "0", -999); // either immutable or independently mutable
assert.deepEqual(ring, [[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]]);

const random = Random.add({ seed: 46 });
const world = World.add({ x: 10, y: 10, boundary: "hard" }, { random });
const agent = world.add(Agent.add({ label: "canonical position" }, { position: { x: 1, y: 1 } }));
const grid = Grid.add({ x: 10, y: 10, boundary: "hard" }, { state: { heat: 0 } });
world.add(grid);
const field = grid.fieldAt({ x: 1.5, y: 1.5 })!;
const beforeRandom = random.state, beforeTick = world.tick.value;
for (let i = 0; i < 3; i++) {
  assert.equal(geometry.contains(mutable, agent, { boundary: "exclude" }), true);
  assert.equal(geometry.contains(mutable, field, { boundary: "exclude" }), true);
  // geometry.map is already delivered; it is only a consumer here.
  const envelope = geometry.bounds([feature(mutable)]);
  assert.ok(envelope);
  assert.deepEqual(geometry.map(agent, { from: envelope, to: [-2, 2, -2, 2] }), { x: -1, y: -1 });
}
assert.equal(agent.x, 1); assert.equal(agent.y, 1); assert.equal(field.heat, 0);
assert.equal(world.tick.value, beforeTick); assert.deepEqual(random.state, beforeRandom);
for (const value of [NaN, Infinity, -Infinity]) {
  assert.throws(() => geometry.contains(mutable, { x: value, y: 1 }, { boundary: "exclude" }));
}
assert.throws(() => geometry.contains(mutable, { x: 1, y: 1, z: 0 } as { x: number; y: number }), TypeError);
assert.throws(() => geometry.contains(mutable, { x: 1, y: 1 }, { boundary: "nearest" } as unknown as { boundary: "include" }), TypeError);
console.log("planar proposal 04: subnormal/cancellation/large-offset geometry, mutation revalidation and canonical purity");
