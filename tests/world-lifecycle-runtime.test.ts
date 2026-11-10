import { test } from "bun:test";
import assert from "node:assert/strict";
import { Agent, World, Random, run } from "city-library";

test("typed views reject noncanonical numeric-looking extra properties", () => {
  for (const key of ["01", "00", "0001", "extra"]) {
    const view = new Uint8Array([1, 2]);
    Object.defineProperty(view, key, { value: 123, enumerable: true });
    assert.throws(() => Agent.create({ view }), TypeError);
  }
});

test("delivered spatial members reject overriding and future members reject copying", () => {
  for (const key of ["move", "rotate", "distanceTo", "directionTo", "neighbors"]) {
    const person = Agent.create({ energy: 1 });
    assert.throws(() => Object.defineProperty(person, key, { value: 123, enumerable: true }), TypeError);
    assert.equal(person.copy().energy, 1);
  }
  for (const key of ["canMove", "gradient"]) {
    const person = Agent.create({ energy: 1 });
    Object.defineProperty(person, key, { value: 123, enumerable: true });
    assert.throws(() => person.copy(), TypeError);
    assert.equal(person.energy, 1);
  }
});

test("copy preserves both allowed plain-record prototypes", () => {
  for (const state of [{ energy: 1 }, Object.assign(Object.create(null), { energy: 1 })]) {
    const person = Agent.create(state);
    assert.equal(Object.getPrototypeOf(person.copy()), Object.getPrototypeOf(person));
  }
});

test("callable iterables support the same atomic membership contract", () => {
  const world = World.create();
  const person = Agent.create();
  const source = Object.assign(function source() {}, {
    *[Symbol.iterator]() { yield person; yield person; },
  });
  assert.deepEqual(world.add(source), [person]);
  assert.equal(person.world, world);
  world.delete(source);
  assert.equal(person.world, undefined);
  assert.deepEqual(world.agents, []);
});

test("Mulberry stream has exact revision fixtures and strict no-draw rejection", () => {
  const random = Random.create();
  assert.deepEqual([random.number(), random.number(), random.number()], [0.6270739405881613, 0.002735721180215478, 0.5274470399599522]);
  assert.equal(Random.create({ seed: -1 }).seed, 0xffffffff);
  for (const seed of [NaN, Infinity, 1.5, -0x80000001, 0x100000000]) assert.throws(() => Random.create({ seed }));
  assert.throws(() => Random.create({ seed: "random" } as never));
  assert.throws(() => Random.create({ algorithm: "unsupported-interleaved-activation" } as never));
  const fresh = Random.create();
  assert.throws(() => (fresh.number as Function)({ min: 2 }));
  assert.equal(fresh.number(), Random.create().number());
});

test("closed constructor options reject accessors and malformed values", () => {
  let reads = 0;
  const accessor = Object.defineProperty({}, "random", { get() { reads += 1; } });
  assert.throws(() => World.create(accessor));
  assert.equal(reads, 0);
  for (const value of [null, 1, [], { boundary: "hard" }, { other: 1 }, { random: {} }]) assert.throws(() => World.create(value as never));
  assert.equal(Agent.create({}, { position: { x: 1, y: 2 } }).x, 1);
  assert.equal(World.create({ x: 3, y: 4 }).space?.x, 3);
  assert.throws(() => Agent.create(new Date()));
  assert.throws(() => Agent.create(() => 1));
});

test("clock operations validate amounts atomically and preserve model data", () => {
  const world = World.create();
  world.tick.advance(0.25);
  world.tick.advance(0);
  assert.equal(world.tick.value, 0.25);
  for (const value of [-1, NaN, Infinity, -Infinity, "1", null]) {
    assert.throws(() => world.tick.advance(value as never));
    assert.equal(world.tick.value, 0.25);
  }
  world.tick.advance(Number.MAX_VALUE);
  const value = world.tick.value;
  assert.throws(() => world.tick.advance(Number.MAX_VALUE));
  assert.equal(world.tick.value, value);
  world.tick.reset();
  assert.equal(world.tick.value, 0);
});

test("run preflight rejects before effects and allows nonthenable return values", () => {
  const world = World.create();
  let calls = 0;
  for (const steps of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, "1", null]) assert.throws(() => run(world, () => { calls += 1; }, steps as never));
  assert.equal(calls, 0);
  assert.throws(() => run({} as never, () => {}));
  assert.throws(() => run(world, undefined as never));
  run(world, () => 4);
  assert.equal(world.tick.value, 1);
});

test("rounded above-safe-integer tick can progress once but not twice", () => {
  const world = World.create();
  world.tick.advance(2 ** 53 + 2);
  let calls = 0;
  assert.throws(() => run(world, () => { calls += 1; }, 2));
  assert.equal(calls, 0);
  run(world, () => { calls += 1; });
  assert.equal(world.tick.value, 2 ** 53 + 4);
  assert.equal(calls, 1);
});

test("preflight binade jumps agree with literal recurrence on fractional boundaries", () => {
  for (const initial of [0, 0.1, 0.9999999999999999, 1.5, 2 ** 40 - 0.25, 2 ** 51 - 0.25, 2 ** 52 - 0.5, 2 ** 53 - 8]) {
    for (const count of [0, 1, 2, 7, 20]) {
      let expected = initial;
      let valid = true;
      for (let i = 0; i < count; i++) { const next = expected + 1; if (next <= expected) { valid = false; break; } expected = next; }
      const world = World.create();
      world.tick.advance(initial);
      let calls = 0;
      if (valid) { run(world, () => { calls++; }, count); assert.equal(world.tick.value, expected); assert.equal(calls, count); }
      else { assert.throws(() => run(world, () => { calls++; }, count)); assert.equal(calls, 0); }
    }
  }
});

test("membership preserves returned types and insertion order snapshots", () => {
  const first = Agent.create({ energy: 1 });
  const second = Agent.create({ energy: 2 });
  const world = World.create();
  const batch = world.add([first, second, first]);
  assert.ok(Object.isFrozen(batch));
  const snapshot = world.agents;
  assert.ok(Object.isFrozen(snapshot));
  world.add(first);
  assert.deepEqual(world.agents, [first, second]);
  world.delete(first);
  world.add(first);
  assert.deepEqual(world.agents, [second, first]);
  assert.deepEqual(snapshot, [first, second]);
});


test("optional standard Float16 views and explicit invalid state remain honest", () => {
  if (typeof Float16Array !== "undefined") {
    const view = new Float16Array([1.5, 2.5]);
    const person = Agent.create({ view });
    assert.notEqual(person.view.buffer, view.buffer);
    assert.deepEqual([...person.view], [1.5, 2.5]);
  }
  assert.throws(() => (Agent.create as Function)(undefined));
  assert.throws(() => (Agent.create().copy as Function)({ energy: 2 }));
});
