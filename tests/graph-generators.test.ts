import { expect, test } from "bun:test";
import { Agent, Graph, Grid, Random, World, type GeneratorOptions, type Position } from "city-library";

function fixture(count: number, parallel = false) {
  const graph = Graph.create<{ index: number }>({ parallel });
  const nodes = Array.from({ length: count }, (_, index) => graph.nodes.add({ index }));
  return { graph, nodes };
}
const canonical = (a: number, b: number) => `${Math.min(a, b)}:${Math.max(a, b)}`;

test("native families obey degree, direction and tree invariants through canonical public edges", () => {
  for (const count of [4, 7, 20]) for (const directed of [false, true]) {
    for (const kind of ["path", "cycle", "star", "wheel", "complete", "tree"] as const) {
      const { graph, nodes } = fixture(count);
      const edges = graph.generate({ kind, nodes, directed });
      expect(Object.isFrozen(edges)).toBe(true);
      expect(edges.every(edge => graph.edges.has(edge) && edge.from !== edge.to && edge.directed === directed && edge.path === undefined)).toBe(true);
      expect(new Set(edges.map(edge => directed ? `${edge.from.index}:${edge.to.index}` : canonical(edge.from.index, edge.to.index))).size).toBe(edges.length);
      expect(graph.isConnected()).toBe(true);
      const degree = [...graph.analyze({ measure: "degree", direction: "all" }).values()];
      if (kind === "complete") {
        expect(edges.length).toBe(count * (count - 1) / (directed ? 1 : 2));
        expect(degree).toEqual(nodes.map(() => (count - 1) * (directed ? 2 : 1)));
      } else if (kind === "cycle") expect(degree).toEqual(nodes.map(() => 2));
      else if (kind === "wheel") expect(degree).toEqual([count - 1, ...nodes.slice(1).map(() => 3)]);
      else {
        expect(edges.length).toBe(count - 1);
        if (kind === "path") expect(degree).toEqual([1, ...nodes.slice(2).map(() => 2), 1]);
        if (kind === "star") expect(degree).toEqual([count - 1, ...nodes.slice(1).map(() => 1)]);
      }
      expect([...graph.nodes]).toEqual(nodes);
    }
  }
  const { graph, nodes } = fixture(5);
  expect(graph.generate({ kind: "tree", nodes, branching: Number.MAX_VALUE }).map(edge => edge.from)).toEqual(nodes.slice(1).map(() => nodes[0]!));
});

test("lattice matches an independent all-pairs coordinate-neighborhood oracle", () => {
  for (const shape of [[1], [2], [3], [1, 2], [2, 3], [3, 2, 2]]) for (const wrap of [false, true]) for (const directed of [false, true]) {
    const count = shape.reduce((a, b) => a * b, 1), { graph, nodes } = fixture(count);
    const coordinates = nodes.map(node => {
      let index = node.index;
      return shape.map(axis => { const value = index % axis; index = Math.floor(index / axis); return value; });
    });
    const expected = new Set<string>();
    for (const from of nodes) for (const to of nodes) {
      const differences = shape.map((_, axis) => coordinates[from.index]![axis]! !== coordinates[to.index]![axis]!).filter(Boolean).length;
      if (differences !== 1) continue;
      const axis = shape.findIndex((_, axis) => coordinates[from.index]![axis]! !== coordinates[to.index]![axis]!);
      const a = coordinates[from.index]![axis]!, b = coordinates[to.index]![axis]!, length = shape[axis]!;
      const positive = b === a + 1 || (wrap && a === length - 1 && b === 0);
      const neighboring = Math.abs(a - b) === 1 || (wrap && Math.abs(a - b) === length - 1);
      if (directed ? positive : neighboring) expected.add(directed ? `${from.index}:${to.index}` : canonical(from.index, to.index));
    }
    const result = graph.generate({ kind: "lattice", nodes, shape, wrap, directed });
    expect(new Set(result.map(edge => directed ? `${edge.from.index}:${edge.to.index}` : canonical(edge.from.index, edge.to.index)))).toEqual(expected);
    expect(result.length).toBe(expected.size);
  }
});

test("preferential prefix selection agrees with exact rational CDF scans and preserves cached Gaussian continuation", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const count = 7 + seed % 9, links = 1 + seed % 4, { graph, nodes } = fixture(count);
    const random = Random.create({ seed }); random.number({ distribution: "normal" });
    const control = random.copy();
    const expected: number[][] = [], degrees = nodes.map(() => 0);
    for (let a = 0; a <= links; a++) for (let b = a + 1; b <= links; b++) { expected.push([a, b]); degrees[a]!++; degrees[b]!++; }
    for (let node = links + 1; node < count; node++) {
      const selected = new Set<number>();
      for (let choice = 0; choice < links; choice++) {
        const candidates = nodes.slice(0, node).filter(node => !selected.has(node.index));
        const total = candidates.reduce((sum, node) => sum + degrees[node.index]!, 0);
        const numerator = BigInt(control.number() * 2 ** 32) * BigInt(total);
        let cumulative = 0;
        const target = candidates.find(node => { cumulative += degrees[node.index]!; return BigInt(cumulative) * (1n << 32n) > numerator; })!.index;
        selected.add(target); expected.push([node, target]);
      }
      for (const target of selected) degrees[target]!++;
      degrees[node] = links;
    }
    const result = graph.generate({ kind: "preferential", nodes, edgesPerNode: links, random });
    expect(result.map(edge => [edge.from.index, edge.to.index])).toEqual(expected);
    expect([...graph.analyze({ measure: "degree" }).values()]).toEqual(degrees);
    expect(random.state).toEqual(control.state);
  }
});

test("small-world rank selection matches explicit eligible-pool rewiring on changing topology", () => {
  for (let seed = 1; seed <= 24; seed++) {
    const count = 3 + seed % 12, neighbors = Math.min(2 + 2 * (seed % 3), 2 * Math.floor((count - 1) / 2));
    const probability = [0, 0.3, 1][seed % 3]!, { graph, nodes } = fixture(count);
    const random = Random.create({ seed }), control = random.copy();
    const expected: number[][] = [], adjacency = nodes.map(() => new Set<number>());
    for (let source = 0; source < count; source++) for (let offset = 1; offset <= neighbors / 2; offset++) {
      const target = (source + offset) % count; expected.push([source, target]); adjacency[source]!.add(target); adjacency[target]!.add(source);
    }
    for (const edge of expected) {
      if (control.number() >= probability) continue;
      const [source, old] = edge as [number, number];
      const pool = nodes.filter(node => node.index !== source && !adjacency[source]!.has(node.index));
      if (!pool.length) continue;
      const target = pool[Math.floor(control.number() * pool.length)]!.index;
      adjacency[source]!.delete(old); adjacency[old]!.delete(source);
      adjacency[source]!.add(target); adjacency[target]!.add(source); edge[1] = target;
    }
    const result = graph.generate({ kind: "small-world", nodes, neighborCount: neighbors, probability, random });
    expect(result.map(edge => [edge.from.index, edge.to.index])).toEqual(expected);
    expect(random.state).toEqual(control.state);
    expect(new Set(result.map(edge => canonical(edge.from.index, edge.to.index))).size).toBe(result.length);
  }
});

test("Bernoulli candidate order, explicit stream and endpoint probabilities preserve the public schedule", () => {
  for (const directed of [false, true]) for (const probability of [0, 0.25, 1]) {
    const { graph, nodes } = fixture(11), random = Random.create({ seed: 9 }), control = random.copy();
    const candidates = nodes.flatMap(a => nodes.filter(b => directed ? a !== b : a.index < b.index).map(b => [a.index, b.index]));
    const expected = candidates.filter(() => control.number() < probability);
    expect(graph.generate({ kind: "random", nodes, directed, probability, random }).map(edge => [edge.from.index, edge.to.index])).toEqual(expected);
    expect(random.state).toEqual(control.state);
  }
});

test("closed descriptors, domains, membership and induced loops reject before callbacks or draws", () => {
  const { graph, nodes } = fixture(4), random = Random.create({ seed: 5 }), before = random.state;
  let reads = 0;
  const variants: GeneratorOptions<typeof nodes[number]>[] = [
    { kind: "path", nodes }, { kind: "cycle", nodes }, { kind: "star", nodes }, { kind: "wheel", nodes }, { kind: "complete", nodes },
    { kind: "tree", nodes }, { kind: "lattice", nodes, shape: [4] }, { kind: "random", nodes, probability: 0, random },
    { kind: "small-world", nodes, neighborCount: 2, probability: 0, random }, { kind: "preferential", nodes, edgesPerNode: 1, random },
    { kind: "geometric", nodes, radius: 1, position: () => { reads++; return { x: 0, y: 0 }; } },
  ];
  for (const options of variants) {
    expect(() => graph.generate({ ...options, foreign: undefined } as never)).toThrow(TypeError);
    expect(() => graph.generate({ ...options, [Symbol()]: 1 } as never)).toThrow(TypeError);
    expect(() => graph.generate({ ...options, get foreign() { reads++; return 1; } } as never)).toThrow(TypeError);
  }
  const accessor = [...nodes]; Object.defineProperty(accessor, "0", { get() { reads++; return nodes[0]; } });
  const sparse = [...nodes]; delete sparse[0];
  for (const invalid of [undefined, null, [], {}, { kind: "kleinberg", nodes }, { kind: "path", nodes: new Set(nodes) },
    { kind: "path", nodes: [nodes[0], nodes[0]] }, { kind: "path", nodes: [{}] }, { kind: "path", nodes: accessor }, { kind: "path", nodes: sparse },
    { kind: "path", nodes, directed: 1 }, { kind: "path", nodes, probability: undefined }, { kind: "small-world", nodes, neighborCount: 2, probability: 1, random, directed: undefined },
    { kind: "random", nodes, probability: 0, random: { number() { reads++; return 0; } } },
    { kind: "geometric", nodes, radius: 1, get position() { reads++; return () => ({ x: 0, y: 0 }); } },
  ]) expect(() => graph.generate(invalid as never)).toThrow(TypeError);
  for (const value of [NaN, Infinity, "1", null]) {
    expect(() => graph.generate({ kind: "random", nodes, probability: value as number, random })).toThrow(TypeError);
    expect(() => graph.generate({ kind: "tree", nodes, branching: value as number })).toThrow(TypeError);
  }
  for (const probability of [-1, 1.1]) expect(() => graph.generate({ kind: "random", nodes, probability, random })).toThrow(RangeError);
  for (const branching of [0, -1, 0.5]) expect(() => graph.generate({ kind: "tree", nodes, branching })).toThrow(RangeError);
  expect(reads).toBe(0); expect(random.state).toEqual(before); expect(graph.edges.size).toBe(0);
  const looped = Graph.create({ selfLoops: true }); const node = looped.nodes.add({}); looped.edges.add({ from: node, to: node });
  expect(() => looped.generate({ kind: "random", nodes: [node], probability: 0, random })).toThrow(TypeError);
  expect(random.state).toEqual(before);
});

test("batch snapshots, callback exceptions and enclosing guards preserve topology and automatic keys", () => {
  const { graph, nodes } = fixture(3, true);
  const iterator = graph.nodes[Symbol.iterator](); iterator.next();
  let calls = 0;
  expect(() => graph.generate({ kind: "geometric", nodes, radius: 1, position: () => { calls++; return { x: 0, y: 0 }; } })).toThrow();
  expect(calls).toBe(0); iterator.return?.();
  const input = [...nodes], sentinel = { failure: true };
  try {
    graph.generate({ kind: "geometric", nodes: input, radius: 1, position: node => {
      expect(graph.distances({ from: node }).size).toBe(1);
      input.reverse(); if (node.index === 2) throw sentinel; return { x: node.index, y: 0 };
    } });
    throw new Error("Missing exception");
  } catch (error) { expect(error).toBe(sentinel); }
  expect(graph.edges.size).toBe(0);
  const held: Iterator<typeof nodes[number]>[] = [];
  expect(() => graph.generate({ kind: "geometric", nodes, radius: 1, position: node => {
    if (node.index === 0) { const iterator = graph.nodes[Symbol.iterator](); iterator.next(); held.push(iterator); }
    return { x: node.index, y: 0 };
  } })).toThrow();
  held[0]!.return?.(); expect(graph.edges.size).toBe(0);
  const positions = [...nodes];
  const result = graph.generate({ kind: "geometric", nodes: positions, radius: 1, position: node => { positions.reverse(); return { x: node.index, y: 0 }; } });
  expect(result.map(edge => [edge.from.index, edge.to.index])).toEqual([[0, 1], [1, 2]]);
  expect(result.map(edge => edge.key)).toEqual(["0", "1"]);
});

test("cloned defaults recheck foreign reference liveness after callbacks and preserve cyclic aliases", () => {
  const reference = Agent.create({ value: 1 });
  const graph = Graph.create<object, { reference: typeof reference }>({ parallel: true, edgeState: { reference } });
  const nodes = [graph.nodes.add({}), graph.nodes.add({})];
  expect(() => graph.generate({ kind: "geometric", nodes, radius: 1, position: () => { reference.delete(); return { x: 0, y: 0 }; } })).toThrow();
  expect(graph.edges.size).toBe(0); expect(reference.alive).toBe(false);
  const random = Random.create({ seed: 3 }), before = random.state;
  expect(() => graph.generate({ kind: "random", nodes, probability: 0, random })).toThrow();
  expect(random.state).toEqual(before);
  const living = Agent.create({ value: 2 });
  expect(graph.edges.add({ from: nodes[0]!, to: nodes[1]!, state: { reference: living } }).key).toBe("0");
  const defaults: { items: number[]; alias?: number[]; self?: unknown } = { items: [1] };
  defaults.alias = defaults.items; defaults.self = defaults;
  const copy = Graph.create<object, typeof defaults>({ edgeState: defaults });
  const members = Array.from({ length: 3 }, () => copy.nodes.add({}));
  const result = copy.generate({ kind: "path", nodes: members });
  expect(result[0]!.self).toBe(result[0]); expect(result[0]!.alias).toBe(result[0]!.items);
  expect(result[0]!.items).not.toBe(result[1]!.items);
  result[0]!.items.push(2); expect(result[1]!.items).toEqual([1]); expect(defaults.items).toEqual([1]);
});

test("geometric capture validates immediately and uses explicit finite topology for Agent/Field positions", () => {
  const worldRandom = Random.create({ seed: 42 }), world = World.create({ x: 10, y: 10, boundary: "wrap" }, { random: worldRandom });
  const a = world.add(Agent.create({}, { position: { x: -4.9, y: 0 } })), b = world.add(Agent.create({}, { position: { x: 4.9, y: 0 } }));
  const graph = Graph.create<typeof a>(); graph.nodes.add(a); graph.nodes.add(b);
  const state = worldRandom.state;
  expect(() => graph.generate({ kind: "geometric", nodes: [a, b], radius: 1, position: node => { node.delete(); return node; } })).toThrow();
  expect(a.alive).toBe(true); expect(b.alive).toBe(true); expect(world.agents.length).toBe(2);
  expect(graph.generate({ kind: "geometric", nodes: [a, b], radius: 0.3, position: node => node })).toEqual([]);
  const generated = graph.generate({ kind: "geometric", nodes: [a, b], radius: 0.3, space: { x: 10, y: 10, boundary: "wrap" }, position: node => node });
  expect(generated.length).toBe(1); expect(generated[0]!.from).toBe(a);
  b.delete(); expect(generated[0]!.alive).toBe(false); expect(graph.edges.size).toBe(0);
  expect(worldRandom.state).toEqual(state); expect(world.tick.value).toBe(0);
  const { graph: invalid, nodes } = fixture(3);
  let calls = 0, reads = 0;
  for (const bad of [{ x: NaN, y: 0 }, { x: Infinity, y: 0 }, { get x() { reads++; return 0; }, y: 0 }, Promise.resolve({ x: 0, y: 0 })]) {
    calls = 0;
    expect(() => invalid.generate({ kind: "geometric", nodes, radius: 1, position: () => { calls++; return bad as Position; } })).toThrow();
    expect(calls).toBe(1);
  }
  expect(reads).toBe(0); expect(invalid.edges.size).toBe(0);
  expect(() => invalid.generate({ kind: "geometric", nodes, radius: Number.MAX_VALUE, position: node => ({ x: [0, -Number.MAX_VALUE, Number.MAX_VALUE][node.index]!, y: 0 }) })).toThrow(RangeError);
  expect(invalid.edges.size).toBe(0); // Two earlier planned pairs cannot leak when the last pair overflows.
  expect(invalid.generate({ kind: "geometric", nodes: nodes.slice(0, 2), radius: 20, space: { x: 2, y: 2, boundary: "hard" }, position: node => ({ x: node.index ? 10 : -10, y: 0 }) }).length).toBe(1);
  const grid = Grid.create({ x: 2, y: 2 }, { state: {} });
  const fields = [...grid.fields];
  const fieldGraph = Graph.create<typeof fields[number]>(); fields.forEach(field => fieldGraph.nodes.add(field));
  expect(fieldGraph.generate({ kind: "geometric", nodes: fields, radius: 1, position: field => field }).length).toBe(4);
});

test("known over-cap batches draw nothing; stochastic cap failure stops at first excess and publishes nothing", () => {
  const { graph, nodes } = fixture(1416, true), random = Random.create({ seed: 17 }), before = random.state;
  expect(() => graph.generate({ kind: "complete", nodes })).toThrow(RangeError);
  expect(() => graph.generate({ kind: "random", nodes, probability: 1, random })).toThrow(RangeError);
  expect(random.state).toEqual(before); expect(graph.edges.size).toBe(0);
  const known = fixture(2002);
  expect(() => known.graph.generate({ kind: "small-world", nodes: known.nodes, neighborCount: 1000, probability: 1, random })).toThrow(RangeError);
  expect(() => known.graph.generate({ kind: "preferential", nodes: known.nodes, edgesPerNode: 1000, random })).toThrow(RangeError);
  expect(random.state).toEqual(before); expect(known.graph.edges.size).toBe(0);
  const control = random.copy(), probability = 0.999999999;
  let accepted = 0;
  while (accepted <= 1_000_000) if (control.number() < probability) accepted++;
  expect(() => graph.generate({ kind: "random", nodes, probability, random })).toThrow(RangeError);
  expect(random.state).toEqual(control.state); expect(graph.edges.size).toBe(0);
  expect(graph.generate({ kind: "path", nodes: nodes.slice(0, 2) })[0]!.key).toBe("0");
});
