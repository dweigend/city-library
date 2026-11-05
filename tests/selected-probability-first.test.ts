import { describe, expect, test } from "bun:test";
import {
  create as birthdays,
  makeMonth,
} from "../experiments/birthdays/model.ts";
import { create as galton } from "../experiments/galton-box/model.ts";
import { create as rabbits } from "../experiments/binomial-rabbits/model.ts";
import { create as doors } from "../experiments/three-doors/model.ts";
import { create as patchwork } from "../experiments/stochastic-patchwork/model.ts";

describe("B17 first five source mechanisms", () => {
  test("Birthdays sorts 23 people, colors exactly duplicate dates and counts rooms", () => {
    const m = birthdays({ seed: 17 });
    expect(m.read().days).toHaveLength(365);
    expect(makeMonth("February", 28).at(-1)).toBe("February 28");
    m.advance(50);
    const s = m.read();
    expect(s.tick).toBe(50);
    expect(s.people).toHaveLength(23);
    expect(s.history).toHaveLength(50);
    expect(s.people.map((p) => p.birthday)).toEqual(
      s.people.map((p) => p.birthday).toSorted((a, b) => a - b),
    );
    for (const p of s.people)
      expect(p.matched).toBe(
        s.people.some((q) => p.id !== q.id && p.birthday === q.birthday),
      );
    expect(s.successes).toBeGreaterThanOrEqual(0);
    expect(s.successes).toBeLessThanOrEqual(50);
  });
  test("Galton original pegs include row zero and counter geometry", () => {
    const m = galton({
      numberOfRows: 1,
      numberOfBalls: 1,
      chanceOfBouncingRight: 100,
      pileUp: false,
    });
    expect(m.read().pegs).toHaveLength(3);
    expect(m.read().counters).toHaveLength(3);
    m.advance(150);
    const s = m.read();
    expect(s.done).toBe(true);
    expect(s.balls).toBe(1);
    expect(s.particles).toHaveLength(0);
    expect(s.counters.find((c) => c.x === 2)?.count).toBe(1);
    expect(s.counters.reduce((a, c) => a + c.count, 0)).toBe(1);
    const tick = s.tick;
    m.advance();
    expect(m.read().tick).toBe(tick);
  });
  test("Galton pile fills and discarded balls do not advance tick forever", () => {
    const m = galton({
      numberOfRows: 15,
      numberOfBalls: 1000,
      chanceOfBouncingRight: 0,
      pileUp: true,
    });
    m.advance(10000);
    expect(m.read().full).toBe(true);
    expect(m.read().done).toBe(true);
    const tick = m.read().tick;
    m.advance();
    expect(m.read().tick).toBe(tick);
  });
  test("Galton live bias affects later bounces and no-pile counters conserve balls", () => {
    const m = galton({
      numberOfRows: 3,
      numberOfBalls: 10,
      pileUp: false,
      chanceOfBouncingRight: 0,
    });
    m.setRules({ chanceOfBouncingRight: 100 });
    m.advance(1000);
    expect(m.read().counters.find((c) => c.x === 4)?.count).toBe(10);
  });
  test("Rabbit deterministic hop, scale and exact equality stop", () => {
    const m = rabbits({ number: 12, hop1: 5, ratio1: 1, ratio2: 0, hops: 2 });
    m.advance(3);
    expect(m.read().tick).toBe(2);
    expect(m.read().mean).toBe(10);
    expect(m.read().distribution.reduce((a, p) => a + p.count, 0)).toBe(12);
    m.goOneHop();
    expect(m.read().tick).toBe(3);
    m.advance();
    expect(m.read().tick).toBe(4); // Original equality, not >=.
    m.setRules({ xScaling: 2 });
    m.goOneHop();
    expect(m.read().mean).toBe(25);
    expect(m.read().xScale).toBe(88);
    expect(m.read().rabbits.every((r) => r.x === 12.5)).toBe(true);
  });
  test("Rabbit all-zero ratios retain source first-hop behavior", () => {
    const m = rabbits({ number: 3, hop1: 2, ratio1: 0, ratio2: 0, ratio3: 0 });
    m.advance();
    expect(m.read().rabbits.every((r) => r.total === 2)).toBe(true);
  });
  test("Three Doors never leaves another closed door equal to first guess except after switching", () => {
    const m = doors({ number: 100, seed: 17 });
    m.advance();
    for (const r of m.read().racers) {
      expect(r.hunch === 0 || r.hunch === 100).toBe(true);
      if (r.hunch === 100) expect(r.guess).toBe(r.otherDoor);
      expect(r.y === -35 || r.y === -34).toBe(true);
    }
    m.advance(1000);
    expect(m.read().done).toBe(true);
    expect(m.read().racers.some((r) => r.y === 35)).toBe(true);
    expect(m.read().racers.every((r) => r.y <= 35)).toBe(true);
  });
  test("Patchwork extreme probabilities, live change and accumulating histogram", () => {
    const m = patchwork({ blockSide: 5, targetPercent: 0 });
    expect(m.read().cells.filter((c) => c.inBlock)).toHaveLength(25);
    m.advance(3);
    expect(m.read().samples).toEqual([0, 0, 0]);
    m.setRules({ targetPercent: 100 });
    m.advance(2);
    expect(m.read().targetCount).toBe(25);
    expect(m.read().samples).toEqual([100, 100, 0, 0, 0]);
    expect(m.read().histogram).toEqual([
      { percent: 0, count: 3 },
      { percent: 100, count: 2 },
    ]);
  });
  test("detached reads do not consume RNG and invalid advances preserve canonical state", () => {
    for (const make of [birthdays, galton, rabbits, doors, patchwork]) {
      const m = make({ seed: 17 });
      const before = m.read();
      m.advance(0);
      expect(m.read()).toEqual(before);
      expect(() => m.advance(-1)).toThrow(RangeError);
      expect(m.read()).toEqual(before);
    }
  });
});
