import { test } from "bun:test";
import assert from "node:assert/strict";
import { Agent, Random, World, type RandomState } from "city-library";

test("uniform validation precedes draws and never invokes options accessors", () => {
  const random = Random.add();
  const before = random.state;
  let getters = 0;
  const accessor = Object.defineProperty({}, "min", { get() { getters++; return 0; } });
  for (const options of [accessor, { min: NaN }, { max: Infinity }, { integer: 1 }, { integer: true, min: 0.5 }, { min: 1, max: 1 }, { distribution: "exponential", mean: -1 }, { mean: 1 }, { bound: 3 }]) {
    assert.throws(() => random.number(options as never));
    assert.deepEqual(random.state, before);
  }
  assert.equal(getters, 0);
  assert.equal(random.number(), 0.6270739405881613);
});

test("uniform numeric endpoints remain finite and max exclusive with one draw", () => {
  const adjacent = Random.add();
  const min = 1 - Number.EPSILON / 2;
  assert.equal(adjacent.number({ min, max: 1 }), min);
  assert.equal(adjacent.number(), 0.002735721180215478);
  const extreme = Random.add().number({ min: -Number.MAX_VALUE, max: Number.MAX_VALUE });
  assert.ok(Number.isFinite(extreme) && extreme >= -Number.MAX_VALUE && extreme < Number.MAX_VALUE);
  assert.throws(() => Random.add().number({ integer: true, min: -Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }));
});

test("uniform integers floor the offset before adding large safe integer bounds", () => {
  const min = Number.MAX_SAFE_INTEGER - 10;
  const random = Random.add();
  const reference = Random.add();
  for (let i = 0; i < 30; i++) {
    assert.equal(random.number({ min, max: Number.MAX_SAFE_INTEGER, integer: true }), min + Math.floor(reference.number() * 10));
  }
});

test("state is deeply frozen detached continuation with atomic closed-schema validation", () => {
  const random = Random.add({ seed: 42 });
  random.number();
  const saved = random.state;
  assert.notEqual(saved, random.state);
  assert.ok(Object.isFrozen(saved) && Object.isFrozen(saved.continuation));
  for (const bad of [
    { ...saved, extra: true },
    { algorithm: "mulberry32", seed: 1 },
    { ...saved, seed: 0x100000000 },
    { ...saved, algorithm: "netlogo-7.0.0" },
    { ...saved, continuation: { ...saved.continuation, revision: "other" } },
    { ...saved, continuation: { ...saved.continuation, word: -1 } },
    { ...saved, continuation: { ...saved.continuation, gaussian: Infinity } },
    { ...saved, continuation: { ...saved.continuation, extra: 1 } },
  ]) {
    assert.throws(() => { random.state = bad as RandomState; });
    assert.deepEqual(random.state, saved);
  }
  random.state = { ...saved, seed: -1, continuation: { ...saved.continuation, gaussian: -0 } };
  assert.equal(random.seed, 0xffffffff);
  assert.ok(Object.is(random.state.continuation.gaussian, -0));
  assert.ok(Object.is(random.copy().state.continuation.gaussian, -0));
  random.reseed(1);
  assert.equal(random.state.continuation.gaussian, null);
});

test("state accessors and unsupported raw variants reject without drawing", () => {
  const random = Random.add();
  const before = random.state;
  let getters = 0;
  const bad = Object.defineProperty({}, "continuation", { get() { getters++; return before.continuation; } });
  assert.throws(() => { random.state = bad as RandomState; });
  for (const options of [{ kind: "int32" }, { kind: "gaussian" }, { kind: "double", bound: 2 }, {}]) {
    assert.throws(() => random.raw(options as never));
  }
  assert.equal(getters, 0);
  assert.deepEqual(random.state, before);
  assert.equal(random.raw({ kind: "double" }), 0.6270739405881613);
});

test("sampling preflight preserves stream on invalid weights and source errors", () => {
  const random = Random.add();
  const before = random.state;
  let calls = 0;
  assert.deepEqual(random.sample([1, 2, 3], { count: 0, weight(value) { calls++; return value; } }), []);
  assert.equal(calls, 3);
  function* broken() { yield 1; throw new Error("source failed"); }
  assert.throws(() => random.sample(broken()));
  assert.throws(() => random.sample([1, 2], { weight: () => Number.MAX_VALUE }));
  assert.throws(() => random.sample([1, 2], { weight: () => -1 }));
  assert.throws(() => random.sample([1], { count: 0, weight: () => NaN }));
  assert.throws(() => random.sample([1], { weight() { throw new Error("weight failed"); } }));
  assert.throws(() => random.sample(42 as never));
  assert.throws(() => random.sample([1], { count: Number.MAX_SAFE_INTEGER + 1 }));
  assert.deepEqual(random.state, before);
});

test("sampling preserves duplicate positions and tiny positive weights", () => {
  const person = Agent.add();
  assert.deepEqual(Random.add().sample([person, person], { count: 4 }), [person, person]);
  const source = [{ weight: Number.MAX_VALUE }, { weight: Number.MIN_VALUE }];
  assert.deepEqual(Random.add().sample(source, { count: 2, weight: (entry) => entry.weight }), source);
  const tiny = Random.add().sample(["a", "b"], { count: 2, weight: () => Number.MIN_VALUE });
  assert.equal(tiny.length, 2);
  assert.equal(new Set(tiny).size, 2);
});

test("sampling acquires and invokes a source iterator exactly once", () => {
  let reads = 0;
  let calls = 0;
  const source = Object.defineProperty({}, Symbol.iterator, {
    get() {
      reads++;
      if (reads > 1) return undefined;
      return function* () { calls++; yield "a"; yield "b"; };
    },
  }) as Iterable<string>;
  const chosen = Random.add().sample(source, { count: 2, order: "source" });
  assert.deepEqual(chosen, ["a", "b"]);
  assert.equal(reads, 1);
  assert.equal(calls, 1);
  assert.throws(() => Random.add().sample({ 0: "a", length: 1 } as never));
});

test("sampling draw schedules distinguish singleton choices from legacy shuffles", () => {
  const selected = Random.add();
  selected.sample([1]);
  assert.equal(selected.number(), 0.002735721180215478);
  const shuffled = Random.add();
  assert.deepEqual(shuffled.sample([1], { count: 1, compatibility: "legacy-shuffle" }), [1]);
  assert.deepEqual(shuffled.sample([], { count: 0, compatibility: "legacy-shuffle" }), []);
  assert.equal(shuffled.number(), 0.6270739405881613);
  const before = shuffled.state;
  assert.throws(() => shuffled.sample([1, 2], { count: 2, compatibility: "legacy-shuffle", order: "draw" }));
  assert.throws(() => shuffled.sample([1, 2], { count: 1, compatibility: "legacy-shuffle" }));
  assert.deepEqual(shuffled.state, before);
});

test("source ordering with replacement remains the same draw schedule", () => {
  const first = Random.add();
  const second = Random.add();
  const source = ["a", "b", "c"];
  const draw = first.sample(source, { replace: true, count: 10 });
  const ordered = second.sample(source, { replace: true, count: 10, order: "source" });
  assert.deepEqual(ordered, [...draw].sort());
  assert.deepEqual(first.state, second.state);
  assert.deepEqual(source, ["a", "b", "c"]);
});

test("nested local state/reseed operations preserve outermost checkpoint and predecessor", () => {
  const random = Random.add();
  random.number();
  const main = random.state;
  random.local(() => {
    random.reseed(42);
    random.number();
    const temporary = random.state;
    const copy = random.copy();
    assert.deepEqual(copy.state, temporary);
    assert.equal(random.local(() => random.number()), 0.002735721180215478);
    assert.deepEqual(random.state, temporary);
    random.state = { ...temporary, seed: 9, continuation: { ...temporary.continuation, word: 100 } };
    assert.equal(random.local(() => random.number()), 0.002735721180215478);
  });
  assert.deepEqual(random.state, main);
});

test("local rejects async/thenables at correct boundary and always releases temporary state", () => {
  const random = Random.add();
  const before = random.state;
  let effects = 0;
  assert.throws(() => random.local(async () => { effects++; }));
  assert.equal(effects, 0);
  const callableThenable = Object.assign(() => {}, { then() {} });
  assert.throws(() => random.local(() => { effects++; random.number(); return callableThenable; }));
  const failure = new Error("then getter");
  const result = Object.defineProperty({}, "then", { get() { throw failure; } });
  assert.throws(() => random.local(() => { effects++; random.number(); return result; }), (error) => error === failure);
  assert.equal(effects, 2);
  assert.deepEqual(random.state, before);
  assert.equal(random.local(() => random.number()), 0.6270739405881613);
  assert.deepEqual(random.state, before);
});

test("continuation writes preserve Random identity retained by World", () => {
  const random = Random.add();
  const world = World.add({ random });
  const saved = random.state;
  const expected = random.number();
  random.state = saved;
  assert.equal(world.random, random);
  assert.equal(world.random.number(), expected);
  assert.equal(world.tick.value, 0);
  assert.throws(() => { (random as unknown as { algorithm: string }).algorithm = "other"; });
  assert.throws(() => { (random as unknown as { seed: number }).seed = 3; });
});
