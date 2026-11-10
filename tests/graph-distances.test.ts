import { expect, test } from "bun:test";
import { Agent, Graph, Random, World } from "city-library";

test("all algorithms agree with independent Floyd–Warshall on mixed multigraphs", () => {
  for (let fixture = 0; fixture < 64; fixture++) {
    const graph = Graph.create<{ index: number }, { weight: number }>({ parallel: true, selfLoops: true, edgeState: { weight: 1 } });
    const nodes = Array.from({ length: 7 }, (_, index) => graph.nodes.add({ index }));
    const oracle = Array.from({ length: 7 }, (_, from) => Array.from({ length: 7 }, (_, to) => from === to ? 0 : Infinity));
    let seed = fixture + 1;
    for (let index = 0; index < 24; index++) {
      seed = Math.imul(seed, 1664525) + 1013904223 | 0;
      const from = (seed >>> 4) % 7, to = (seed >>> 12) % 7;
      const directed = Boolean(seed & 1);
      const weight = (seed >>> 20) % 5;
      graph.edges.add({ from: nodes[from]!, to: nodes[to]!, directed, state: { weight } });
      oracle[from]![to] = Math.min(oracle[from]![to]!, weight);
      if (!directed) oracle[to]![from] = Math.min(oracle[to]![from]!, weight);
    }
    for (let via = 0; via < 7; via++) for (let from = 0; from < 7; from++) for (let to = 0; to < 7; to++)
      oracle[from]![to] = Math.min(oracle[from]![to]!, oracle[from]![via]! + oracle[via]![to]!);
    for (const algorithm of ["auto", "dijkstra", "bellman-ford"] as const) {
      const all = graph.allDistances({ cost: edge => edge.weight, algorithm });
      expect([...all.keys()]).toEqual(nodes);
      for (const from of nodes) for (const to of nodes)
        expect(all.get(from)!.get(to)).toBe(Number.isFinite(oracle[from.index]![to.index]!) ? oracle[from.index]![to.index] : undefined);
    }
    const finitePairs = oracle.flatMap((row, from) => row.filter((value, to) => from !== to && Number.isFinite(value)));
    const eccentricities = oracle.map((row, from) => Math.max(0, ...row.filter((value, to) => from !== to && Number.isFinite(value))));
    const summary = graph.distanceSummary({ cost: edge => edge.weight });
    expect(summary.reachablePairCount).toBe(finitePairs.length);
    expect(summary.mean).toBe(finitePairs.length ? finitePairs.reduce((a, b) => a + b, 0) / finitePairs.length : undefined);
    expect(summary.radius).toBe(Math.min(...eccentricities));
    expect(summary.diameter).toBe(Math.max(...eccentricities));
    expect(nodes.map(node => summary.eccentricity.get(node))).toEqual(eccentricities);
    const unweighted = graph.allDistances({ algorithm: "breadth" });
    for (const algorithm of ["auto", "dijkstra", "bellman-ford"] as const) {
      const other = graph.allDistances({ algorithm });
      for (const node of nodes) expect(other.get(node)).toEqual(unweighted.get(node));
    }
  }
});

test("signed acyclic distances agree with independent dynamic recurrence", () => {
  const graph = Graph.create<{ index: number }, { weight: number }>({ parallel: true, edgeState: { weight: 1 } });
  const nodes = Array.from({ length: 24 }, (_, index) => graph.nodes.add({ index }));
  for (let from = 0; from < nodes.length; from++) for (let to = from + 1; to < nodes.length; to++)
    if ((from + to) % 3 !== 0) graph.edges.add({ from: nodes[from]!, to: nodes[to]!, directed: true, state: { weight: (from * 3 + to) % 9 - 4 } });
  const all = graph.allDistances({ algorithm: "bellman-ford", cost: edge => edge.weight });
  for (const source of nodes) {
    const expected = new Map([[source, 0]]);
    for (const node of nodes) if (expected.has(node)) for (const edge of graph.edges) if (edge.from === node) {
      const candidate = expected.get(node)! + edge.weight;
      if (candidate < (expected.get(edge.to) ?? Infinity)) expected.set(edge.to, candidate);
    }
    expect(all.get(source)).toEqual(expected);
  }
});

test("negative cycles reject exactly the affected single sources and every all-pairs query", () => {
  const graph = Graph.create<object, { weight: number }>({ parallel: true, selfLoops: true, edgeState: { weight: 1 } });
  const [a, b, c, isolated] = Array.from({ length: 4 }, () => graph.nodes.add({}));
  graph.edges.add({ from: a!, to: b!, directed: true });
  const cycle = graph.edges.add({ from: c!, to: c!, directed: true, state: { weight: -1 } });
  const options = { cost: (edge: { weight: number }) => edge.weight, algorithm: "bellman-ford" as const };
  expect(graph.distances({ from: a!, ...options })).toEqual(new Map([[a!, 0], [b!, 1]]));
  expect(graph.distances({ from: isolated!, ...options })).toEqual(new Map([[isolated!, 0]]));
  expect(() => graph.distances({ from: c!, ...options })).toThrow(RangeError);
  expect(() => graph.allDistances(options)).toThrow(RangeError);
  expect(() => graph.distances({ from: a!, cost: options.cost })).toThrow(RangeError);
  expect(() => graph.distanceSummary({ cost: options.cost })).toThrow(RangeError);
  cycle.weight = 0;
  expect(graph.distances({ from: c!, ...options })).toEqual(new Map([[c!, 0]]));
  graph.edges.add({ from: b!, to: c!, directed: true, state: { weight: -3 } });
  expect(graph.distances({ from: a!, ...options }).get(c!)).toBe(-2);
  graph.edges.add({ from: c!, to: b!, directed: true });
  expect(() => graph.distances({ from: a!, ...options })).toThrow(RangeError);
  const undirected = Graph.create({ selfLoops: true });
  const first = undirected.nodes.add({}), second = undirected.nodes.add({});
  undirected.edges.add({ from: first, to: second });
  expect(() => undirected.distances({ from: first, cost: () => -1, algorithm: "bellman-ford" })).toThrow(RangeError);
});

test("every query captures costs once in current insertion order and permits nested pure queries", () => {
  const graph = Graph.create<object, { weight: number }>({ parallel: true, edgeState: { weight: 2 } });
  const a = graph.nodes.add({}), b = graph.nodes.add({}), c = graph.nodes.add({});
  const first = graph.edges.add({ from: a, to: b });
  const deleted = graph.edges.add({ from: b, to: c });
  deleted.delete();
  const second = graph.edges.add({ from: a, to: c });
  const expected = [first, second];
  for (const query of [
    (cost: (edge: typeof first) => number) => graph.distances({ from: a, cost }),
    (cost: (edge: typeof first) => number) => graph.allDistances({ cost }),
    (cost: (edge: typeof first) => number) => graph.distanceSummary({ cost }),
  ]) {
    const seen: typeof first[] = [];
    query(edge => { seen.push(edge); expect(graph.distances({ from: a }).size).toBe(3); return edge.weight; });
    expect(seen).toEqual(expected);
  }
  const snapshot = graph.allDistances({ cost: edge => edge.weight });
  const summary = graph.distanceSummary({ cost: edge => edge.weight });
  first.weight = 8;
  first.delete();
  graph.nodes.delete(c);
  expect(snapshot.get(a)!.get(b)).toBe(2);
  expect(snapshot.get(a)!.has(c)).toBe(true);
  expect(summary.eccentricity.get(a)).toBe(2);
  expect(graph.distances({ from: a }).size).toBe(1);
  // Even untyped callers mutating detached result maps cannot change topology or future queries.
  (snapshot as Map<object, ReadonlyMap<object, number>>).clear();
  expect(graph.nodes.size).toBe(2);
  expect(graph.allDistances().size).toBe(2);
});

test("invalid options and endpoints fail before callbacks, without reading accessors", () => {
  const graph = Graph.create({ selfLoops: true });
  const node = graph.nodes.add({});
  graph.edges.add({ from: node, to: node });
  let calls = 0, reads = 0;
  const cost = () => { calls++; return 1; };
  const invalidRecords: unknown[] = [null, [], new Date(), { unexpected: 1 }, { [Symbol()]: 1 }, { get cost() { reads++; return cost; } }];
  for (const invalid of invalidRecords) {
    expect(() => graph.distances(invalid as never)).toThrow(TypeError);
    expect(() => graph.allDistances(invalid as never)).toThrow(TypeError);
    expect(() => graph.distanceSummary(invalid as never)).toThrow(TypeError);
  }
  for (const algorithm of [null, 0, "wrong"]) {
    expect(() => graph.distances({ from: node, cost, algorithm: algorithm as never })).toThrow(TypeError);
    expect(() => graph.allDistances({ cost, algorithm: algorithm as never })).toThrow(TypeError);
  }
  for (const invalid of [null, 0, {}, "cost"]) {
    expect(() => graph.distances({ from: node, cost: invalid as never })).toThrow(TypeError);
    expect(() => graph.allDistances({ cost: invalid as never })).toThrow(TypeError);
    expect(() => graph.distanceSummary({ cost: invalid as never })).toThrow(TypeError);
  }
  expect(() => graph.distances({ from: {}, cost })).toThrow(TypeError);
  expect(() => graph.distances({ from: node, cost, algorithm: "breadth" })).toThrow(TypeError);
  expect(() => graph.allDistances({ cost, algorithm: "breadth" })).toThrow(TypeError);
  expect(() => graph.distanceSummary({ cost, disconnected: "wrong" as never })).toThrow(TypeError);
  expect(calls).toBe(0);
  expect(reads).toBe(0);
});

test("bad callback values reject, exceptions retain identity and guards release after failure", () => {
  const graph = Graph.create();
  const a = graph.nodes.add({}), b = graph.nodes.add({});
  graph.edges.add({ from: a, to: b });
  for (const value of [NaN, Infinity, -Infinity, undefined, null, "1", 1n, {}, Promise.resolve(1), { then() {} }])
    expect(() => graph.distances({ from: a, cost: () => value as number })).toThrow(TypeError);
  const sentinel = { failure: true };
  try { graph.allDistances({ cost: () => { throw sentinel; } }); throw new Error("Did not throw"); }
  catch (error) { expect(error).toBe(sentinel); }
  graph.nodes.add({});
  expect(graph.nodes.size).toBe(3);
});

test("cost callbacks cannot change graph structure, including canonical Agent deletion", () => {
  const graph = Graph.create<ReturnType<typeof Agent.create>>();
  const a = graph.nodes.add(Agent.create()), b = graph.nodes.add(Agent.create()), c = graph.nodes.add(Agent.create());
  const edge = graph.edges.add({ from: a, to: b });
  for (const mutate of [
    () => graph.nodes.add(Agent.create()), () => graph.nodes.delete(b), () => edge.delete(),
    () => graph.delete(), () => graph.delete({ edgesOnly: true }), () => b.delete(),
    () => graph.edges.add({ from: a, to: c, directed: true }),
  ]) {
    expect(() => graph.distanceSummary({ cost: () => { mutate(); return 1; } })).toThrow();
    expect(graph.nodes.size).toBe(3); expect(graph.edges.size).toBe(1);
    expect(a.alive).toBe(true); expect(b.alive).toBe(true); expect(edge.alive).toBe(true);
  }
  b.delete();
  expect(graph.distances({ from: a })).toEqual(new Map([[a, 0]]));
  expect(() => graph.distances({ from: b })).toThrow(TypeError);
});

test("distance arithmetic rejects overflow in every weighted algorithm and summaries", () => {
  const graph = Graph.create();
  const a = graph.nodes.add({}), b = graph.nodes.add({}), c = graph.nodes.add({});
  graph.edges.add({ from: a, to: b, directed: true });
  graph.edges.add({ from: b, to: c, directed: true });
  for (const algorithm of ["auto", "dijkstra", "bellman-ford"] as const)
    expect(() => graph.distances({ from: a, algorithm, cost: () => Number.MAX_VALUE })).toThrow(RangeError);
  expect(() => graph.distances({ from: a, algorithm: "bellman-ford", cost: () => -Number.MAX_VALUE })).toThrow(RangeError);
  expect(() => graph.distanceSummary({ cost: () => Number.MAX_VALUE })).toThrow(RangeError);
});

test("pure public observations preserve World/RNG authority and independent instances", () => {
  const random = Random.create({ seed: 9 });
  const world = World.create({ random });
  const a = world.add(Agent.create({ energy: 1 })), b = world.add(Agent.create({ energy: 2 }));
  const graph = Graph.create<typeof a>();
  graph.nodes.add(a); graph.nodes.add(b); graph.edges.add({ from: a, to: b });
  const state = random.state;
  expect(graph.distanceSummary().mean).toBe(1);
  expect(graph.allDistances().get(a)!.get(b)).toBe(1);
  expect(graph.distances({ from: a }).keys().next().value).toBe(a);
  expect(random.state).toEqual(state); expect(world.tick.value).toBe(0);
  expect(a.energy).toBe(1); expect(b.energy).toBe(2);
  const independent = Graph.create<typeof a>();
  independent.nodes.add(a);
  expect(independent.distanceSummary().reachablePairCount).toBe(0);
  graph.delete();
  expect(independent.distances({ from: a })).toEqual(new Map([[a, 0]]));
  expect(a.alive).toBe(true);
});

test("iterative breadth and heap Dijkstra handle a long directed chain", () => {
  const graph = Graph.create<{ index: number }>({ parallel: true });
  const nodes = Array.from({ length: 12000 }, (_, index) => graph.nodes.add({ index }));
  for (let index = 1; index < nodes.length; index++) graph.edges.add({ from: nodes[index - 1]!, to: nodes[index]!, directed: true });
  expect(graph.distances({ from: nodes[0]! }).get(nodes.at(-1)!)).toBe(11999);
  expect(graph.distances({ from: nodes[0]!, cost: () => 2 }).get(nodes.at(-1)!)).toBe(23998);
});
