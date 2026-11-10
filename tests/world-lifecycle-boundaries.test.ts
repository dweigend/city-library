import { test } from "bun:test";
import assert from "node:assert/strict";
import { Agent, Random, World, run } from "city-library";

test("prototype spellings are own model data without prototype assignment", () => {
  const state = JSON.parse('{"__proto__":{"polluted":true},"constructor":"resident","energy":3}') as {
    __proto__: { polluted: boolean };
    constructor: string;
    energy: number;
  };
  const person = Agent.create(state);
  assert.ok(Object.hasOwn(person, "__proto__"));
  assert.ok(Object.hasOwn(person, "constructor"));
  assert.deepEqual(person.__proto__, { polluted: true });
  assert.equal(person.constructor, "resident");
  assert.equal(({} as { polluted?: boolean }).polluted, undefined);
  const copy = person.copy();
  assert.deepEqual(copy.__proto__, { polluted: true });
  assert.notEqual(copy.__proto__, person.__proto__);
  assert.equal(copy.constructor, "resident");
});

test("root cycles and aliases are preserved within each supported-data clone", () => {
  interface State { energy: number; self?: State; list: unknown[]; }
  const state: State = { energy: 7, list: [] };
  state.self = state;
  state.list.push(state, state.list);
  const person = Agent.create(state);
  assert.notEqual(person.self, state);
  assert.equal(person.self?.self, person.self);
  assert.equal(person.self?.list, person.list);
  assert.equal(person.list[0], person.self);
  assert.equal(person.list[1], person.list);
  const copy = person.copy();
  assert.notEqual(copy.self, person.self);
  assert.equal(copy.self?.self, copy.self);
  assert.equal(copy.self?.list, copy.list);
  assert.equal(copy.list[0], copy.self);
  assert.equal(copy.list[1], copy.list);
});

test("Map Set Date RegExp sparse arrays and scalar identities survive copying", () => {
  const shared = { score: 3 };
  const sparse = new Array<unknown>(3);
  sparse[2] = shared;
  const expression = /city/gi;
  expression.lastIndex = 2;
  const date = new Date("2026-11-05T00:00:00.000Z");
  const person = Agent.create({
    shared,
    map: new Map<unknown, unknown>([[shared, sparse]]),
    set: new Set([shared]),
    date,
    dateAlias: date,
    expression,
    sparse,
    negativeZero: -0,
    missing: undefined,
    nothing: null,
    large: 2n ** 80n,
  });
  assert.equal(person.map.get(person.shared), person.sparse);
  assert.ok(person.set.has(person.shared));
  assert.notEqual(person.date, date);
  assert.equal(person.date, person.dateAlias);
  assert.equal(person.date.getTime(), date.getTime());
  assert.notEqual(person.expression, expression);
  assert.equal(person.expression.source, "city");
  assert.equal(person.expression.flags, "gi");
  assert.equal(person.expression.lastIndex, 2);
  assert.equal(person.sparse.length, 3);
  assert.equal(0 in person.sparse, false);
  assert.equal(1 in person.sparse, false);
  assert.equal(person.sparse[2], person.shared);
  assert.ok(Object.is(person.negativeZero, -0));
  assert.ok(Object.hasOwn(person, "missing"));
  assert.equal(person.missing, undefined);
  assert.equal(person.nothing, null);
  assert.equal(person.large, 2n ** 80n);
});

test("buffer views preserve offsets and shared backing inside fresh clones", () => {
  const buffer = new ArrayBuffer(24);
  const bytes = new Uint8Array(buffer);
  bytes.set([1, 2, 3, 4], 4);
  const typed = new Uint16Array(buffer, 4, 3);
  const view = new DataView(buffer, 2, 12);
  const person = Agent.create({ buffer, bytes, typed, view, typedAlias: typed });
  assert.notEqual(person.buffer, buffer);
  assert.equal(person.bytes.buffer, person.buffer);
  assert.equal(person.typed.buffer, person.buffer);
  assert.equal(person.view.buffer, person.buffer);
  assert.equal(person.typedAlias, person.typed);
  assert.equal(person.typed.byteOffset, 4);
  assert.equal(person.typed.length, 3);
  assert.equal(person.view.byteOffset, 2);
  assert.equal(person.view.byteLength, 12);
  assert.deepEqual([...person.bytes], [...bytes]);
  person.bytes[4] = 99;
  assert.equal(bytes[4], 1);
  assert.equal(person.view.getUint8(2), 99);
  const copy = person.copy();
  assert.notEqual(copy.buffer, person.buffer);
  assert.equal(copy.typed.buffer, copy.buffer);
  assert.equal(copy.view.buffer, copy.buffer);
});

test("symbols and accessors reject without invoking getters", () => {
  let reads = 0;
  const accessor = Object.defineProperty({}, "energy", {
    enumerable: true,
    get() { reads += 1; return 10; },
  });
  assert.throws(() => Agent.create(accessor));
  assert.throws(() => Agent.create({ nested: accessor }));
  assert.equal(reads, 0);
  assert.throws(() => Agent.create({ [Symbol("private")]: 1 }));
  const array = [1];
  Object.defineProperty(array, "extra", { value: 2 });
  assert.throws(() => Agent.create({ array }));
});

test("unsupported resources and malformed supported values reject", () => {
  class CustomRecord { energy = 1; }
  const invalidValues: unknown[] = [
    NaN, Infinity, -Infinity,
    () => 1, Symbol("value"), new WeakMap(), new WeakSet(),
    new Error("resource"), new CustomRecord(), Promise.resolve(1), new Date(NaN),
    new SharedArrayBuffer(8),
  ];
  for (const value of invalidValues) {
    assert.throws(() => Agent.create({ value }));
  }
  const invalidExpression = /x/;
  invalidExpression.lastIndex = -1;
  assert.throws(() => Agent.create({ invalidExpression }));
  const detached = new ArrayBuffer(8);
  structuredClone(detached, { transfer: [detached] });
  assert.throws(() => Agent.create({ detached }));
  assert.throws(() => Agent.create({ id: "model-id" }));
  assert.throws(() => Agent.create({ move: 2 }));
  assert.doesNotThrow(() => Agent.create({ nested: { id: "model-id", move: 2 } }));
});

test("framework identities remain original and deleted references reject", () => {
  const world = World.create();
  const random = Random.create();
  const friend = Agent.create({ energy: 1 });
  const person = Agent.create({ worldReference: world, randomReference: random, friend });
  assert.equal(person.worldReference, world);
  assert.equal(person.randomReference, random);
  assert.equal(person.friend, friend);
  const copy = person.copy();
  assert.equal(copy.worldReference, world);
  assert.equal(copy.randomReference, random);
  assert.equal(copy.friend, friend);
  assert.equal(friend.world, undefined);
  friend.delete();
  assert.throws(() => Agent.create({ friend }));
  assert.throws(() => person.copy());
});

test("throwing iterators cannot partially attach or detach", () => {
  const world = World.create();
  const person = Agent.create();
  const companion = Agent.create();
  function* broken() {
    yield person;
    throw new Error("iteration failed");
  }
  assert.throws(() => world.add(broken()));
  assert.equal(person.world, undefined);
  assert.deepEqual(world.agents, []);
  world.add(new Set([person, companion]));
  assert.throws(() => world.delete(broken()));
  assert.deepEqual(world.agents, [person, companion]);
  assert.equal(person.world, world);
});

test("foreign or deleted entries cannot partially change a membership batch", () => {
  const home = World.create();
  const other = World.create();
  const local = Agent.create();
  const foreign = Agent.create();
  const dead = Agent.create();
  dead.delete();
  home.add(local);
  other.add(foreign);
  assert.throws(() => home.delete([local, foreign]));
  assert.equal(local.world, home);
  assert.equal(foreign.world, other);
  const newcomer = Agent.create();
  assert.throws(() => home.add([newcomer, dead]));
  assert.equal(newcomer.world, undefined);
  assert.deepEqual(home.agents, [local]);
  const absent = Agent.create();
  assert.doesNotThrow(() => home.delete(absent));
});

function attemptSet(object: object, property: PropertyKey, value: unknown) {
  try { Reflect.set(object, property, value); } catch { /* Throwing is permitted. */ }
}

test("readonly bookkeeping cannot be overwritten through ordinary assignment", () => {
  const person = Agent.create({ energy: 10 });
  const world = World.create();
  world.add(person);
  const id = person.id;
  const tick = world.tick;
  const random = world.random;
  attemptSet(person, "id", "replacement");
  attemptSet(person, "alive", false);
  attemptSet(person, "world", undefined);
  attemptSet(person, "x", 42);
  attemptSet(world, "tick", {});
  attemptSet(world, "random", {});
  attemptSet(world.tick, "value", 99);
  attemptSet(world, "agents", []);
  assert.equal(person.id, id);
  assert.equal(person.alive, true);
  assert.equal(person.world, world);
  assert.equal(person.x, 0);
  assert.equal(world.tick, tick);
  assert.equal(world.random, random);
  assert.equal(world.tick.value, 0);
  assert.deepEqual(world.agents, [person]);
});

test("async declaration and thenable returns reject at their specified boundaries", () => {
  const world = World.create();
  let effects = 0;
  const declaredAsync = async () => { effects += 1; };
  assert.throws(() => run(world, declaredAsync as unknown as () => void));
  assert.equal(effects, 0);
  const returnsThenable = () => {
    effects += 1;
    return { then() { throw new Error("must not await or dispatch then"); } };
  };
  assert.throws(() => run(world, returnsThenable as unknown as () => void));
  assert.equal(effects, 1);
  assert.equal(world.tick.value, 0);
  run(world, () => { effects += 1; });
  assert.equal(world.tick.value, 1);
  assert.equal(effects, 2);
});

test("active World clock locks do not lock independent Worlds", () => {
  const world = World.create();
  const other = World.create();
  run(world, () => {
    assert.throws(() => world.tick.advance());
    assert.throws(() => world.tick.reset());
    assert.throws(() => run(world, () => {}));
    run(other, () => {});
    other.tick.advance(0.5);
  });
  assert.equal(world.tick.value, 1);
  assert.equal(other.tick.value, 1.5);
});

test("run validates the full representable clock recurrence before model effects", () => {
  const world = World.create();
  let effects = 0;
  world.tick.advance(Number.MAX_SAFE_INTEGER);
  assert.throws(() => run(world, () => { effects += 1; }, 2));
  assert.equal(effects, 0);
  assert.equal(world.tick.value, Number.MAX_SAFE_INTEGER);
  run(world, () => { effects += 1; });
  assert.equal(effects, 1);
  assert.equal(world.tick.value, 2 ** 53);
  assert.throws(() => run(world, () => { effects += 1; }));
  assert.equal(effects, 1);
  run(world, () => { effects += 1; }, 0);
  assert.equal(effects, 1);

  // Tick need not be a safe integer: the specified rounded recurrence is authoritative.
  const fractional = World.create();
  fractional.tick.advance(2 ** 52 - 0.5);
  const expected = (fractional.tick.value + 1) + 1;
  run(fractional, () => {}, 2);
  assert.equal(fractional.tick.value, expected);
});

test("callable thenables and throwing then getters reject without stranding the run lock", () => {
  const world = World.create();
  let effects = 0;
  const callable = Object.assign(() => {}, { then() {} });
  assert.throws(() => run(world, (() => {
    effects += 1;
    return callable;
  }) as unknown as () => void));
  assert.equal(effects, 1);
  assert.equal(world.tick.value, 0);

  const failure = new Error("then getter failed");
  const returned = Object.defineProperty({}, "then", {
    get() { throw failure; },
  });
  assert.throws(() => run(world, () => returned), (error) => error === failure);
  assert.equal(world.tick.value, 0);
  run(world, () => { effects += 1; });
  assert.equal(world.tick.value, 1);
  assert.equal(effects, 2);
});

test("copy validates unsupported values introduced by ordinary later assignments", () => {
  const person = Agent.create<{ value: unknown }>({ value: 1 });
  person.value = () => 1;
  assert.throws(() => person.copy());
  assert.equal(typeof person.value, "function");
  person.value = { score: 3 };
  assert.doesNotThrow(() => person.copy());
});
