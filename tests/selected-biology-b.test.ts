import { describe, expect, test } from "bun:test";
import { create as autumn } from "../experiments/autumn/model.ts";
import { create as membrane } from "../experiments/membrane-formation/model.ts";
import { create as sunflower } from "../experiments/sunflower-emergent/model.ts";
import { create as tumor } from "../experiments/tumor/model.ts";
import { create as muscle } from "../experiments/muscle-development/model.ts";

describe("Selected biology B07 source procedures", () => {
  test("Autumn setup converts sugar before the first tick; cold water procedure returns only locally", () => {
    const tree = autumn({
      numberOfLeaves: 4,
      temperature: 5,
      startSugarStddev: 0,
      rainIntensity: 0,
      windFactor: 0,
      sunIntensity: 0,
    });
    const before = tree.read();
    expect(
      before.leaves.every(
        (leaf) => leaf.sugarLevel === 49 && leaf.anthocyanin === 1,
      ),
    ).toBe(true);
    tree.advance();
    const after = tree.read();
    expect(after.tick).toBe(1);
    expect(
      after.leaves.every(
        (leaf) => leaf.sugarLevel === 47.5 && leaf.anthocyanin === 2,
      ),
    ).toBe(true);
    for (const leaf of after.leaves) {
      const previous = before.leaves.find(
        (candidate) => candidate.id === leaf.id,
      )!;
      expect(leaf.chlorophyll).toBe(previous.chlorophyll - 5);
      expect(leaf.waterLevel).toBe(previous.waterLevel - 1);
    }
  });

  test("Autumn transitions living leaves into persistent dead leaves then preflight-stops", () => {
    const tree = autumn({
      seed: 7,
      numberOfLeaves: 8,
      temperature: 0,
      rainIntensity: 0,
      sunIntensity: 0,
      windFactor: 10,
    });
    tree.advance(300);
    expect(tree.read().stopped).toBe(true);
    expect(tree.read().leaves.length).toBe(0);
    expect(tree.read().deadLeaves.length).toBe(8);
    const tick = tree.read().tick;
    tree.advance(10);
    expect(tree.read().tick).toBe(tick);
  });

  test("Membrane uses one distinct water partner for each lipid and conserves membership", () => {
    const solution = membrane({ seed: 4, numWater: 0, numLipids: 8 });
    const setup = solution.read();
    expect(setup.agents.length).toBe(16);
    expect(setup.edges.length).toBe(8);
    expect(new Set(setup.edges.map((edge) => edge.waterId)).size).toBe(8);
    for (const edge of setup.edges) {
      const oil = setup.agents.find((agent) => agent.id === edge.oilId)!;
      const water = setup.agents.find((agent) => agent.id === edge.waterId)!;
      expect(oil.breed).toBe("oil");
      expect(water.breed).toBe("water");
      expect(water.hydrophilic).toBe(true);
    }
    solution.advance(4);
    expect(solution.read().agents.length).toBe(16);
    expect(solution.read().edges.map((edge) => edge.waterId)).toEqual(
      setup.edges.map((edge) => edge.waterId),
    );
  });

  test("Membrane self-inclusive hydrophobic isolation equals one for an isolated one-lipid oil", () => {
    const solution = membrane({ numWater: 0, numLipids: 1 });
    expect(solution.read().hydrophobicIsolation).toBe(1);
    solution.setParameters({
      waterWaterForce: 0,
      waterOilForce: 0,
      tooCloseForce: 0,
      randomForce: 0,
    });
    solution.advance();
    expect(solution.read().hydrophobicIsolation).toBe(1);
  });

  test("Sunflower setup tick is one and live ring distance affects only new placements", () => {
    const flower = sunflower({ ringDist: 1, fixedTemps: false });
    const first = flower.read().particles[0]!;
    expect(flower.read().tick).toBe(1);
    flower.setParameters({
      ringDist: 0.5,
      particleSize: 2.5,
      showTemps: false,
    });
    flower.advance();
    expect(flower.read().particles[0]).toEqual(first);
    expect(flower.read().particles[1]!.size).toBe(2.5);
    expect(flower.read().numTempParticles).toBe(30);
    expect(flower.read().temporaryParticles).toEqual([]);
  });

  test("Sunflower counts temporary candidates and stops before the outer ring", () => {
    const flower = sunflower({ ringDist: 1, fixedTemps: true });
    flower.advance(2);
    expect(flower.read().numTempParticles).toBe(360);
    expect(flower.read().temporaryParticles.length).toBe(360);
    flower.advance(100);
    expect(flower.read().particles.length).toBe(79);
    expect(flower.read().tick).toBe(79);
    expect(flower.read().stopped).toBe(true);
  });

  test("Tumor hatches have source age zero and are not activated in their birth phase", () => {
    const growth = tumor({ leaveTrail: false });
    growth.advance();
    expect(growth.read().cells.length).toBe(4);
    expect(
      growth
        .read()
        .cells.filter((cell) => cell.stem)
        .every((cell) => cell.age === 1),
    ).toBe(true);
    expect(
      growth
        .read()
        .cells.filter((cell) => !cell.stem)
        .every((cell) => cell.age === 0),
    ).toBe(true);
    growth.advance();
    expect(growth.read().cells.length).toBe(8);
  });

  test("Tumor kill actions preserve source cached reporter until the next completed tick", () => {
    const growth = tumor();
    growth.killOriginalStemCell();
    growth.killMovingStemCell();
    expect(growth.read().cells.length).toBe(0);
    expect(growth.read().cellCount).toBe(2);
    growth.advance();
    expect(growth.read().tick).toBe(1);
    expect(growth.read().cellCount).toBe(0);
    expect(growth.read().stopped).toBe(true);
    growth.advance();
    expect(growth.read().tick).toBe(1);
  });

  test("Muscle all-slow fibers have max four; hormone bounds and mass remain exact", () => {
    const tissue = muscle({
      slowTwitchFibers: 100,
      lift: true,
      hoursOfSleep: 0,
      daysBetweenWorkouts: 1,
    });
    tissue.advance(40);
    const current = tissue.read();
    expect(current.fibers.length).toBe(289);
    expect(
      current.fibers.every(
        (fiber) =>
          fiber.maxSize === 4 && fiber.fiberSize >= 1 && fiber.fiberSize <= 4,
      ),
    ).toBe(true);
    expect(
      current.cells.every(
        (cell) =>
          cell.anabolicHormone >= 50 &&
          cell.anabolicHormone <= 200 &&
          cell.catabolicHormone >= 52 &&
          cell.catabolicHormone <= 250,
      ),
    ).toBe(true);
    expect(current.muscleMass).toBeCloseTo(
      current.fibers.reduce((sum, fiber) => sum + fiber.fiberSize, 0),
      10,
    );
  });

  test("Detached reads cannot mutate canonical state; invalid live edits fail atomically", () => {
    const tissue = muscle();
    const before = tissue.read();
    const detached = tissue.read();
    detached.cells[0]!.anabolicHormone = -1;
    detached.fibers[0]!.fiberSize = -1;
    expect(tissue.read()).toEqual(before);
    expect(() => tissue.setParameters({ intensity: 101 })).toThrow(RangeError);
    expect(tissue.read()).toEqual(before);
    expect(() => tissue.advance(-1)).toThrow(RangeError);
  });
});
