import { expect, test } from "bun:test";
import { Agent, Graph, Random, World, type GeneratorOptions } from "city-library";

const profile = "ordered-topology/1";
function fixture(count: number, parallel = false) {
  const graph = Graph.create<{ index: number }>({ parallel });
  const nodes = Array.from({ length: count }, (_, index) => graph.nodes.add({ index }));
  return { graph, nodes };
}

test("legacy native-kind unions and narrowed tree branching keep their public TypeScript syntax", () => {
  function options(kind: "path" | "cycle" | "star" | "wheel" | "complete" | "tree", nodes: readonly { index: number }[]): GeneratorOptions<{ index: number }> {
    return { kind, nodes, directed: true };
  }
  function treeBranching(value: GeneratorOptions<{ index: number }>): number | undefined {
    return value.kind === "tree" ? value.branching : undefined;
  }
  for (const kind of ["path", "cycle", "star", "wheel", "complete", "tree"] as const) {
    const { graph, nodes } = fixture(4);
    expect(graph.generate(options(kind, nodes)).length).toBeGreaterThan(0);
  }
  const { graph, nodes } = fixture(4);
  const tree: GeneratorOptions<typeof nodes[number]> = { kind: "tree", nodes, branching: 3, directed: true };
  expect(treeBranching(tree)).toBe(3);
  expect(graph.generate(tree).map(edge => edge.from.index)).toEqual([0, 0, 0]);
});

test("Kleinberg sampled targets match independent small integer distance-mass tables", () => {
  // Exact ideal-law masses on 2x3 and wrapped 3x3. Selected dyadic units stay
  // away from boundaries, so these fixtures also check the Number CDF law.
  for (const wrapped of [false, true]) for (let seed = 1; seed <= 20; seed++) {
    const columns = 3, rows = wrapped ? 3 : 2, count = columns * rows;
    const { graph, nodes } = fixture(count), random = Random.create({ seed }), control = random.copy();
    const expected: number[][] = [], seen = new Set<string>();
    function add(from: number, to: number) {
      const key = `${from}:${to}`;
      if (!seen.has(key)) { seen.add(key); expected.push([from, to]); }
    }
    // Independent all-pairs adjacency predicate; sort by source then axis.
    const base = nodes.flatMap(a => nodes.filter(b => a !== b).flatMap(b => {
      const ax = a.index % columns, ay = Math.floor(a.index / columns), bx = b.index % columns, by = Math.floor(b.index / columns);
      if (ay === by && (bx === ax + 1 || (wrapped && ax === 2 && bx === 0))) return [{ from: a.index, to: b.index, axis: 0 }];
      if (ax === bx && (by === ay + 1 || (wrapped && ay === 2 && by === 0))) return [{ from: a.index, to: b.index, axis: 1 }];
      return [];
    })).sort((a, b) => a.from - b.from || a.axis - b.axis);
    base.forEach(edge => add(edge.from, edge.to));
    for (const source of nodes) {
      const masses = nodes.filter(target => target !== source).map(target => {
        let dx = Math.abs(source.index % 3 - target.index % 3), dy = Math.abs(Math.floor(source.index / 3) - Math.floor(target.index / 3));
        if (wrapped) { dx = Math.min(dx, 3 - dx); dy = Math.min(dy, 3 - dy); }
        const distance = dx + dy;
        return { target: target.index, mass: wrapped ? distance === 1 ? 4 : 1 : distance === 1 ? 36 : distance === 2 ? 9 : 4 };
      });
      const total = masses.reduce((sum, entry) => sum + entry.mass, 0);
      const unit = BigInt(control.number() * 2 ** 32);
      let cumulative = 0;
      const target = masses.find(entry => { cumulative += entry.mass; return unit * BigInt(total) <= BigInt(cumulative) * (1n << 32n); })!.target;
      add(source.index, target);
    }
    const result = graph.generate({ kind: "kleinberg", profile, nodes, shape: [columns, rows], clusteringExponent: 2, wrap: wrapped, directed: true, random });
    expect(result.map(edge => [edge.from.index, edge.to.index])).toEqual(expected);
    expect(random.state).toEqual(control.state);
  }
});

test("extreme finite exponents preserve zero-weight plateaus and the inclusive zero-unit boundary", () => {
  // Mulberry's third updated word is exactly zero for this real issued stream.
  const random = Random.create({ seed: (-3 * 0x6d2b79f5) >>> 0 }), control = random.copy();
  control.number(); control.number(); expect(control.number()).toBe(0);
  expect(Math.pow(2, -Number.MAX_VALUE)).toBe(0);
  const { graph, nodes } = fixture(6);
  const result = graph.generate({ kind: "kleinberg", profile, nodes, shape: [3, 2], clusteringExponent: Number.MAX_VALUE, directed: true, random });
  // Source2's first target0 is at distance2 with cumulative zero. U0 selects it,
  // rather than skipping the zero weight or changing <= to a strict boundary.
  expect(result.some(edge => edge.from === nodes[2] && edge.to === nodes[0])).toBe(true);
  control.number(); control.number(); control.number(); expect(random.state).toEqual(control.state);
  expect(result.every(edge => edge.from !== edge.to)).toBe(true);
  for (const exponent of [0, 11, 1e6]) {
    const current = fixture(4);
    expect(current.graph.generate({ kind: "kleinberg", profile, nodes: current.nodes, shape: [2, 2], clusteringExponent: exponent, random: Random.create({ seed: 1 }) }).length).toBeGreaterThanOrEqual(4);
  }
});

test("PA directed and undirected endpoints match independent endpoint-occurrence rejection traces", () => {
  for (const directed of [false, true]) for (let seed = 1; seed <= 12; seed++) {
    const { graph, nodes } = fixture(9), random = Random.create({ seed }), control = random.copy();
    const expected: number[][] = [[0, 1], [0, 2], [1, 2]];
    for (let source = 3; source < nodes.length; source++) {
      // An independent flat endpoint bag spells out incident mass, including
      // sinks/sources of directed edges. It is held fixed for the whole batch.
      const endpoints = expected.flatMap(pair => pair);
      const chosen: number[] = [];
      while (chosen.length < 2) {
        const link = Math.floor(control.number() * (endpoints.length / 2));
        const end = control.number() < 0.5 ? 0 : 1;
        const target = endpoints[2 * link + end]!;
        if (!chosen.includes(target)) chosen.push(target);
      }
      expected.push(...chosen.map(target => [source, target]));
    }
    const result = graph.generate({ kind: "preferential", profile, nodes, edgesPerNode: 2, directed, random });
    expect(result.map(edge => [edge.from.index, edge.to.index])).toEqual(expected);
    expect(random.state).toEqual(control.state);
    expect(result.every(edge => edge.directed === directed)).toBe(true);
  }
});

test("WS front-cursor rejection preserves saturated K3, singleton trials, k0 and probability0 schedules", () => {
  for (const directed of [false, true]) for (let seed = 1; seed <= 8; seed++) {
    const { graph, nodes } = fixture(3), random = Random.create({ seed }), control = random.copy();
    // K3: after removing each slot only its old endpoint is eligible. Track
    // the persistent list as a front prefix plus untried tail, not swap code.
    let buffer = [0, 1, 2], singletonTrials = 0;
    for (let source = 0; source < 3; source++) {
      control.number();
      const desired = (source + 1) % 3;
      const prefix: number[] = [], remaining = [...buffer];
      while (true) {
        if (remaining.length === 1) singletonTrials++;
        const index = Math.floor(control.number() * remaining.length);
        const candidate = remaining[index]!;
        // Original front-swap leaves the prior front item in the chosen slot.
        if (index !== 0) remaining[index] = remaining[0]!;
        remaining.shift(); prefix.push(candidate);
        if (candidate === desired) { buffer = [...prefix, ...remaining]; break; }
      }
    }
    const result = graph.generate({ kind: "small-world", profile, nodes, neighborsPerSide: 1, probability: 1, directed, random });
    expect(result.map(edge => [edge.from.index, edge.to.index])).toEqual([[0, 1], [1, 2], [2, 0]]);
    expect(random.state).toEqual(control.state);
    if (seed === 1) expect(singletonTrials).toBeGreaterThan(0);
  }
  for (const count of [1, 2, 200]) {
    const { graph, nodes } = fixture(count), random = Random.create({ seed: 4 });
    random.number({ distribution: "normal" }); const before = random.state;
    expect(graph.generate({ kind: "small-world", profile, nodes, neighborsPerSide: 0, probability: 1, random })).toEqual([]);
    expect(random.state).toEqual(before);
  }
  const { graph, nodes } = fixture(7), random = Random.create({ seed: 9 }), control = random.copy();
  for (let draw = 0; draw < 14; draw++) control.number();
  expect(graph.generate({ kind: "small-world", profile, nodes, neighborsPerSide: 2, probability: 0, random }).length).toBe(14);
  expect(random.state).toEqual(control.state);
});

test("profile wheel/lattice stored endpoints differ explicitly from unprofiled defaults", () => {
  for (const directed of [false, true]) {
    const current = fixture(5);
    const edges = current.graph.generate({ kind: "wheel", profile, nodes: current.nodes, directed });
    expect(edges.map(edge => [edge.from.index, edge.to.index])).toEqual([[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]]);
    const grid = fixture(6);
    expect(grid.graph.generate({ kind: "lattice", profile, nodes: grid.nodes, shape: [3, 2], wrap: true, directed }).map(edge => [edge.from.index, edge.to.index])).toEqual([[0, 1], [0, 3], [1, 2], [1, 4], [2, 0], [2, 5], [3, 4], [4, 5], [5, 3]]);
  }
  const old = fixture(4);
  expect(old.graph.generate({ kind: "lattice", nodes: old.nodes, shape: [2, 2], wrap: true, directed: true }).length).toBe(8);
});

test("closed profile schemas and scalar domains reject before draws, including own undefined discriminants", () => {
  const { graph, nodes } = fixture(6), random = Random.create({ seed: 3 }), before = random.state;
  const valid = { kind: "kleinberg", profile, nodes, shape: [3, 2], clusteringExponent: 2, random };
  let reads = 0;
  for (const options of [
    { ...valid, profile: undefined }, { ...valid, profile: "nw-web" }, { ...valid, profile: null },
    { ...valid, foreign: undefined }, { ...valid, neighbors: undefined }, { ...valid, [Symbol()]: 1 },
    { ...valid, get clusteringExponent() { reads++; return 2; } },
    { ...valid, random: { number() { reads++; return 0; } } },
    { ...valid, nodes: [nodes[0], nodes[0]] }, { ...valid, nodes: [{}, ...nodes.slice(1)] },
    { kind: "path", profile, nodes }, { kind: "star", profile, nodes }, { kind: "random", profile, nodes, probability: 0, random },
    { kind: "small-world", profile, nodes, neighbors: 2, neighborsPerSide: 1, probability: 0, random },
    { kind: "wheel", profile, nodes, random: undefined }, { kind: "preferential", nodes, edgesPerNode: 1, directed: undefined, random },
    { kind: "small-world", nodes, neighbors: 2, probability: 0, directed: undefined, random },
    { kind: "path", nodes, branching: undefined }, { kind: "wheel", nodes, spokes: undefined },
    { kind: "path", nodes, profile: undefined },
  ]) expect(() => graph.generate(options as never)).toThrow(TypeError);
  for (const value of [NaN, Infinity, -Infinity, "1", null]) {
    expect(() => graph.generate({ ...valid, clusteringExponent: value } as never)).toThrow(TypeError);
    expect(() => graph.generate({ kind: "small-world", profile, nodes, neighborsPerSide: value as number, probability: 0, random })).toThrow(TypeError);
  }
  for (const value of [-1, 0.5]) expect(() => graph.generate({ kind: "small-world", profile, nodes, neighborsPerSide: value, probability: 0, random })).toThrow(RangeError);
  expect(() => graph.generate({ ...valid, shape: [1, 6] } as never)).toThrow(RangeError);
  expect(() => graph.generate({ ...valid, clusteringExponent: -1 } as never)).toThrow(RangeError);
  expect(reads).toBe(0); expect(random.state).toEqual(before); expect(graph.edges.size).toBe(0);
});

test("owner guard and late clone failure keep topology/key atomicity while retaining scheduled units", () => {
  const graph = Graph.create<{ index: number }, { stamp: Date }>({ parallel: true, edgeState: { stamp: new Date(0) } });
  const nodes = Array.from({ length: 6 }, (_, index) => graph.nodes.add({ index }));
  const random = Random.create({ seed: 7 }), control = random.copy();
  for (let draw = 0; draw < 14; draw++) control.number();
  const original = Date.prototype.getTime, sentinel = { clone: "late" }; let calls = 0;
  Date.prototype.getTime = function () { if (++calls === 2) throw sentinel; return original.call(this); };
  try {
    try { graph.generate({ kind: "preferential", profile, nodes, edgesPerNode: 2, random }); throw new Error("Missing clone failure"); }
    catch (error) { expect(error).toBe(sentinel); }
  } finally { Date.prototype.getTime = original; }
  expect(random.state).toEqual(control.state); expect(graph.edges.size).toBe(0);
  const iterator = graph.nodes[Symbol.iterator](); iterator.next(); const before = random.state;
  expect(() => graph.generate({ kind: "preferential", profile, nodes, edgesPerNode: 2, random })).toThrow();
  expect(random.state).toEqual(before); iterator.return?.();
  const result = graph.generate({ kind: "wheel", profile, nodes });
  expect(result[0]!.key).toBe("0"); expect(result[0]!.stamp).not.toBe(result[1]!.stamp);
});

test("profile operations preserve canonical lifecycle, defaults and World/RNG separation", () => {
  const worldRandom = Random.create({ seed: 4 }), world = World.create({ random: worldRandom });
  const nodes = Array.from({ length: 4 }, (_, index) => world.add(Agent.create({ index })));
  const graph = Graph.create<typeof nodes[number]>(); nodes.forEach(node => graph.nodes.add(node));
  const before = worldRandom.state;
  const edges = graph.generate({ kind: "small-world", profile, nodes, neighborsPerSide: 1, probability: 0, directed: true, random: Random.create({ seed: 1 }) });
  expect(Object.isFrozen(edges)).toBe(true); expect(edges[0]!.from).toBe(nodes[0]!);
  nodes[1]!.delete(); expect(graph.nodes.size).toBe(3); expect(edges[0]!.alive).toBe(false);
  expect(world.tick.value).toBe(0); expect(worldRandom.state).toEqual(before);
  const reference = Agent.create(), invalid = Graph.create<object, { reference: typeof reference }>({ edgeState: { reference } });
  const pair = [invalid.nodes.add({}), invalid.nodes.add({})]; reference.delete();
  const random = Random.create({ seed: 3 }), state = random.state;
  expect(() => invalid.generate({ kind: "preferential", profile, nodes: pair, edgesPerNode: 1, random })).toThrow(TypeError);
  expect(random.state).toEqual(state); expect(invalid.edges.size).toBe(0);
});

test("known profile caps preflight; practical PA, WS and Kleinberg batches use actual owner publication", () => {
  const large = fixture(2002), random = Random.create({ seed: 1 }), before = random.state;
  expect(() => large.graph.generate({ kind: "small-world", profile, nodes: large.nodes, neighborsPerSide: 500, probability: 0, random })).toThrow(RangeError);
  expect(() => large.graph.generate({ kind: "preferential", profile, nodes: large.nodes, edgesPerNode: 1000, random })).toThrow(RangeError);
  expect(random.state).toEqual(before); expect(large.graph.edges.size).toBe(0);
  const pa = fixture(10000), ws = fixture(10000), kleinberg = fixture(400);
  expect(pa.graph.generate({ kind: "preferential", profile, nodes: pa.nodes, edgesPerNode: 2, directed: true, random: Random.create({ seed: 7 }) }).length).toBe(19997);
  expect(ws.graph.generate({ kind: "small-world", profile, nodes: ws.nodes, neighborsPerSide: 2, probability: 0, random: Random.create({ seed: 7 }) }).length).toBe(20000);
  const edges = kleinberg.graph.generate({ kind: "kleinberg", profile, nodes: kleinberg.nodes, shape: [20, 20], clusteringExponent: 2, wrap: true, random: Random.create({ seed: 7 }) });
  expect(edges.length).toBeGreaterThanOrEqual(800); expect(edges.length).toBeLessThanOrEqual(1200);
  expect(kleinberg.graph.edges.size).toBe(edges.length);
});
