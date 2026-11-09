import { test, expect } from "bun:test";
import { create as choice } from "../models/consumer-choice/model.ts";
import { create as rebellion } from "../models/rebellion/model.ts";
import { create as language } from "../models/language-change/model.ts";
import { create as party } from "../models/party/model.ts";
import { create as ethnicity } from "../models/ethnocentrism/model.ts";

test("consumer utilities combine retained experience and current neighbors only after consumption", () => {
  const m = choice({
    numConsumers: 10,
    avgConnections: 2,
    initialOrangePercent: 100,
    qualityOrange: 1,
    qualityBlue: 0,
    normInfluence: 1,
    informationExchange: 0,
    exploration: 0,
  });
  expect(m.read().edges.length).toBe(10);
  m.advance();
  expect(
    m
      .read()
      .consumers.every(
        (a) => a.choice === 0 && a.utilities[0] === 1 && a.utilities[1] === 0,
      ),
  ).toBe(true);
  const previous = m.read();
  m.setParameters({ qualityOrange: 0 });
  expect(m.read().consumers).toEqual(previous.consumers);
  m.advance();
  expect(
    m.read().consumers.every((a) => a.choice === 0 && a.satisfaction[0] === 0),
  ).toBe(true);
  expect(m.read().cluster).toBe(1);
  expect(() => choice({ numConsumers: 2, avgConnections: 5 })).toThrow();
  const empty = choice({ numConsumers: 0 });
  empty.advance();
  expect(empty.read().cluster).toBeNull();
  expect(empty.read().tick).toBe(1);
});

test("Rebellion setup keeps free occupancy distinct; zero legitimacy and no police follows grievance", () => {
  const m = rebellion({
    initialCopDensity: 0,
    initialAgentDensity: 10,
    movement: false,
    governmentLegitimacy: 0,
    vision: 0,
  });
  expect(new Set(m.read().agents.map((a) => `${a.x},${a.y}`)).size).toBe(160);
  m.advance();
  for (const a of m.read().agents) expect(a.active).toBe(a.hardship > 0.1);
  m.setParameters({ governmentLegitimacy: 1 });
  m.advance();
  expect(m.read().quietCount).toBe(160);
  m.watchOne();
  const s = m.read();
  expect(s.parameters.visualization).toBe("3D");
  expect(s.agents.find((a) => a.id === s.watchedId)!.hardship).toBe(
    Math.max(...s.agents.map((a) => a.hardship)),
  );
  expect(() =>
    rebellion({ initialCopDensity: 50, initialAgentDensity: 51 }),
  ).toThrow();
});

test("Rebellion mixed turns preserve population and legal torus cells", () => {
  const m = rebellion({
    initialAgentDensity: 5,
    initialCopDensity: 1,
    governmentLegitimacy: 0,
    vision: 2,
    maxJailTerm: 1,
  });
  m.advance(20);
  const s = m.read();
  expect(s.agentCount).toBe(80);
  expect(s.copCount).toBe(16);
  expect(s.quietCount + s.activeCount + s.jailedCount).toBe(80);
  expect(s.jailedCount).toBe(0); // random1 is always0, then end-of-tick decay
  for (const a of s.agents) {
    expect(Number.isInteger(a.x) && Number.isInteger(a.y)).toBe(true);
    expect(a.x >= 0 && a.x <= 39 && a.y >= 0 && a.y <= 39).toBe(true);
  }
});

test("language redistribution truncates n-of fractions and retains topology; reset retains spoken output", () => {
  const m = language({
    numNodes: 3,
    percentGrammar1: 50,
    updateAlgorithm: "threshold",
    thresholdVal: 0,
    sinkState1: false,
  });
  const edges = m.read().edges;
  expect(m.read().grammar1).toBe(1);
  m.advance();
  expect(m.read().grammar1).toBe(3);
  m.resetNodes();
  expect(m.read().grammar1).toBe(1);
  expect(m.read().edges).toEqual(edges);
  const spoken = m.read().nodes.map((a) => a.spokenState);
  m.advance();
  m.resetNodes();
  expect(m.read().nodes.map((a) => a.spokenState)).toEqual(spoken);
  m.setParameters({
    percentGrammar1: 100,
    updateAlgorithm: "reward",
    logistic: false,
  });
  m.redistributeGrammars();
  m.advance(20);
  expect(m.read().meanState).toBe(1);
});

test("party stale happiness stops before a changed tolerance is applied; groups are atomic", () => {
  const m = party({ number: 0, numGroups: 5, tolerance: 99 });
  m.setGroups([["male", "female"], [], [], [], []]);
  expect(m.read().happyCount).toBe(2);
  m.setParameters({ tolerance: 0 });
  m.advance();
  expect(m.read().tick).toBe(0);
  expect(m.read().stopped).toBe(true);
  m.setGroups([["male", "female"], [], [], [], []]);
  expect(m.read().happyCount).toBe(0);
  m.advance();
  expect(m.read().people.every((a) => a.group !== 0 && !a.happy)).toBe(true);
  const snap = m.read();
  expect(() =>
    m.setGroups([["male"], [], [], [], ["bad" as "male"]]),
  ).toThrow();
  expect(m.read()).toEqual(snap);
  expect(() =>
    m.setGroups([
      Object.defineProperty([], "0", {
        get() {
          throw new Error("must not read");
        },
      }),
      [],
      [],
      [],
      [],
    ]),
  ).toThrow();
  expect(m.read()).toEqual(snap);
});

test("ethnocentrism full cooperation is directed and PTR remains unclamped", () => {
  const m = ethnicity({
    setup: "full",
    immigrantsPerDay: 0,
    deathRate: 0,
    mutationRate: 0,
    initialPtr: 0,
    costOfGiving: 0,
    gainOfReceiving: 1,
    immigrantChanceCooperateWithSame: 1,
    immigrantChanceCooperateWithDifferent: 1,
  });
  m.advance();
  let s = m.read();
  expect(s.turn.meet).toBe(10404);
  expect(s.turn.coopOwn + s.turn.coopOther).toBe(10404);
  expect(s.agents.length).toBe(2601);
  expect(s.agents.every((a) => a.ptr === 4)).toBe(true);
  expect(s.turnRatios.coopPercent).toBe(1);
  expect(s.genotypeMean.cc).toBe(2601);
  m.setParameters({ deathRate: 1 });
  m.advance();
  s = m.read();
  expect(s.agents.length).toBe(0);
  expect(s.cumulative.meet).toBe(20808);
  m.setupEmpty();
  expect(m.read().turnRatios.coopPercent).toBe(0);
  expect(m.read().genotypeMean.cc).toBe(0);
});

test("ethnocentrism death includes new immigrants and newborns", () => {
  const m = ethnicity({
    immigrantsPerDay: 100,
    initialPtr: 1,
    deathRate: 1,
    mutationRate: 1,
  });
  m.advance(3);
  expect(m.read().agents.length).toBe(0);
  expect(m.read().tick).toBe(3);
});

test("all first-five live updates validate atomically and reads detach nested data", () => {
  for (const m of [
    choice({ numConsumers: 10, avgConnections: 0 }),
    rebellion({ initialAgentDensity: 1 }),
    language({ numNodes: 3 }),
    party({ number: 3 }),
    ethnicity(),
  ]) {
    const before = m.read();
    expect(m.read()).toEqual(before);
    expect(() => m.advance(-1)).toThrow();
    expect(m.read()).toEqual(before);
    expect(() => m.setParameters({ seed: 4 } as never)).toThrow();
    expect(m.read()).toEqual(before);
    let read = false;
    const bad = Object.defineProperty({}, "unused", {
      get() {
        read = true;
        return 1;
      },
    });
    expect(() => m.setParameters(bad)).toThrow();
    expect(read).toBe(false);
    expect(m.read()).toEqual(before);
    expect(Object.isFrozen(before)).toBe(true);
    expect(Object.isFrozen(before.history)).toBe(true);
  }
  const m = choice({ numConsumers: 10, avgConnections: 0 });
  const s = m.read();
  expect(Object.isFrozen(s.consumers[0]!.personalExperience)).toBe(true);
  m.advance();
  expect(s.tick).toBe(0);
  expect(s.consumers[0]!.personalExperience).toEqual([0, 0]);
});
