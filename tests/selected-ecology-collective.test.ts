import { describe, expect, test } from "bun:test";
import { Agent } from "city-library";
import { create as ants } from "../models/ants/model.ts";
import { create as heatbugs } from "../models/heatbugs/model.ts";
import {
  create as flocking,
  headingDifference,
  averageHeadingTowardsFlockmates,
} from "../models/flocking/model.ts";
import { create as fireflies } from "../models/fireflies/model.ts";
import { create as plants } from "../models/invasive-plants/model.ts";

describe("selected ecology collective source mechanisms", () => {
  test("Ants source dimensions, nest and delayed departure", () => {
    const model = ants({ antCount: 2, seed: 9 });
    const initial = model.read();
    expect(initial.cells).toHaveLength(71 * 71);
    expect(initial.cells.filter((c) => c.nest)).toHaveLength(69);
    expect(initial.cells.find((c) => c.x === 0 && c.y === 0)!.nestScent).toBe(
      200,
    );
    expect(initial.foodByPile.every((n) => n > 0)).toBe(true);
    model.advance();
    expect(model.read().ants.map((a) => [a.x, a.y])).toEqual([
      [0, 0],
      [0, 0],
    ]);
    model.advance();
    expect(
      Math.hypot(model.read().ants[0]!.x, model.read().ants[0]!.y),
    ).toBeCloseTo(1, 12);
    expect(model.read().ants[1]!.x).toBe(0);
    expect(model.read().ants[1]!.y).toBe(0);
    model.setRules({ diffusionRate: 0, evaporationRate: 99 });
    expect(model.read().tick).toBe(2);
    expect(() => model.advance(-1)).toThrow(RangeError);
  });
  test("Heatbugs conserve diffusion quantity before evaporation and sequential emissions", () => {
    const model = heatbugs({ bugCount: 20, seed: 4 });
    const initial = model.read();
    expect(initial.cells).toHaveLength(10000);
    expect(
      initial.bugs.every(
        (b) =>
          b.idealTemp >= 10 &&
          b.idealTemp < 40 &&
          b.outputHeat >= 5 &&
          b.outputHeat < 25,
      ),
    ).toBe(true);
    model.advance();
    const sum = model.read().cells.reduce((s, c) => s + c.temp, 0);
    const output = initial.bugs.reduce((s, b) => s + b.outputHeat, 0);
    expect(sum).toBeCloseTo(output, 10);
    model.advance();
    expect(model.read().cells.reduce((s, c) => s + c.temp, 0)).toBeCloseTo(
      output * 1.99,
      9,
    );
    expect(new Set(model.read().bugs.map((b) => `${b.x},${b.y}`)).size).toBe(
      20,
    );
    model.deepFreeze();
    expect(model.read().cells.every((c) => c.temp === 0)).toBe(true);
    expect(model.read().tick).toBe(2);
    model.heatUp();
    expect(model.read().cells.every((c) => c.temp === 25)).toBe(true);
    expect(heatbugs({ bugCount: 0 }).read().done).toBe(true);
  });
  test("Flocking no perception preserves headings and toroidal population", () => {
    expect(headingDifference(1, 359)).toBe(2);
    expect(headingDifference(359, 1)).toBe(-2);
    expect(headingDifference(180, 0)).toBe(180);
    expect(() =>
      averageHeadingTowardsFlockmates(Agent.create(), [Agent.create()]),
    ).toThrow(RangeError);
    const model = flocking({ birdCount: 5, vision: 0, seed: 8 });
    const headings = model.read().birds.map((b) => b.heading);
    model.advance(10);
    expect(model.read().birds.map((b) => b.heading)).toEqual(headings);
    expect(
      model
        .read()
        .birds.every(
          (b) => b.x >= -35.5 && b.x < 35.5 && b.y >= -35.5 && b.y < 35.5,
        ),
    ).toBe(true);
    expect(() => model.setRules({ vision: 11 })).toThrow(RangeError);
    expect(model.read().parameters.vision).toBe(0);
  });
  test("Firefly strategy fields are captured at setup; cycle equality is live", () => {
    const delay = fireflies({
      fireflyCount: 1,
      cycleLength: 10,
      strategy: "delay",
      flashCountToReset: 3,
    });
    expect(delay.read().fireflies[0]!.window).toBe(-1);
    expect(delay.read().fireflies[0]!.resetLevel).toBe(1);
    const advance = fireflies({
      fireflyCount: 1,
      cycleLength: 10,
      strategy: "advance",
      flashCountToReset: 3,
    });
    expect(advance.read().fireflies[0]!.window).toBe(2);
    expect(advance.read().fireflies[0]!.resetLevel).toBe(0);
    const before = advance.read().fireflies[0]!.clock;
    advance.advance(10);
    expect(advance.read().fireflies[0]!.clock).toBe(before);
    advance.setRules({ strategy: "delay", flashLength: 4 });
    expect(advance.read().fireflies[0]!.threshold).toBe(1);
    expect(advance.read().fireflies[0]!.resetLevel).toBe(0);
    const empty = fireflies({ fireflyCount: 0 });
    empty.advance(3);
    expect(empty.read().tick).toBe(3);
  });
  test("Invasion germinates old seeds before generation and blocks edge crossing", () => {
    const model = plants({
      initialDensity: 0,
      initialResistanceShape: "none",
      weedKillerRate: 0,
      seedProductionRate: 1,
      spreadDistance: 0,
      seed: 12,
    });
    model.paint(0, 0, "infestation", 20);
    model.advance();
    const offspring = model.read().seeds.length;
    expect(offspring).toBeGreaterThan(0);
    expect(model.read().aggregateInfestation).toBe(20);
    model.advance();
    expect(model.read().aggregateInfestation).toBe(20 + offspring);
    const blocked = plants({
      initialDensity: 0,
      initialResistanceShape: "none",
      weedKillerRate: 0,
      seedProductionRate: 1,
      spreadDistance: 10,
      seed: 12,
    });
    blocked.paint(16, 0, "infestation", 100);
    blocked.advance();
    expect(
      blocked
        .read()
        .seeds.every(
          (s) => s.x >= -16.5 && s.x < 16.5 && s.y >= -16.5 && s.y < 16.5,
        ),
    ).toBe(true);
    expect(blocked.read().seeds.some((s) => s.x === 16 && s.y === 0)).toBe(
      true,
    );
    const partial = plants({
      initialDensity: 0,
      initialResistanceShape: "none",
      weedKillerRate: 0,
      seedProductionRate: 1,
      spreadDistance: 10,
      seed: 12,
    });
    partial.paint(14, 0, "infestation", 100);
    partial.advance();
    // Blocked forward retains completed unit strides. Continuous sampled
    // full distances have fractional length; positive integer lengths identify
    // partial progress rather than whole-endpoint rejection.
    expect(
      partial.read().seeds.some((seed) => {
        const moved = Math.hypot(seed.x - 14, seed.y);
        return moved > 0.5 && Math.abs(moved - Math.round(moved)) < 1e-10;
      }),
    ).toBe(true);
  });
  test("Invasion plus/circle initialization, runoff, drawing and histogram", () => {
    const plus = plants({ initialDensity: 1 });
    expect(plus.read().cells.filter((c) => c.resistance === 100)).toHaveLength(
      305,
    );
    const circle = plants({
      initialDensity: 0,
      initialResistanceShape: "circle",
    });
    expect(
      circle.read().cells.filter((c) => c.resistance === 100),
    ).toHaveLength(145);
    const model = plants({
      initialDensity: 0,
      initialResistanceShape: "none",
      weedKillerRate: 1,
      weedKillerEffectiveness: 1,
      seedProductionRate: 0,
    });
    model.paint(0, 0, "infestation", 100);
    model.paint(1, 0, "infestation", 60);
    model.advance();
    expect(model.read().aggregateInfestation).toBe(30);
    expect(model.read().histogram.counts.reduce((s, n) => s + n, 0)).toBe(1089);
    model.draw(0, 0);
    expect(model.read().tick).toBe(2);
    expect(
      model.read().cells.find((c) => c.x === 0 && c.y === 0)!.resistance,
    ).toBe(100);
    model.clearFields();
    expect(
      model
        .read()
        .cells.every(
          (c) =>
            c.infestation === 0 && c.resistance === 0 && !c.hasResistanceBlock,
        ),
    ).toBe(true);
    model.clearPlots();
    expect(model.read().history).toHaveLength(0);
  });
  test("All five models return detached, pure measurements", () => {
    for (const model of [
      ants({ antCount: 1 }),
      heatbugs({ bugCount: 1 }),
      flocking({ birdCount: 1 }),
      fireflies({ fireflyCount: 1 }),
      plants({ initialDensity: 0 }),
    ]) {
      const before = model.read();
      expect(Object.isFrozen(before)).toBe(true);
      expect(model.read()).toEqual(before);
    }
  });
});
