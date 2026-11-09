import { describe, expect, test } from "bun:test";
import type { SpatialData } from "../ui/index.ts";
import { create as waste } from "../experiments/des-waste-collection/model.ts";
import { scene as wasteScene } from "../experiments/des-waste-collection/scene.ts";
import { create as dispatch } from "../experiments/des-emergency-dispatch/model.ts";
import { scene as dispatchScene } from "../experiments/des-emergency-dispatch/scene.ts";
import { create as bikes } from "../experiments/des-bike-redistribution/model.ts";
import { scene as bikeScene } from "../experiments/des-bike-redistribution/scene.ts";
import { create as water } from "../experiments/des-water-allocation/model.ts";
import { scene as waterScene } from "../experiments/des-water-allocation/scene.ts";
import { create as maintenance } from "../experiments/des-machine-maintenance/model.ts";
import { scene as maintenanceScene } from "../experiments/des-machine-maintenance/scene.ts";

function count(scene: SpatialData, prefix: string, filledOnly = false) {
  return scene.agents.filter(agent => agent.id.startsWith(prefix) && (!filledOnly || agent.filled !== false)).length;
}
function bounded(scene: SpatialData) {
  expect(new Set(scene.agents.map(agent => agent.id)).size).toBe(scene.agents.length);
  for (const agent of scene.agents) {
    expect(Math.abs(agent.x) + (agent.extent?.width ?? 0) / 2).toBeLessThan(scene.width / 2);
    expect(Math.abs(agent.y) + (agent.extent?.height ?? 0) / 2).toBeLessThan(scene.height / 2);
  }
  for (const label of scene.labels ?? []) {
    expect(Math.abs(label.x)).toBeLessThan(scene.width / 2);
    expect(Math.abs(label.y)).toBeLessThan(scene.height / 2);
  }
}

describe("five detached spatial infrastructure scenes", () => {
  test("waste patches and load slots conserve all twelve original units", () => {
    for (const loadCapacity of [1, 12]) {
      const instance = waste({ loadCapacity });
      for (let minute = 0; minute <= 40; minute++) {
        const state = instance.read();
        const before = structuredClone(state);
        const scene = wasteScene(state);
        expect(count(scene, "waste:")).toBe(state.remaining);
        expect(count(scene, "load:", true)).toBe(state.carried);
        expect(count(scene, "load:")).toBe(loadCapacity);
        expect(state.remaining + state.carried + state.delivered).toBe(12);
        expect(state).toEqual(before);
        expect(instance.read()).toEqual(before);
        bounded(scene);
        instance.advance();
      }
    }
  });

  test("dispatch preserves four-node topology and every assigned team through capacity shrink", () => {
    const instance = dispatch({ responders: 3 });
    instance.setResponders(1);
    for (let minute = 0; minute <= 20; minute++) {
      const state = instance.read();
      const before = structuredClone(state);
      const scene = dispatchScene(state);
      expect(count(scene, "call:")).toBe(3);
      expect(count(scene, "team:")).toBe(state.busy);
      expect(count(scene, "idle-team:")).toBe(Math.max(0, state.parameters.responders - state.busy));
      expect(scene.segments).toHaveLength(state.edges.length);
      expect(scene.labels!.map(label => label.text)).toContain("Call 2 · p0");
      expect(instance.read()).toEqual(before);
      bounded(scene);
      instance.advance();
    }
  });

  test("all bike slots and bike dots agree with stores and closed fleet including cargo", () => {
    const instance = bikes({ targetBikes: 6, truckCapacity: 6 });
    for (let minute = 0; minute <= 12; minute++) {
      const state = instance.read();
      const before = structuredClone(state);
      const scene = bikeScene(state);
      expect(count(scene, "bike-slot:")).toBe(54);
      expect(count(scene, "bike-slot:", true) + count(scene, "cargo:")).toBe(state.totalBikes);
      expect(state.totalBikes).toBe(18);
      expect(scene.segments).toHaveLength(2);
      expect(instance.read()).toEqual(before);
      bounded(scene);
      instance.advance();
    }
  });

  test("water keeps twelve allocation glyphs through reserved, delivered and newly funded states", () => {
    const instance = water({ supplyUnits: 3 });
    for (let minute = 0; minute < 5; minute++) {
      const state = instance.read();
      const before = structuredClone(state);
      const scene = waterScene(state);
      expect(count(scene, "allocation:")).toBe(12);
      expect(count(scene, "allocation:", true)).toBe(state.supplied);
      expect(12 - count(scene, "allocation:", true)).toBe(state.unmet);
      expect(instance.read()).toEqual(before);
      bounded(scene);
      instance.addSupply();
      instance.advance();
    }
  });

  test("repair-team triangles represent canonical claims, including retained assignments", () => {
    const instance = maintenance({ repairTeams: 3, repairMinutes: 10 });
    instance.advance(4);
    instance.setRepairTeams(1);
    for (let minute = 4; minute <= 25; minute++) {
      const state = instance.read();
      const before = structuredClone(state);
      const scene = maintenanceScene(state);
      expect(scene.agents.filter(agent => state.machines.some(machine => machine.id === agent.id))).toHaveLength(3);
      expect(count(scene, "crew:")).toBe(state.busy);
      expect(count(scene, "idle-crew:")).toBe(Math.max(0, state.parameters.repairTeams - state.busy));
      expect(instance.read()).toEqual(before);
      bounded(scene);
      instance.advance();
    }
  });
});
