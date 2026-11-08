import { expect, test } from "bun:test";
import { Agent, Grid, Random, World, geometry, type Orientation, type Position } from "city-library";

const close = (actual: number, expected: number) => expect(Math.abs(actual - expected)).toBeLessThan(1e-12);

test("pure forward vectors agree with existing Agent motion including XYZ roll", () => {
  const angles: Orientation[] = [
    { heading: 0 }, { heading: 90 }, { heading: -270 }, { heading: 735 },
    { heading: 30, pitch: 20, roll: 50 }, { heading: 210, pitch: -50, roll: -90 },
    { heading: 0, pitch: 90, roll: 120 }, { heading: 65, pitch: 0, roll: 360 },
  ];
  for (const orientation of angles) {
    const xyz = orientation.pitch !== undefined;
    const agent = Agent.add({}, { position: xyz ? { x: 0, y: 0, z: 0 } : { x: 0, y: 0 }, orientation });
    const forward = geometry.direction(orientation);
    agent.move(1);
    close(forward.x, agent.x); close(forward.y, agent.y);
    if (xyz) close(forward.z!, agent.z!); else expect(forward.z).toBeUndefined();
    close(Math.hypot(forward.x, forward.y, forward.z ?? 0), 1);
    expect(Object.isFrozen(forward)).toBe(true);
    agent.delete();
  }
});

test("forward periodicity and finite huge angles preserve a unit vector", () => {
  for (const heading of [-359, -90, 0, 45, 90, 359]) {
    const first = geometry.direction({ heading, pitch: 25, roll: 5 });
    const repeated = geometry.direction({ heading: heading + 1080, pitch: 385, roll: 75 });
    close(first.x, repeated.x); close(first.y, repeated.y); close(first.z!, repeated.z!);
  }
  const huge = geometry.direction({ heading: Number.MAX_VALUE, pitch: -Number.MAX_VALUE });
  close(Math.hypot(huge.x, huge.y, huge.z!), 1);
});

test("normalization is idempotent and distinguishes hard endpoints from wrap seams", () => {
  const space = Object.freeze({ x: 10, y: 8, z: 6, boundary: Object.freeze({ x: "wrap", y: "hard", z: "wrap" }) } as const);
  for (const x of [-45, -5, 0, 5, 45]) for (const z of [-27, -3, 0, 3, 27]) {
    const point = Object.freeze({ x, y: 4, z });
    const normalized = geometry.normalize(point, { space });
    expect(normalized).toBeDefined();
    expect(geometry.normalize(normalized!, { space })).toEqual(normalized);
    expect(geometry.normalize(point, { space, endpoints: "half-open" })).toBeUndefined();
    expect(Object.isFrozen(normalized)).toBe(true);
    expect(point).toEqual({ x, y: 4, z });
  }
  expect(geometry.normalize({ x: 5, y: -4, z: 3 }, { space, endpoints: "half-open" })).toEqual({ x: -5, y: -4, z: -3 });
  expect(geometry.normalize({ x: 0, y: 4.01, z: 0 }, { space })).toBeUndefined();
});

test("distance matches Agent measurement and toroidal metric properties", () => {
  const space = { x: 11, y: 9, boundary: { x: "wrap", y: "hard" } } as const;
  const world = World.add(space);
  const agent = Agent.add({}, { position: { x: 5, y: 4 } }); world.add(agent);
  const targets: Position[] = [{ x: -5, y: -4 }, { x: 3, y: 1 }, { x: 16, y: 30 }];
  for (const target of targets) {
    close(geometry.distance(agent, target, { space }), agent.distanceTo(target));
    close(geometry.distance(agent, target, { space }), geometry.distance(target, agent, { space }));
    close(geometry.distance(agent, target, { space, wrap: false }), Math.hypot(target.x - agent.x, target.y - agent.y));
  }
  for (let i = 0; i < 20; i++) {
    const a = { x: (i * 7) % 11 - 5, y: i % 9 - 4 };
    const b = { x: (i * 3) % 11 - 5, y: (i * 2) % 9 - 4 };
    const c = { x: (i * 5) % 11 - 5, y: (i * 4) % 9 - 4 };
    close(geometry.distance(a, b, { space }), geometry.distance({ x: a.x + 33, y: a.y }, b, { space }));
    expect(geometry.distance(a, c, { space })).toBeLessThanOrEqual(geometry.distance(a, b, { space }) + geometry.distance(b, c, { space }) + 1e-12);
  }
});

test("canonical field probes are current and do not allocate, move or draw", () => {
  const random = Random.add({ seed: 21 });
  const world = World.add({ x: 5, y: 5, boundary: "wrap" }, { random });
  const grid = Grid.add(world.space!, { state: { value: 7 } }); world.add(grid);
  const person = Agent.add({}, { position: { x: 2, y: 0 }, orientation: { heading: 90 } }); world.add(person);
  const before = random.state;
  const field = grid.fieldAt({ x: -2, y: 0 })!;
  for (let i = 0; i < 10; i++) {
    const direction = geometry.direction({ heading: person.heading });
    const point = geometry.normalize({ x: person.x + direction.x, y: person.y + direction.y }, { space: world.space! });
    expect(grid.fieldAt(point!)).toBe(field);
    expect(geometry.distance(person, field, { space: grid.space })).toBe(1);
  }
  expect(world.agents).toEqual([person]); expect(world.tick.value).toBe(0);
  expect(random.state).toEqual(before); expect(person.x).toBe(2); expect(field.value).toBe(7);
  person.move({ to: { x: -1, y: 0 } });
  expect(geometry.distance(person, field, { space: grid.space })).toBe(1);
});

test("strict shapes and dimensions reject without invoking input accessors", () => {
  let invoked = false;
  const accessor = Object.defineProperty({}, "heading", { get() { invoked = true; return 0; } });
  for (const value of [null, [], {}, { heading: NaN }, { heading: 0, roll: 20 }, { heading: 0, pitch: 0, roll: Infinity }, { heading: 0, extra: true }, accessor])
    expect(() => geometry.direction(value as Orientation)).toThrow();
  const badPoint = Object.defineProperty({ y: 0 }, "x", { get() { invoked = true; return 0; } });
  expect(() => geometry.normalize(badPoint as Position, { space: { x: 10, y: 10 } })).toThrow(TypeError);
  expect(invoked).toBe(false);
  for (const endpoints of [null, "other", 3]) expect(() => geometry.normalize({ x: 0, y: 0 }, { space: { x: 10, y: 10 }, endpoints } as never)).toThrow(TypeError);
  expect(() => geometry.normalize({ x: 10, y: 0, z: 0 }, { space: { x: 10, y: 10 } })).toThrow(TypeError);
  expect(() => geometry.distance({ x: 0, y: 0 }, { x: 0, y: 0 }, { space: { x: 10, y: 10, z: 10 } })).toThrow(TypeError);
  expect(() => geometry.distance({ x: 0, y: 0 }, { x: 1, y: 1 }, { space: { x: 10, y: 10 }, wrap: null } as never)).toThrow(TypeError);
  expect(() => (geometry.direction as Function)({ heading: 0 }, 1)).toThrow(TypeError);
  expect(() => (geometry.normalize as Function)({ x: 0, y: 0 }, { space: { x: 1, y: 1 } }, 1)).toThrow(TypeError);
  expect(Object.isFrozen(geometry)).toBe(true);
});

test("finite hypot handles large values while actual arithmetic overflow rejects", () => {
  const space = { x: 10, y: 10 };
  expect(geometry.distance({ x: 0, y: 0 }, { x: 1e308, y: 1e308 }, { space })).toBe(Math.hypot(1e308, 1e308));
  expect(() => geometry.distance({ x: 0, y: 0 }, { x: 1.7e308, y: 1.7e308 }, { space })).toThrow(RangeError);
  expect(() => geometry.distance({ x: -Number.MAX_VALUE, y: 0 }, { x: Number.MAX_VALUE, y: 0 }, { space: { ...space, boundary: "wrap" } })).toThrow(RangeError);
  expect(() => geometry.normalize({ x: Infinity, y: 0 }, { space })).toThrow(RangeError);
});
