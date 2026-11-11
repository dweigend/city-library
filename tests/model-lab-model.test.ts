import { describe, expect, test } from "bun:test";
import { createTestModel } from "./fixtures/model-lab-model.ts";
import { createExchangeModel } from "../models/resource-exchange/model.ts";

describe("Headless model actions", () => {
  test("agent view reads are detached observations of canonical agents", () => {
    const model = createTestModel();
    const before = model.read();
    expect(before.agents).toHaveLength(1);
    expect(before.agents[0]).toMatchObject({ id: before.id, energy: 10, alive: true, attached: true, selected: true, x: 0, y: 0, heading: 0 });
    expect(Object.isFrozen(before.agents)).toBe(true);
    expect(Object.isFrozen(before.agents[0])).toBe(true);
    expect(model.read()).toEqual(before);
    expect(model.read()).toEqual(before);
    model.advance(1);
    expect(before.agents[0]?.energy).toBe(10);
    expect(model.read().agents[0]?.energy).toBe(9);
    expect(model.read().tick).toBe(1);
  });

  test("selection addresses existing canonical agents and steps only the selection", () => {
    const model = createTestModel();
    const original = model.read().id;
    model.copy();
    const copied = model.read().id;
    expect(model.read().agents.map((agent) => agent.id)).toEqual([original, copied]);
    expect(model.read().agents.map((agent) => agent.attached)).toEqual([true, false]);
    model.select(original);
    model.advance(1);
    expect(model.read().agents.map((agent) => agent.energy)).toEqual([9, 10]);
    expect(model.read().agents.map((agent) => agent.selected)).toEqual([true, false]);
    model.select(copied);
    expect(model.read().energy).toBe(10);
    expect(model.read().attached).toBe(false);
    const before = model.read();
    expect(() => model.select("unknown-agent")).toThrow(RangeError);
    expect(model.read()).toEqual(before);
  });

  test("detached and deleted test objects stay inspectable without World membership", () => {
    const model = createTestModel();
    const original = model.read().id;
    model.copy();
    model.toggleMembership();
    expect(model.read().agentCount).toBe(2);
    model.delete();
    expect(model.read().agents[1]).toMatchObject({ alive: false, attached: false, selected: true });
    expect(model.read().agentCount).toBe(1);
    model.select(original);
    model.toggleMembership();
    expect(model.read().agents[0]).toMatchObject({ alive: true, attached: false });
    expect(model.read().agentCount).toBe(0);
    expect(model.read().agents).toHaveLength(2);
    expect(model.read().tick).toBe(0);
  });

  test("successful and failed updates share the library clock contract", () => {
    const model = createTestModel();
    model.advance(5);
    expect(model.read().energy).toBe(5);
    expect(model.read().tick).toBe(5);
    expect(() => model.failStep()).toThrow("Intentional step failure");
    expect(model.read().energy).toBe(4);
    expect(model.read().tick).toBe(5);
  });

  test("copy selection preserves the original and requires explicit attachment", () => {
    const model = createTestModel();
    const original = model.read();
    model.copy();
    expect(model.read().id).not.toBe(original.id);
    expect(model.read().energy).toBe(original.energy);
    expect(model.read().attached).toBe(false);
    expect(model.read().agentCount).toBe(1);
    expect(() => model.advance(1)).toThrow("Attach the selected agent");
    expect(model.read().tick).toBe(0);
    model.toggleMembership();
    expect(model.read().agentCount).toBe(2);
    model.advance(1);
    expect(model.read().energy).toBe(9);
    model.delete();
    expect(model.read().alive).toBe(false);
    expect(model.read().agentCount).toBe(1);
    expect(() => model.advance(1)).toThrow("Create a new model");
  });

  test("detachment and input rejection preserve valid state", () => {
    const model = createTestModel(3);
    model.toggleMembership();
    expect(model.read().alive).toBe(true);
    expect(model.read().attached).toBe(false);
    expect(model.read().energy).toBe(3);
    model.toggleMembership();
    model.advance(5);
    expect(model.read().energy).toBe(-2);
    const before = model.read();
    expect(() => createTestModel(Number.NaN)).toThrow(RangeError);
    expect(() => createTestModel(-1)).toThrow(RangeError);
    expect(() => createTestModel(0.5)).toThrow(RangeError);
    expect(model.read()).toEqual(before);
  });
});


describe("Model Lab exchange scenario", () => {
  test("same setup and seed replay the same conserved population dynamics", () => {
    const first = createExchangeModel({ count: 24, initialEnergy: 10, seed: 1 });
    const replay = createExchangeModel({ count: 24, initialEnergy: 10, seed: 1 });
    first.advance(100);
    replay.advance(40);
    replay.advance(60);
    expect(first.read().agents.map((agent) => agent.energy)).toEqual(replay.read().agents.map((agent) => agent.energy));
    expect(first.read().totalEnergy).toBe(240);
    expect(first.read().tick).toBe(100);
    expect(first.read().minimumEnergy).toBeGreaterThanOrEqual(0);
    expect(first.read().maximumEnergy).toBeGreaterThan(first.read().minimumEnergy);
  });

  test("inspection selection and repeated reads leave the exchange stream untouched", () => {
    const inspected = createExchangeModel({ count: 8, seed: 2 });
    const plain = createExchangeModel({ count: 8, seed: 2 });
    const before = inspected.read();
    expect(Object.isFrozen(before.agents)).toBe(true);
    expect(Object.isFrozen(before.randomState)).toBe(true);
    inspected.select(before.agents[3]!.id);
    inspected.read();
    inspected.read();
    expect(inspected.read().randomState).toEqual(before.randomState);
    expect(inspected.read().tick).toBe(0);
    inspected.advance(20);
    plain.advance(20);
    expect(inspected.read().agents.map((agent) => agent.energy)).toEqual(plain.read().agents.map((agent) => agent.energy));
    expect(before.agents.every((agent) => agent.energy === 10)).toBe(true);
  });

  test("population steps remain valid while a detached or deleted object is inspected", () => {
    const model = createExchangeModel({ count: 8, seed: 1 });
    model.toggleMembership();
    expect(model.read().agentCount).toBe(7);
    expect(model.read().totalEnergy).toBe(70);
    model.copy();
    model.delete();
    expect(model.read().alive).toBe(false);
    model.advance(5);
    const state = model.read();
    expect(state.tick).toBe(5);
    expect(state.agentCount).toBe(7);
    expect(state.totalEnergy).toBe(70);
    expect(state.agents.filter((agent) => state.lastInteractionIds.includes(agent.id)).every((agent) => agent.alive && agent.attached)).toBe(true);
    expect(() => model.toggleMembership()).toThrow("deleted agent");
    expect(model.read().tick).toBe(5);
  });
});
