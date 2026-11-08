import { expect, test } from "bun:test";
import { Graph } from "city-library";

test("single captured costs preserve binary64 bits across exponent and significand boundaries", () => {
  const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: 0 } });
  const a = graph.nodes.add({}), b = graph.nodes.add({});
  const edge = graph.edges.add({ from: a, to: b, directed: true });
  const view = new DataView(new ArrayBuffer(8));
  const exponents = [0, 1, 2, 1022, 1023, 1024, 2045, 2046];
  for (let exponent = 3; exponent < 2045; exponent += 37) exponents.push(exponent);
  for (const exponent of exponents) for (const fraction of [0n, 1n, (1n << 51n) + 1n, (1n << 52n) - 1n]) for (const negative of [false, true]) {
    const encoded = (negative ? 1n << 63n : 0n) | (BigInt(exponent) << 52n) | fraction;
    view.setBigUint64(0, encoded);
    edge.cost = view.getFloat64(0);
    const result = graph.distances({ from: a, algorithm: "bellman-ford", cost: current => current.cost }).get(b)!;
    if (edge.cost === 0) expect(result).toBe(0);
    else {
      view.setFloat64(0, result);
      expect(view.getBigUint64(0)).toBe(encoded);
    }
  }
});

/** Independent fixed-lattice Floyd oracle. Integer conversion rounds once;
 * the power-of-two scale is exact for these normal-range fixtures. */
test("fractional weighted paths match a fixed-lattice integer oracle in either insertion order", () => {
  const scale = 2 ** -20;
  for (const signed of [false, true]) for (const reverse of [false, true]) {
    const graph = Graph.add<{ index: number }, { cost: number }>({ parallel: true, edgeState: { cost: 0 } });
    const nodes = Array.from({ length: 9 }, (_, index) => graph.nodes.add({ index }));
    const coefficients = signed ? [1n << 80n, 1n, 3n, -(1n << 80n), -5n, 0n] : [1n << 80n, 1n, 3n, 7n, 0n];
    const edges: { from: number; to: number; units: bigint }[] = [];
    for (let from = 0; from < nodes.length; from++) for (let to = from + 1; to < nodes.length; to++)
      for (let parallel = 0; parallel < 2; parallel++) edges.push({ from, to, units: coefficients[(from * 3 + to + parallel) % coefficients.length]! });
    const oracle: (bigint | undefined)[][] = nodes.map((_, i) => nodes.map((__, j) => i === j ? 0n : undefined));
    for (const edge of edges) {
      const previous = oracle[edge.from]![edge.to];
      if (previous === undefined || edge.units < previous) oracle[edge.from]![edge.to] = edge.units;
    }
    for (let via = 0; via < nodes.length; via++) for (let from = 0; from < nodes.length; from++) for (let to = 0; to < nodes.length; to++) {
      const a = oracle[from]![via], b = oracle[via]![to];
      if (a === undefined || b === undefined) continue;
      const previous = oracle[from]![to], candidate = a + b;
      if (previous === undefined || candidate < previous) oracle[from]![to] = candidate;
    }
    for (const edge of reverse ? edges.toReversed() : edges)
      graph.edges.add({ from: nodes[edge.from]!, to: nodes[edge.to]!, directed: true, state: { cost: Number(edge.units) * scale } });
    for (const algorithm of signed ? ["bellman-ford"] as const : ["auto", "dijkstra", "bellman-ford"] as const) {
      const rows = graph.allDistances({ algorithm, cost: edge => edge.cost });
      for (const from of nodes) for (const to of nodes) {
        const expected = oracle[from.index]![to.index];
        expect(rows.get(from)!.get(to)).toBe(expected === undefined ? undefined : Number(expected) * scale);
      }
    }
  }
});

test("captured fractional binary64 values are summed exactly rather than as decimal rationals", () => {
  const weights = [0.1, 0.2, 0.3, -0.2, -0.1, 0.125, -0.125];
  const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: 0 } });
  const nodes = Array.from({ length: weights.length + 1 }, () => graph.nodes.add({}));
  weights.forEach((cost, index) => graph.edges.add({ from: nodes[index]!, to: nodes[index + 1]!, directed: true, state: { cost } }));
  const result = graph.distances({ from: nodes[0]!, algorithm: "bellman-ford", cost: edge => edge.cost });
  let exact = 0n;
  weights.forEach((weight, index) => {
    exact += BigInt(weight * 2 ** 55);
    expect(result.get(nodes[index + 1]!)).toBe(Number(exact) / 2 ** 55);
  });
});

test("rounding handles both signs, normal exponent carries and ties to even", () => {
  for (const sign of [1, -1]) for (const exponent of [-1021, -200, 0, 53, 500, 970]) {
    const base = 2 ** exponent, halfUlp = 2 ** (exponent - 53);
    const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: sign * halfUlp } });
    const nodes = Array.from({ length: 5 }, () => graph.nodes.add({}));
    graph.edges.add({ from: nodes[0]!, to: nodes[1]!, directed: true, state: { cost: sign * base } });
    for (let index = 1; index < 4; index++) graph.edges.add({ from: nodes[index]!, to: nodes[index + 1]!, directed: true });
    const result = graph.distances({ from: nodes[0]!, algorithm: "bellman-ford", cost: edge => edge.cost });
    expect(result.get(nodes[2]!)).toBe(sign * base);
    expect(result.get(nodes[3]!)).toBe(sign * (base + 2 * halfUlp));
    expect(result.get(nodes[4]!)).toBe(sign * (base + 4 * halfUlp));
  }
  const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: 1 } });
  const a = graph.nodes.add({}), b = graph.nodes.add({}), c = graph.nodes.add({});
  graph.edges.add({ from: a, to: b, directed: true, state: { cost: 2 ** 54 - 2 } });
  graph.edges.add({ from: b, to: c, directed: true });
  expect(graph.distances({ from: a, cost: edge => edge.cost }).get(c)).toBe(2 ** 54);
});

test("tiny values survive large signed prefixes and the normal/subnormal boundary", () => {
  const tiny = Number.MIN_VALUE, normal = 2 ** -1022;
  for (const sign of [1, -1]) for (const prefix of [2 ** 100, Number.MAX_VALUE]) {
    const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: 0 } });
    const weights = [sign * prefix, sign * tiny, -sign * prefix, sign * (normal - tiny), sign * tiny];
    const nodes = Array.from({ length: weights.length + 1 }, () => graph.nodes.add({}));
    weights.forEach((cost, index) => graph.edges.add({ from: nodes[index]!, to: nodes[index + 1]!, directed: true, state: { cost } }));
    const result = graph.distances({ from: nodes[0]!, algorithm: "bellman-ford", cost: edge => edge.cost });
    expect(result.get(nodes[3]!)).toBe(sign * tiny);
    expect(result.get(nodes[4]!)).toBe(sign * normal);
    expect(result.get(nodes[5]!)).toBe(sign * (normal + tiny));
  }
});

test("a subnormal negative cycle stays detectable behind enormous prefixes", () => {
  for (const reverse of [false, true]) for (const prefix of [2 ** 53, Number.MAX_VALUE]) {
    const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: 0 } });
    const [start, a, b, isolate] = Array.from({ length: 4 }, () => graph.nodes.add({}));
    const edges = [
      { from: start!, to: a!, directed: true, state: { cost: prefix } },
      { from: a!, to: b!, directed: true, state: { cost: 0 } },
      { from: b!, to: a!, directed: true, state: { cost: -Number.MIN_VALUE } },
    ];
    for (const edge of reverse ? edges.toReversed() : edges) graph.edges.add(edge);
    const settings = { algorithm: "bellman-ford" as const, cost: (edge: { cost: number }) => edge.cost };
    expect(() => graph.distances({ from: start!, ...settings })).toThrow(RangeError);
    expect(graph.distances({ from: isolate!, ...settings })).toEqual(new Map([[isolate!, 0]]));
    expect(() => graph.allDistances(settings)).toThrow(RangeError);
  }
});

test("finite-rounded overflow includes discarded candidates and allows MAX_VALUE plus a tiny tail", () => {
  for (const sign of [1, -1]) for (const tail of [1, Number.MIN_VALUE, 2 ** 969, 2 ** 970]) {
    const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: sign * tail } });
    const a = graph.nodes.add({}), b = graph.nodes.add({}), c = graph.nodes.add({});
    graph.edges.add({ from: a, to: b, directed: true, state: { cost: sign * Number.MAX_VALUE } });
    graph.edges.add({ from: b, to: c, directed: true });
    for (const algorithm of sign > 0 ? ["auto", "dijkstra", "bellman-ford"] as const : ["bellman-ford"] as const) {
      const query = () => graph.distances({ from: a, algorithm, cost: edge => edge.cost });
      if (tail === 2 ** 970) expect(query).toThrow(RangeError);
      else expect(query().get(c)).toBe(sign * Number.MAX_VALUE);
    }
  }
  for (const algorithm of ["auto", "dijkstra", "bellman-ford"] as const) {
    const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: Number.MAX_VALUE } });
    const a = graph.nodes.add({}), b = graph.nodes.add({}), c = graph.nodes.add({});
    graph.edges.add({ from: a, to: b, directed: true });
    graph.edges.add({ from: a, to: c, directed: true, state: { cost: 0 } });
    graph.edges.add({ from: b, to: c, directed: true });
    expect(() => graph.distances({ from: a, algorithm, cost: edge => edge.cost })).toThrow(RangeError);
  }
});

test("summary sums published distances exactly, independent of summand order and before division", () => {
  for (const weights of [[2 ** 53, 1, 1], [1, 1, 2 ** 53], [Number.MIN_VALUE, Number.MIN_VALUE, 2 * Number.MIN_VALUE]]) {
    const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: 0 } });
    for (const cost of weights) {
      const from = graph.nodes.add({}), to = graph.nodes.add({});
      graph.edges.add({ from, to, directed: true, state: { cost } });
    }
    const summary = graph.distanceSummary({ cost: edge => edge.cost });
    expect(summary.reachablePairs).toBe(3);
    expect(summary.mean).toBe(weights[0] === Number.MIN_VALUE ? 4 * Number.MIN_VALUE / 3 : (2 ** 53 + 2) / 3);
  }
  for (const tail of [1, 2 ** 970]) {
    const graph = Graph.add<object, { cost: number }>({ edgeState: { cost: 0 } });
    for (const cost of [Number.MAX_VALUE, tail]) {
      const from = graph.nodes.add({}), to = graph.nodes.add({});
      graph.edges.add({ from, to, directed: true, state: { cost } });
    }
    const query = () => graph.distanceSummary({ cost: edge => edge.cost });
    if (tail === 1) expect(query().mean).toBe(Number.MAX_VALUE / 2);
    else expect(query).toThrow(RangeError);
  }
});
