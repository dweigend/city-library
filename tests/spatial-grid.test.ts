import { test } from "bun:test";
import assert from "node:assert/strict";
import { Agent, Grid, Random, World, run } from "city-library";

test("space contexts are normalized snapshots and spatial attachment validates atomically", () => {
  const input = { x: 4, y: 4, boundary: "wrap" as const };
  const world = World.create(input);
  input.x = 20;
  assert.equal(world.space?.x, 4);
  assert.ok(Object.isFrozen(world.space?.boundary));
  const valid = Agent.create(),
    outside = Agent.create({}, { position: { x: 3, y: 0 } });
  assert.throws(() => world.add([valid, outside]));
  assert.equal(world.agents.length, 0);
  assert.throws(() => World.create({ x: 4, y: 4, random: Random.create() } as never));
  assert.throws(() => World.create({ x: 4, y: 4, z: 4, dimensions: 2 }));
  let reads = 0;
  assert.throws(() =>
    Agent.create(
      {},
      {
        position: Object.defineProperty({ y: 0 }, "x", {
          get() {
            reads++;
            return 1;
          },
        }) as never,
      },
    ),
  );
  assert.equal(reads, 0);
});

test("movement clips complete segments, wraps ties and leaves observations inert", () => {
  const world = World.create({ x: 4, y: 4, boundary: "wrap" });
  const a = Agent.create(),
    b = Agent.create({}, { position: { x: 2, y: 0 } });
  world.add(a);
  assert.equal(a.directionTo(b)?.heading, 270);
  assert.throws(() => a.move({ by: { x: 1, z: 0 } } as never));
  assert.equal(a.x, 0);
  a.move({ by: { x: 9, y: 3 } });
  assert.equal(a.x, 1);
  assert.equal(a.y, -1);
  const before = world.random.state;
  const tick = world.tick.value;
  a.neighbors({ source: [a, b, b] });
  assert.deepEqual(world.random.state, before);
  assert.equal(world.tick.value, tick);
  assert.throws(() =>
    a.move({ to: { x: 0, y: 0 }, space: { x: 5, y: 4, boundary: "wrap" } }),
  );
});

test("three dimensional orientation preserves local-axis composition and detached copies", () => {
  const a = Agent.create({ value: 1 }, { position: { x: 0, y: 0, z: 0 } });
  a.rotate(90, { axis: "x" });
  a.move(1);
  assert.ok(Math.abs(a.z! - 1) < 1e-12);
  assert.ok(Math.abs(a.y) < 1e-12);
  const copy = a.copy();
  assert.equal(copy.z, a.z);
  assert.equal(copy.pitch, a.pitch);
  assert.equal(copy.world, undefined);
  a.rotate({ towards: { x: 1, y: 0, z: 1 } });
  assert.ok(Math.abs(a.heading - 90) < 1e-12);
  assert.equal(a.roll, 0);
  assert.throws(() => Agent.create({}, { orientation: { pitch: 0 } }));
});

test("grid occupancy preserves one membership owner and detach retains fields", () => {
  const world = World.create({ x: 2, y: 2, boundary: "wrap" });
  const grid = Grid.create(world.space!);
  const a = Agent.create({}, { position: grid.fields[0]! });
  world.add([grid, a]);
  assert.deepEqual(grid.agentsAt(grid.fields[0]!), [a]);
  assert.equal(world.grids[0], grid);
  const foreign = World.create();
  assert.throws(() => foreign.add(grid));
  world.delete(grid);
  assert.equal(world.grids.length, 0);
  assert.throws(() => grid.agentsAt(grid.fields[0]!));
  assert.equal(grid.fields.length, 4);
  const retained = Agent.create({ grid, field: grid.fields[0] });
  assert.equal(retained.grid, grid);
  assert.equal(retained.field, grid.fields[0]);
});

test("diffusion preserves directional slots on tiny wraps and commits atomically", () => {
  const grid = Grid.create(
    { x: 2, y: 1, boundary: "wrap" },
    { state: { heat: 0 } },
  );
  grid.fields[0]!.heat = 8;
  grid.diffuse("heat", { rate: 1, neighborhood: "faces" });
  assert.deepEqual(
    grid.fields.map((f) => f.heat),
    [4, 4],
  );
  grid.fields[1]!.heat = Infinity;
  const before = grid.fields.map((f) => f.heat);
  assert.throws(() => grid.diffuse("heat"));
  assert.deepEqual(
    grid.fields.map((f) => f.heat),
    before,
  );
  assert.throws(() => Grid.create({ x: 2, y: 2 }, { state: null } as never));
  const other = Grid.create({ x: 2, y: 2 });
  assert.throws(() => grid.neighbors(other.fields[0]! as never));
});

test("three dimensional grid neighborhoods and numeric fields stay canonical", () => {
  const grid = Grid.create(
    { x: 3, y: 3, z: 3, boundary: "wrap" },
    { state: { heat: 0 } },
  );
  const center = grid.fieldAt({ x: 0, y: 0, z: 0 })!;
  assert.equal(grid.fields.length, 27);
  assert.equal(grid.neighbors(center).length, 26);
  assert.equal(grid.neighbors(center, { neighborhood: "faces" }).length, 6);
  center.heat = 6;
  grid.diffuse("heat", { rate: 1 });
  assert.equal(
    grid.fields.reduce((sum, f) => sum + f.heat, 0),
    6,
  );
  assert.throws(() => grid.fieldAt({ x: 0, y: 0 }));
  const world = World.create();
  run(world, () => {
    grid.fields[0]!.heat = 1;
  });
  assert.equal(world.tick.value, 1);
});

test("World admission retains concrete Grid payload and mixed-batch identities", () => {
  const world = World.create({ x: 2, y: 2, boundary: "wrap" });
  const grid = Grid.create(world.space!, { state: { grass: true, countdown: 3 } });
  const attached = world.add(grid);
  attached.fields[0]!.countdown = 2;
  assert.equal(attached, grid);
  assert.equal(grid.fields[0]!.countdown, 2);
  assert.equal(world.grids[0], grid);
  const animal = Agent.create({ species: "sheep" });
  const mixed = world.add([animal, grid]);
  assert.deepEqual(mixed, [animal, grid]);
  assert.equal(world.grids.length, 1);
  world.delete(grid);
  assert.equal(world.grids.length, 0);
  assert.equal(world.agents[0], animal);
});

test("hard clipping handles limiting-boundary roundoff and rejects an invalid origin", () => {
  const hard = { x: 4, y: 4 };
  const clipped = Agent.create({}, { position: { x: -1.1, y: 0 } });
  clipped.move({ by: { x: 6, y: 1 }, space: hard });
  assert.equal(clipped.x, 2);
  assert.ok(Math.abs(clipped.y - 3.1 / 6) < 1e-15);
  const outside = Agent.create({}, { position: { x: 5, y: 0 } });
  assert.throws(
    () => outside.move({ by: { x: 2, y: 1 }, space: hard }),
    RangeError,
  );
  assert.deepEqual([outside.x, outside.y], [5, 0]);
  assert.throws(() => outside.move(0, { space: hard }), RangeError);
});

test("World attachment respects half-open wraps and retains atomic batches", () => {
  const wrapping = World.create({ x: 4, y: 4, boundary: "wrap" });
  const valid = Agent.create();
  const upper = Agent.create({}, { position: { x: 2, y: 0 } });
  assert.throws(() => wrapping.add([valid, upper]), RangeError);
  assert.equal(wrapping.agents.length, 0);
  assert.equal(valid.world, undefined);
  assert.equal(upper.world, undefined);
  const hard = World.create({ x: 4, y: 4 });
  hard.add(upper);
  upper.move(0);
  assert.equal(upper.x, 2);
});

test("position inputs reject accessors, foreign frameworks and non-data shapes before reads", () => {
  let reads = 0;
  const accessor = Object.defineProperty({ y: 0 }, "x", {
    get() {
      reads += 1;
      return 0;
    },
  });
  const inherited = Object.create({ x: 0, y: 0 });
  const extra = { x: 0, y: 0, label: "unexpected" };
  const agent = Agent.create();
  const grid = Grid.create({ x: 2, y: 2 });
  for (const target of [
    accessor,
    inherited,
    extra,
    World.create(),
    Random.create(),
    grid,
  ]) {
    assert.throws(() => agent.move({ to: target as never }));
    assert.throws(() => agent.distanceTo(target as never));
    assert.throws(() => grid.fieldAt(target as never));
    assert.throws(() => Agent.create({}, { position: target as never }));
  }
  assert.equal(reads, 0);
  const field = grid.fields[0]!;
  const fromField = Agent.create({}, { position: field });
  agent.move({ to: fromField });
  assert.deepEqual([agent.x, agent.y], [field.x, field.y]);
  assert.equal(grid.fieldAt(agent), field);
});

test("new spatial and Grid APIs reject argument placeholders, excess arity and string sources", () => {
  const agent = Agent.create();
  const grid = Grid.create({ x: 2, y: 2 });
  const cell = grid.fields[0]!;
  const invoke = (fn: Function, ...args: unknown[]) => fn(...args);
  for (const args of [
    [undefined],
    [undefined, {}],
    [{ x: 2, y: 2 }, undefined],
    [{}, {}, {}],
  ]) {
    assert.throws(() => invoke(World.create, ...args), TypeError);
    assert.throws(() => invoke(Grid.create, ...args), TypeError);
  }
  assert.throws(() => invoke(agent.move, { by: { x: 1 } }, {}), TypeError);
  assert.throws(
    () => invoke(agent.rotate, { towards: { x: 1, y: 0 } }, {}),
    TypeError,
  );
  assert.throws(() => invoke(agent.move, 1, {}, 2), TypeError);
  assert.throws(() => invoke(agent.rotate, 1, {}, 2), TypeError);
  assert.throws(
    () => invoke(agent.distanceTo, { x: 0, y: 0 }, {}, 2),
    TypeError,
  );
  assert.throws(
    () => invoke(agent.directionTo, { x: 0, y: 0 }, undefined),
    TypeError,
  );
  assert.throws(() => invoke(agent.neighbors, {}, {}), TypeError);
  assert.throws(() => invoke(grid.fieldAt, cell, {}), TypeError);
  assert.throws(() => invoke(grid.neighbors, cell, undefined), TypeError);
  assert.throws(() => invoke(grid.agentsAt, cell, undefined), TypeError);
  assert.throws(() => invoke(grid.diffuse, "missing", {}, 2), TypeError);
  assert.throws(() => agent.neighbors({ source: "" as never }), TypeError);
  assert.throws(() => grid.agentsAt(cell, { source: "" as never }), TypeError);
  assert.deepEqual([agent.x, agent.y, agent.heading], [0, 0, 0]);
});
