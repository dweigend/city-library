import { expect, test } from "bun:test";
import { Agent, Graph, Grid, World } from "city-library";

test("implicit occupancy preserves World admission order across moves, copies and failed batches", () => {
  const world = World.create({ x: 5, y: 5 });
  const grid = world.add(Grid.create({ x: 5, y: 5 }));
  const first = world.add(Agent.create({ energy: 4 }));
  const second = world.add(first.copy());
  const home = grid.fieldAt(first)!;
  const before = grid.agentsAt(home);
  expect(before).toEqual([first, second]);
  first.move({ to: { x: 1, y: 0 } });
  first.move({ to: home });
  world.add([first, second, first]);
  expect(grid.agentsAt(home)).toEqual([first, second]);
  expect(() => first.move({ to: { x: NaN, y: 0 } })).toThrow();
  const rejected = Agent.create();
  const foreign = World.create().add(Agent.create());
  expect(() => world.add([rejected, foreign])).toThrow();
  expect(rejected.world).toBeUndefined();
  expect(grid.agentsAt(home)).toEqual([first, second]);
  world.delete(first);
  world.add(first);
  expect(grid.agentsAt(home)).toEqual([second, first]);
  second.energy = 12;
  expect((grid.agentsAt(home)[0] as typeof second).energy).toBe(12);
  second.delete();
  expect(grid.agentsAt(home)).toEqual([first]);
  expect(before).toEqual([first, second]);
  expect(Object.isFrozen(before)).toBe(true);
});

test("several indexes track 3D mixed-boundary motion and changing cell sizes independently", () => {
  const world = World.create();
  const fine = world.add(Grid.create({ x: 4, y: 4, z: 4, boundary: { x: "wrap", y: "hard", z: "wrap" } }));
  const coarse = world.add(Grid.create({ x: 4, y: 4, z: 4, boundary: "hard" }, { cellSize: 2 }));
  const population = [
    { x: -2, y: -2, z: -2 }, { x: 2, y: 2, z: 2 },
    { x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: -6 },
  ].map(position => world.add(Agent.create({}, { position })));
  for (let step = 0; step < 8; step++) {
    for (const grid of [fine, coarse]) for (const field of grid.fields)
      expect(grid.agentsAt(field)).toEqual(population.filter(agent => grid.fieldAt(agent) === field));
    population[step % population.length]!.move({ by: { x: 0.7, y: -0.4, z: 0.5 } });
  }
  const lower = fine.fieldAt({ x: -2, y: 0, z: -2 })!;
  population[0]!.move({ to: { x: 2, y: 0, z: 2 } });
  expect(fine.agentsAt(lower)).toContain(population[0]!);
});

test("mismatched dimensions invalidate the entire implicit source and recover on detach", () => {
  const world = World.create();
  const grid = world.add(Grid.create({ x: 4, y: 4 }));
  const point = world.add(Agent.create());
  const cell = grid.fieldAt(point)!;
  expect(grid.agentsAt(cell)).toEqual([point]);
  const xyz = world.add(Agent.create({}, { position: { x: 10, y: 10, z: 10 } }));
  expect(() => grid.agentsAt(cell)).toThrow(TypeError);
  expect(grid.agentsAt(cell, { source: [point] })).toEqual([point]);
  xyz.move({ by: { x: 2 } });
  expect(() => grid.agentsAt(cell)).toThrow(TypeError);
  world.delete(xyz);
  expect(grid.agentsAt(cell)).toEqual([point]);
  world.add(xyz);
  expect(() => grid.agentsAt(cell)).toThrow(TypeError);
  xyz.delete();
  expect(grid.agentsAt(cell)).toEqual([point]);
});

test("Grid detach releases its prior World observation and later rebuilds current canonical data", () => {
  const first = World.create();
  const second = World.create();
  const grid = first.add(Grid.create({ x: 5, y: 5 }));
  const a = first.add(Agent.create());
  const b = second.add(Agent.create());
  const cell = grid.fieldAt(a)!;
  for (let iteration = 0; iteration < 4; iteration++) {
    expect(grid.agentsAt(cell)).toEqual([a]);
    first.delete(grid);
    expect(() => grid.agentsAt(cell)).toThrow();
    second.add(grid);
    expect(grid.agentsAt(cell)).toEqual([b]);
    first.delete(a);
    a.move({ to: { x: 1, y: 0 } });
    first.add(a);
    expect(grid.agentsAt(cell)).toEqual([b]);
    second.delete(grid);
    first.add(grid);
    expect(grid.agentsAt(cell)).toEqual([]);
    a.move({ to: cell });
  }
});

test("failed graph deletion and explicit source side effects leave the implicit index canonical", () => {
  const world = World.create();
  const grid = world.add(Grid.create({ x: 5, y: 5 }));
  const a = world.add(Agent.create());
  const b = Agent.create();
  const cell = grid.fieldAt(a)!;
  expect(grid.agentsAt(cell)).toEqual([a]);
  const graph = Graph.create();
  graph.nodes.add(a);
  const iterator = graph.nodes[Symbol.iterator]();
  iterator.next();
  expect(() => a.delete()).toThrow();
  expect(grid.agentsAt(cell)).toEqual([a]);
  iterator.return?.();
  function* changingSource() {
    yield b;
    a.move({ to: { x: 1, y: 0 } });
    world.add(b);
    yield a;
    yield b;
  }
  expect(grid.agentsAt(cell, { source: changingSource() })).toEqual([b]);
  expect(grid.agentsAt(cell)).toEqual([b]);
  function* failingSource() { b.delete(); yield a; throw new Error("source failure"); }
  expect(() => grid.agentsAt(cell, { source: failingSource() })).toThrow("source failure");
  expect(grid.agentsAt(cell)).toEqual([]);
  a.delete();
  expect(grid.agentsAt(grid.fieldAt({ x: 1, y: 0 })!)).toEqual([]);
});
