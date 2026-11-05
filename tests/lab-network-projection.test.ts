import { describe, expect, test } from "bun:test";
import { createExchangeModel } from "../examples/models/exchange.ts";
import { createTestModel } from "../models/agent-lab/model.ts";
import { projectNetwork } from "../Agend_Lab/ui/visualization/projection.ts";
import { createLabSession, isExchangeSnapshot } from "../Agend_Lab/ui/application/session.ts";
import { createNetworkDiffusionModel } from "../examples/models/network-diffusion.ts";

describe("lab network observation projection", () => {
  test("projects only the explicit latest pair, without changing model state or RNG", () => {
    const model = createExchangeModel({ count: 4, seed: 7 });
    expect(projectNetwork(model.read()).edges).toEqual([]);
    model.advance();
    const before = model.read();
    const view = projectNetwork(before);
    expect(view.nodes.map((node) => node.id)).toEqual(before.agents.map((agent) => agent.id));
    expect(view.edges).toEqual([{ id: "last-interaction", source: before.lastInteractionIds[0]!, target: before.lastInteractionIds[1]! }]);
    expect(view.nodes[0]).not.toBe(before.agents[0]);
    expect(model.read()).toEqual(before);
    model.advance();
    expect(projectNetwork(model.read()).edges).toHaveLength(1);
    model.toggleMembership();
    expect(projectNetwork(model.read()).edges).toEqual([]);
  });

  test("lifecycle has no invented relations, and copies/deleted nodes retain observable identity", () => {
    const model = createTestModel();
    const first = model.read().id;
    model.copy();
    model.delete();
    const view = projectNetwork(model.read());
    expect(view.edges).toEqual([]);
    expect(view.nodes).toHaveLength(2);
    expect(view.nodes[0]!.id).toBe(first);
    expect(view.nodes[1]).toMatchObject({ alive: false, selected: true, attached: false });
  });

  test("snapshot model coordinates never become display-layout coordinates", () => {
    const model = createExchangeModel({ count: 2 });
    const snapshot = model.read();
    const view = projectNetwork(snapshot);
    expect(view.nodes[0]).not.toHaveProperty("x");
    expect(view.nodes[0]).not.toHaveProperty("y");
    expect(view.nodes[0]).not.toHaveProperty("position");
    view.nodes[0]!.energy = 999;
    expect(model.read()).toEqual(snapshot);
  });
});

test("lab application delegates selection and resets atomically without advancing the model", () => {
  const session = createLabSession("exchange");
  session.advance(3);
  const before = session.read();
  if (!isExchangeSnapshot(before)) throw new Error("Expected exchange model.");
  session.select(before.agents[1]!.id);
  const selected = session.read();
  if (!isExchangeSnapshot(selected)) throw new Error("Expected exchange model.");
  expect(selected.randomState).toEqual(before.randomState);
  expect(selected.tick).toBe(before.tick);
  expect(selected.agents.map(({ selected: _selected, ...agent }) => agent))
    .toEqual(before.agents.map(({ selected: _selected, ...agent }) => agent));
  expect(session.revision).toBe(0);
  expect(() => session.create("exchange", { count: 1 })).toThrow();
  expect(session.read()).toEqual(selected);
  expect(session.revision).toBe(0);
  session.create("lifecycle", { initialEnergy: 20 });
  expect(session.revision).toBe(1);
  expect(projectNetwork(session.read()).edges).toEqual([]);
  expect(session.read()).toMatchObject({ energy: 20, tick: 0, agentCount: 1 });
});

test("diffusion projection copies canonical contacts and state without advancing the model", () => {
  const model = createNetworkDiffusionModel({ count: 12, transmission: 1 });
  const before = model.read();
  const projected = projectNetwork(before);
  expect(projected.edges.map((edge) => [edge.id, edge.source, edge.target]))
    .toEqual(before.edges.map((edge) => [edge.id, edge.from, edge.to]));
  expect(projected.nodes[0]).toMatchObject({ state: "active", community: 0 });
  expect(projected.nodes[0]).not.toHaveProperty("energy");
  expect(projected.nodes[0]).not.toBe(before.agents[0]);
  expect(projected.edges[0]).not.toBe(before.edges[0]);
  projected.nodes[0]!.label = "view only";
  expect(model.read()).toEqual(before);
  model.setBridges(false);
  expect(projectNetwork(model.read()).edges.filter((edge) => edge.kind === "bridge")).toEqual([]);
});
