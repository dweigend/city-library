import { test, expect } from "bun:test";
import { create as fire } from "../experiments/fire/model.ts";
import { create as life } from "../experiments/life/model.ts";
import { create as oil } from "../experiments/percolation/model.ts";

test("fixtures reject sparse/accessor values without invoking getters or changing state", () => {
  for (const [model, set] of [
    [fire({ width: 3, height: 3 }), "setForest"],
    [life({ width: 3, height: 3 }), "setCells"],
  ] as const) {
    const before = model.read();
    const sparse = Array<boolean>(9);
    expect(() =>
      (model as unknown as Record<string, (v: boolean[]) => void>)[set]!(
        sparse,
      ),
    ).toThrow();
    let read = false;
    const getter = Array(9).fill(false) as boolean[];
    Object.defineProperty(getter, 4, {
      get() {
        read = true;
        return true;
      },
    });
    expect(() =>
      (model as unknown as Record<string, (v: boolean[]) => void>)[set]!(
        getter,
      ),
    ).toThrow();
    expect(read).toBe(false);
    expect(model.read()).toEqual(before);
  }
});

test("Life gesture retains paint/erase latch until release, without time or RNG", () => {
  const m = life({ width: 5, height: 5, initialization: "blank" });
  const rng = m.read().randomState;
  m.setCell({ x: 1, y: 0 }, true);
  m.setDrawing(true);
  m.beginBrush({ x: 0, y: 0 });
  m.moveBrush({ x: 1, y: 0 });
  m.endBrush();
  expect(m.read().counts.living).toBe(2);
  m.beginBrush({ x: 1, y: 0 });
  m.moveBrush({ x: 0, y: 0 });
  m.moveBrush({ x: -1, y: 0 });
  m.endBrush();
  expect(m.read().counts.living).toBe(0);
  m.moveBrush({ x: 2, y: 0 });
  expect(m.read().counts.living).toBe(0);
  expect(m.read().tick).toBe(0);
  expect(m.read().history.length).toBe(1);
  expect(m.read().randomState).toEqual(rng);
  m.setDrawing(false);
  m.beginBrush({ x: 0, y: 0 });
  expect(m.read().counts.living).toBe(0);
});

test("Life palette changes affect births/deaths only until explicit recolor", () => {
  const m = life({ width: 5, height: 5, initialization: "blank" });
  m.setCells(m.read().cells.map((c) => c.y === 0 && Math.abs(c.x) <= 1));
  const oldColor = m.read().cells.find((c) => c.x === 0 && c.y === 0)!.color;
  const rng = m.read().randomState;
  m.setColors({ foreground: "#ffffff", background: "#000000" });
  expect(m.read().cells.find((c) => c.x === 0 && c.y === 0)!.color).toBe(
    oldColor,
  );
  m.advance();
  expect(m.read().cells.find((c) => c.x === 0 && c.y === 0)!.color).toBe(
    oldColor,
  );
  expect(m.read().cells.find((c) => c.x === 0 && c.y === 1)!.color).toBe(
    "#ffffff",
  );
  m.recolor();
  expect(
    m
      .read()
      .cells.filter((c) => c.living)
      .every((c) => c.color === "#ffffff"),
  ).toBe(true);
  const before = m.read();
  expect(() => m.setColors({ foreground: "red" })).toThrow();
  expect(m.read()).toEqual(before);
  expect(m.read().randomState).toEqual(rng);
});

test("Life wraps Moore neighborhoods and never stops a stable board", () => {
  const m = life({ width: 5, height: 5, initialization: "blank" });
  m.setCells(m.read().cells.map((c) => c.y === 0 && [2, -2, -1].includes(c.x)));
  m.advance();
  expect(
    m
      .read()
      .cells.filter((c) => c.living)
      .map((c) => [c.x, c.y]),
  ).toEqual([
    [-2, -1],
    [-2, 0],
    [-2, 1],
  ]);
  m.setCells(Array(25).fill(false));
  m.advance(1005);
  expect(m.read().tick).toBe(1006);
  expect(m.read().done).toBe(false);
  expect(m.read().history.length).toBe(1001);
  expect(m.read().history[0]!.tick).toBe(0);
});

test("Fire hard boundaries, unconditional ignition and complete fade", () => {
  const m = fire({ width: 5, height: 3, density: 0 });
  m.setForest(m.read().cells.map((c) => c.x === 2));
  m.advance(100);
  expect(m.read().counts).toEqual({ trees: 3, fires: 0, embers: 0 });
  expect(m.read().tick).toBe(12);
  expect(m.read().burnedTrees).toBe(0);
  expect(
    m
      .read()
      .cells.filter((c) => c.status === "burned")
      .every((c) => c.emberColor < 11.5),
  ).toBe(true);
  const before = m.read();
  m.advance(5);
  expect(m.read()).toEqual(before);
});

test("Percolation sequential retries consume a new draw after a failed parent entry", () => {
  // Seed 2: parent 3 fails at column 2 (0.8753), parent 1 retries and succeeds (0.1140).
  // Both outer destinations fail, so a once-per-destination implementation leaves no front.
  const m = oil({ width: 5, height: 5, porosity: 50, seed: 2 });
  m.setFront([1, 3]);
  m.advance();
  expect(m.read().totalOil).toBe(2);
  expect(
    m
      .read()
      .cells.filter((c) => c.kind === "oil")
      .map((c) => c.column),
  ).toEqual([2]);
  expect(m.read().randomState.continuation.word).toBe(1135788948);
});

test("Percolation empty front stays stopped and invalid setters are atomic", () => {
  const m = oil({ width: 3, height: 3 });
  m.setFront([]);
  const before = m.read();
  m.advance(100);
  expect(m.read()).toEqual(before);
  for (const value of [[1, 1], [0], [3], Array<number>(1)]) {
    expect(() => m.setFront(value)).toThrow();
    expect(m.read()).toEqual(before);
  }
  m.setRules({ porosity: 99 });
  expect(m.read().done).toBe(true);
});
