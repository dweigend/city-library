import { describe, expect, test } from "bun:test";
import { create } from "../experiments/neighborhood-heat-intervention/model.ts";
import { heatMap } from "../experiments/neighborhood-heat-intervention/ui.ts";

describe("neighborhood heat observation geometry", () => {
  test("the same heat index has the same color across geometry and time", () => {
    const narrow = create({ width: 2, shadeCooling: 0 });
    const wide = create({ width: 8, shadeCooling: 0 });
    const initial = narrow.read();
    const initialColor = heatMap(initial).cells![0]!.color;
    wide.advance(10);
    expect(heatMap(wide.read()).cells!.every(cell => cell.color === initialColor)).toBe(true);
    narrow.setShadeCooling(2);
    narrow.advance();
    const cooled = narrow.read();
    const projection = heatMap(cooled);
    expect(projection.cells!.filter(cell => cell.x < 0).every(cell => cell.color !== initialColor)).toBe(true);
    expect(projection.cells!.filter(cell => cell.x > 0).every(cell => cell.color === initialColor)).toBe(true);
    expect(heatMap(initial).cells!.every(cell => cell.color === initialColor)).toBe(true);
    expect(narrow.read()).toEqual(cooled);
  });
  test("describes real centered unit fields without mutating time or measurements", () => {
    const instance = create({ width: 4 });
    const initial = instance.read();
    expect(initial.width).toBe(4);
    expect(initial.height).toBe(4);
    expect(initial.fields.map(field => [field.x, field.y])).toEqual([
      [-1.5, -1.5], [-0.5, -1.5], [0.5, -1.5], [1.5, -1.5],
      [-1.5, -0.5], [-0.5, -0.5], [0.5, -0.5], [1.5, -0.5],
      [-1.5, 0.5], [-0.5, 0.5], [0.5, 0.5], [1.5, 0.5],
      [-1.5, 1.5], [-0.5, 1.5], [0.5, 1.5], [1.5, 1.5],
    ]);
    expect(initial.fields.filter(field => field.shaded).every(field => field.x < 0)).toBe(true);
    expect(instance.read()).toEqual(initial);
    expect(Object.isFrozen(initial.fields)).toBe(true);
    expect(initial.fields.every(field => Object.isFrozen(field))).toBe(true);
    instance.advance();
    const next = instance.read();
    expect(next.tick).toBe(1);
    expect(next.fields.map(field => [field.id, field.x, field.y])).toEqual(initial.fields.map(field => [field.id, field.x, field.y]));
    expect(next.fields.filter(field => field.shaded).every(field => field.heatIndex === 29.5)).toBe(true);
    expect(next.fields.filter(field => !field.shaded).every(field => field.heatIndex === 30)).toBe(true);
    expect(initial.fields.every(field => field.heatIndex === 30)).toBe(true);
  });

  test("live cooling affects the same shaded geometry and retains original rule values", () => {
    const instance = create({ width: 2, shadeCooling: 0 });
    instance.advance(3);
    expect(instance.read().fields.every(field => field.heatIndex === 30)).toBe(true);
    instance.setShadeCooling(2);
    const before = instance.read();
    instance.advance();
    const after = instance.read();
    expect(after.tick).toBe(4);
    expect(after.meanHeat).toBe(29);
    expect(after.fields.filter(field => field.shaded).every(field => field.heatIndex === 28)).toBe(true);
    expect(after.fields.map(field => [field.x, field.y, field.shaded])).toEqual(before.fields.map(field => [field.x, field.y, field.shaded]));
  });
});
