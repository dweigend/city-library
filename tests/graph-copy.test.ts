import { expect, test } from "bun:test";
import { Agent, Graph, Random, World } from "city-library";
import { frameworkRecord } from "../library/agent/lifecycle.ts";

const participants = (node: object) => frameworkRecord(node)!.deletionParticipants.size;

test("source-order filters and all direction transforms preserve every selected labeled edge independently", () => {
  for (let fixture = 0; fixture < 24; fixture++) {
    const source = Graph.create<{ index: number }, { label: number; nested: number[] }>({ parallel: true, selfLoops: true, edgeState: { label: 0, nested: [1] } });
    const nodes = Array.from({ length: 5 }, (_, index) => source.nodes.add({ index }));
    let word = fixture + 1;
    for (let label = 0; label < 15; label++) {
      word = Math.imul(word, 1664525) + 1013904223 | 0;
      source.edges.add({ from: nodes[(word >>> 4) % 5]!, to: nodes[(word >>> 12) % 5]!, directed: Boolean(word & 1), key: `label${label}`, state: { label, nested: [label] } });
    }
    const selected = nodes.filter(node => (node.index + fixture) % 3 !== 0);
    const expected = [...source.edges].filter(edge => selected.includes(edge.from) && selected.includes(edge.to) && edge.label % 2 === 0);
    for (const direction of ["original", "reverse", "undirected"] as const) {
      const result = source.copy({ nodes: [...selected.toReversed(), ...selected], edges: [...expected.toReversed(), ...expected], direction });
      expect([...result.nodes]).toEqual(selected);
      expect(result.parallel).toBe(true); expect(result.selfLoops).toBe(true);
      const edges = [...result.edges];
      expect(edges.length).toBe(expected.length);
      for (let index = 0; index < edges.length; index++) {
        const copied = edges[index]!, original = expected[index]!;
        expect(copied).not.toBe(original); expect(copied.id).not.toBe(original.id);
        expect(copied.from).toBe(direction === "reverse" && original.directed ? original.to : original.from);
        expect(copied.to).toBe(direction === "reverse" && original.directed ? original.from : original.to);
        expect(copied.directed).toBe(direction === "undirected" ? false : original.directed);
        expect(copied.key).toBe(original.key); expect(copied.graph).toBe(result);
        expect(copied.label).toBe(original.label); expect(copied.nested).toEqual(original.nested);
        expect(copied.nested).not.toBe(original.nested); expect(copied.path).toBeUndefined();
      }
      result.delete(); expect([...source.edges].length).toBe(15);
    }
  }
});

test("undirected promotion retains opposite arcs and uses a fresh automatic-key owner", () => {
  const source = Graph.create<object, { label: string }>({ selfLoops: true, edgeState: { label: "default" } });
  const a = source.nodes.add({}), b = source.nodes.add({});
  source.edges.add({ from: a, to: b, directed: true, state: { label: "ab" } });
  source.edges.add({ from: b, to: a, directed: true, state: { label: "ba" } });
  source.edges.add({ from: a, to: a, state: { label: "loop" } });
  const copy = source.copy({ direction: "undirected" });
  expect(copy.parallel).toBe(true); expect(copy.selfLoops).toBe(true);
  expect([...copy.edges].map(edge => [edge.label, edge.key, edge.directed])).toEqual([["ab", "0", false], ["ba", "1", false], ["loop", "2", false]]);
  expect(copy.edges.add({ from: b, to: b }).key).toBe("3");
  const plain = source.copy({ edges: [[...source.edges][0]!] , direction: "undirected" });
  expect(plain.parallel).toBe(false); expect([...plain.edges][0]!.key).toBeUndefined();
  const keyed = Graph.create({ parallel: true }); keyed.nodes.add(a); keyed.nodes.add(b);
  keyed.edges.add({ from: a, to: b }).delete(); keyed.edges.add({ from: a, to: b, key: "9" });
  const fresh = keyed.copy();
  expect(fresh.edges.add({ from: a, to: b }).key).toBe("0");
  expect(keyed.edges.add({ from: a, to: b }).key).toBe("1");
});

test("state extraction preserves hidden data, null prototypes and framework backreferences without rebinding", () => {
  const state = Object.assign(Object.create(null), { alias: { value: 1 }, same: undefined as unknown, self: undefined as unknown });
  state.same = state.alias; state.self = state;
  const source = Graph.create<object, typeof state>({ edgeState: state });
  const a = source.nodes.add({}), b = source.nodes.add({}), c = source.nodes.add({});
  const ab = source.edges.add({ from: a, to: b }), bc = source.edges.add({ from: b, to: c });
  const shared = { nested: [2] };
  ab.alias = shared; ab.same = shared; bc.alias = shared; bc.same = shared;
  Object.defineProperty(ab, "hidden", { value: { value: 3 }, enumerable: false, configurable: true });
  const copied = source.copy(), [first, second] = [...copied.edges];
  expect(Object.getPrototypeOf(first!)).toBeNull();
  expect(first!.alias).toBe(first!.same); expect(second!.alias).toBe(second!.same);
  expect(first!.alias).not.toBe(second!.alias); expect(first!.alias).not.toBe(shared);
  expect(first!.self).toBe(ab); // An actual registered Edge reference stays canonical.
  expect(second!.self).toBe(bc);
  const hidden = Object.getOwnPropertyDescriptor(first!, "hidden")!;
  expect(hidden.enumerable).toBe(false); expect(hidden.value).toEqual({ value: 3 });
  expect(hidden.value).not.toBe(Object.getOwnPropertyDescriptor(ab, "hidden")!.value);
  const added = copied.edges.add({ from: a, to: c });
  expect(added.alias).toEqual({ value: 1 }); expect(added.alias).toBe(added.same); expect(added.self).toBe(added);
});

test("late clone failures create no target Agent participants; recovery registers exactly one owner", () => {
  const nodes = Array.from({ length: 3 }, (_, index) => Agent.create({ index }));
  const source = Graph.create<typeof nodes[number], { data: object }>({ edgeState: { data: {} } });
  nodes.forEach(node => source.nodes.add(node));
  const good = source.edges.add({ from: nodes[0]!, to: nodes[1]! });
  const bad = source.edges.add({ from: nodes[1]!, to: nodes[2]! });
  const before = nodes.map(participants), sentinel = { late: true };
  let during: number[] = [];
  bad.data = new Proxy({}, { ownKeys() { during = nodes.map(participants); throw sentinel; } });
  try { source.copy(); throw new Error("Missing reflection error"); }
  catch (error) { expect(error).toBe(sentinel); }
  expect(during).toEqual(before); expect(nodes.map(participants)).toEqual(before);
  expect([...source.edges]).toEqual([good, bad]);
  bad.data = {};
  const recovered = source.copy();
  expect(nodes.map(participants)).toEqual(before.map(count => count + 1));
  recovered.delete(); expect(nodes.map(participants)).toEqual(before);
  const next = source.copy(); nodes[1]!.delete();
  expect(source.edges.size).toBe(0); expect(next.edges.size).toBe(0);
  expect(participants(nodes[1]!)).toBe(0);
  next.delete(); source.delete();
  expect(nodes.map(participants)).toEqual([0, 0, 0]);
});

test("final liveness validation catches foreign deletion from a later reflection, including Map/Set and defaults", () => {
  for (const inDefaults of [false, true]) {
    const foreign = Agent.create({ value: 1 }), a = Agent.create(), b = Agent.create(), c = Agent.create();
    const nested = { map: new Map([[{ key: 1 }, new Set([foreign])]]) };
    const source = Graph.create<typeof a, { data: object }>({ edgeState: { data: inDefaults ? nested : {} } });
    [a, b, c].forEach(node => source.nodes.add(node));
    const first = source.edges.add({ from: a, to: b, state: { data: inDefaults ? {} : nested } });
    const last = source.edges.add({ from: b, to: c, state: { data: {} } });
    last.data = new Proxy({}, { ownKeys(target) { foreign.delete(); return Reflect.ownKeys(target); } });
    const before = [a, b, c].map(participants);
    expect(() => source.copy()).toThrow(TypeError);
    expect(foreign.alive).toBe(false); expect([a, b, c].map(participants)).toEqual(before);
    expect(first.alive).toBe(true); expect(last.alive).toBe(true);
    source.delete();
  }
  // Non-Agent framework nodes have no Graph deletion hook; a late external
  // deletion must still be detected before any target owner is published.
  const outer = Graph.create(), x = outer.nodes.add({}), y = outer.nodes.add({});
  const external = outer.edges.add({ from: x, to: y });
  const source = Graph.create<object, { data: object }>({ edgeState: { data: {} } });
  source.nodes.add(external); const other = source.nodes.add({});
  source.edges.add({ from: external, to: other }).data = new Proxy({}, { ownKeys() { external.delete(); return []; } });
  expect(() => source.copy()).toThrow(TypeError);
  expect(source.nodes.size).toBe(2); expect(source.edges.size).toBe(1);
});

test("source reflection rejects structural reentrancy and Agent deletion, permits reads and independent owners", () => {
  const a = Agent.create(), b = Agent.create();
  const source = Graph.create<typeof a, { data: object }>({ edgeState: { data: {} } });
  source.nodes.add(a); source.nodes.add(b);
  const edge = source.edges.add({ from: a, to: b });
  const before = [a, b].map(participants);
  for (const mutate of [() => source.nodes.delete(a), () => edge.delete(), () => source.delete(), () => a.delete(), () => source.generate({ kind: "path", nodes: [] })]) {
    edge.data = new Proxy({}, { ownKeys() { mutate(); return []; } });
    expect(() => source.copy()).toThrow();
    expect([a, b].map(participants)).toEqual(before);
    expect(a.alive).toBe(true); expect(edge.alive).toBe(true); expect(source.edges.size).toBe(1);
  }
  edge.data = {};
  const independent = source.copy();
  edge.data = new Proxy({}, { ownKeys() {
    expect(source.distances({ from: a }).get(b)).toBe(1);
    expect(source.analyze({ measure: "degree" }).get(a)).toBe(1);
    independent.delete(); return [];
  } });
  const iterator = source.nodes[Symbol.iterator](); iterator.next();
  const copied = source.copy();
  copied.delete(); expect(source.hasNode(a)).toBe(true); expect(independent.nodes.size).toBe(0);
  iterator.return?.(); edge.data = {};
  source.edges.add({ from: a, to: b, directed: false }); // Guard released; duplicate remains a no-op.
  source.delete(); expect([a, b].map(participants)).toEqual([0, 0]);
});

test("array subclasses, strict own descriptors, complete validation and membership precede state reflection", () => {
  const source = Graph.create<object, { data: object }>({ edgeState: { data: {} } });
  const a = source.nodes.add({}), b = source.nodes.add({}), edge = source.edges.add({ from: a, to: b });
  class Selection<T> extends Array<T> {}
  expect([...source.copy({ nodes: new Selection(b, a, b), edges: new Selection(edge, edge) }).nodes]).toEqual([a, b]);
  let reads = 0;
  edge.data = new Proxy({}, { ownKeys() { reads++; return []; } });
  const accessor = Object.defineProperty([a], "0", { get() { reads++; return a; } });
  for (const options of [
    { nodes: [a], edges: [edge] }, { nodes: [{}] }, { edges: [{}] }, { nodes: accessor },
    { nodes: new Array(1) }, { nodes: Object.assign([a], { extra: true }) },
    { nodes: Object.assign([a], { [Symbol()]: 1 }) }, { direction: "no" }, { unknown: undefined },
    { get nodes() { reads++; return [a]; } },
  ]) expect(() => source.copy(options as never)).toThrow(TypeError);
  expect(reads).toBe(0);
  edge.data = {};
  Object.defineProperty(edge, "invalid", { get() { reads++; return 1; }, configurable: true });
  expect(() => source.copy()).toThrow(TypeError); expect(reads).toBe(0); Reflect.deleteProperty(edge, "invalid");
  expect(source.copy().edges.size).toBe(1);
});

test("shared Agent identities retain World positions, continuation and independent graph hooks", () => {
  const random = Random.create({ seed: 9 }), world = World.create({ x: 10, y: 10 }, { random });
  const a = world.add(Agent.create({ value: 1 }, { position: { x: 1, y: 2 } })), b = world.add(Agent.create({ value: 2 }));
  const source = Graph.create<typeof a>(); source.nodes.add(a); source.nodes.add(b); source.edges.add({ from: a, to: b });
  const state = random.state, before = [a, b].map(participants), copied = source.copy();
  expect([...copied.nodes]).toEqual([a, b]); expect([a, b].map(participants)).toEqual(before.map(count => count + 1));
  expect(a.world).toBe(world); expect(a.x).toBe(1); expect(a.y).toBe(2);
  expect(world.agents.length).toBe(2); expect(world.tick.value).toBe(0); expect(random.state).toEqual(state);
  copied.delete(); expect([a, b].map(participants)).toEqual(before);
});

test("a large generated edge batch copies through the owner without public add scans or generator limits", () => {
  const source = Graph.create<{ index: number }>({ parallel: true });
  const nodes = Array.from({ length: 30000 }, (_, index) => source.nodes.add({ index }));
  const edges = source.generate({ kind: "path", nodes, directed: true });
  const copied = source.copy({ direction: "reverse" }), current = [...copied.edges];
  expect(current.length).toBe(29999); expect([...copied.nodes]).toEqual(nodes);
  expect(current[0]!.from).toBe(nodes[1]!); expect(current.at(-1)!.to).toBe(nodes.at(-2)!);
  expect(current[0]!).not.toBe(edges[0]); expect(current[0]!.key).toBe("0");
  expect(copied.distances({ from: nodes.at(-1)! }).get(nodes[0]!)).toBe(29999);
  copied.delete(); expect(source.edges.size).toBe(29999);
});
