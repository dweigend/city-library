import { expect, test } from "bun:test";
import { Agent, Graph, Random, World } from "city-library";

function isMaskConnected(adjacency: readonly (readonly boolean[])[], mask: number): boolean {
  if (mask === 0) return true;
  let first = 0;
  while (!(mask & (1 << first))) first++;
  let seen = 1 << first;
  const pending = [first];
  while (pending.length) {
    const from = pending.pop()!;
    for (let to = 0; to < adjacency.length; to++) {
      const bit = 1 << to;
      if (adjacency[from]![to] && (mask & bit) && !(seen & bit)) {
        seen |= bit;
        pending.push(to);
      }
    }
  }
  return seen === mask;
}

/** Independent definition: enumerate induced connected vertex sets that remain
 * connected after any single vertex removal, then retain maximal sets. */
function blockOracle(adjacency: readonly (readonly boolean[])[]): number[][] {
  const valid: number[] = [];
  for (let mask = 1; mask < 1 << adjacency.length; mask++) {
    if (!isMaskConnected(adjacency, mask)) continue;
    let survivesCuts = true;
    for (let cut = 0; cut < adjacency.length; cut++)
      if ((mask & (1 << cut)) && !isMaskConnected(adjacency, mask & ~(1 << cut))) survivesCuts = false;
    if (survivesCuts) valid.push(mask);
  }
  return valid.filter(mask => !valid.some(other => other !== mask && (mask & other) === mask))
    .map(mask => Array.from({ length: adjacency.length }, (_, index) => index).filter(index => mask & (1 << index)))
    .sort((a, b) => {
      for (let index = 0; index < Math.min(a.length, b.length); index++) if (a[index] !== b[index]) return a[index]! - b[index]!;
      return a.length - b.length;
    });
}

test("biconnected vertex blocks match cut-definition oracle for all five-node simple graphs plus loops/parallel edges", () => {
  const pairs: [number, number][] = [];
  for (let from = 0; from < 5; from++) for (let to = from + 1; to < 5; to++) pairs.push([from, to]);
  for (let mask = 0; mask < 1 << pairs.length; mask++) {
    const graph = Graph.create<{ index: number }>({ parallel: true, selfLoops: true });
    const nodes = Array.from({ length: 5 }, (_, index) => graph.nodes.add({ index }));
    const adjacency = Array.from({ length: 5 }, () => Array<boolean>(5).fill(false));
    graph.edges.add({ from: nodes[mask % 5]!, to: nodes[mask % 5]! });
    pairs.forEach(([from, to], edge) => {
      if (!(mask & (1 << edge))) return;
      adjacency[from]![to] = adjacency[to]![from] = true;
      graph.edges.add({ from: nodes[from]!, to: nodes[to]! });
      if (edge % 3 === 0) graph.edges.add({ from: nodes[to]!, to: nodes[from]! });
    });
    expect(graph.components({ mode: "biconnected" }).map(part => part.map(node => node.index))).toEqual(blockOracle(adjacency));
    expect(graph.isConnected()).toBe(isMaskConnected(adjacency, 31));
  }
});

test("strong components match independent mutual-reachability oracle on directed and mixed structures", () => {
  for (let structure = 0; structure < 256; structure++) {
    const graph = Graph.create<{ index: number }>({ parallel: true, selfLoops: true });
    const nodes = Array.from({ length: 5 }, (_, index) => graph.nodes.add({ index }));
    const reaches = Array.from({ length: 5 }, (_, from) => Array.from({ length: 5 }, (_, to) => from === to));
    let state = structure + 1;
    for (let from = 0; from < 5; from++) for (let to = 0; to < 5; to++) {
      state = Math.imul(state, 1664525) + 1013904223 | 0;
      if ((state >>> 28) > 3) continue;
      const directed = Boolean(state & 1);
      graph.edges.add({ from: nodes[from]!, to: nodes[to]!, directed });
      reaches[from]![to] = true;
      if (!directed) reaches[to]![from] = true;
    }
    for (let via = 0; via < 5; via++) for (let from = 0; from < 5; from++) for (let to = 0; to < 5; to++)
      reaches[from]![to] ||= reaches[from]![via]! && reaches[via]![to]!;
    const remaining = new Set([0, 1, 2, 3, 4]);
    const expected: number[][] = [];
    for (const start of remaining) {
      const part = [...remaining].filter(next => reaches[start]![next] && reaches[next]![start]);
      expected.push(part);
      for (const node of part) remaining.delete(node);
    }
    expect(graph.components({ mode: "strong" }).map(part => part.map(node => node.index))).toEqual(expected);
    expect(graph.isConnected({ mode: "strong" })).toBe(expected.length === 1);
  }
});

test("connectivity options reject malformed data without invoking accessors or mutating graphs", () => {
  const graph = Graph.create({ selfLoops: true });
  const node = graph.nodes.add({});
  const edge = graph.edges.add({ from: node, to: node, directed: true });
  let reads = 0;
  for (const invalid of [null, [], new Date(), { mode: "unknown" }, { mode: null }, { mode: 0 }, { extra: 1 }, { [Symbol()]: 1 }, { get mode() { reads++; return "weak"; } }]) {
    expect(() => graph.components(invalid as never)).toThrow(TypeError);
    expect(() => graph.isConnected(invalid as never)).toThrow(TypeError);
  }
  expect(reads).toBe(0);
  expect(() => graph.components({ mode: "biconnected" })).toThrow(TypeError);
  expect(() => graph.isConnected({ mode: "biconnected" as never })).toThrow(TypeError);
  expect(graph.components()).toEqual([[node]]);
  expect(graph.isConnected()).toBe(true);
  expect(graph.edges.has(edge)).toBe(true);
  expect(graph.edges.size).toBe(1);
});

test("canonical query snapshots survive Agent edits and reflect membership lifecycle without clock/RNG effects", () => {
  const random = Random.create({ seed: 7 });
  const world = World.create({ random });
  const first = world.add(Agent.create({ energy: 3 }));
  const second = world.add(first.copy());
  const graph = Graph.create<typeof first>();
  graph.nodes.add(first); graph.nodes.add(second);
  graph.edges.add({ from: first, to: second });
  const state = random.state;
  const captured = graph.components();
  expect(captured[0]![0]).toBe(first);
  first.energy = 9;
  expect(captured[0]![0]!.energy).toBe(9);
  expect(Object.isFrozen(captured)).toBe(true);
  expect(Object.isFrozen(captured[0])).toBe(true);
  expect(graph.components({ mode: "strong" })).toEqual([[first, second]]);
  second.delete();
  expect(graph.components()).toEqual([[first]]);
  expect(captured).toEqual([[first, second]]);
  expect(random.state).toEqual(state);
  expect(world.tick.value).toBe(0);
});

test("iterative connectivity handles a long chain without depending on call-stack depth", () => {
  const graph = Graph.create<{ index: number }>({ parallel: true });
  const nodes = Array.from({ length: 12000 }, (_, index) => graph.nodes.add({ index }));
  for (let index = 1; index < nodes.length; index++) graph.edges.add({ from: nodes[index - 1]!, to: nodes[index]! });
  expect(graph.isConnected()).toBe(true);
  expect(graph.components({ mode: "strong" })[0]).toEqual(nodes);
  const blocks = graph.components({ mode: "biconnected" });
  expect(blocks).toHaveLength(nodes.length - 1);
  expect(blocks[0]).toEqual(nodes.slice(0, 2));
  expect(blocks.at(-1)).toEqual(nodes.slice(-2));
});
