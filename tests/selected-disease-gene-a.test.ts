import { describe, expect, test } from "bun:test";
import { create as disease } from "../experiments/disease-solo/model.ts";
import { create as hiv } from "../experiments/hiv/model.ts";
import { create as virus } from "../experiments/virus/model.ts";
import { create as repressilator } from "../experiments/repressilator-1d/model.ts";
import { create as bacterium } from "../experiments/crispr-bacterium/model.ts";

describe("B09 native contact and molecular compositions", () => {
  test("Disease Solo caches sickness only in GO and keeps distinct run histories", () => {
    const model = disease({ seed: 11, numAndroids: 20, infectionChance: 0 });
    model.infect();
    expect(model.read().numSick).toBe(0);
    expect(model.read().agents.filter((agent) => agent.infected)).toHaveLength(
      1,
    );
    model.advance(8);
    expect(model.read().numSick).toBe(1);
    expect(model.read().tick).toBe(8);
    model.setupKeep();
    expect(model.read().runNumber).toBe(2);
    expect(
      model.read().history.some((point) => point.run === 1 && point.tick === 8),
    ).toBe(true);
    model.setupClear();
    expect(model.read().runNumber).toBe(1);
    expect(model.read().history).toHaveLength(1);
  });

  test("Disease user movement takes native unit substeps at the hard edge", () => {
    const model = disease({ numAndroids: 1, stepSize: 5 });
    model.move(90);
    model.move(90);
    model.move(90);
    const user = model.read().agents.find((agent) => agent.breed === "user")!;
    expect(user.x).toBeCloseTo(10);
    expect(user.y).toBeCloseTo(0);
    expect(model.read().tick).toBe(0);
    model.move(270);
    expect(
      model.read().agents.find((agent) => agent.breed === "user")!.x,
    ).toBeCloseTo(5);
  });

  test("Disease delay has fifty completed tail steps and a preflight stop", () => {
    const model = disease({ numAndroids: 1, infectionChance: 100 });
    // This is a direct public source procedure on the canonical turtles it creates.
    const added = model.createUser();
    model.getSick(added);
    model.infect();
    // The original user can be infected naturally; once all are infected the cached counter drives the tail.
    for (
      let index = 0;
      index < 1000 && model.read().numSick < model.read().agents.length;
      index++
    )
      model.advance();
    expect(model.read().numSick).toBe(model.read().agents.length);
    const start = model.read().tick;
    model.advance(60);
    expect(model.read().tick).toBe(start + 50);
    expect(model.read().delay).toBe(51);
    expect(model.read().stopped).toBe(true);
  });

  test("HIV has ceiling-style source initial infections and no coupling at zero tendency", () => {
    const model = hiv({
      seed: 21,
      initialPeople: 81,
      averageCouplingTendency: 0,
      averageTestFrequency: 0,
    });
    expect(model.read().agents.filter((agent) => agent.infected)).toHaveLength(
      3,
    );
    model.advance(12);
    expect(
      model
        .read()
        .agents.every((agent) => !agent.coupled && agent.partnerId === null),
    ).toBe(true);
    expect(model.read().agents.filter((agent) => agent.infected)).toHaveLength(
      3,
    );
    model.setParameters({ averageCouplingTendency: 5 });
    expect(
      model.read().agents.every((agent) => agent.couplingTendency === 0),
    ).toBe(true);
    model.advance();
    expect(
      model.read().agents.every((agent) => agent.couplingTendency > 0),
    ).toBe(true);
  });

  test("HIV partnership references remain symmetric and traits use the source forty draws", () => {
    const model = hiv({
      seed: 7,
      initialPeople: 100,
      averageCouplingTendency: 10,
    });
    expect(model.randomNear(0)).toBe(0);
    model.advance(100);
    const people = model.read().agents;
    for (const person of people)
      if (person.coupled) {
        const partner = people.find(
          (candidate) => candidate.id === person.partnerId,
        )!;
        expect(partner.partnerId).toBe(person.id);
        expect(partner.coupled).toBe(true);
        expect(partner.righty).not.toBe(person.righty);
      }
  });

  test("Virus source recovery threshold is strict and deaths precede spreading", () => {
    const model = virus({
      seed: 12,
      numberPeople: 40,
      infectiousness: 0,
      duration: 1,
      chanceRecover: 0,
    });
    model.advance();
    expect(model.read().agents.filter((agent) => agent.sick)).toHaveLength(10);
    model.advance();
    expect(model.read().agents.filter((agent) => agent.sick)).toHaveLength(0);
    expect(model.read().tick).toBe(2);
    const tick = model.read().tick;
    model.advance(5);
    expect(model.read().tick).toBe(tick + 5);
  });

  test("Virus immunity and mortality remain separate from presentation shape", () => {
    const model = virus({
      seed: 3,
      numberPeople: 40,
      infectiousness: 0,
      chanceRecover: 99,
      duration: 0,
    });
    model.advance();
    expect(
      model.read().agents.filter((agent) => agent.remainingImmunity === 52)
        .length,
    ).toBeGreaterThan(0);
    const healthy = model.read().agents.filter((agent) => !agent.sick).length;
    model.setParameters({ agentShape: "circle" });
    expect(model.read().agents.every((agent) => agent.shape === "circle")).toBe(
      true,
    );
    expect(model.read().agents.filter((agent) => !agent.sick)).toHaveLength(
      healthy,
    );
  });

  test("Repressilator complete source phases remove initial TFs without translation", () => {
    const model = repressilator({
      seed: 31,
      initialTF0s: 10,
      tfDecayProb: 1,
      tfsPerMRNA: 0,
    });
    expect(model.read().tfCounts).toEqual([10, 0, 0]);
    model.advance(6);
    expect(model.read().tfCounts).toEqual([0, 0, 0]);
    expect(model.read().signalOn).toBe(true);
    expect(model.read().genes.every((gene) => !gene.inhibited)).toBe(true);
    expect(model.getDNATFInhibits(2)).toBe(0);
    expect(model.getTFDNAIsInhibitedBy(0)).toBe(2);
  });

  test("Repressilator exposes source arithmetic failures instead of silently replacing synergy", () => {
    const model = repressilator({
      maxTFSynergy: 0,
      initialTF0s: 0,
      initialTF1s: 0,
      initialTF2s: 0,
    });
    const tf = model.initializeTF(0, 0, 0);
    expect(model.tfCanBindGeneHere(tf)).toBe(true);
    expect(() => model.bindTFs()).toThrow("division by zero");
    expect(model.read().tick).toBe(0);
    expect(model.harmonicMean(0, 0)).toBe(0);
    expect(model.meanOnDuration()).toBe(0);
  });

  test("CRISPR zero function suppresses setup products and infection is an action without time", () => {
    const model = bacterium({
      seed: 41,
      initialArraySize: 3,
      maxVirusTypes: 1,
      crisprFunction: 0,
    });
    expect(model.read().array).toEqual([0, 0, 0]);
    expect(model.read().rnapCount).toBe(25);
    expect(model.read().cas9Count).toBe(0);
    expect(model.read().guideCount).toBe(0);
    model.infect(0);
    expect(model.read().virusCount).toBe(1);
    expect(model.read().tick).toBe(0);
    model.advance(3);
    expect(model.read().tick).toBe(3);
    expect(model.read().infected).toBe(false);
    expect(model.read().rnapCount).toBe(25);
  });

  test("CRISPR canonical molecular bonds keep the partners co-located", () => {
    const model = bacterium({ seed: 1 });
    model.advance();
    const state = model.read();
    expect(state.edges.length).toBeGreaterThan(0);
    for (const edge of state.edges) {
      const from = state.agents.find((agent) => agent.id === edge.from)!;
      const to = state.agents.find((agent) => agent.id === edge.to)!;
      expect(from.bound).toBe(true);
      expect(to.bound).toBe(true);
      expect(from.x).toBeCloseTo(to.x, 12);
      expect(from.y).toBeCloseTo(to.y, 12);
      expect([from.breed, to.breed].sort()).toEqual(["cas9", "guide"]);
    }
  });

  test("CRISPR common infection preserves empty-prefix and duplicate-sublist source errors", () => {
    const emptyPrefix = bacterium({ processivity: 0, crisprFunction: 0 });
    expect(() => emptyPrefix.commonInfection()).toThrow("empty prefix");
    const duplicates = bacterium({
      maxVirusTypes: 1,
      initialArraySize: 15,
      crisprFunction: 0,
      processivity: 100,
    });
    expect(() => duplicates.commonInfection()).toThrow("sublist");
  });

  test("all five reads detach observations, do not advance time, and reject invalid step counts", () => {
    for (const create of [disease, hiv, virus, repressilator, bacterium]) {
      const model = create();
      const before = model.read();
      model.read().agents.splice(0);
      model.read().history.splice(0);
      expect(model.read()).toEqual(before);
      expect(() => model.advance(-1)).toThrow(RangeError);
      expect(() => model.advance(0.5)).toThrow(RangeError);
      expect(() => model.setParameters({ seed: 2 } as never)).toThrow(
        TypeError,
      );
    }
  });
});
