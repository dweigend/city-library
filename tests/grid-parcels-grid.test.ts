import { expect, test } from "bun:test";
import { Agent, Grid, World, topology, type PlanarPolygon } from "city-library";

test("layout Fields retain canonical owner and independent direct state", () => {
  const layout = topology.square({ columns: 2, rows: 1, cellSize: 2 });
  const initial = { temperature: 10, samples: [1], nested: { enabled: true } };
  const grid = Grid.add({ layout, state: initial });
  const first = grid.fields[0]!;
  const second = grid.fields[1]!;
  expect(grid.layout).toBe(layout);
  expect(first.grid).toBe(grid);
  expect(first.id).not.toBe(second.id);
  expect([first.x, first.y, first.z]).toEqual([1, 1, undefined]);
  first.temperature = 30;
  first.samples.push(2);
  first.nested.enabled = false;
  expect(second.temperature).toBe(10);
  expect(second.samples).toEqual([1]);
  expect(initial).toEqual({ temperature: 10, samples: [1], nested: { enabled: true } });
  expect(Object.isFrozen(grid)).toBe(true);
  expect(Object.isFrozen(grid.fields)).toBe(true);
  expect(grid.fieldAt({ x: 2, y: 1 })).toBe(first);
  expect(grid.fieldAt({ x: 4, y: 1 })).toBe(second);
  expect(grid.fieldAt({ x: 4.1, y: 1 })).toBeUndefined();
  expect(grid.neighbors(first)).toEqual([second]);
  expect("space" in grid || "cellSize" in grid || "diffuse" in grid).toBe(false);
  expect(Reflect.set(first, "grid", Grid.add())).toBe(false);
  expect(first.grid).toBe(grid);
});

test("authored Field position uses polygon area rather than a regular address", () => {
  const polygon: PlanarPolygon = { type: "Polygon", coordinates: [[[2, 4], [8, 4], [2, 10], [2, 4]]] };
  const grid = Grid.add({ layout: topology.fromPolygons({ polygons: [polygon] }), state: {} });
  expect([grid.fields[0]!.x, grid.fields[0]!.y]).toEqual([4, 6]);
  expect(grid.fieldAt(grid.fields[0]!)).toBe(grid.fields[0]!);
});

test("layout occupancy follows current positions, canonical identities and admission order", () => {
  const layout = topology.hex({ columns: 3, rows: 2 });
  const world = World.add();
  const grid = world.add(Grid.add({ layout, state: { value: 0 } }));
  const firstField = grid.fields[0]!;
  const secondField = grid.fields[1]!;
  const first = world.add(Agent.add({ label: "first" }, { position: firstField }));
  const second = world.add(first.copy());
  const saved = grid.agentsAt(firstField);
  expect(saved).toEqual([first, second]);
  first.move({ to: secondField });
  expect(grid.agentsAt(firstField)).toEqual([second]);
  expect(grid.agentsAt(secondField)).toEqual([first]);
  first.move({ to: firstField });
  expect(grid.agentsAt(firstField)).toEqual([first, second]);
  world.delete(first);
  world.add(first);
  expect(grid.agentsAt(firstField)).toEqual([second, first]);
  expect(saved).toEqual([first, second]);
  expect(Object.isFrozen(saved)).toBe(true);
  second.delete();
  expect(grid.agentsAt(firstField)).toEqual([first]);
  first.move({ to: { x: 100, y: 100 } });
  expect(grid.agentsAt(firstField)).toEqual([]);
  expect(grid.agentsAt(firstField, { source: [first, first, second] })).toEqual([]);
  first.move({ to: firstField });
  expect(grid.agentsAt(firstField, { source: [first, first, second] })).toEqual([first]);
});

test("layout occupancy invalidates incompatible sources and rebuilds after detach", () => {
  const firstWorld = World.add();
  const secondWorld = World.add();
  const grid = firstWorld.add(Grid.add({ layout: topology.square({ columns: 1, rows: 1 }), state: {} }));
  const field = grid.fields[0]!;
  const first = firstWorld.add(Agent.add({}, { position: field }));
  const second = secondWorld.add(Agent.add({}, { position: field }));
  expect(grid.agentsAt(field)).toEqual([first]);
  const incompatible = firstWorld.add(Agent.add({}, { position: { x: 0, y: 0, z: 0 } }));
  expect(() => grid.agentsAt(field)).toThrow(TypeError);
  expect(grid.agentsAt(field, { source: [first] })).toEqual([first]);
  expect(() => grid.agentsAt(field, { source: [first, incompatible] })).toThrow(TypeError);
  firstWorld.delete(incompatible);
  expect(grid.agentsAt(field)).toEqual([first]);
  firstWorld.delete(grid);
  expect(() => grid.agentsAt(field)).toThrow(TypeError);
  secondWorld.add(grid);
  expect(grid.agentsAt(field)).toEqual([second]);
  first.move({ to: { x: 2, y: 2 } });
  expect(grid.agentsAt(field)).toEqual([second]);
  secondWorld.delete(grid);
  firstWorld.add(grid);
  expect(grid.agentsAt(field)).toEqual([]);
  expect(firstWorld.grids).toEqual([grid]);
});

test("layout Grid admission checks actual geometry without fabricated Space", () => {
  const layout = topology.square({ columns: 2, rows: 1 });
  const grid = Grid.add({ layout, state: {} });
  const adequate = World.add({ x: 4, y: 2 });
  adequate.add(grid);
  expect(adequate.grids[0]).toBe(grid);
  adequate.delete(grid);
  const small = World.add({ x: 2, y: 2 });
  const wrap = World.add({ x: 10, y: 10, boundary: "wrap" });
  const volume = World.add({ x: 10, y: 10, z: 10 });
  for (const world of [small, wrap, volume]) {
    expect(() => world.add(grid)).toThrow(TypeError);
    expect(world.grids).toHaveLength(0);
  }
  const other = World.add();
  other.add(grid);
  expect(() => adequate.add(grid)).toThrow(TypeError);
  expect(adequate.grids).toHaveLength(0);
  const agent = Agent.add();
  expect(() => adequate.add([agent, grid])).toThrow(TypeError);
  expect(agent.world).toBeUndefined();
});

test("layout Grid rejects malformed options and foreign canonical Fields", () => {
  const layout = topology.square({ columns: 1, rows: 1 });
  const grid = Grid.add({ layout, state: {} });
  const foreign = Grid.add({ layout, state: {} });
  const callAdd = (...args: unknown[]) => Reflect.apply(Grid.add, Grid, args);
  expect(() => callAdd({ layout, state: {} }, {})).toThrow(TypeError);
  expect(() => callAdd({ layout })).toThrow(TypeError);
  expect(() => callAdd({ layout, state: {}, cellSize: 1 })).toThrow(TypeError);
  expect(() => callAdd({ layout: { ...layout }, state: {} })).toThrow(TypeError);
  expect(() => callAdd({ layout, state: { id: "overridden" } })).toThrow(TypeError);
  expect(() => callAdd({ layout, state: { temperature: Infinity } })).toThrow(RangeError);
  expect(() => callAdd({ get layout() { throw new Error("must not read accessor"); }, state: {} })).toThrow(TypeError);
  expect(() => grid.neighbors(foreign.fields[0]!)).toThrow(TypeError);
  expect(() => grid.agentsAt(foreign.fields[0]!, { source: [] })).toThrow(TypeError);
  expect(() => grid.fieldAt({ x: 0, y: 0, z: 0 })).toThrow(TypeError);
  expect(() => grid.fieldAt({ x: Infinity, y: 0 })).toThrow(RangeError);
  expect(() => Reflect.apply(grid.neighbors, grid, [grid.fields[0], { neighborhood: "faces" }])).toThrow(TypeError);
  expect(() => Reflect.apply(grid.fieldAt, grid, [undefined])).toThrow(TypeError);
  expect(() => Reflect.apply(grid.agentsAt, grid, [grid.fields[0], { source: [{}] }])).toThrow(TypeError);
});
