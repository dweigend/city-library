import { describe, expect, test } from "bun:test";
import {
  create as smooth,
  sigmoid,
  transition,
} from "../experiments/smoothlife/model.ts";
import { create as hex } from "../experiments/hex-cell-aggregation/model.ts";
import { create as vants } from "../experiments/vants/model.ts";
import {
  create as turing,
  directionToNumber,
  numberToDirection,
  type Rule,
} from "../experiments/turing-machine-2d/model.ts";

describe("selected B19 SmoothLife source equation", () => {
  test("discrete Euclidean disk and annulus have exact normalizers, include self and wrap", () => {
    const m = smooth({ width: 9, height: 9, innerRadius: 1, outerRadius: 2 });
    expect(m.read().innerCount).toBe(5);
    expect(m.read().outerCount).toBe(8);
    // A corner impulse contributes to both sides of the periodic boundary.
    m.setCells(
      m.read().cells.map((cell) => (cell.x === -4 && cell.y === -4 ? 1 : 0)),
    );
    const settings = m.read().parameters;
    m.advance();
    expect(
      m.read().cells.find((cell) => cell.x === 4 && cell.y === -4)!.value,
    ).toBe(transition(0, 1 / 5, settings));
    expect(
      m.read().cells.find((cell) => cell.x === 3 && cell.y === -4)!.value,
    ).toBe(transition(1 / 8, 0, settings));
  });
  test("unique periodic neighbors on a tiny torus and source's cutoff", () => {
    const m = smooth({ width: 3, height: 3, innerRadius: 0, outerRadius: 2 });
    expect(m.read().innerCount).toBe(1);
    expect(m.read().outerCount).toBe(8);
    m.setCells(m.read().cells.map(() => 1e-4));
    m.advance();
    for (const cell of m.read().cells)
      expect(cell.value).toBe(transition(0, 0, m.read().parameters));
    expect(() =>
      smooth({ width: 3, height: 3, innerRadius: 0, outerRadius: 0.5 }),
    ).toThrow();
  });
  test("paint is periodic, erase preserves ticks and observations do not advance random", () => {
    const m = smooth({
      width: 9,
      height: 9,
      innerRadius: 1,
      outerRadius: 2,
      paintRadius: 1,
      paintValue: 1,
    });
    m.eraseAll();
    const before = m.read();
    expect(m.visualizeTransition(3)).toHaveLength(9);
    expect(m.read()).toEqual(before);
    m.paint({ x: 4, y: 0 });
    expect(m.read().cells.filter((cell) => cell.value === 1)).toHaveLength(5);
    expect(
      m.read().cells.find((cell) => cell.x === -4 && cell.y === 0)!.value,
    ).toBe(1);
    expect(m.read().tick).toBe(0);
    expect(m.read().randomState).toEqual(before.randomState);
    m.advance(2);
    m.eraseAll();
    expect(m.read().tick).toBe(2);
    expect(m.read().cells.every((cell) => cell.value === 0)).toBe(true);
  });
  test("live rules are atomic, radii remain setup-only and numerical guards reject invalid equations", () => {
    const m = smooth({ width: 9, height: 9, innerRadius: 1, outerRadius: 2 });
    const before = m.read();
    expect(() => m.setRules({ innerStepWidth: 0 })).toThrow();
    // @ts-expect-error Radius changes require setup, as cached in the source.
    expect(() => m.setRules({ outerRadius: 4 })).toThrow();
    expect(m.read()).toEqual(before);
    expect(() => m.setCells(Array(81).fill(Infinity))).toThrow();
    expect(m.read()).toEqual(before);
    expect(() => sigmoid(0, 0, 0)).toThrow();
    expect(() => transition(2, 0, before.parameters)).toThrow();
    expect(() => m.advance(-1)).toThrow();
    expect(m.read().tick).toBe(0);
  });
});

describe("selected B19 bounded hex aggregation", () => {
  test("six source offset neighbors are reciprocal and bounded", () => {
    const m = hex({ width: 9, height: 9 });
    const state = m.read();
    const center = state.cells.find((cell) => cell.x === 0 && cell.y === 0)!;
    expect(center.neighborIds).toHaveLength(6);
    expect(
      center.neighborIds
        .map((id) => state.cells.find((cell) => cell.id === id)!)
        .map((cell) => `${cell.x},${cell.y}`)
        .sort(),
    ).toEqual(["-1,-1", "-1,0", "0,-1", "0,1", "1,-1", "1,0"]);
    expect(
      state.cells.find((cell) => cell.x === -4 && cell.y === -4)!.neighborIds
        .length,
    ).toBeLessThan(6);
    for (const cell of state.cells)
      for (const id of cell.neighborIds)
        expect(
          state.cells.find((neighbor) => neighbor.id === id)!.neighborIds,
        ).toContain(cell.id);
  });
  test("each successful activation adds one cell and counts canonical live neighbors", () => {
    const m = hex({ width: 9, height: 9, seed: 41 });
    m.advance(80);
    const state = m.read();
    expect(state.tick).toBe(80);
    expect(state.done).toBe(true);
    expect(state.cells.filter((cell) => cell.alive)).toHaveLength(81);
    for (const cell of state.cells)
      expect(cell.liveNeighborCount).toBe(
        cell.neighborIds.filter(
          (id) => state.cells.find((neighbor) => neighbor.id === id)!.alive,
        ).length,
      );
    const before = m.read();
    m.advance();
    expect(m.read()).toEqual(before);
  });
  test("pending switch edits apply only on read-switches and terminal state can recover", () => {
    const m = hex({ width: 9, height: 9 });
    m.setSwitches({
      oneNeighbor: false,
      twoNeighbors: false,
      threeNeighbors: false,
      fourNeighbors: false,
      fiveNeighbors: false,
      sixNeighbors: false,
    });
    expect(m.read().eligibleCount).toBe(6);
    m.readSwitches();
    expect(m.read().done).toBe(true);
    m.advance(50);
    expect(m.read().tick).toBe(0);
    m.readSwitches([1]);
    expect(m.read().done).toBe(false);
    m.advance();
    expect(m.read().tick).toBe(1);
    const before = m.read();
    expect(() => m.readSwitches([0, 1])).toThrow();
    expect(() => m.readSwitches([1, 7])).toThrow();
    expect(m.read()).toEqual(before);
    expect(() => hex({ width: 4 })).toThrow();
  });
});

describe("selected B19 Vants", () => {
  test("long forward/reverse trajectories exactly recover shared tape and all cardinal orientations", () => {
    for (const seed of [1, 7, 100]) {
      const m = vants({ width: 9, height: 7, numVants: 4, seed });
      const before = m.read();
      m.advance(250);
      m.reverse(250);
      expect(m.read().tick).toBe(500);
      expect(m.read().agents).toEqual(before.agents);
      expect(m.read().cells).toEqual(before.cells);
      expect(m.read().randomState).toEqual(before.randomState);
    }
  });
  test("tape toggles after moving and old snapshots remain detached", () => {
    const m = vants({ width: 9, height: 9, seed: 1 });
    const before = m.read();
    const head = before.agents[0]!;
    m.advance();
    const after = m.read();
    const dx = head.heading === 90 ? 1 : head.heading === 270 ? -1 : 0;
    const dy = head.heading === 0 ? 1 : head.heading === 180 ? -1 : 0;
    expect(after.agents[0]!.x).toBe(dx);
    expect(after.agents[0]!.y).toBe(dy);
    expect(after.agents[0]!.heading).toBe((head.heading + 90) % 360);
    expect(after.cells.find((cell) => cell.x === dx && cell.y === dy)!.on).toBe(
      true,
    );
    expect(before.cells.every((cell) => !cell.on)).toBe(true);
    expect(() => m.reverse(NaN)).toThrow();
    expect(m.read().tick).toBe(1);
  });
});

describe("selected B19 two-dimensional Turing machine", () => {
  test("source default differs from example 1, which resets tape and clock", () => {
    const m = turing({ width: 9, height: 9, heads: 1 });
    expect(m.read().rules).toEqual([
      [1, 180, true],
      [0, 90, true],
      [0, 0, true],
      [1, 270, true],
    ]);
    m.advance(10);
    m.setupExample(1);
    expect(m.read().tick).toBe(0);
    expect(m.read().rules).toEqual([
      [1, 180, true],
      [1, 90, true],
      [0, 180, true],
      [1, 270, true],
    ]);
    expect(m.read().cells.every((cell) => !cell.on)).toBe(true);
    expect(m.read().agents[0]!.state).toBe(0);
  });
  test("all four combinations select their own rule, and writes precede movement", () => {
    const m = turing({ width: 9, height: 9, heads: 1, colorPaths: false });
    const table: readonly Rule[] = [
      [1, 90, true],
      [0, 180, true],
      [1, 0, false],
      [0, 270, false],
    ];
    m.setRules(table);
    const visited = new Set<number>();
    for (let i = 0; i < 100; i++) {
      const before = m.read();
      const head = before.agents[0]!;
      const cell = before.cells.find(
        (cell) => cell.x === head.x && cell.y === head.y,
      )!;
      const index = (cell.on ? 2 : 0) + head.state;
      visited.add(index);
      m.advance();
      const after = m.read();
      const result = after.agents[0]!;
      expect(result.state).toBe(table[index]![0]);
      expect(result.heading).toBe((head.heading + table[index]![1]) % 360);
      expect(after.cells.find((next) => next.id === cell.id)!.on).toBe(
        table[index]![2],
      );
    }
    expect([...visited].sort()).toEqual([0, 1, 2, 3]);
  });
  test("multiple heads all read the old tape before source-ordered conflicting writes", () => {
    const m = turing({ width: 5, height: 3, heads: 8, seed: 4 });
    const table: readonly Rule[] = [
      [1, 90, true],
      [0, 180, false],
      [0, 270, false],
      [1, 0, true],
    ];
    m.setRules(table);
    for (let i = 0; i < 30; i++) {
      const before = m.read();
      const writes = new Map<string, { on: boolean; color: number }[]>();
      for (const head of before.agents) {
        const cell = before.cells.find(
          (cell) => cell.x === head.x && cell.y === head.y,
        )!;
        const rule = table[(cell.on ? 2 : 0) + head.state]!;
        const group = writes.get(cell.id) ?? [];
        group.push({ on: rule[2], color: rule[2] ? head.foreground : 0 });
        writes.set(cell.id, group);
      }
      m.advance();
      const after = m.read();
      for (const head of before.agents) {
        const cell = before.cells.find(
          (cell) => cell.x === head.x && cell.y === head.y,
        )!;
        const rule = table[(cell.on ? 2 : 0) + head.state]!;
        expect(
          after.agents.find((result) => result.id === head.id)!.state,
        ).toBe(rule[0]);
      }
      for (const cell of after.cells) {
        const group = writes.get(cell.id);
        if (group)
          expect(
            group.some(
              (write) =>
                write.on === cell.on && write.color === cell.colorNumber,
            ),
          ).toBe(true);
        else
          expect(cell).toEqual(before.cells.find((old) => old.id === cell.id)!);
      }
    }
  });
  test("rule validation, no draws on observation, explicit cardinal conversion", () => {
    const m = turing({ width: 9, height: 9, heads: 2 });
    const before = m.read();
    expect(m.read()).toEqual(before);
    expect(() => m.setRules([[0, 0, false]])).toThrow();
    expect(() =>
      m.setRules([
        // @ts-expect-error Invalid transition payloads are also rejected at runtime.
        [0, 45, false],
        [0, 0, false],
        [0, 0, false],
        [0, 0, false],
      ]),
    ).toThrow();
    expect(() => m.setConfiguration({ off0State: 2 })).toThrow();
    expect(() => m.setupExample(6)).toThrow();
    expect(m.read()).toEqual(before);
    for (const direction of ["--", "Right", "Backwards", "Left"] as const)
      expect(numberToDirection(directionToNumber(direction))).toBe(direction);
  });
});
