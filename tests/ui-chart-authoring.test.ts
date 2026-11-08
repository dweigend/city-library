/// <reference lib="dom" />
import { describe, expect, test } from "bun:test";
import { chartGeometry, prepareChartData } from "../ui/views/chart.ts";

describe("chart authoring data and geometry", () => {
  test("first-seen categories share grouped positions without imputing missing observations", () => {
    const data = prepareChartData("bar", [
      { label: "First", color: "#123456", points: [{ x: "B", y: -3 }, { x: "A", y: 0 }] },
      { label: "Second", points: [{ x: "A", y: 7 }, { x: "C", y: 2 }] },
    ]);
    expect(data.categories).toEqual(["B", "A", "C"]);
    expect(data.series.map(line => line.points.length)).toEqual([2, 2]);
    expect(data.series[0]!.color).toBe("#123456");
    const geometry = chartGeometry(data);
    const first = geometry.bar(data.series[0]!.points[1]!, 0);
    const second = geometry.bar(data.series[1]!.points[0]!, 1);
    expect(first.x + first.width).toBeLessThanOrEqual(second.x);
    expect(first.height).toBe(0);
    expect(data.series[1]!.points.some(point => point.category === "B")).toBe(false);
    expect(data.series[0]!.points.some(point => point.category === "C")).toBe(false);
  });

  test("negative and positive values extend in opposite directions from zero", () => {
    const data = prepareChartData("bar", [{ label: "Signed", points: [{ x: "negative", y: -4 }, { x: "positive", y: 6 }] }]);
    const geometry = chartGeometry(data);
    const negative = geometry.bar(data.series[0]!.points[0]!, 0);
    const positive = geometry.bar(data.series[0]!.points[1]!, 0);
    expect(negative.y).toBe(geometry.y(0));
    expect(negative.y + negative.height).toBeCloseTo(geometry.y(-4));
    expect(positive.y).toBe(geometry.y(6));
    expect(positive.y + positive.height).toBeCloseTo(geometry.y(0));
    expect(negative.height).toBeGreaterThan(0);
    expect(positive.height).toBeGreaterThan(0);
  });

  test("mixed x modes across all series and duplicate categories reject", () => {
    expect(() => prepareChartData("bar", [
      { label: "Number", points: [{ x: 1, y: 2 }] },
      { label: "Category", points: [{ x: "one", y: 3 }] },
    ])).toThrow(TypeError);
    expect(() => prepareChartData("bar", [{ label: "Duplicate", points: [{ x: "one", y: 2 }, { x: "one", y: 3 }] }])).toThrow(TypeError);
    expect(() => prepareChartData("bar", [
      { label: "First", points: [{ x: "one", y: 2 }] },
      { label: "Second", points: [{ x: "one", y: 3 }] },
    ])).not.toThrow();
  });

  test("empty categorical input invents no categories or samples and leaves finite geometry", () => {
    const data = prepareChartData("bar", [{ label: "Empty", points: [] }]);
    expect(data.categories).toEqual([]);
    expect(data.series[0]!.points).toEqual([]);
    const geometry = chartGeometry(data);
    expect(Number.isFinite(geometry.x(0))).toBe(true);
    expect(Number.isFinite(geometry.y(0))).toBe(true);
  });

  test("numeric legacy bars retain coordinates, repeated positions and finite filtering", () => {
    const source = [
      { label: "Numeric", points: [{ x: -2, y: -3 }, { x: 8, y: 5 }, { x: 8, y: 2 }, { x: NaN, y: 4 }, { x: 1, y: Infinity }] },
    ];
    const data = prepareChartData("bar", source);
    expect(data.categorical).toBe(false);
    expect(data.series[0]!.points).toEqual([{ x: -2, y: -3 }, { x: 8, y: 5 }, { x: 8, y: 2 }]);
    expect([data.minX, data.maxX, data.minY, data.maxY]).toEqual([-2, 8, -3, 5]);
    const geometry = chartGeometry(data);
    const negative = geometry.bar(data.series[0]!.points[0]!, 0);
    expect(negative.x + negative.width / 2).toBe(geometry.x(-2));
    expect(negative.height).toBeGreaterThan(0);
    expect(source[0]!.points).toHaveLength(5);
  });

  test("line and scatter use unchanged finite numeric point order", () => {
    const input = [{ label: "Numbers", points: [{ x: 5, y: 2 }, { x: 1, y: -1 }, { x: Infinity, y: 3 }] }];
    for (const mode of ["line", "scatter"] as const) {
      expect(prepareChartData(mode, input).series[0]!.points).toEqual([{ x: 5, y: 2 }, { x: 1, y: -1 }]);
    }
  });
  test("responsive plot coordinates fit CSS-sized SVG units while preserving signed groups", () => {
    const data = prepareChartData("bar", [
      { label: "X", points: [{ x: "West", y: -1 }, { x: "East", y: 1 }] },
      { label: "Y", points: [{ x: "West", y: -1 }, { x: "East", y: 1 }] },
    ]);
    for (const width of [280, 366, 640, 1000]) {
      const geometry = chartGeometry(data, 64, width, 134);
      const west = geometry.bar(data.series[0]!.points[0]!, 0);
      const neighboringWest = geometry.bar(data.series[1]!.points[0]!, 1);
      expect(west.x).toBeGreaterThanOrEqual(64);
      expect(west.x + west.width).toBeLessThanOrEqual(neighboringWest.x);
      expect(neighboringWest.x + neighboringWest.width).toBeLessThan(width - 14);
      expect(west.y).toBe(geometry.y(0));
      expect(west.y + west.height).toBe(134);
      expect(geometry.y(1)).toBe(14);
    }
    expect(data.series[0]!.points).toEqual([{ x: 0, y: -1, category: "West" }, { x: 1, y: 1, category: "East" }]);
  });

});
