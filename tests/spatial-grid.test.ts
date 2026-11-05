import { test } from "bun:test";
import assert from "node:assert/strict";
import { Agent, Grid, Random, World, run } from "city-library";

test("space contexts are normalized snapshots and spatial attachment validates atomically", () => {
  const input = { x: 4, y: 4, boundary: "wrap" as const };
  const world = World.add(input);
  input.x = 20;
  assert.equal(world.space?.x, 4);
  assert.ok(Object.isFrozen(world.space?.boundary));
  const valid = Agent.add(),
    outside = Agent.add({}, { position: { x: 3, y: 0 } });
  assert.throws(() => world.add([valid, outside]));
  assert.equal(world.agents.length, 0);
  assert.throws(() => World.add({ x: 4, y: 4, random: Random.add() } as never));
  assert.throws(() => World.add({ x: 4, y: 4, z: 4, dimensions: 2 }));
  let reads = 0;
  assert.throws(() =>
    Agent.add(
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
  const world = World.add({ x: 4, y: 4, boundary: "wrap" });
  const a = Agent.add(),
    b = Agent.add({}, { position: { x: 2, y: 0 } });
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
  const a = Agent.add({ value: 1 }, { position: { x: 0, y: 0, z: 0 } });
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
  assert.throws(() => Agent.add({}, { orientation: { pitch: 0 } }));
});

test("grid occupancy preserves one membership owner and detach retains fields", () => {
  const world = World.add({ x: 2, y: 2, boundary: "wrap" });
  const grid = Grid.add(world.space!);
  const a = Agent.add({}, { position: grid.fields[0]! });
  world.add([grid, a]);
  assert.deepEqual(grid.agentsAt(grid.fields[0]!), [a]);
  assert.equal(world.grids[0], grid);
  const foreign = World.add();
  assert.throws(() => foreign.add(grid));
  world.delete(grid);
  assert.equal(world.grids.length, 0);
  assert.throws(() => grid.agentsAt(grid.fields[0]!));
  assert.equal(grid.fields.length, 4);
  const retained = Agent.add({ grid, field: grid.fields[0] });
  assert.equal(retained.grid, grid);
  assert.equal(retained.field, grid.fields[0]);
});

test("diffusion preserves directional slots on tiny wraps and commits atomically", () => {
  const grid = Grid.add(
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
  assert.throws(() => Grid.add({ x: 2, y: 2 }, { state: null } as never));
  const other = Grid.add({ x: 2, y: 2 });
  assert.throws(() => grid.neighbors(other.fields[0]! as never));
});

test("three dimensional grid neighborhoods and numeric fields stay canonical", () => {
  const grid = Grid.add(
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
  const world = World.add();
  run(world, () => {
    grid.fields[0]!.heat = 1;
  });
  assert.equal(world.tick.value, 1);
});

test("World admission retains concrete Grid payload and mixed-batch identities", () => {
  const world = World.add({ x: 2, y: 2, boundary: "wrap" });
  const grid = Grid.add(world.space!, { state: { grass: true, countdown: 3 } });
  const attached = world.add(grid);
  attached.fields[0]!.countdown = 2;
  assert.equal(attached, grid);
  assert.equal(grid.fields[0]!.countdown, 2);
  assert.equal(world.grids[0], grid);
  const animal = Agent.add({ species: "sheep" });
  const mixed = world.add([animal, grid]);
  assert.deepEqual(mixed, [animal, grid]);
  assert.equal(world.grids.length, 1);
  world.delete(grid);
  assert.equal(world.grids.length, 0);
  assert.equal(world.agents[0], animal);
});
