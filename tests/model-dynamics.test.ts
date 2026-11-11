import { describe, expect, test } from "bun:test";
import { Agent, Grid, Graph, Random, World, continuous, twoPhase } from "city-library";

describe("World activation", () => {
  test("nested contexts preserve immediate caller and expire", () => {
    const world = World.create();
    const a = world.add(Agent.create({ value: 1 }));
    const b = world.add(Agent.create({ value: 2 }));
    let saved: Parameters<Parameters<typeof world.activate>[1]>[0] | undefined;
    world.activate(a, (outer) => {
      saved = outer;
      world.activate(b, ({ caller }) => { expect(caller).toBe(a); }, { caller: outer });
    });
    expect(() => saved!.die()).toThrow("expired");
    expect(() => world.activate(b, () => {}, { caller: saved })).toThrow("Expired");
  });
  test("stable priorities validate before callbacks and random draws", () => {
    const world = World.create({ random: Random.create({ seed: 99 }) });
    const members = [1, 2].map((value) => world.add(Agent.create({ value })));
    const before = world.random.state;
    let called = false;
    expect(() => world.activate(members, () => { called = true; }, {
      order: "priority", priority: (member) => member.value === 2 ? NaN : 1,
    })).toThrow(RangeError);
    expect(called).toBe(false);
    expect(world.random.state).toEqual(before);
  });
  test("select is deterministic and activate results retain dead entry positions", () => {
    const world = World.create();
    const a = world.add(Agent.create({ value: 1 }));
    const b = world.add(Agent.create({ value: 2 }));
    expect(world.select([a, b], ({ self }) => self.value > 1)).toEqual([b]);
    b.delete();
    expect(world.activate([a, b], ({ self }) => self.value, { order: "fixed" })).toEqual([1, undefined]);
    expect(() => world.select(a, () => undefined as unknown as boolean)).toThrow(TypeError);
  });
  test("foreign membership fails at visit after preceding effects", () => {
    const world = World.create();
    const other = World.create();
    const a = world.add(Agent.create({ value: 1 }));
    const b = other.add(Agent.create({ value: 2 }));
    expect(() => world.activate([a, b], ({ self }) => { self.value += 1; }, { order: "fixed" })).toThrow(TypeError);
    expect(a.value).toBe(2);
  });
  test("fields and edges require attached owners", () => {
    const world = World.create();
    const grid = world.add(Grid.create({ x: 2, y: 2 }, { state: { value: 0 } }));
    world.activate(grid.fields, ({ self }) => { self.value += 1; }, { order: "fixed" });
    expect(grid.fields.every((field) => field.value === 1)).toBe(true);
    const graph = world.add(Graph.create<object>());
    const a = graph.nodes.add({}); const b = graph.nodes.add({});
    const edge = graph.edges.add({ from: a, to: b });
    world.activate(edge, ({ die }) => { die(); });
    expect(edge.alive).toBe(false);
  });
  test("async callbacks reject before shuffle", () => {
    const world = World.create();
    const a = world.add(Agent.create());
    const state = world.random.state;
    expect(() => world.activate([a], async () => {})).toThrow(TypeError);
    expect(world.random.state).toEqual(state);
    expect(() => world.activate(a, () => Promise.resolve())).toThrow(TypeError);
  });
});

describe("two-phase and linear thresholds", () => {
  test("deduplicates and performs all computes before commits", () => {
    const member = { value: 2 };
    const events: string[] = [];
    twoPhase([member, member], {
      compute: (value) => { events.push("compute"); return value.value + 1; },
      commit: (value, proposal) => { events.push("commit"); value.value = proposal; },
    });
    expect(events).toEqual(["compute", "commit"]);
    expect(member.value).toBe(3);
  });
  test("rejects nonfinite progression and zero-duration crossings", () => {
    expect(() => continuous.linear({ value: Number.MAX_VALUE, rate: Number.MAX_VALUE, duration: 2 })).toThrow(RangeError);
    expect(continuous.crossing({ from: 2, to: 0, threshold: 1, duration: 0 })).toBeUndefined();
    expect(continuous.crossing({ from: 2, to: 0, threshold: 1, duration: 4 })).toEqual({ elapsed: 2, value: 1, direction: "falling" });
    expect(continuous.crossing({ from: -1e308, to: 1e308, threshold: 0, duration: 2 })?.elapsed).toBe(1);
  });
});

describe("Graph and World ownership", () => {
  test("graph mutation rejects foreign nodes before changes", () => {
    const first = World.create(); const second = World.create();
    const graph = first.add(Graph.create<object>());
    const foreign = second.add(Agent.create());
    expect(() => graph.nodes.add(foreign)).toThrow(TypeError);
    expect(graph.nodes.size).toBe(0);
  });
  test("node attachment respects existing graph ownership atomically", () => {
    const first = World.create(); const second = World.create();
    const node = Agent.create();
    const graph = first.add(Graph.create<object>());
    graph.nodes.add(node);
    const local = Agent.create();
    expect(() => second.add([local, node])).toThrow(TypeError);
    expect(second.agents.length).toBe(0);
    graph.nodes.delete(node);
    expect(second.add(node)).toBe(node);
  });
  test("a graph and its detached Agent attach together, foreign graphs reject", () => {
    const first = World.create(); const second = World.create();
    const graph = Graph.create<object>(); const node = Agent.create();
    graph.nodes.add(node);
    first.add([graph, node]);
    expect(first.agents[0]).toBe(node);
    expect(first.graphs[0]).toBe(graph);
    first.delete(graph);
    expect(() => second.add(graph)).toThrow(TypeError);
    expect(second.graphs.length).toBe(0);
  });
});

test("Field ownership follows Grid when used as a graph node", () => {
  const first = World.create(); const second = World.create();
  const grid = Grid.create({ x: 2, y: 2 });
  const field = grid.fields[0]!;
  const graph = first.add(Graph.create<object>());
  graph.nodes.add(field);
  expect(() => second.add(grid)).toThrow(TypeError);
  expect(second.grids.length).toBe(0);
  graph.nodes.delete(field);
  expect(second.add(grid)).toBe(grid);
  expect(() => graph.nodes.add(field)).toThrow(TypeError);
});

test("priority never evaluates already-dead members", () => {
  const world = World.create();
  const dead = world.add(Agent.create({ priority: 1 }));
  const live = world.add(Agent.create({ priority: 2 }));
  dead.delete();
  const priorities: object[] = [];
  world.activate([dead, live], () => {}, {
    order: "priority", priority: (member) => { priorities.push(member); return member.priority; },
  });
  expect(priorities).toEqual([live]);
});

test("outer death unwinds through nested frames and expires both", () => {
  const world = World.create();
  const outer = world.add(Agent.create()); const inner = world.add(Agent.create());
  let afterInner = false;
  let afterOuter = false;
  world.activate(outer, (context) => {
    world.activate(inner, () => { context.die(); afterInner = true; }, { caller: context });
    afterOuter = true;
  });
  expect(outer.alive).toBe(false);
  expect(inner.alive).toBe(true);
  expect(afterInner).toBe(false);
  expect(afterOuter).toBe(false);
});

test("endpoint crossings retain exact supplied duration", () => {
  expect(continuous.crossing({ from: -1e308, to: 1e308, threshold: 1e308, duration: 0.3 })?.elapsed).toBe(0.3);
  expect(continuous.crossing({ from: 0, to: 1, threshold: Number.MIN_VALUE, duration: Number.MIN_VALUE })?.elapsed).toBe(0);
});


test("detaching absent membership ignores an external graph's attachment policy", () => {
  const graphWorld = World.create();
  const other = World.create();
  const detached = Agent.create();
  const graph = graphWorld.add(Graph.create<object>());
  graph.nodes.add(detached);
  expect(() => other.delete(detached)).not.toThrow();
  expect(detached.world).toBeUndefined();
  expect(graph.hasNode(detached)).toBe(true);
  expect(() => other.add(detached)).toThrow(TypeError);
  expect(other.agents).toEqual([]);
});


test("continuous and two-phase boundaries reject accessors and unknown options", () => {
  let reads = 0;
  const progression = { value: 0, duration: 1, get rate() { reads += 1; return 2; } };
  expect(() => continuous.linear(progression)).toThrow(TypeError);
  const crossing = { from: 0, to: 2, duration: 1, get threshold() { reads += 1; return 1; } };
  expect(() => continuous.crossing(crossing)).toThrow(TypeError);
  expect(() => continuous.linear({ value: 0, rate: 2, duration: 1, typo: true } as Parameters<typeof continuous.linear>[0])).toThrow(TypeError);
  expect(() => continuous.crossing({ from: 0, to: 2, threshold: 1, duration: 0, typo: true } as Parameters<typeof continuous.crossing>[0])).toThrow(TypeError);
  const actions = { get compute() { reads += 1; return () => 1; }, commit() {} };
  expect(() => twoPhase([{}], actions)).toThrow(TypeError);
  expect(() => twoPhase([], { compute: () => 1, commit() {}, typo: true } as Parameters<typeof twoPhase>[1])).toThrow(TypeError);
  expect(reads).toBe(0);
});
