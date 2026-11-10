/// <reference lib="dom" />
import { describe, expect, test } from "bun:test";
import { chartGeometry, niceTicks, numericSpacing, prepareChartData, tickText } from "../ui/views/chart.ts";

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

  test("numeric-coordinate bars retain coordinates, repeated positions and finite filtering", () => {
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

  test("axis ticks use rounded steps that cover the data and readable precision", () => {
    expect(niceTicks(0, 0.46, 5)).toMatchObject({ min: 0, max: 0.5, step: 0.1 });
    expect(niceTicks(-3, 5, 4).values).toEqual([-4, -2, 0, 2, 4, 6]);
    expect(niceTicks(0, 0.46, 5).values).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5]);
    expect(niceTicks(0, 16899, 6)).toMatchObject({ min: 0, max: 20000, step: 5000 });
    expect(niceTicks(0, 2, 5, 1).values).toEqual([0, 1, 2]);
    expect(tickText(0.30000000000000004, 0.1)).toBe("0.3");
    expect(tickText(16000, 2000)).toBe("16000");
    expect(tickText(1_200_000, 200_000)).toBe("1.2M");
  });

  test("flat or empty data keeps a unit span and numeric bars share the smallest bin spacing", () => {
    expect(prepareChartData("line", [{ label: "Flat", points: [{ x: 0, y: 0 }] }])).toMatchObject({ minY: 0, maxY: 1 });
    const flat = prepareChartData("line", [{ label: "Luminosity", points: [{ x: 0, y: 0.8 }, { x: 5, y: 0.8 }] }]);
    expect(flat.minY).toBeCloseTo(0.4);
    expect(flat.maxY).toBeCloseTo(1.2);
    const prices = prepareChartData("line", [{ label: "Price", points: [{ x: 10, y: 16 }, { x: 20, y: 17.5 }] }]);
    expect([prices.minX, prices.maxX, prices.minY, prices.maxY]).toEqual([10, 20, 16, 17.5]);
    const counts = prepareChartData("bar", [{ label: "Counts", points: [{ x: "A", y: 4 }, { x: "B", y: 9 }] }]);
    expect([counts.minY, counts.maxY]).toEqual([0, 9]);
    const dodged = prepareChartData("bar", [
      { label: "First", points: [{ x: 1, y: 2 }] },
      { label: "Second", points: [{ x: 1, y: 3 }] },
    ]);
    const geometry = chartGeometry(dodged);
    const first = geometry.bar(dodged.series[0]!.points[0]!, 0);
    const second = geometry.bar(dodged.series[1]!.points[0]!, 1);
    expect(first.x + first.width).toBeLessThanOrEqual(second.x + 1e-9);
    expect(numericSpacing(prepareChartData("bar", [{ label: "Bins", points: [{ x: 0, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 1 }] }]))).toBe(1);
  });
});
