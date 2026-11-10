import { describe, expect, test } from "bun:test";
import { create as createHousing } from "../models/residential-occupancy/model.ts";
import { housingData } from "../models/residential-occupancy/ui.ts";
import { create as createCrossing } from "../models/pedestrian-crossing-phases/model.ts";
import { crossingData } from "../models/pedestrian-crossing-phases/ui.ts";
import { create as createRecycling } from "../models/household-recycling-behavior/model.ts";
import { recyclingNodes } from "../models/household-recycling-behavior/ui.ts";
import { create as createZoning } from "../models/zoning-scenario-comparison/model.ts";
import { zoningData } from "../models/zoning-scenario-comparison/ui.ts";
import { create as createMembership } from "../models/workplace-household-membership/model.ts";
import { membershipNodes } from "../models/workplace-household-membership/ui.ts";

function withoutIdentities(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutIdentities);
  if (value !== null && typeof value === "object") return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !["id", "from", "to"].includes(key)).map(([key, entry]) => [key, withoutIdentities(entry)]));
  return value;
}

describe("mechanism-specific social visual projections", () => {
  test("housing shows the actual Resource reservations moving from queue into available slots", () => {
    const instance = createHousing({ applicantCount: 5, slotCount: 2 });
    const before = instance.read();
    const initial = housingData(before);
    expect(initial.cells?.length).toBe(2);
    expect(initial.agents.filter(person => person.x > -3 && person.x < 5).length).toBe(2);
    expect(initial.agents.filter(person => person.x < -3).length).toBe(3);
    instance.moveOut();
    const after = instance.read();
    const changed = housingData(after);
    expect(after.occupiedSlotCount).toBe(2);
    expect(after.waitingHouseholdCount).toBe(2);
    expect(changed.agents.filter(person => person.x > 5).length).toBe(1);
    expect(instance.read()).toEqual(after);
  });

  test("cohort stage changes visibly cross the road without inventing intermediate motion", () => {
    const instance = createCrossing({ pedestrianCount: 4 });
    const initial = crossingData(instance.read());
    expect(initial.agents.slice(0, 4).every(person => person.x < -3)).toBe(true);
    instance.advance(4);
    const crossing = crossingData(instance.read());
    expect(crossing.agents.slice(0, 4).every(person => Math.abs(person.x) < 1)).toBe(true);
    instance.advance();
    expect(crossingData(instance.read()).agents.slice(0, 4).every(person => person.x > 3)).toBe(true);
  });

  test("recycling colors change with adoption while ring layout stays fixed and seeded reads stay inert", () => {
    const visible = createRecycling({ householdCount: 6, influence: 1, seed: 17 });
    const baseline = createRecycling({ householdCount: 6, influence: 1, seed: 17 });
    const initial = recyclingNodes(visible.read());
    const initialColors = initial.map(node => node.color);
    for (let step = 0; step < 6; step += 1) {
      const before = visible.read();
      recyclingNodes(before);
      recyclingNodes(before);
      expect(visible.read()).toEqual(before);
      visible.advance(); baseline.advance();
    }
    const final = recyclingNodes(visible.read());
    expect(final.map(node => node.position)).toEqual(initial.map(node => node.position));
    expect(final.map(node => node.color)).not.toEqual(initialColors);
    expect(withoutIdentities(visible.read())).toEqual(withoutIdentities(baseline.read()));
  });

  test("zoning depicts exactly the completed capacity, leaving pending runs unbuilt", () => {
    const instance = createZoning({ parcelCount: 5, seed: 17 });
    const before = instance.read();
    const initial = zoningData(before);
    expect(initial.agents.length).toBe(6);
    expect(before.runPlan.map(run => run.cap)).toEqual([2, 2, 2, 4, 4, 4]);
    expect(before.runPlan.every(run => Object.isFrozen(run))).toBe(true);
    expect(instance.read().runPlan).not.toBe(before.runPlan);
    expect(initial.cells?.filter(cell => cell.id.startsWith("view:slot:")).length).toBe(0);
    instance.advance(2);
    const state = instance.read();
    const visual = zoningData(state);
    expect(visual.cells?.filter(cell => cell.id.startsWith("view:slot:")).length)
      .toBe(state.outcomes.reduce((sum, outcome) => sum + outcome.slotCount, 0));
    expect(instance.read()).toEqual(state);
  });

  test("zoning projection reads planned scenario metadata rather than guessing replication boundaries", () => {
    const state = createZoning({ parcelCount: 2 }).read();
    const reordered = { ...state, runPlan: [state.runPlan[3]!, state.runPlan[0]!] };
    const visual = zoningData(reordered);
    expect(visual.agents.map(agent => agent.label)).toEqual([
      "Run 1 · cap 4 · pending", "Run 2 · cap 2 · pending",
    ]);
    expect(visual.agents.length).toBe(reordered.runPlan.length);
    expect(state.runPlan.map(run => run.cap)).toEqual([2, 2, 2, 4, 4, 4]);
  });

  test("membership positions are presentation-only and reassignment changes real edges", () => {
    const instance = createMembership({ residentCount: 4 });
    const state = instance.read();
    const initial = membershipNodes(state);
    expect(initial.filter(node => node.position?.x === 0).length).toBe(4);
    expect(initial.filter(node => node.position?.x === -170).length).toBe(2);
    expect(initial.filter(node => node.position?.x === 170).length).toBe(2);
    instance.reassign(0);
    const changed = instance.read();
    expect(changed.people[0]?.workplace).not.toBe(state.people[0]?.workplace);
    expect(membershipNodes(changed)).toEqual(initial);
    expect(changed.edges).not.toEqual(state.edges);
    expect(instance.read()).toEqual(changed);
  });
});
