import { describe, expect, test } from "bun:test";
import { create } from "../models/pedestrian-crossing-phases/model.ts";
import { crossingData } from "../models/pedestrian-crossing-phases/ui.ts";
import { indexedColor } from "../ui/index.ts";
import { create as createZoning } from "../models/zoning-scenario-comparison/model.ts";
import { zoningData } from "../models/zoning-scenario-comparison/ui.ts";

describe("crossing road projection", () => {
  test("one effective road cell per coordinate retains all nine crosswalk stripes", () => {
    const instance = create({ pedestrianCount: 40 });
    for (const steps of [0, 4, 1]) {
      instance.advance(steps);
      const before = instance.read();
      const scene = crossingData(before);
      const cells = scene.cells ?? [];
      const coordinates = cells.map(cell => `${cell.x}:${cell.y}`);
      expect(new Set(coordinates).size).toBe(cells.length);
      const stripes = cells.filter(cell => cell.id.startsWith("view:stripe:"));
      expect(stripes).toHaveLength(9);
      expect(stripes.every(cell => cell.color === indexedColor(9))).toBe(true);
      expect(cells.filter(cell => cell.id.startsWith("view:road:"))
        .every(cell => cell.color === indexedColor(3))).toBe(true);
      expect(instance.read()).toEqual(before);
    }
  });
});

test("single-parcel studies retain canvas width for two caption columns", () => {
  for (const baseCap of [1, 10]) {
    const instance = createZoning({ parcelCount: 1, baseCap });
    for (const steps of [0, 6]) {
      instance.advance(steps);
      const before = instance.read();
      const scene = zoningData(before);
      // A tall, thin world also shrinks its canvas width at the host height limit.
      expect(scene.width).toBeGreaterThanOrEqual(scene.height);
      expect(scene.cells?.filter(cell => cell.id.startsWith("view:slot:")).length)
        .toBe(before.outcomes.reduce((total, outcome) => total + outcome.slotCount, 0));
      expect(instance.read()).toEqual(before);
    }
  }
});
