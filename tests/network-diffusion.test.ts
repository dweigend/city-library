import { describe, expect, test } from "bun:test";
import { Random } from "city-library";
import { createNetworkDiffusionModel } from "../examples/models/network-diffusion.ts";

describe("headless network diffusion", () => {
  test("ring propagation is synchronous and new adopters wait until the next tick", () => {
    const model = createNetworkDiffusionModel({ count: 12, topology: "ring", transmission: 1 });
    model.advance();
    expect(model.read().counts).toEqual({ unaware: 9, active: 3, settled: 0 });
    expect(model.read().tick).toBe(1);
    model.advance();
    expect(model.read().counts).toEqual({ unaware: 7, active: 5, settled: 0 });
  });

  test("bridges change reachable adoption, and cutting them prevents cross-group spread", () => {
    const isolated = createNetworkDiffusionModel({ count: 12, transmission: 1, bridges: false });
    const connected = createNetworkDiffusionModel({ count: 12, transmission: 1 });
    const cut = createNetworkDiffusionModel({ count: 12, transmission: 1 });
    cut.setBridges(false);
    isolated.advance(20);
    connected.advance(20);
    cut.advance(20);
    expect(isolated.read().counts).toEqual({ unaware: 8, active: 0, settled: 4 });
    expect(cut.read().counts).toEqual(isolated.read().counts);
    expect(connected.read().counts).toEqual({ unaware: 0, active: 0, settled: 12 });
    expect(connected.read().contactCount - isolated.read().contactCount).toBe(2);
    expect(isolated.read().agents.filter((agent) => agent.community > 0).every((agent) => agent.state === "unaware")).toBe(true);
  });

  test("hub and ring differ after one tick and old active senders transmit before settling", () => {
    const hub = createNetworkDiffusionModel({ count: 10, topology: "hub", transmission: 1, activeTicks: 1 });
    const ring = createNetworkDiffusionModel({ count: 10, topology: "ring", transmission: 1, activeTicks: 1 });
    const before = hub.read().randomState;
    hub.advance();
    ring.advance();
    expect(hub.read().counts).toEqual({ unaware: 0, active: 9, settled: 1 });
    expect(ring.read().counts).toEqual({ unaware: 7, active: 2, settled: 1 });
    expect(hub.read().randomState).toEqual(before);
    expect(hub.read().newActivations).toBe(9);
    hub.advance();
    expect(hub.read().done).toBe(true);
  });

  test("same seed reproduces every state and bounded trajectory without shared identities", () => {
    const a = createNetworkDiffusionModel({ seed: 17 });
    const b = createNetworkDiffusionModel({ seed: 17 });
    expect(a.read().id).not.toBe(b.read().id);
    for (let step = 0; step < 40; step += 1) {
      a.advance(); b.advance();
      expect(a.read().agents.map(({ state, activeAge }) => [state, activeAge]))
        .toEqual(b.read().agents.map(({ state, activeAge }) => [state, activeAge]));
      expect(a.read().history).toEqual(b.read().history);
      expect(a.read().randomState).toEqual(b.read().randomState);
      const counts = a.read().counts;
      expect(counts.unaware + counts.active + counts.settled).toBe(60);
    }
  });

  test("selection, topology observation and bridge edits leave tick, states and stream alone", () => {
    const model = createNetworkDiffusionModel({ count: 12 });
    model.advance(2);
    const before = model.read();
    model.select(before.agents[5]!.id);
    model.setBridges(false);
    const after = model.read();
    expect(after.tick).toBe(before.tick);
    expect(after.randomState).toEqual(before.randomState);
    expect(after.counts).toEqual(before.counts);
    expect(after.parameters.bridges).toBe(false);
    expect(after.edges.every((edge) => edge.kind === "contact")).toBe(true);
    expect(after.contactCount).toBe(before.contactCount - 2);
    model.setBridges(false);
    expect(model.read()).toEqual(after);
    model.setBridges(true);
    expect(model.read().contactCount).toBe(before.contactCount);
    expect(Object.isFrozen(after)).toBe(true);
    expect(Object.isFrozen(after.agents[0])).toBe(true);
    expect(Object.isFrozen(after.edges)).toBe(true);
    expect(Object.isFrozen(after.history[0])).toBe(true);
  });

  test("zero transmission draws nothing; explicit activation resumes a completed cascade", () => {
    const model = createNetworkDiffusionModel({ count: 9, transmission: 0, activeTicks: 1 });
    const before = model.read();
    model.advance(5);
    expect(model.read().randomState).toEqual(before.randomState);
    expect(model.read().counts).toEqual({ unaware: 8, active: 0, settled: 1 });
    expect(model.read().done).toBe(true);
    model.select(model.read().agents[4]!.id);
    const state = model.read();
    model.seedSelected();
    expect(model.read().state).toBe("active");
    expect(model.read().activeAge).toBe(0);
    expect(model.read().tick).toBe(state.tick);
    expect(model.read().randomState).toEqual(state.randomState);
    expect(model.read().counts).toEqual({ unaware: 7, active: 1, settled: 1 });
    expect(model.read().done).toBe(false);
    expect(() => model.seedSelected()).toThrow();
  });

  test("input and action rejection preserve model observations", () => {
    for (const options of [{ count: 2 }, { count: 201 }, { transmission: -1 }, { transmission: 1.01 }, { activeTicks: 0 }, { activeTicks: 1.5 }, { seed: Infinity }]) {
      expect(() => createNetworkDiffusionModel(options)).toThrow();
    }
    for (const key of ["count", "seed", "transmission", "activeTicks", "topology", "bridges"]) {
      expect(() => createNetworkDiffusionModel({ [key]: null } as never)).toThrow();
    }
    const model = createNetworkDiffusionModel({ count: 6, topology: "ring" });
    const before = model.read();
    expect(() => model.select("absent")).toThrow();
    expect(() => model.setBridges(false)).toThrow();
    expect(() => model.advance(-1)).toThrow();
    expect(() => model.advance(0.5)).toThrow();
    expect(model.read()).toEqual(before);
  });

  test("history keeps the initial sample plus only the latest 240 model ticks", () => {
    const model = createNetworkDiffusionModel({ count: 3, transmission: 0 });
    model.advance(300);
    const { history, tick } = model.read();
    expect(tick).toBe(300);
    expect(history).toHaveLength(241);
    expect(history[0]!.tick).toBe(0);
    expect(history[1]!.tick).toBe(61);
    expect(history.at(-1)!.tick).toBe(300);
  });

  test("multiple active neighbors combine exposure while draws follow unaware-agent insertion order", () => {
    const model = createNetworkDiffusionModel({ count: 6, topology: "ring", transmission: 0.5, seed: 1 });
    model.select(model.read().agents[2]!.id);
    model.seedSelected();
    const random = Random.add({ seed: 1 });
    const expected = [random.number() < 0.75, random.number() < 0.5, random.number() < 0.5];
    model.advance();
    const after = model.read();
    expect([after.agents[1]!.state === "active", after.agents[3]!.state === "active", after.agents[5]!.state === "active"])
      .toEqual(expected);
    expect(after.agents[4]!.state).toBe("unaware");
    expect(after.randomState).toEqual(random.state);
  });
});
