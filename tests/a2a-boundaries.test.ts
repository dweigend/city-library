import { test } from "bun:test";
import assert from "node:assert/strict";
import { Random, World } from "city-library";

const firstDraw = 0.6270739405881613;
const secondDraw = 0.002735721180215478;

function unchanged(random: ReturnType<typeof Random.add>, action: () => unknown) {
  const before = random.state;
  assert.throws(action);
  assert.deepEqual(random.state, before);
}

test("uniform options are closed data and invalid domains leave continuation unchanged", () => {
  const random = Random.add();
  for (const options of [
    null, [], 1, { extra: 1 }, { min: "0" }, { max: Infinity }, { min: NaN },
    { min: 2, max: 2 }, { min: 3, max: 2 }, { integer: "true" },
    { min: 0.5, max: 3, integer: true },
    { min: -Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, integer: true },
    { distribution: "exponential", mean: -1 }, { distribution: "gamma", shape: 1, rate: 1 },
    { distribution: "uniform", mean: 1 }, { bound: 2 },
  ]) unchanged(random, () => random.number(options as never));
  let reads = 0;
  const accessor = Object.defineProperty({}, "min", { get() { reads += 1; return 0; } });
  unchanged(random, () => random.number(accessor));
  assert.equal(reads, 0);
  unchanged(random, () => random.number({ [Symbol("option")]: 1 } as never));
  assert.equal(random.number(), firstDraw);
});

test("uniform adjacent representable intervals remain max-exclusive with exactly one draw", () => {
  for (const [min, max] of [[1, 1 + Number.EPSILON], [-1 - Number.EPSILON, -1]] as const) {
    const random = Random.add();
    const result = random.number({ min, max });
    assert.equal(result, min);
    assert.ok(result >= min && result < max);
    assert.equal(random.number(), secondDraw);
  }
  const wide = Random.add();
  const finite = wide.number({ min: -Number.MAX_VALUE, max: Number.MAX_VALUE });
  assert.ok(Number.isFinite(finite));
  assert.ok(finite >= -Number.MAX_VALUE && finite < Number.MAX_VALUE);
  assert.equal(wide.number(), secondDraw);
  const singleInteger = Random.add();
  assert.equal(singleInteger.number({ min: 7, max: 8, integer: true }), 7);
  assert.equal(singleInteger.number(), secondDraw);
});

test("state reads are detached frozen observations and replacement updates retained identity", () => {
  const random = Random.add({ seed: 42 });
  const world = World.add({ random });
  const before = random.state;
  const again = random.state;
  assert.notEqual(before, again);
  assert.notEqual(before.continuation, again.continuation);
  assert.ok(Object.isFrozen(before));
  assert.ok(Object.isFrozen(before.continuation));
  const supplied = {
    algorithm: "mulberry32" as const,
    seed: -1,
    continuation: {
      algorithm: "mulberry32" as const,
      revision: "agent-loom-random/1" as const,
      word: 1,
      gaussian: -0.5,
    },
  };
  random.state = supplied;
  assert.equal(world.random, random);
  assert.equal(random.seed, 0xffffffff);
  assert.equal(random.state.continuation.gaussian, -0.5);
  supplied.continuation.word = 99;
  supplied.continuation.gaussian = 7;
  assert.equal(random.state.continuation.word, 1);
  assert.equal(random.state.continuation.gaussian, -0.5);
  const copy = random.copy();
  assert.notEqual(copy, random);
  assert.deepEqual(copy.state, random.state);
  assert.equal(copy.number(), random.number());
  copy.reseed(3);
  assert.equal(copy.state.continuation.gaussian, null);
  assert.equal(random.seed, 0xffffffff);
  assert.deepEqual(before, again);
  const metadata = { seed: random.seed, algorithm: random.algorithm };
  try { Reflect.set(random, "seed", 123); } catch { /* Throwing is allowed. */ }
  try { Reflect.set(random, "algorithm", "netlogo-7.0.0"); } catch { /* Throwing is allowed. */ }
  assert.equal(random.seed, metadata.seed);
  assert.equal(random.algorithm, metadata.algorithm);
  assert.equal(world.tick.value, 0);
});

test("state closed-schema validation rejects atomically without evaluating getters", () => {
  const random = Random.add();
  const valid = random.state;
  const invalid: unknown[] = [
    null, [], {}, { ...valid, extra: 1 }, { ...valid, seed: 1.5 },
    { ...valid, seed: -0x80000001 }, { ...valid, seed: 0x100000000 },
    { ...valid, algorithm: "netlogo-7.0.0" },
    { ...valid, continuation: { ...valid.continuation, extra: 1 } },
    { ...valid, continuation: { ...valid.continuation, algorithm: "netlogo-7.0.0" } },
    { ...valid, continuation: { ...valid.continuation, revision: "unknown" } },
    { ...valid, continuation: { ...valid.continuation, word: -1 } },
    { ...valid, continuation: { ...valid.continuation, word: 0x100000000 } },
    { ...valid, continuation: { ...valid.continuation, word: 1.5 } },
    { ...valid, continuation: { ...valid.continuation, gaussian: Infinity } },
    { ...valid, continuation: { ...valid.continuation, gaussian: undefined } },
  ];
  let reads = 0;
  invalid.push(Object.defineProperty({ ...valid }, "seed", { get() { reads += 1; return 1; } }));
  invalid.push({ ...valid, continuation: Object.defineProperty({ ...valid.continuation }, "word", { get() { reads += 1; return 1; } }) });
  invalid.push({ ...valid, [Symbol("state")]: 1 });
  for (const value of invalid) unchanged(random, () => { random.state = value as typeof valid; });
  assert.equal(reads, 0);
  assert.equal(random.number(), firstDraw);
});

test("sample validates counts weights options and iterators before drawing", () => {
  const random = Random.add();
  for (const value of [null, undefined, 3, {}]) unchanged(random, () => random.sample(value as never));
  for (const options of [
    { count: -1 }, { count: 0.5 }, { count: NaN }, { count: Number.MAX_SAFE_INTEGER + 1 },
    { count: "2" }, { replace: 1 }, { order: "sorted" }, { compatibility: "unknown" },
    { weight: 2 }, { extra: 1 },
  ]) unchanged(random, () => random.sample([1, 2], options as never));
  for (const weight of [NaN, Infinity, -1, "1", null, Promise.resolve(1)]) {
    unchanged(random, () => random.sample([1, 2], { weight: () => weight as number }));
  }
  unchanged(random, () => random.sample([1, 2], { weight: () => Number.MAX_VALUE }));
  let reads = 0;
  unchanged(random, () => random.sample([1], Object.defineProperty({}, "count", { get() { reads += 1; return 1; } })));
  assert.equal(reads, 0);
  const failure = new Error("preflight failed");
  function* broken() { yield 1; throw failure; }
  assert.throws(() => random.sample(broken()), (error) => error === failure);
  assert.equal(random.number(), firstDraw);
  const before = random.state;
  let calls = 0;
  assert.throws(() => random.sample([1, 2, 3], { weight: () => { calls += 1; if (calls === 3) throw failure; return 1; } }), (error) => error === failure);
  assert.equal(calls, 3);
  assert.deepEqual(random.state, before);
});

test("zero count still preflights every weight exactly once but consumes no draw", () => {
  const random = Random.add();
  const calls: number[] = [];
  const before = random.state;
  assert.deepEqual(random.sample([1, 2, 3], { count: 0, weight: (value) => { calls.push(value); return value; } }), []);
  assert.deepEqual(calls, [1, 2, 3]);
  assert.deepEqual(random.state, before);
  unchanged(random, () => random.sample([1, 2], { count: 0, weight: () => NaN }));
  assert.deepEqual(random.sample([1, 2], { count: 3, replace: true, weight: () => 0 }), []);
  assert.deepEqual(random.state, before);
});

test("sampling treats repeated references as positions and source order is stable", () => {
  const shared = {};
  const other = {};
  const source = [shared, shared, other];
  const random = Random.add();
  const selected = random.sample(source, { count: 9 });
  assert.equal(selected.length, 3);
  assert.equal(selected.filter((value) => value === shared).length, 2);
  assert.equal(selected.filter((value) => value === other).length, 1);
  assert.deepEqual(source, [shared, shared, other]);
  const reference = Random.add();
  reference.number(); reference.number(); reference.number();
  assert.deepEqual(random.state, reference.state);
  assert.deepEqual(Random.add().sample(["a", "b", "c"], { count: 4, replace: true }), ["b", "a", "b", "c"]);
  assert.deepEqual(Random.add().sample(["a", "b", "c"], { count: 4, replace: true, order: "source" }), ["a", "b", "b", "c"]);
});

test("singleton selection and explicit legacy shuffle have distinct schedules", () => {
  const single = Random.add();
  assert.deepEqual(single.sample(["only"]), ["only"]);
  assert.equal(single.number(), secondDraw);
  const legacy = Random.add();
  assert.deepEqual(legacy.sample(["only"], { count: 1, compatibility: "legacy-shuffle" }), ["only"]);
  assert.equal(legacy.number(), firstDraw);
  const empty = Random.add();
  assert.deepEqual(empty.sample([], { count: 0, compatibility: "legacy-shuffle" }), []);
  assert.equal(empty.number(), firstDraw);
  for (const options of [
    { count: 2, compatibility: "legacy-shuffle" },
    { count: 3, replace: true, compatibility: "legacy-shuffle" },
    { count: 3, weight: () => 1, compatibility: "legacy-shuffle" },
    { count: 3, order: "draw", compatibility: "legacy-shuffle" },
  ]) {
    const random = Random.add();
    unchanged(random, () => random.sample([1, 2, 3], options as never));
  }
});

test("unsupported profiles distributions and raw branches do not draw", () => {
  const random = Random.add();
  for (const seed of [-0x80000001, 0x100000000, 1.5, NaN, Infinity]) unchanged(random, () => random.reseed(seed));
  unchanged(random, () => random.reseed("2" as never));
  for (const options of [{ kind: "int32" }, { kind: "int31", bound: 4 }, { kind: "gaussian" }, { kind: "double", bound: 2 }, {}, null]) {
    unchanged(random, () => random.raw(options as never));
  }
  assert.throws(() => Random.add({ algorithm: "netlogo-7.0.0" } as never));
  assert.throws(() => Random.add({ seed: "random" } as never));
  assert.equal(random.raw({ kind: "double" }), firstDraw);
});

test("nested local state and reseed restore predecessors without changing main checkpoint", () => {
  const random = Random.add({ seed: 1 });
  random.number();
  const main = random.state;
  const outcome = random.local(() => {
    random.reseed(9);
    random.number();
    const temporary = random.state;
    const copied = random.copy();
    assert.deepEqual(copied.state, temporary);
    assert.equal(copied.number(), random.number());
    const beforeNested = random.state;
    const nestedDraw = random.local(() => {
      assert.deepEqual(random.state, main);
      random.state = { ...main, seed: 4, continuation: { ...main.continuation, word: 4, gaussian: 0.25 } };
      assert.equal(random.seed, 4);
      return random.number();
    });
    assert.equal(typeof nestedDraw, "number");
    assert.deepEqual(random.state, beforeNested);
    return 7;
  });
  assert.equal(outcome, 7);
  assert.deepEqual(random.state, main);
  assert.equal(random.seed, 1);
});

test("local rejects asynchronous boundaries and always restores stream after observable effects", () => {
  const random = Random.add();
  const before = random.state;
  let effects = 0;
  assert.throws(() => random.local(async () => { effects += 100; }));
  assert.equal(effects, 0);
  const callable = Object.assign(() => {}, { then() {} });
  assert.throws(() => random.local(() => { effects += 1; random.number(); return callable; }));
  assert.deepEqual(random.state, before);
  const failure = new Error("then getter failed");
  const returned = Object.defineProperty({}, "then", { get() { throw failure; } });
  assert.throws(() => random.local(() => { effects += 1; random.number(); return returned; }), (error) => error === failure);
  assert.equal(effects, 2);
  assert.deepEqual(random.state, before);
  assert.equal(random.number(), firstDraw);
});
