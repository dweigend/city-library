import { expect, test } from "bun:test";
import { Agent, Grid, Random, World, geometry, type Bounds } from "city-library";

const unit: Bounds = [0, 1, 0, 1];

test("uniform mapping centers translated asymmetric bounds along either padded axis", () => {
  const from: Bounds = [-10, 30, 20, 40];
  const horizontal: Bounds = [100, 220, -50, -10];
  expect(geometry.map({ x: -10, y: 20 }, { from, to: horizontal })).toEqual({ x: 120, y: -50 });
  expect(geometry.map({ x: 30, y: 40 }, { from, to: horizontal })).toEqual({ x: 200, y: -10 });
  expect(geometry.map({ x: 0, y: 25 }, { from, to: horizontal })).toEqual({ x: 140, y: -40 });
  const vertical: Bounds = [-80, 0, 10, 90];
  expect(geometry.map({ x: -10, y: 20 }, { from, to: vertical })).toEqual({ x: -80, y: 30 });
  expect(geometry.map({ x: 30, y: 40 }, { from, to: vertical, mode: "uniform-centered" })).toEqual({ x: 0, y: 70 });
  expect(geometry.map({ x: -30, y: 60 }, { from, to: vertical })).toEqual({ x: -120, y: 110 });
});

test("independent axes map exact corners and invert for translated envelopes and outside points", () => {
  const from: Bounds = [-10, 30, 20, 40], to: Bounds = [100, 220, -50, -10];
  expect(geometry.map({ x: -10, y: 20 }, { from, to, mode: "independent-axes" })).toEqual({ x: 100, y: -50 });
  expect(geometry.map({ x: 30, y: 40 }, { from, to, mode: "independent-axes" })).toEqual({ x: 220, y: -10 });
  expect(geometry.map({ x: 10, y: 30 }, { from, to, mode: "independent-axes" })).toEqual({ x: 160, y: -30 });
  for (const point of [{ x: -30, y: -20 }, { x: 0, y: 25 }, { x: 90, y: 100 }]) {
    const mapped = geometry.map(point, { from, to, mode: "independent-axes" });
    expect(geometry.map(mapped, { from: to, to: from, mode: "independent-axes" })).toEqual(point);
  }
  const sameAspect: Bounds = [100, 180, -50, -10];
  for (const point of [{ x: -30, y: -20 }, { x: 0, y: 25 }, { x: 90, y: 100 }]) {
    const mapped = geometry.map(point, { from, to: sameAspect });
    expect(geometry.map(mapped, { from: sameAspect, to: from })).toEqual(point);
  }
});

test("archived world ASC envelope and Murmansk record give the pinned affine fixtures", () => {
  const from: Bounds = [-180, 180, -90, 90], to: Bounds = [-72.5, 72.5, -36.5, 36.5];
  expect(geometry.map({ x: 0, y: 0 }, { from, to })).toEqual({ x: 0, y: 0 });
  expect(geometry.map({ x: 0, y: 90 }, { from, to })).toEqual({ x: 0, y: 36.25 });
  expect(geometry.map({ x: 0, y: 90 }, { from, to, mode: "independent-axes" })).toEqual({ x: 0, y: 36.5 });
  const mapped = geometry.map({ x: 33.08604049682617, y: 68.96354675292969 }, { from, to, mode: "independent-axes" });
  expect(Math.abs(mapped.x - 13.326321866777208)).toBeLessThan(1e-12);
  expect(Math.abs(mapped.y - 27.968549516465927)).toBeLessThan(1e-12);
  expect(geometry.map({ x: 2e10, y: 3e10 }, { from: [0, 4e10, 0, 4e10], to: [0, 4, 0, 4] })).toEqual({ x: 2, y: 3 });
});

test("canonical Agent/Field positions return detached immutable XY without state or RNG effects", () => {
  const random = Random.create({ seed: 4 }), world = World.create({ x: 10, y: 10, boundary: "hard" }, { random });
  const agent = world.add(Agent.create({ energy: 2 }, { position: { x: 2, y: -1 } }));
  const grid = Grid.create({ x: 10, y: 10, boundary: "hard" }, { state: { heat: 3 } });
  world.add(grid);
  const field = grid.fieldAt({ x: 1.5, y: -0.5 })!;
  const state = random.state;
  const from: Bounds = Object.freeze([-5, 5, -5, 5]), to: Bounds = Object.freeze([0, 100, 0, 100]);
  const point = Object.freeze({ x: 2, y: -1 });
  const mapped = geometry.map(agent, { from, to });
  expect(mapped).toEqual({ x: 70, y: 40 });
  expect(mapped).not.toBe(agent); expect(Object.isFrozen(mapped)).toBe(true);
  expect(geometry.map(field, { from, to })).toEqual({ x: 65, y: 45 });
  expect(geometry.map(point, Object.freeze({ from, to }))).toEqual(mapped);
  expect(agent.energy).toBe(2); expect(field.heat).toBe(3);
  expect(world.tick.value).toBe(0); expect(random.state).toEqual(state);
  agent.move({ to: { x: 3, y: 1 } });
  expect(mapped).toEqual({ x: 70, y: 40 });
  expect(geometry.map(agent, { from, to })).toEqual({ x: 80, y: 60 });
  expect(from).toEqual([-5, 5, -5, 5]); expect(to).toEqual([0, 100, 0, 100]);
});

test("closed affine options reject malformed records and accessors without reading them", () => {
  let reads = 0;
  for (const invalid of [undefined, null, [], new Date(), {}, { from: unit }, { from: unit, to: unit, extra: 1 },
    { from: unit, to: unit, mode: null }, { from: unit, to: unit, mode: "clip" },
    { from: unit, to: unit, [Symbol()]: 1 }, { from: unit, get to() { reads++; return unit; } },
    { from: unit, to: unit, get mode() { reads++; return "uniform-centered"; } },
  ]) expect(() => geometry.map({ x: 0, y: 0 }, invalid as never)).toThrow(TypeError);
  for (const invalid of [null, [], { x: 0 }, { x: 0, y: 0, z: 0 }, { x: "0", y: 0 },
    { x: 0, y: 0, extra: 1 }, { get x() { reads++; return 0; }, y: 0 },
  ]) expect(() => geometry.map(invalid as never, { from: unit, to: unit })).toThrow(TypeError);
  expect(reads).toBe(0);
  expect(() => (geometry.map as Function)({ x: 0, y: 0 })).toThrow(TypeError);
  expect(() => (geometry.map as Function)({ x: 0, y: 0 }, { from: unit, to: unit }, {})).toThrow(TypeError);
});

test("bounds require own dense numeric array data and never invoke index getters", () => {
  let reads = 0;
  const accessor = [0, 1, 0, 1];
  Object.defineProperty(accessor, "0", { get() { reads++; return 0; } });
  const sparse = [0, 1, , 1];
  const inherited = [0, 1, , 1];
  Object.setPrototypeOf(inherited, Object.assign(Object.create(Array.prototype), { 2: 0 }));
  for (const bad of [null, {}, "0,1,0,1", new Float64Array([0, 1, 0, 1]), [0, 1, 0], [0, 1, 0, 1, 2],
    [0, "1", 0, 1], sparse, inherited, accessor, Object.assign([0, 1, 0, 1], { extra: 1 }),
  ]) {
    expect(() => geometry.map({ x: 0, y: 0 }, { from: bad as Bounds, to: unit })).toThrow(TypeError);
    expect(() => geometry.map({ x: 0, y: 0 }, { from: unit, to: bad as Bounds })).toThrow(TypeError);
  }
  expect(reads).toBe(0);
});

test("nonfinite, degenerate, overflowing and underflowing affine arithmetic rejects", () => {
  for (const invalid of [NaN, Infinity, -Infinity]) {
    expect(() => geometry.map({ x: invalid, y: 0 }, { from: unit, to: unit })).toThrow(RangeError);
    expect(() => geometry.map({ x: 0, y: invalid }, { from: unit, to: unit })).toThrow(RangeError);
    for (let index = 0; index < 4; index++) {
      const bad = [0, 1, 0, 1]; bad[index] = invalid;
      expect(() => geometry.map({ x: 0, y: 0 }, { from: bad as unknown as Bounds, to: unit })).toThrow(RangeError);
      expect(() => geometry.map({ x: 0, y: 0 }, { from: unit, to: bad as unknown as Bounds })).toThrow(RangeError);
    }
  }
  for (const bad of [[0, 0, 0, 1], [1, 0, 0, 1], [0, 1, 0, 0], [0, 1, 1, 0], [-Number.MAX_VALUE, Number.MAX_VALUE, 0, 1]] as Bounds[]) {
    expect(() => geometry.map({ x: 0, y: 0 }, { from: bad, to: unit })).toThrow(RangeError);
    expect(() => geometry.map({ x: 0, y: 0 }, { from: unit, to: bad })).toThrow(RangeError);
  }
  for (const mode of ["uniform-centered", "independent-axes"] as const) {
    expect(() => geometry.map({ x: 0, y: 0 }, { from: [0, Number.MIN_VALUE, 0, 1], to: [0, Number.MAX_VALUE, 0, 1], mode })).toThrow(RangeError);
    expect(() => geometry.map({ x: 0, y: 0 }, { from: [0, Number.MAX_VALUE, 0, 1], to: [0, Number.MIN_VALUE, 0, 1], mode })).toThrow(RangeError);
    expect(() => geometry.map({ x: Number.MAX_VALUE, y: 0 }, { from: [-Number.MAX_VALUE, 0, 0, 1], to: unit, mode })).toThrow(RangeError);
    expect(() => geometry.map({ x: Number.MAX_VALUE, y: 0 }, { from: unit, to: [0, 2, 0, 2], mode })).toThrow(RangeError);
    expect(() => geometry.map({ x: Number.MIN_VALUE, y: 0 }, { from: [0, 2, 0, 2], to: unit, mode })).toThrow(RangeError);
    expect(() => geometry.map({ x: Number.MAX_VALUE, y: 0 }, { from: unit, to: [Number.MAX_VALUE / 2, Number.MAX_VALUE, 0, 1], mode })).toThrow(RangeError);
  }
});
