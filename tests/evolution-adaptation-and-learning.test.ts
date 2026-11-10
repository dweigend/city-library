import { describe, expect, test } from "bun:test";
import {
  create as mimicry,
  rememberColor,
  forgetColors,
  isColorInMemory,
} from "../models/mimicry/model.ts";
import {
  create as anisogamy,
  gameteDiameter,
  tickAdvanceAmount,
} from "../models/anisogamy/model.ts";
import { create as peppered } from "../models/peppered-moths/model.ts";
import {
  create as baldwin,
  fitnessOf,
} from "../models/baldwin-effect/model.ts";
import { create as mammoths } from "../models/mammoths/model.ts";
import terrain from "../models/mammoths/data/terrain.json";

describe("first five source mechanisms", () => {
  test("Mimicry FIFO ages and duration-zero eviction; observations do not change RNG", () => {
    const old = [
      [15, 2],
      [25, 1],
    ] as const;
    expect(rememberColor(old, 35, 2)).toEqual([
      [25, 1],
      [35, 0],
    ]);
    expect(old).toEqual([
      [15, 2],
      [25, 1],
    ]);
    expect(isColorInMemory(old, 15)).toBe(true);
    expect(forgetColors([[15, 0]], 0)).toEqual([]);
    expect(() => rememberColor([], 15, 0)).toThrow(RangeError);
    const model = mimicry({ seed: 81 });
    const before = model.read();
    expect(model.read()).toEqual(before);
    model.advance(3);
    expect(model.read().tick).toBe(3);
    expect(before.tick).toBe(0);
    expect(before.monarchs).toHaveLength(225);
    expect(model.read().birds).toHaveLength(75);
    expect(model.read().birds.every((a) => a.memory.length <= 3)).toBe(true);
  });

  test("Anisogamy diameter/partial delta, inherited strategies and capacity", () => {
    expect(gameteDiameter(Math.PI)).toBe(2);
    expect(tickAdvanceAmount([])).toBe(1);
    expect(tickAdvanceAmount([gameteDiameter(0.5) / 10])).toBeCloseTo(0.1, 14);
    const model = anisogamy({
      seed: 21,
      maxAdultCount: 10,
      mutationSigma: 0,
      speedSizeCorrelation: true,
    });
    expect(model.read().adults.every((a) => a.gameteSizeTrait === 0.25)).toBe(
      true,
    );
    model.advance();
    expect(model.read().tick).toBe(1);
    model.advance(30);
    const state = model.read();
    expect(state.adults.length).toBeLessThanOrEqual(10);
    expect(
      [...state.adults, ...state.gametes, ...state.zygotes].every(
        (a) => a.gameteSizeTrait === 0.25,
      ),
    ).toBe(true);
    expect(state.tick).toBeGreaterThan(1);
    expect(model.read()).toEqual(state);
  });

  test("Peppered pollution actions are non-ticking and non-random; empty go still ticks", () => {
    const model = peppered({ mothCount: 0, speed: 100 });
    const rng = model.read().randomState;
    for (let i = 0; i < 8; i++) model.polluteWorld();
    expect(model.read().darkness).toBe(8);
    expect(model.read().darkening).toBe(true);
    model.polluteWorld();
    expect(model.read().darkening).toBe(false);
    expect(model.read().randomState).toEqual(rng);
    expect(model.read().tick).toBe(0);
    model.advance(2);
    expect(model.read().tick).toBe(2);
    expect(model.read().moths).toEqual([]);
  });

  test("Baldwin threshold equality, zero-weight reproduction and source fractional counts", () => {
    expect(fitnessOf([1, 0], [1, 1], 0.5)).toBe(0.5);
    expect(fitnessOf([1, 0], [1, 1], 0.49)).toBe(0);
    const model = baldwin({
      seed: 1,
      populationSize: 20,
      smoothness: 0,
      geneLength: 100,
    });
    expect(model.read().randomLearners.every((a) => a.fitness === 0)).toBe(
      true,
    );
    model.advance();
    expect(model.read().randomLearners).toHaveLength(20);
    const fractional = baldwin({ seed: 1, populationSize: 12 });
    fractional.advance();
    expect(fractional.read().nonLearners).toHaveLength(11); // ceil2.4 removal, floor2.4 births
    expect(fractional.read().smartLearners).toHaveLength(11);
    expect(() => baldwin({ populationSize: 1 }).advance()).not.toThrow(); // repeat0 performs no tournament
  });

  test("Mammoths literal terrain matches every original-derived field; climate precedes movement", () => {
    const model = mammoths({
      seed: 1,
      mammothCount: 10,
      humanCount: 0,
      climateChangeDecayChance: 100,
      mammothBirthRate: 0,
    });
    const before = model.read();
    expect(before.cells).toHaveLength(97 * 97);
    expect(before.cells.filter((c) => c.terrain === "land")).toHaveLength(2505);
    for (const cell of before.cells) {
      expect(cell.terrain === "land").toBe(
        terrain.rows[cell.originalY]![cell.originalX] === "1",
      );
    }
    expect(
      before.mammoths.every((a) =>
        before.cells.some(
          (c) =>
            c.originalX === a.originalX &&
            c.originalY === a.originalY &&
            c.terrain === "land",
        ),
      ),
    ).toBe(true);
    model.advance();
    expect(model.read().cells.every((c) => c.terrain !== "land")).toBe(true);
    expect(model.read().humanKilledMammothCount).toBe(0);
    expect(before.cells.filter((c) => c.terrain === "land")).toHaveLength(2505);
    const empty = mammoths({ mammothCount: 0, humanCount: 0 });
    empty.advance();
    expect(empty.read().tick).toBe(1);
  });
});
