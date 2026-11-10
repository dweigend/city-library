import assert from "node:assert/strict";
import { test } from "bun:test";
import { Agent, Grid, World } from "city-library";

test("occupancy retains field lookup boundary semantics across source contexts", () => {
  for (const boundary of ["hard", "wrap"] as const) {
    const grid = Grid.create({ x: 4, y: 6, boundary }, { cellSize: 2 });
    const source = [
      [-2, -3], [2, 3], [0, 0], [-0.001, -1.001],
      [2.001, 0], [-2.001, 0], [10, -15], [0, 3.001],
    ].map(([x, y]) => Agent.create({}, { position: { x: x!, y: y! } }));
    const outsideWorld = World.create({ x: 40, y: 40 });
    outsideWorld.add(source.at(-1)!);
    for (const field of grid.fields) {
      assert.deepEqual(
        grid.agentsAt(field, { source: [...source, source[0]!] }),
        source.filter((agent) => grid.fieldAt(agent) === field),
      );
    }
    source[0]!.move({ to: { x: 1, y: 2 } });
    const current = grid.fieldAt(source[0]!)!;
    assert.ok(grid.agentsAt(current, { source }).includes(source[0]!));
    source[0]!.delete();
    assert.ok(!grid.agentsAt(current, { source }).includes(source[0]!));
  }
});

test("three-dimensional mixed boundaries preserve source order and live queries", () => {
  const grid = Grid.create({ x: 4, y: 4, z: 4, boundary: { x: "wrap", y: "hard", z: "wrap" } });
  const source = [
    { x: 2, y: 2, z: 2 }, { x: -2, y: 2, z: -2 },
    { x: 6, y: 2, z: -6 }, { x: 0, y: 2.1, z: 0 },
  ].map((position) => Agent.create({}, { position }));
  for (const field of grid.fields) {
    assert.deepEqual(grid.agentsAt(field, { source }), source.filter((agent) => grid.fieldAt(agent) === field));
  }
  const target = grid.fieldAt(source[0]!)!;
  assert.deepEqual(grid.agentsAt(target, { source }), source.slice(0, 3));
  assert.ok(Object.isFrozen(grid.agentsAt(target, { source })));
});

test("occupancy validates every source candidate before returning matches", () => {
  const grid = Grid.create({ x: 4, y: 4 });
  const agent = Agent.create();
  const wrongDimension = Agent.create({}, { position: { x: 0, y: 0, z: 0 } });
  wrongDimension.delete();
  const field = grid.fieldAt(agent)!;
  assert.throws(() => grid.agentsAt(field, { source: [agent, wrongDimension] }), TypeError);
  assert.throws(() => grid.agentsAt(field, { source: [agent, {} as typeof agent] }), TypeError);
  function* brokenSource() { yield agent; throw new Error("source failed"); }
  assert.throws(() => grid.agentsAt(field, { source: brokenSource() }), /source failed/);
  assert.deepEqual(grid.agentsAt(field, { source: [agent, agent] }), [agent]);
});
