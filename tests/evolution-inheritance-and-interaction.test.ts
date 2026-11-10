import { test, expect } from "bun:test";
import {
  create as sexRatio,
  adultSexRatio,
} from "../models/sex-ratio-equilibrium/model.ts";
import {
  create as infection,
  giveDose,
} from "../models/bacterial-infection/model.ts";
import {
  create as vision,
  visionRadius,
  energyCost,
  weightedDistance,
} from "../models/vision-evolution/model.ts";
import { create as drift } from "../models/gendrift-t-interact/model.ts";
import { create as mendel } from "../models/mendelian-inheritance/model.ts";

test("sex-ratio preserves native all-males numerator, death threshold and empty reporter contract", () => {
  expect(
    adultSexRatio([
      { sex: "male", adult: false },
      { sex: "female", adult: true },
    ]),
  ).toBe(100);
  const m = sexRatio({ initialPopulationSize: 0 });
  expect(() => m.matingSuccess("male")).toThrow("nonempty");
  const a = m.makeIndividual("male");
  a.age = 10;
  a.longevity = 10;
  m.checkIfDead(a);
  expect(a.alive).toBe(true);
  expect(a.age).toBe(11);
  m.checkIfDead(a);
  expect(a.alive).toBe(false);
  expect(m.read().ageList).toEqual([11]);
  m.advance();
  expect(m.read().tick).toBe(0);
});

test("sex-ratio gestation equality births before increment and hatch inherits adult flag", () => {
  const m = sexRatio({
    seed: 11,
    initialPopulationSize: 0,
    gestationPeriod: 2,
    maximumLitterSize: 1,
  });
  const mother = m.makeIndividual("female");
  mother.carrying = true;
  mother.tempMaleChildChance = 1;
  mother.gestation = 1;
  m.reproduce(mother);
  expect(m.read().males.length).toBe(0);
  expect(mother.gestation).toBe(2);
  m.reproduce(mother);
  const s = m.read();
  expect(s.males.length).toBe(1);
  expect(s.males[0]!.adult).toBe(true);
  expect(s.males[0]!.age).toBe(0);
  expect(mother.carrying).toBe(false);
  expect(mother.childCount).toBe(1);
  expect(s.tick).toBe(0);
});

test("sex-ratio partner search requires exactly one eligible female and no rival male", () => {
  const m = sexRatio({ initialPopulationSize: 0, matingChance: 1 });
  const male = m.makeIndividual("male");
  const female = m.makeIndividual("female");
  male.move({ to: { x: 0, y: 0 } });
  female.move({ to: { x: 0, y: 0 } });
  m.searchForAnAdultPartner(male);
  expect(female.carrying).toBe(true);
  expect(female.partner).toBe(male);
  expect(male.partner).toBe(null);
  expect(male.formerPartnerCount).toBe(1);
  expect(female.formerPartnerCount).toBe(1);
});

const noBacteria = {
  initialThreePoreBacteriumCountA: 0,
  initialFourPoreBacteriumCountA: 0,
  initialFivePoreBacteriumCountA: 0,
  initialSixPoreBacteriumCountA: 0,
  initialThreePoreBacteriumCountB: 0,
  initialFourPoreBacteriumCountB: 0,
  initialFivePoreBacteriumCountB: 0,
  initialSixPoreBacteriumCountB: 0,
  autoDoseA: "skip-all-doses" as const,
  autoDoseB: "skip-all-doses" as const,
};

test("infection auto-dose is scheduled at pre-step tick zero and manual dose has no tick", () => {
  const m = infection({
    reproduce: false,
    autoDoseA: "take-all-doses",
    autoDoseB: "skip-all-doses",
  });
  expect(m.read().antibiotics.length).toBe(0);
  m.advance();
  expect(m.read().doseCountA).toBe(1);
  expect(m.read().antibiotics.length).toBe(50);
  expect(m.read().tick).toBe(1);
  m.doseRegion("B", 100);
  expect(m.read().doseCountB).toBe(1);
  expect(m.read().antibiotics.length).toBe(150);
  expect(m.read().tick).toBe(1);
  expect(giveDose(480, 4, false, "skip-dose-2", 1)).toBe(false);
  expect(giveDose(480, 4, false, "skip-dose-3", 1)).toBe(true);
});

test("infection reproduction preserves source parent reservations and movement-age reset", () => {
  const m = infection({ ...noBacteria, seed: 19 });
  const parent = m.makeBacteria(1, 3, "A")[0]!;
  expect(m.canReproduce(parent, 1)).toBe(true);
  m.reproduceBacteriaIntoAvailableSpace();
  const s = m.read();
  expect(s.bacteria.length).toBe(2);
  expect(s.cells.filter((c) => c.owner === parent.id).length).toBe(2);
  m.advance();
  expect(m.read().bacteria.some((a) => a.age === 1)).toBe(true);
  m.bacteriaDeath(parent);
  expect(m.read().cells.filter((c) => c.owner === parent.id).length).toBe(0);
});

test("infection extinction marks both regions, suppresses auto-dose and still advances time", () => {
  const m = infection({
    ...noBacteria,
    autoDoseA: "take-all-doses",
    autoDoseB: "take-all-doses",
  });
  m.advance(60);
  const s = m.read();
  expect(s.aWipedOut).toBe(true);
  expect(s.bWipedOut).toBe(true);
  expect(s.doseCountA).toBe(0);
  expect(s.minutes).toBe(60);
  expect(s.hours).toBe(1);
  expect(s.days).toBe(0);
});

test("vision source equations use shoreline land branch and PREY habitat in weighting", () => {
  expect(visionRadius(2, -1, 5)).toBe(3.4);
  expect(visionRadius(2, 0, 5)).toBe(7);
  expect(energyCost(1, 0, -1, 9)).toBe(0.5);
  expect(energyCost(1, 0, 0, 9)).toBe(9.5);
  expect(weightedDistance(2, -1, 1)).toBe(2 * Math.exp(1.5));
  expect(weightedDistance(2, 1, 1)).toBe(2 * Math.exp(-1.5));
});

test("vision death is strict negative and reproduction threshold is strict greater-than", () => {
  const m = vision({
    initialFishCount: 0,
    initialFoodCount: 0,
    reproductionRate: 100,
    mutationRate: 0,
  });
  const agent = m.makeFish({ x: 0, y: -1, energy: 0.5 });
  m.consumeEnergy(agent);
  m.death(agent);
  expect(agent.alive).toBe(true);
  agent.energy = 100;
  m.reproduce(agent);
  expect(m.read().fish.length).toBe(1);
  agent.energy = 200;
  m.reproduce(agent);
  expect(m.read().fish.length).toBe(2);
  expect(m.read().fish.map((a) => a.energy)).toEqual([100, 100]);
  agent.energy = -Number.EPSILON;
  m.death(agent);
  expect(agent.alive).toBe(false);
});

test("vision reads preserve RNG and detached states; extinction is a pre-step gate", () => {
  const m = vision({ initialFishCount: 0, initialFoodCount: 0 });
  const before = m.read();
  m.advance(5);
  expect(m.read().tick).toBe(0);
  expect(m.read().randomState).toEqual(before.randomState);
  const fish = m.makeFish({ x: 0, y: -10, energy: 100 });
  const s = m.read();
  s.fish[0]!.energy = 1000;
  expect(fish.energy).toBe(100);
  expect(m.read().foodPreferenceHistogram.counts.reduce((a, b) => a + b)).toBe(
    1,
  );
});

test("drift setup keeps all walls, removes turtles from them and does not recompute max-percent", () => {
  const m = drift({ agentCount: 30, colorCount: 2 });
  m.advance();
  const percentage = m.read().maxPercent;
  m.placeWall(0);
  const walls = m.read().cells.filter((c) => c.wall).length;
  expect(walls).toBe(105);
  m.setup();
  expect(m.read().maxPercent).toBe(percentage);
  expect(m.read().tick).toBe(0);
  expect(m.read().cells.filter((c) => c.wall).length).toBe(walls);
  expect(
    m.read().agents.every((a) => ![0, -17, 17].includes(Math.round(a.y))),
  ).toBe(true);
});

test("drift meet copies the right-hand patch color and single-color population stops before movement", () => {
  const m = drift({ agentCount: 1, colorCount: 2 });
  const source = m.makeAgent(15, 10, 10);
  const target = m.makeAgent(25, 11, 10);
  m.meet(source);
  expect(source.colorNumber).toBe(target.colorNumber);
  const single = drift({ agentCount: 1 });
  const s = single.read();
  single.advance(10);
  expect(single.read().tick).toBe(0);
  expect(single.read().agents).toEqual(s.agents);
});

test("Mendelian source crosses, persistent counters, genotype readback and prebatch cap", () => {
  const m = mendel({
    maleGenotype: "aa",
    femaleGenotype: "AA",
    offspringCount: 10,
  });
  m.makeF1Generation();
  expect(
    m
      .read()
      .mice.filter((a) => a.generation === "F1")
      .every((a) => a.genotype === "aA"),
  ).toBe(true);
  const offspring = m.read().mice.find((a) => a.generation === "F1")!;
  expect(m.displayGenotype(offspring.id)).toBe("aA");
  m.clearF1Generation();
  expect(m.read().darkOffspringCount).toBe(10);
  expect(m.read().mice.length).toBe(2);
  for (let n = 0; n < 5; n++) m.makeF1Generation();
  expect(m.read().mice.length).toBe(52);
  const before = m.read();
  m.makeF1Generation();
  expect(m.read().tick).toBe(before.tick);
  expect(m.read().trialNumber).toBe(before.trialNumber);
  expect(m.read().message).toContain("Too much population");
});
