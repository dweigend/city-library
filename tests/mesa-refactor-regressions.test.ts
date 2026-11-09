import { describe, expect, test } from "bun:test";
import { create } from "../experiments/pedestrian-crossing-phases/model.ts";
import { crossingData } from "../experiments/pedestrian-crossing-phases/ui.ts";
import { netLogoColor } from "../ui/index.ts";

describe("crossing road projection", () => {
  test("one effective road cell per coordinate retains all nine crosswalk stripes", () => {
    const instance = create({ pedestrians: 40 });
    for (const steps of [0, 4, 1]) {
      instance.advance(steps);
      const before = instance.read();
      const scene = crossingData(before);
      const cells = scene.cells ?? [];
      const coordinates = cells.map(cell => `${cell.x}:${cell.y}`);
      expect(new Set(coordinates).size).toBe(cells.length);
      const stripes = cells.filter(cell => cell.id.startsWith("view:stripe:"));
      expect(stripes).toHaveLength(9);
      expect(stripes.every(cell => cell.color === netLogoColor(9))).toBe(true);
      expect(cells.filter(cell => cell.id.startsWith("view:road:"))
        .every(cell => cell.color === netLogoColor(3))).toBe(true);
      expect(instance.read()).toEqual(before);
    }
  });
});
