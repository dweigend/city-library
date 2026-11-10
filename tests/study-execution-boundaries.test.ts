import { describe, expect, test } from "bun:test";
import { Agent, Graph, World } from "city-library";

describe("detached graph contracts", () => {
  test("closed options and state validation precede duplicate return without getters", () => {
    let calls = 0;
    expect(() => Graph.create({ get parallel() { calls += 1; return true; } })).toThrow();
    expect(calls).toBe(0);
    for (const edgeState of [null, undefined, [], new Date(), { id: "reserved" }, { tie: "reserved" }, { tieMode: "fixed" }]) {
      expect(() => Graph.create({ edgeState } as never)).toThrow();
    }
    const graph = Graph.create<object, { weight: number }>({ edgeState: { weight: 1 } });
    const a = graph.nodes.add({}); const b = graph.nodes.add({});
    const edge = graph.edges.add({ from: a, to: b });
    for (const options of [
      { from: a, to: b, state: { weight: NaN } },
      { from: a, to: b, state: { id: "reserved" } },
      { from: a, to: b, path: [] },
      { from: a, to: b, directed: 0 },
      { from: a, to: b, get state() { calls += 1; return { weight: 2 }; } },
    ]) expect(() => graph.edges.add(options as never)).toThrow();
    expect(calls).toBe(0);
    expect(graph.edges.size).toBe(1);
    expect(edge.weight).toBe(1);
  });

  test("edge state keeps cyclic aliases, independent defaults and framework identities", () => {
    const value: { nest: { value: number }; self?: unknown; alias?: unknown } = { nest: { value: 1 } };
    value.self = value; value.alias = value.nest;
    const graph = Graph.create<object, typeof value>({ edgeState: value });
    const a = graph.nodes.add({}); const b = graph.nodes.add({}); const c = graph.nodes.add({});
    const first = graph.edges.add({ from: a, to: b });
    const second = graph.edges.add({ from: b, to: c });
    // A copied state root becomes the Edge object, retaining its internal root cycles.
    expect(first.self).toBe(first);
    expect(first.alias).toBe(first.nest);
    expect(second.nest).not.toBe(first.nest);
    first.nest.value = 8;
    expect(value.nest.value).toBe(1);
    expect(second.nest.value).toBe(1);
    const holder = Agent.create({ graph, first });
    expect(holder.copy().graph).toBe(graph);
    first.delete();
    expect(() => holder.copy()).toThrow();
  });

  test("active collection guards reject both kinds of structural mutation and release", () => {
    const graph = Graph.create();
    const a = graph.nodes.add({}); const b = graph.nodes.add({});
    const edge = graph.edges.add({ from: a, to: b });
    const iterator = graph.nodes[Symbol.iterator]();
    expect(iterator.next().value).toBe(a);
    expect(graph.nodes.add(a)).toBe(a);
    expect(graph.edges.add({ from: b, to: a })).toBe(edge);
    expect(() => edge.delete()).toThrow();
    expect(() => graph.delete()).toThrow();
    expect(() => graph.nodes.delete(b)).toThrow();
    expect(edge.alive).toBe(true);
    iterator.return?.();
    edge.delete();
    expect(edge.alive).toBe(false);
    const edgeIterator = graph.edges[Symbol.iterator]();
    expect(edgeIterator.next().done).toBe(true);
    graph.nodes.delete(b);
    expect(graph.nodes.size).toBe(1);
    for (const _node of graph.nodes) break;
    graph.nodes.add({});
    expect(graph.nodes.size).toBe(2);
  });

  test("Agent deletion preflights every graph before World detach or cleanup", () => {
    const agent = Agent.create({ value: 1 }); const other = Agent.create();
    const world = World.create(); world.add([agent, other]);
    const first = Graph.create(); const second = Graph.create();
    for (const graph of [first, second]) { graph.nodes.add(agent); graph.nodes.add(other); graph.edges.add({ from: agent, to: other }); }
    const iterator = second.edges[Symbol.iterator](); iterator.next();
    expect(() => agent.delete()).toThrow();
    expect(agent.alive).toBe(true);
    expect(agent.world).toBe(world);
    expect(first.hasNode(agent)).toBe(true);
    expect(first.edges.size).toBe(1);
    expect(second.edges.size).toBe(1);
    iterator.return?.();
    agent.delete();
    expect(agent.alive).toBe(false);
    expect(agent.world).toBeUndefined();
    expect(first.hasNode(agent)).toBe(false);
    expect(second.hasNode(agent)).toBe(false);
    expect(first.edges.size + second.edges.size).toBe(0);
  });

  test("node removal unregisters lifecycle participation and leaves other graphs alone", () => {
    const agent = Agent.create(); const other = Agent.create();
    const first = Graph.create(); const second = Graph.create();
    first.nodes.add(agent); first.nodes.add(other); second.nodes.add(agent);
    first.nodes.delete(agent);
    const iterator = first.nodes[Symbol.iterator](); iterator.next();
    agent.delete();
    expect(second.hasNode(agent)).toBe(false);
    iterator.return?.();
  });

  test("direction queries preserve insertion, loops once and frozen snapshots", () => {
    const graph = Graph.create({ parallel: true, selfLoops: true });
    const a = graph.nodes.add({}); const b = graph.nodes.add({}); const c = graph.nodes.add({});
    const inward = graph.edges.add({ from: b, to: a, directed: true });
    const outward = graph.edges.add({ from: a, to: c, directed: true });
    const loop = graph.edges.add({ from: a, to: a, directed: true });
    graph.edges.add({ from: b, to: a });
    expect(graph.neighbors(a)).toEqual([c, a, b]);
    expect(graph.neighbors(a, { direction: "in" })).toEqual([b, a]);
    expect(graph.edges.between(a, a, { direction: "all" })).toEqual([loop]);
    const snapshot = graph.edges.between(a, b, { direction: "all" });
    expect(Object.isFrozen(snapshot)).toBe(true);
    inward.delete();
    expect(snapshot).toHaveLength(2);
    expect(graph.edges.has(inward)).toBe(false);
    expect(graph.hasEdge({}, b)).toBe(false);
    expect(() => graph.neighbors({})).toThrow();
    expect(() => graph.neighbors(a, { direction: null } as never)).toThrow();
    expect(outward.alive).toBe(true);
  });

  test("parallel key allocation is monotonic and rejected insertions consume no key", () => {
    const graph = Graph.create({ parallel: true }); const a = graph.nodes.add({}); const b = graph.nodes.add({});
    graph.edges.add({ from: a, to: b, key: "0" });
    graph.edges.add({ from: a, to: b, key: "2" });
    expect(() => graph.edges.add({ from: a, to: b, state: { weight: Infinity } })).toThrow();
    const one = graph.edges.add({ from: a, to: b }); expect(one.key).toBe("1");
    one.delete();
    expect(graph.edges.add({ from: a, to: b }).key).toBe("3");
    graph.delete({ edgesOnly: true });
    expect(graph.edges.add({ from: a, to: b }).key).toBe("4");
  });
});
