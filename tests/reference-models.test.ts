import { test, expect } from "bun:test";
import { model as attachment } from "../models/preferential-attachment/model.ts";
import { model as voting } from "../models/voting/model.ts";
import { model as wolf } from "../models/wolf-sheep-predation/model.ts";
import {
  model as wealth,
  wealthClass,
  profitableHeading,
  harvestedWealth,
} from "../models/wealth-distribution/model.ts";

test("attachment always grows a simple tree and seeded observations remain independent", () => {
  const first = attachment.create({ seed: 12 });
  const second = attachment.create({ seed: 12 });
  first.advance(30);
  second.advance(30);
  const state = first.read();
  expect(state.nodeCount).toBe(32);
  expect(state.edgeCount).toBe(31);
  expect(state.nodes.reduce((sum, node) => sum + node.degree, 0)).toBe(62);
  expect(state.nodes.map((node) => node.degree)).toEqual(
    second.read().nodes.map((node) => node.degree),
  );
  expect(state.edges.every((edge) => edge.from !== edge.to)).toBe(true);
  const degreeTotal = state.distribution.reduce(
    (sum, point) => sum + point.count,
    0,
  );
  expect(degreeTotal).toBe(32);
});

test("voting fixed point stops before tick and live rule changes can restart a tied state", () => {
  const instance = voting.create({ width: 3, height: 3 });
  instance.setVotes([1, 1, 1, 1, 0, 0, 0, 0, 0]);
  instance.setRules({ awardCloseCallsToLoser: true });
  instance.advance(10);
  expect(instance.read().tick).toBe(0);
  expect(instance.read().done).toBe(true);
  instance.setRules({ awardCloseCallsToLoser: false });
  instance.advance(1);
  expect(instance.read().tick).toBe(1);
  expect(instance.read().counts.zero).toBe(9);
  const state = instance.read();
  expect(() => instance.setVotes(Array<number>(9))).toThrow();
  expect(() => instance.setRules({ changeVote: 1 } as never)).toThrow();
  expect(instance.read()).toEqual(state);
});

test("wolf source termination and zero-energy boundary retain successful-step clocks", () => {
  const empty = wolf.create({ initialSheep: 0, initialWolves: 0 });
  empty.advance(100);
  expect(empty.read().tick).toBe(0);
  expect(empty.read().done).toBe(true);
  const lone = wolf.create({
    initialSheep: 0,
    initialWolves: 1,
    wolfGain: 0,
    wolfReproduce: 0,
  });
  expect(lone.read().agents[0]!.energy).toBe(0);
  lone.advance(100);
  expect(lone.read().tick).toBe(1);
  expect(lone.read().counts.wolves).toBe(0);
  expect(lone.read().history.map((point) => point.tick)).toEqual([0, 1]);
});

test("both wolf modes are deterministic per seed and observations are detached", () => {
  for (const mode of ["sheep-wolves", "sheep-wolves-grass"] as const) {
    const first = wolf.create({
      mode,
      initialSheep: 20,
      initialWolves: 10,
      seed: 17,
    });
    const second = wolf.create({
      mode,
      initialSheep: 20,
      initialWolves: 10,
      seed: 17,
    });
    const captured = first.read();
    first.advance(5);
    second.advance(5);
    expect(first.read().counts).toEqual(second.read().counts);
    expect(first.read().randomState).toEqual(second.read().randomState);
    expect(captured.tick).toBe(0);
    expect(captured.agents.length).toBe(30);
    expect(
      first
        .read()
        .agents.every(
          (agent) =>
            agent.x >= -25.5 &&
            agent.x < 25.5 &&
            agent.y >= -25.5 &&
            agent.y < 25.5,
        ),
    ).toBe(true);
  }
});

test("voting validates and commits the same materialized input", () => {
  const instance = voting.create({ width: 1, height: 1 });
  const votes = [0];
  let reads = 0;
  Object.defineProperty(votes, 0, { get: () => reads++ === 0 ? 0 : 2 });
  instance.setVotes(votes);
  expect(reads).toBe(1);
  expect(instance.read().cells[0]!.vote).toBe(0);
  expect(instance.read().counts).toEqual({ zero: 1, one: 0 });
});

test("grass recording preserves missing samples across mode interventions", () => {
  const instance = wolf.create({ initialSheep: 10, initialWolves: 0, sheepReproduce: 1 });
  instance.advance(2);
  expect(instance.read().history.every((point) => !point.grassAvailable)).toBe(true);
  instance.setRules({ mode: "sheep-wolves-grass" });
  expect(instance.read().history.every((point) => !point.grassAvailable)).toBe(true);
  instance.advance(1);
  expect(instance.read().history.at(-1)!.grassAvailable).toBe(true);
  instance.setRules({ mode: "sheep-wolves" });
  instance.advance(1);
  expect(instance.read().history.at(-1)!.grassAvailable).toBe(false);
  expect(instance.read().history.filter((point) => point.grassAvailable)).toHaveLength(1);
});

test("wealth equations retain cardinal tie order, fractional sharing floor and class boundaries", () => {
  expect(profitableHeading([4, 4, 4, 4])).toBe(0);
  expect(profitableHeading([1, 5, 5, 4])).toBe(90);
  expect(harvestedWealth(10, 5, 2)).toBe(12);
  expect(wealthClass(3, 9)).toBe("low");
  expect(wealthClass(6, 9)).toBe("middle");
  expect(wealthClass(7, 9)).toBe("high");
});

test("wealth rebirth preserves identities and population, with finite headless inequality", () => {
  const first = wealth.create({ people: 12, minLife: 1, maxLife: 1, seed: 9 });
  const second = wealth.create({ people: 12, minLife: 1, maxLife: 1, seed: 9 });
  const captured = first.read();
  const ids = captured.agents.map((agent) => agent.id);
  first.advance(3);
  second.advance(3);
  const state = first.read();
  expect(state.agents.map((agent) => agent.id)).toEqual(ids);
  expect(state.peopleCount).toBe(12);
  expect(state.agents.map((agent) => agent.wealth)).toEqual(
    second.read().agents.map((agent) => agent.wealth),
  );
  expect(state.randomState).toEqual(second.read().randomState);
  expect(state.classes.low + state.classes.middle + state.classes.high).toBe(
    12,
  );
  expect(state.gini).toBeGreaterThanOrEqual(0);
  expect(state.gini).toBeLessThanOrEqual(1);
  expect(
    state.cells.every((cell) => cell.grain >= 0 && cell.grain <= cell.capacity),
  ).toBe(true);
  expect(state.history.map((point) => point.tick)).toEqual([0, 1, 2, 3]);
  expect(captured.tick).toBe(0);
  expect(captured.history.length).toBe(1);
  expect(() => first.setRules({ minLife: 10 })).toThrow();
  expect(first.read()).toEqual(state);
});
