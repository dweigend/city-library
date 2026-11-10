import { describe, expect, test } from "bun:test";
import { Agent, Agenda, EventTrace, Random, Resource, ServiceQueue, Signal, Store, TimeWeighted, World } from "city-library";

describe("DES causal execution through public imports", () => {
  test("the last event leaves room for a causal successor before the horizon", () => {
    const agenda = Agenda.create<string>();
    agenda.add({ at: 2, data: "arrival" });
    expect(agenda.next({ until: 10 })?.data).toBe("arrival");
    expect(agenda.time).toBe(2);
    agenda.add({ at: 3, data: "departure" });
    expect(agenda.next({ until: 10 })?.at).toBe(3);
    expect(agenda.time).toBe(3);
    expect(agenda.next({ until: 10 })).toBeUndefined();
    expect(agenda.time).toBe(10);
  });

  test("priority precedes insertion ties while batch budget preserves remaining work", () => {
    const agenda = Agenda.create<string>();
    for (const [priority, data] of [[1, "last"], [-2, "first"], [-2, "second"]] as const)
      agenda.add({ at: 0.5, priority, data });
    expect(agenda.advance({ until: 9, maxEvents: 2 }).map(event => event.data)).toEqual(["first", "second"]);
    expect(agenda.time).toBe(0.5);
    expect(agenda.size).toBe(1);
    expect(agenda.advance({ until: 9, maxEvents: 1 }).map(event => event.data)).toEqual(["last"]);
    expect(agenda.time).toBe(9);
  });

  test("a caller's finite limit bounds a zero-delay chain without discarding it", () => {
    const agenda = Agenda.create<number>();
    agenda.add({ at: 0, data: 0 });
    for (let count = 0; count < 7; count++) {
      const event = agenda.next({ until: 1 });
      expect(event?.data).toBe(count);
      agenda.add({ at: agenda.time, data: count + 1 });
    }
    expect(agenda.time).toBe(0);
    expect(agenda.size).toBe(1);
    expect(agenda.next({ until: 1 })?.data).toBe(7);
    expect(agenda.time).toBe(0);
  });

  test("invalid horizons, priorities and budgets leave pending events intact", () => {
    const agenda = Agenda.create<number>();
    agenda.add({ at: 2, data: 1 });
    for (const until of [-1, NaN, Infinity]) expect(() => agenda.next({ until })).toThrow();
    for (const maxEvents of [0, -1, 0.5, Infinity]) expect(() => agenda.advance({ until: 3, maxEvents })).toThrow();
    expect(() => agenda.add({ at: 1, data: 2, priority: 0.5 })).toThrow();
    expect(agenda.time).toBe(0);
    expect(agenda.size).toBe(1);
    expect(agenda.next({ until: 2 })?.data).toBe(1);
  });

  test("default batch budget is finite and exact-horizon behavior remains explicit", () => {
    const agenda = Agenda.create<number>();
    for (let index = 0; index < 1001; index++) agenda.add({ at: 0, data: index });
    expect(agenda.advance({ until: 5 })).toHaveLength(1000);
    expect(agenda.time).toBe(0);
    expect(agenda.size).toBe(1);
    expect(agenda.next({ until: 5 })?.data).toBe(1000);
    expect(agenda.time).toBe(0);
    expect(agenda.next({ until: 5 })).toBeUndefined();
    expect(agenda.time).toBe(5);
  });

  test("Agenda rejects accessor options without invoking them", () => {
    const agenda = Agenda.create<number>();
    let reads = 0;
    const invalid = { get until() { reads++; return 5; } };
    expect(() => agenda.next(invalid)).toThrow(TypeError);
    expect(reads).toBe(0);
    expect(agenda.time).toBe(0);
    const wrongType = { until: "5" } as unknown as { until: number };
    expect(() => agenda.next(wrongType)).toThrow(TypeError);
    expect(() => agenda.next({ until: Infinity })).toThrow(RangeError);
  });

  test("forged and foreign cancellation handles cannot remove an issued event", () => {
    const agenda = Agenda.create<number>();
    const handle = agenda.add({ at: 1, data: 5 });
    expect(() => agenda.delete({ ...handle })).toThrow();
    expect(() => Agenda.create<number>().delete(handle)).toThrow();
    expect(agenda.size).toBe(1);
    agenda.delete(handle);
    agenda.delete(handle);
    expect(agenda.size).toBe(0);
  });

  test("event payloads detach plain data while retaining canonical Agents", () => {
    const person = Agent.create({ label: "resident" });
    const payload = { nested: { value: 1 }, person };
    const agenda = Agenda.create<typeof payload>();
    agenda.add({ at: 1, data: payload });
    payload.nested.value = 99;
    const event = agenda.next({ until: 2 });
    expect(event?.data.nested.value).toBe(1);
    expect(event?.data.person).toBe(person);
    expect(() => agenda.add({ at: 1, data: { nested: { value: Infinity }, person } })).toThrow();
    expect(agenda.size).toBe(0);
  });

  test("World attachment is atomic and does not couple its fractional tick to Agenda", () => {
    const first = World.create();
    const other = World.create();
    const fresh = Agenda.create();
    const owned = Agenda.create();
    other.add(owned);
    expect(() => first.add([fresh, owned])).toThrow();
    expect(first.agendas).toEqual([]);
    first.add(fresh);
    first.tick.advance(0.25);
    fresh.next({ until: 3.5 });
    expect(first.tick.value).toBe(0.25);
    first.delete(fresh);
    expect(fresh.time).toBe(3.5);
    other.add(fresh);
    expect(other.agendas).toEqual([owned, fresh]);
  });
});

describe("single-owner queue, capacity and lifecycle contracts", () => {
  test("priority queue has stable ties and independently issued handles", () => {
    const queue = ServiceQueue.create<string>({ policy: "priority" });
    const first = queue.add("first", { priority: -1 });
    queue.add("last", { priority: 2 });
    queue.add("second", { priority: -1 });
    expect(queue.entries).toEqual(["first", "second", "last"]);
    expect(() => queue.delete({ ...first })).toThrow();
    expect(() => ServiceQueue.create<string>().delete(first)).toThrow();
    queue.delete(first);
    queue.delete(first);
    expect(queue.take()).toBe("second");
  });

  test("strict head of line survives shrink, growth and cancellation", () => {
    const capacity = Resource.create<string>({ capacity: 3 });
    const holder = capacity.request({ owner: "holder", units: 2 });
    const large = capacity.request({ owner: "large", units: 3 });
    const small = capacity.request({ owner: "small", units: 1 });
    expect(capacity.used).toBe(2);
    expect(small.status).toBe("waiting");
    expect(() => capacity.setCapacity(1)).toThrow();
    expect(capacity.capacity).toBe(3);
    capacity.setCapacity(1, { occupied: "retain" });
    expect(capacity.available).toBe(0);
    capacity.release(holder);
    expect(large.status).toBe("waiting");
    expect(small.status).toBe("waiting");
    capacity.cancel(large);
    expect(small.status).toBe("granted");
    expect(capacity.used).toBe(1);
    capacity.cancel(small);
    expect(capacity.used).toBe(0);
  });

  test("priority admits stable lower-priority-number waiters without preempting holders", () => {
    const capacity = Resource.create<string>({ capacity: 1, policy: "priority" });
    const holder = capacity.request({ owner: "holder", priority: 99 });
    const later = capacity.request({ owner: "later", priority: 0 });
    const earlier = capacity.request({ owner: "earlier", priority: -1 });
    const tie = capacity.request({ owner: "tie", priority: -1 });
    expect(holder.status).toBe("granted");
    capacity.release(holder);
    expect(earlier.status).toBe("granted");
    expect(capacity.waiting).toEqual([tie, later]);
    capacity.cancel(earlier);
    expect(tie.status).toBe("granted");
  });

  test("forged requests and invalid units cannot mutate occupancy", () => {
    const capacity = Resource.create<string>({ capacity: 1 });
    const holder = capacity.request({ owner: "holder" });
    expect(() => capacity.cancel({ ...holder })).toThrow();
    expect(() => Resource.create<string>({ capacity: 1 }).release(holder)).toThrow();
    for (const units of [0, -1, 0.5, 2, Infinity]) expect(() => capacity.request({ owner: "bad", units })).toThrow();
    Reflect.set(holder, "status", "released");
    expect(holder.status).toBe("granted");
    expect(capacity.used).toBe(1);
    capacity.release(holder);
    capacity.release(holder);
    expect(capacity.used).toBe(0);
  });

  test("all Agent participations must end before atomic deletion can succeed", () => {
    const person = Agent.create({ label: "resident" });
    const world = World.create();
    world.add(person);
    const queue = ServiceQueue.create<typeof person>();
    const queued = queue.add(person);
    const capacity = Resource.create<typeof person>({ capacity: 1 });
    const held = capacity.request({ owner: person });
    expect(() => person.delete()).toThrow();
    expect(person.alive).toBe(true);
    expect(world.agents).toEqual([person]);
    world.delete(person);
    expect(() => person.delete()).toThrow();
    queue.delete(queued);
    expect(() => person.delete()).toThrow();
    capacity.cancel(held);
    person.delete();
    expect(person.alive).toBe(false);
    expect(() => queue.add(person)).toThrow();
    expect(() => capacity.request({ owner: person })).toThrow();
  });

  test("duplicate queue participation protects the Agent until the last entry leaves", () => {
    const person = Agent.create({ label: "same resident" });
    const queue = ServiceQueue.create<typeof person>();
    queue.add(person);
    queue.add(person);
    expect(queue.take()).toBe(person);
    expect(() => person.delete()).toThrow();
    expect(person.alive).toBe(true);
    expect(queue.take()).toBe(person);
    person.delete();
    expect(person.alive).toBe(false);
  });

  test("multiple requests by one Agent retain independent lifecycle participation", () => {
    const person = Agent.create({ label: "same requester" });
    const capacity = Resource.create<typeof person>({ capacity: 1 });
    const first = capacity.request({ owner: person });
    const second = capacity.request({ owner: person });
    capacity.cancel(first);
    expect(second.status).toBe("granted");
    expect(() => person.delete()).toThrow();
    capacity.release(second);
    person.delete();
    expect(capacity.used).toBe(0);
  });
});

describe("bounded producer-consumer transfer", () => {
  test("undefined is a completed payload when get status is received", () => {
    const store = Store.create<undefined>({ capacity: 1 });
    const consumer = store.get();
    expect(consumer.status).toBe("waiting");
    const producer = store.put(undefined);
    expect(producer.status).toBe("stored");
    expect(consumer.status).toBe("received");
    expect(consumer.value).toBeUndefined();
    expect(store.items).toEqual([]);
    store.cancelGet(consumer);
    store.cancelPut(producer);
    expect(consumer.status).toBe("received");
    expect(producer.status).toBe("stored");
  });

  test("waiting producer cancellation preserves FIFO and never removes a completed item", () => {
    const store = Store.create<string>({ capacity: 1 });
    const first = store.put("first");
    const cancelled = store.put("cancelled");
    const next = store.put("next");
    store.cancelPut(cancelled);
    store.cancelPut(first);
    expect(store.take()).toBe("first");
    expect(next.status).toBe("stored");
    expect(store.take()).toBe("next");
    expect(store.take()).toBeUndefined();
  });

  test("waiting consumer cancellation preserves FIFO and receiver provenance", () => {
    const store = Store.create<string>({ capacity: 1 });
    const cancelled = store.get();
    const next = store.get();
    expect(() => store.cancelGet({ ...next })).toThrow();
    expect(() => Store.create<string>({ capacity: 1 }).cancelGet(next)).toThrow();
    store.cancelGet(cancelled);
    store.put("next");
    expect(cancelled.status).toBe("cancelled");
    expect(next.status).toBe("received");
    expect(next.value).toBe("next");
  });

  test("stored and blocked Agent values both protect deletion until removal", () => {
    const first = Agent.create({ number: 1 });
    const second = Agent.create({ number: 2 });
    const store = Store.create<typeof first>({ capacity: 1 });
    store.put(first);
    const blocked = store.put(second);
    expect(() => first.delete()).toThrow();
    expect(() => second.delete()).toThrow();
    store.cancelPut(blocked);
    second.delete();
    expect(store.take()).toBe(first);
    first.delete();
    expect(() => store.put(first)).toThrow();
  });

  test("duplicate stored and blocked Agent values protect until the final consumption", () => {
    const item = Agent.create({ number: 1 });
    const store = Store.create<typeof item>({ capacity: 1 });
    store.put(item);
    const blocked = store.put(item);
    expect(store.take()).toBe(item);
    expect(blocked.status).toBe("stored");
    expect(() => item.delete()).toThrow();
    expect(store.take()).toBe(item);
    item.delete();
    expect(item.alive).toBe(false);
  });
});

describe("explicit conditions and observation", () => {
  test("Signal evaluates every proposed predicate before committing satisfaction", () => {
    const signal = Signal.create(0);
    const satisfied = signal.wait(value => value === 1);
    const error = new Error("predicate failed");
    signal.wait(value => { if (value === 1) throw error; return false; });
    expect(() => signal.set(1)).toThrow(error);
    expect(signal.value).toBe(0);
    expect(satisfied.status).toBe("waiting");
  });

  test("Signal rejects asynchronous predicates instead of treating Promise as true", () => {
    const signal = Signal.create(0);
    const asyncPredicate = (async () => true) as unknown as (value: number) => boolean;
    expect(() => signal.wait(asyncPredicate)).toThrow();
    const thenablePredicate = (() => Promise.resolve(true)) as unknown as (value: number) => boolean;
    expect(() => signal.wait(thenablePredicate)).toThrow();
    expect(signal.value).toBe(0);
  });

  test("a predicate that becomes asynchronous cannot partially commit Signal.set", () => {
    const signal = Signal.create(0);
    const first = signal.wait(value => value === 1);
    const changing = ((value: number) => value === 0 ? false : Promise.resolve(true)) as unknown as (value: number) => boolean;
    const second = signal.wait(changing);
    expect(() => signal.set(1)).toThrow();
    expect(signal.value).toBe(0);
    expect(first.status).toBe("waiting");
    expect(second.status).toBe("waiting");
  });

  test("Signal satisfaction is one shot and issued cancellation is receiver-specific", () => {
    const signal = Signal.create(0);
    const immediate = signal.wait(value => value === 0);
    const delayed = signal.wait(value => value === 1);
    expect(immediate.status).toBe("satisfied");
    expect(() => signal.cancel({ ...delayed })).toThrow();
    expect(() => Signal.create(0).cancel(delayed)).toThrow();
    signal.set(1);
    signal.set(0);
    signal.cancel(delayed);
    expect(delayed.status).toBe("satisfied");
  });

  test("time weighting uses explicit intervals, equal-time replacement and pure reads", () => {
    const weighted = TimeWeighted.create({ at: 2, value: 3 });
    weighted.set({ at: 5, value: 9 });
    weighted.set({ at: 5, value: 1 });
    const expected = { duration: 8, integral: 14, mean: 1.75 };
    expect(weighted.read({ until: 10 })).toEqual(expected);
    expect(weighted.read({ until: 10 })).toEqual(expected);
    expect(() => weighted.set({ at: 4, value: 100 })).toThrow();
    expect(() => weighted.set({ at: 6, value: Infinity })).toThrow();
    expect(weighted.read({ until: 10 })).toEqual(expected);
    expect(TimeWeighted.create({ value: 1 }).read({ until: 0 })).toEqual({ duration: 0, integral: 0, mean: undefined });
  });

  test("nonfinite time-weighted arithmetic rejects without publishing a partial set", () => {
    const weighted = TimeWeighted.create({ value: Number.MAX_VALUE });
    expect(() => weighted.set({ at: 2, value: 0 })).toThrow();
    expect(weighted.read({ until: 0 })).toEqual({ duration: 0, integral: 0, mean: undefined });
  });

  test("event diagnostics permit equal timestamps and detach insertion and read data", () => {
    const trace = EventTrace.create<{ nested: { count: number } }>({ capacity: 2 });
    const value = { nested: { count: 1 } };
    trace.record({ at: 1, value });
    value.nested.count = 99;
    const snapshot = trace.read();
    expect(snapshot[0]?.value.nested.count).toBe(1);
    Reflect.set(snapshot[0]!.value.nested, "count", 88);
    expect(trace.read()[0]?.value.nested.count).toBe(1);
    trace.record({ at: 1, value: { nested: { count: 2 } } });
    trace.record({ at: 2, value: { nested: { count: 3 } } });
    expect(trace.read().map(event => event.value.nested.count)).toEqual([2, 3]);
    expect(() => trace.record({ at: 1, value })).toThrow();
    expect(trace.read().map(event => event.at)).toEqual([1, 2]);
  });
});

describe("explicit random draws", () => {
  test("nonconstant triangular draws use one uniform and the inverse distribution", () => {
    for (const mode of [-3, 1, 9]) {
      const random = Random.create({ seed: 41 });
      const copy = random.copy();
      const uniform = copy.number();
      const min = -3;
      const max = 9;
      const expected = uniform < (mode - min) / (max - min)
        ? min + Math.sqrt(uniform * (max - min) * (mode - min))
        : max - Math.sqrt((1 - uniform) * (max - min) * (max - mode));
      const sampled = random.number({ distribution: "triangular", min, mode, max });
      expect(sampled).toBeCloseTo(expected, 12);
      expect(random.state).toEqual(copy.state);
    }
  });

  test("invalid and degenerate distribution calls preserve complete Random continuation", () => {
    const random = Random.create({ seed: 31 });
    random.number({ distribution: "normal" });
    const before = random.state;
    for (const probability of [0, 1]) expect(random.number({ distribution: "bernoulli", probability })).toBe(probability);
    expect(random.number({ distribution: "triangular", min: 4, mode: 4, max: 4 })).toBe(4);
    expect(() => random.number({ distribution: "gamma", shape: -1, rate: 2 })).toThrow();
    expect(() => random.number({ distribution: "triangular", min: 0, mode: 2, max: 1 })).toThrow();
    expect(() => random.number({ distribution: "bernoulli", probability: NaN })).toThrow();
    expect(random.state).toEqual(before);
  });

  test("copied cached streams reproduce both gamma regimes without sharing state", () => {
    const random = Random.create({ seed: 37 });
    random.number({ distribution: "normal" });
    const copy = random.copy();
    for (const shape of [0.25, 1, 4]) {
      const sampled = random.number({ distribution: "gamma", shape, rate: 2 });
      expect(Number.isFinite(sampled)).toBe(true);
      expect(sampled).toBeGreaterThanOrEqual(0);
      expect(copy.number({ distribution: "gamma", shape, rate: 2 })).toBe(sampled);
    }
    expect(copy.state).toEqual(random.state);
    const checkpoint = copy.state;
    random.number();
    expect(copy.state).toEqual(checkpoint);
  });

  test("gamma fixed-seed moment sanity is separate from exact conservation fixtures", () => {
    const count = 20_000;
    const rate = 2;
    for (const shape of [0.5, 2, 5]) {
      const random = Random.create({ seed: 47 + shape * 2 });
      let sum = 0;
      let squaredSum = 0;
      for (let index = 0; index < count; index++) {
        const value = random.number({ distribution: "gamma", shape, rate });
        sum += value;
        squaredSum += value * value;
      }
      const mean = sum / count;
      const variance = (squaredSum - count * mean * mean) / (count - 1);
      const targetMean = shape / rate;
      const targetVariance = shape / (rate * rate);
      // Predeclared broad six-standard-error envelopes detect parameter/shape mistakes.
      const meanTolerance = 6 * Math.sqrt(targetVariance / count);
      const varianceTolerance = 6 * targetVariance * Math.sqrt((2 + 6 / shape) / count);
      expect(Math.abs(mean - targetMean)).toBeLessThan(meanTolerance);
      expect(Math.abs(variance - targetVariance)).toBeLessThan(varianceTolerance);
    }
  });
});
