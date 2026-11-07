import { expect, test } from "bun:test";
import { Agent, Graph, Random, World } from "city-library";

type Fraction = readonly [bigint, bigint];
function fraction(n: bigint, d = 1n): Fraction {
  let a = n, b = d;
  while (b) [a, b] = [b, a % b];
  return n === 0n ? [0n, 1n] : [n / a, d / a];
}
function add(a: Fraction, b: Fraction): Fraction { return fraction(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function number(a: Fraction): number {
  // Tiny exhaustive fixtures stay in the exact-integer conversion range.
  expect(Number.isSafeInteger(Number(a[0])) && Number.isSafeInteger(Number(a[1]))).toBe(true);
  return Number(a[0]) / Number(a[1]);
}

test("weighted mixed multigraph scores match independent exhaustive vertex-simple path fractions", () => {
  for (let fixture = 0; fixture < 32; fixture++) {
    const graph = Graph.add<{ index: number }, { amount: number }>({ parallel: true, selfLoops: true, edgeState: { amount: 1 } });
    const nodes = Array.from({ length: 5 }, (_, index) => graph.nodes.add({ index }));
    const arcs: { to: number; units: number }[][] = nodes.map(() => []);
    let state = fixture + 1;
    for (let edge = 0; edge < 13; edge++) {
      state = Math.imul(state, 1664525) + 1013904223 | 0;
      const from = (state >>> 4) % 4, to = (state >>> 12) % 4, units = (state >>> 20) % 4 + 1;
      const directed = fixture % 4 !== 0 && Boolean(state & 1);
      graph.edges.add({ from: nodes[from]!, to: nodes[to]!, directed, state: { amount: units / 2 } });
      arcs[from]!.push({ to, units });
      if (!directed && from !== to) arcs[to]!.push({ to: from, units });
    }
    const scores: Fraction[] = nodes.map(() => [0n, 1n]);
    const distances: (number | undefined)[][] = nodes.map(() => nodes.map(() => undefined));
    for (let source = 0; source < nodes.length; source++) for (let target = 0; target < nodes.length; target++) {
      if (source === target) { distances[source]![target] = 0; continue; }
      let best = Infinity;
      let paths: number[][] = [];
      function visit(node: number, cost: number, path: number[]) {
        if (node === target) {
          if (cost < best) { best = cost; paths = []; }
          if (cost === best) paths.push(path);
          return;
        }
        for (const arc of arcs[node]!) if (!path.includes(arc.to)) visit(arc.to, cost + arc.units, [...path, arc.to]);
      }
      visit(source, 0, [source]);
      if (!paths.length) continue;
      distances[source]![target] = best / 2;
      for (let node = 0; node < nodes.length; node++) if (node !== source && node !== target) {
        const through = paths.filter(path => path.includes(node)).length;
        scores[node] = add(scores[node]!, fraction(BigInt(through), BigInt(paths.length)));
      }
    }
    const whollyUndirected = [...graph.edges].every(edge => !edge.directed);
    for (const normalized of [false, true]) {
      const result = graph.analyze({ measure: "betweenness", normalized, cost: edge => edge.amount });
      for (const node of nodes) {
        let expected = scores[node.index]!;
        if (whollyUndirected) expected = fraction(expected[0], expected[1] * 2n);
        if (normalized) expected = fraction(expected[0] * (whollyUndirected ? 2n : 1n), expected[1] * 12n);
        expect(result.get(node)).toBe(number(expected));
      }
    }
    for (const direction of ["out", "in"] as const) for (const disconnected of ["reachable", "discount"] as const) {
      const result = graph.analyze({ measure: "closeness", direction, disconnected, cost: edge => edge.amount });
      for (const node of nodes) {
        const row = direction === "out" ? distances[node.index]! : distances.map(row => row[node.index]);
        const values = row.filter((value, index) => index !== node.index && value !== undefined) as number[];
        const raw = values.length ? values.length / values.reduce((a, b) => a + b, 0) : 0;
        expect(result.get(node)).toBe(disconnected === "discount" ? raw * values.length / 4 : raw);
      }
    }
    for (const direction of ["in", "out", "all"] as const) {
      const expected = nodes.map(() => 0);
      for (const edge of graph.edges) {
        if (!edge.directed || direction !== "in") expected[edge.from.index]! += edge.amount;
        if (!edge.directed || direction !== "out") expected[edge.to.index]! += edge.amount;
      }
      expect([...graph.analyze({ measure: "degree", direction, weight: edge => edge.amount }).values()]).toEqual(expected);
    }
  }
});

test("spectral scores satisfy independent rank-one eigenpair and PageRank balance oracles", () => {
  for (const reverse of [false, true]) {
    const graph = Graph.add<{ index: number }, { weight: number }>({ parallel: true, selfLoops: true, edgeState: { weight: 1 } });
    const nodes = Array.from({ length: 3 }, (_, index) => graph.nodes.add({ index }));
    const edges = nodes.flatMap(from => nodes.map(to => ({ from, to, directed: true, state: { weight: (to.index + 1) * [2, 1, 1][from.index]! } })));
    for (const edge of reverse ? edges.toReversed() : edges) graph.edges.add(edge);
    const result = graph.analyze({ measure: "eigenvector", weight: edge => edge.weight, tolerance: 1e-13 });
    for (const node of nodes) expect(result.get(node)!).toBeCloseTo((node.index + 1) / Math.sqrt(14), 11);
    expect([...result.values()].reduce((sum, value) => sum + value * value, 0)).toBeCloseTo(1, 14);
    expect(() => graph.analyze({ measure: "eigenvector", weight: edge => edge.weight, tolerance: 1e-13, maxIterations: 1 })).toThrow();
    for (const edge of graph.edges) edge.weight = (edge.to.index + 1) * 2 ** 1022;
    const ranks = graph.analyze({ measure: "pageRank", weight: edge => edge.weight, damping: 0.5, tolerance: 1e-13, maxIterations: 2 });
    for (const [index, expected] of [1 / 4, 1 / 3, 5 / 12].entries()) expect(ranks.get(nodes[index]!)!).toBeCloseTo(expected, 14);
    expect([...ranks.values()].reduce((a, b) => a + b, 0)).toBeCloseTo(1, 14);
    expect(() => graph.analyze({ measure: "pageRank", weight: edge => edge.weight, damping: 0.5, tolerance: 1e-13, maxIterations: 1 })).toThrow();
  }
});

test("all five measures capture once, allow nested observations and preserve canonical lifecycle and RNG authority", () => {
  const random = Random.add({ seed: 17 }), world = World.add({ random });
  const a = world.add(Agent.add({ energy: 2 })), b = world.add(Agent.add({ energy: 3 })), c = world.add(Agent.add({ energy: 4 }));
  const graph = Graph.add<typeof a, { value: number }>({ edgeState: { value: 1 } });
  for (const node of [a, b, c]) graph.nodes.add(node);
  const edges = [graph.edges.add({ from: a, to: b }), graph.edges.add({ from: b, to: c })];
  const state = random.state;
  const measures = ["degree", "closeness", "betweenness", "eigenvector", "pageRank"] as const;
  const snapshots = [];
  for (const measure of measures) {
    const seen: typeof edges = [];
    const callback = (edge: typeof edges[number]) => {
      seen.push(edge); expect(graph.distances({ from: a }).size).toBe(3); return edge.value;
    };
    const result = graph.analyze({ measure, ...((measure === "closeness" || measure === "betweenness") ? { cost: callback } : { weight: callback }) });
    expect(seen).toEqual(edges); expect([...result.keys()]).toEqual([a, b, c]);
    snapshots.push(result);
    for (const mutate of [() => b.delete(), () => edges[0]!.delete(), () => graph.nodes.add(Agent.add({ energy: 5 })), () => graph.edges.add({ from: a, to: c })]) {
      const callback = () => { mutate(); return 1; };
      expect(() => graph.analyze({ measure, ...((measure === "closeness" || measure === "betweenness") ? { cost: callback } : { weight: callback }) })).toThrow();
      expect(b.alive).toBe(true); expect(graph.edges.size).toBe(2); expect(graph.nodes.size).toBe(3);
    }
  }
  expect(random.state).toEqual(state); expect(world.tick.value).toBe(0); expect(a.energy).toBe(2);
  const old = snapshots.map(snapshot => [...snapshot]);
  b.delete();
  snapshots.forEach((snapshot, index) => expect([...snapshot]).toEqual(old[index]!));
  for (const measure of measures) expect([...graph.analyze({ measure }).keys()]).toEqual([a, c]);
  (snapshots[0]! as Map<typeof a, number>).clear();
  expect(graph.analyze({ measure: "degree" }).size).toBe(2);
  const independent = Graph.add<typeof a>(); independent.nodes.add(a);
  expect(independent.analyze({ measure: "degree" }).get(a)).toBe(0);
});

test("measure-specific own-data validation executes before callbacks even on empty graphs", () => {
  const allowed = {
    degree: ["direction", "normalized", "weight"], closeness: ["direction", "disconnected", "cost"],
    betweenness: ["normalized", "cost"], eigenvector: ["weight", "tolerance", "maxIterations"],
    pageRank: ["weight", "damping", "tolerance", "maxIterations"],
  } as const;
  const keys = ["direction", "normalized", "disconnected", "cost", "weight", "damping", "tolerance", "maxIterations", "unknown"];
  for (const populated of [false, true]) {
    const graph = Graph.add(); const a = graph.nodes.add({}), b = graph.nodes.add({});
    graph.edges.add({ from: a, to: b });
    if (!populated) graph.delete();
    let calls = 0, reads = 0;
    for (const measure of Object.keys(allowed) as (keyof typeof allowed)[]) {
      const callback = () => { calls++; return 1; };
      const options = { measure, ...((measure === "closeness" || measure === "betweenness") ? { cost: callback } : { weight: callback }) };
      for (const key of keys) if (!(allowed[measure] as readonly string[]).includes(key))
        expect(() => graph.analyze({ ...options, [key]: undefined } as never)).toThrow(TypeError);
      expect(() => graph.analyze({ ...options, get unknown() { reads++; return 1; } } as never)).toThrow(TypeError);
      expect(() => graph.analyze({ ...options, [Symbol()]: 1 } as never)).toThrow(TypeError);
    }
    for (const invalid of [undefined, null, [], new Date(), {}, { measure: "no" }, { get measure() { reads++; return "degree"; } }])
      expect(() => graph.analyze(invalid as never)).toThrow(TypeError);
    expect(calls).toBe(0); expect(reads).toBe(0);
    expect(() => graph.analyze({ measure: "degree", normalized: 1 as never })).toThrow(TypeError);
    expect(() => graph.analyze({ measure: "closeness", direction: "all" })).toThrow(TypeError);
    expect(() => graph.analyze({ measure: "closeness", disconnected: null as never })).toThrow(TypeError);
    for (const measure of ["eigenvector", "pageRank"] as const) {
      for (const value of [NaN, Infinity, "1", null]) {
        expect(() => graph.analyze({ measure, tolerance: value as never })).toThrow(TypeError);
        expect(() => graph.analyze({ measure, maxIterations: value as never })).toThrow(TypeError);
      }
      for (const value of [0, -1]) expect(() => graph.analyze({ measure, tolerance: value })).toThrow(RangeError);
      for (const value of [0, -1, 0.5]) expect(() => graph.analyze({ measure, maxIterations: value })).toThrow(RangeError);
    }
  }
});

test("callback exceptions retain identity, malformed values reject and weights recapture after failure", () => {
  const graph = Graph.add<object, { value: number }>({ edgeState: { value: 1 } });
  const a = graph.nodes.add({}), b = graph.nodes.add({});
  const edge = graph.edges.add({ from: a, to: b });
  for (const measure of ["degree", "closeness", "betweenness", "eigenvector", "pageRank"] as const) {
    const positive = measure === "closeness" || measure === "betweenness";
    const query = (callback: (current: typeof edge) => number) => graph.analyze({ measure, ...(positive ? { cost: callback } : { weight: callback }) });
    for (const invalid of [NaN, Infinity, -Infinity, null, undefined, "1", 1n, Promise.resolve(1), { then() {} }])
      expect(() => query(() => invalid as number)).toThrow(TypeError);
    expect(() => query(() => -1)).toThrow(RangeError);
    if (positive) expect(() => query(() => 0)).toThrow(RangeError);
    const sentinel = { measure };
    try { query(() => { throw sentinel; }); throw new Error("Missing callback exception"); }
    catch (error) { expect(error).toBe(sentinel); }
    expect(query(current => current.value).size).toBe(2);
  }
  const before = graph.analyze({ measure: "degree", weight: current => current.value });
  edge.value = 3;
  expect(before.get(a)).toBe(1);
  expect(graph.analyze({ measure: "degree", weight: current => current.value }).get(a)).toBe(3);
});

test("loop incidences, edgeless distinctions and wholly-undirected normalization remain explicit", () => {
  const graph = Graph.add({ selfLoops: true });
  const a = graph.nodes.add({}), b = graph.nodes.add({});
  expect([...graph.analyze({ measure: "eigenvector" }).values()]).toEqual([0, 0]);
  expect([...graph.analyze({ measure: "pageRank" }).values()]).toEqual([0.5, 0.5]);
  graph.edges.add({ from: a, to: a }); graph.edges.add({ from: a, to: b });
  expect([...graph.analyze({ measure: "degree" }).values()]).toEqual([3, 1]);
  const eigenvector = graph.analyze({ measure: "eigenvector", tolerance: 1e-13 });
  expect(eigenvector.get(a)!).toBeCloseTo(Math.cos(Math.PI / 8), 11);
  expect(eigenvector.get(b)!).toBeCloseTo(Math.sin(Math.PI / 8), 11);
  const zero = graph.analyze({ measure: "eigenvector", weight: () => 0, tolerance: 1e-13, maxIterations: 1 });
  for (const value of zero.values()) expect(value).toBeCloseTo(1 / Math.sqrt(2), 14);
  const rank = graph.analyze({ measure: "pageRank", damping: 0.5, tolerance: 1e-13 });
  expect(rank.get(a)!).toBeCloseTo(9 / 14, 12); expect(rank.get(b)!).toBeCloseTo(5 / 14, 12);
  for (const measure of ["degree", "closeness", "betweenness", "eigenvector", "pageRank"] as const)
    expect(Graph.add().analyze({ measure }).size).toBe(0);
});
