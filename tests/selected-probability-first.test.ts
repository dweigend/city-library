import { describe, expect, test } from "bun:test";
import {
  create as birthdays,
  makeMonth,
} from "../models/birthdays/model.ts";
import { create as galton } from "../models/galton-box/model.ts";
import { create as rabbits } from "../models/binomial-rabbits/model.ts";
import { create as doors } from "../models/three-doors/model.ts";
import { create as patchwork } from "../models/stochastic-patchwork/model.ts";

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

describe("B17 canonical public Agent/Grid/World composition", () => {
  test("Birthdays creates real world members, moves their canonical positions, and deletes the old room", () => {
    const model = birthdays({ seed: 17 });
    expect(model.world.agents).toHaveLength(0);
    expect(model.world.space?.boundary).toEqual({ x: "hard", y: "wrap" });
    model.advance();
    const room = model.world.agents;
    const snapshot = model.read();
    expect(room).toHaveLength(23);
    for (const agent of room) {
      expect(agent.world).toBe(model.world);
      expect(agent.alive).toBe(true);
      expect(snapshot.people.some((person) => person.id === agent.id)).toBe(
        false,
      );
      const person = snapshot.people.find(
        (person) => "displayId" in agent && person.id === agent.displayId,
      )!;
      expect({ x: person.x, y: person.y }).toEqual({ x: agent.x, y: agent.y });
      expect(Reflect.set(person, "y", -100)).toBe(false);
    }
    model.advance();
    expect(model.world.tick.value).toBe(2);
    expect(model.read().tick).toBe(2);
    expect(model.world.agents).toHaveLength(23);
    for (const old of room) {
      expect(old.alive).toBe(false);
      expect(old.world).toBeUndefined();
      expect(model.world.agents.includes(old)).toBe(false);
    }
    expect(snapshot.tick).toBe(1);
  });

  test("Galton fields own pegs/counters and indexed occupancy follows public Agent movement/deletion", () => {
    const model = galton({ numberOfRows: 1, numberOfBalls: 1 });
    expect(model.world.grids.some((grid) => Object.is(grid, model.grid))).toBe(
      true,
    );
    expect(model.grid.space.boundary).toEqual({ x: "hard", y: "hard" });
    expect(model.grid.fields).toHaveLength(35 * 61);
    expect(model.grid.fieldAt({ x: 0, y: 28 })?.color).toBe(45);
    expect(model.grid.fieldAt({ x: 2, y: 24 })?.counter).toBe(true);
    expect(model.grid.fieldAt({ x: 2, y: 24 })?.color).toBe(52);
    expect(model.grid.fieldAt({ x: 18, y: 0 })).toBeUndefined();
    model.advance();
    const ball = model.world.agents[0]!;
    expect(ball.world).toBe(model.world);
    const previous = model.grid.fieldAt(ball)!;
    expect(model.grid.agentsAt(previous)).toContain(ball);
    expect(model.read().particles[0]!.id).not.toBe(ball.id);
    const before = model.read();
    ball.move({ to: { x: 1, y: 10 } });
    const current = model.grid.fieldAt(ball)!;
    expect(current).not.toBe(previous);
    expect(model.grid.agentsAt(previous)).not.toContain(ball);
    expect(model.grid.agentsAt(current)).toEqual([ball]);
    expect(model.read().particles[0]!.x).toBe(ball.x);
    expect(model.read().particles[0]!.y).toBe(ball.y);
    expect(before.particles[0]!.y).toBe(29);
    expect(model.world.tick.value).toBe(1); // Movement is not a second clock.
    const counter = model.grid.fieldAt({ x: 2, y: 24 })!;
    counter.count = 7;
    expect(model.read().counters.find((field) => field.x === 2)?.count).toBe(7);
    ball.delete();
    expect(model.world.agents).toHaveLength(0);
    expect(model.grid.agentsAt(current)).toHaveLength(0);
    expect(model.read().particles).toHaveLength(0);
  });

  test("Patchwork observation is a detached projection of the sole canonical wrapped grid", () => {
    const model = patchwork({ blockSide: 3, targetPercent: 100 });
    expect(model.world.grids).toHaveLength(1);
    expect(Object.is(model.world.grids[0], model.grid)).toBe(true);
    expect(model.world.agents).toHaveLength(0);
    expect(model.grid.fields).toHaveLength(441);
    expect(model.grid.space.boundary).toEqual({ x: "wrap", y: "wrap" });
    expect(model.grid.fieldAt({ x: 11, y: 0 })).toBe(
      model.grid.fieldAt({ x: -10, y: 0 }),
    );
    const center = model.grid.fieldAt({ x: 0, y: 0 })!;
    const initial = model.read();
    center.target = true;
    expect(model.read().targetCount).toBe(1);
    expect(initial.targetCount).toBe(0);
    expect(
      initial.cells.find((cell) => cell.x === 0 && cell.y === 0)?.target,
    ).toBe(false);
    model.advance();
    expect(model.world.tick.value).toBe(1);
    expect(model.read().tick).toBe(1);
    expect(model.grid.fields.filter((field) => field.target)).toHaveLength(9);
    expect(model.read().targetCount).toBe(9);
    for (const field of model.grid.fields) {
      const dto = model
        .read()
        .cells.find((cell) => cell.id === field.displayId)!;
      expect(dto.id).not.toBe(field.id);
      expect(dto.target).toBe(field.target);
      expect(dto.drawn).toBe(field.drawn);
      expect(Reflect.set(dto, "target", false)).toBe(false);
    }
  });

  test("Rabbits use Agent.move wrapping and Grid occupancy while displacement remains unwrapped", () => {
    const model = rabbits({
      number: 2,
      hops: 10,
      hop1: 5,
      ratio1: 1,
      ratio2: 0,
    });
    const population = model.world.agents;
    expect(population).toHaveLength(2);
    expect(model.world.grids.some((grid) => Object.is(grid, model.grid))).toBe(
      true,
    );
    expect(model.world.space?.boundary).toEqual({ x: "wrap", y: "hard" });
    model.advance(10);
    expect(model.world.agents).toEqual(population);
    for (const agent of population) {
      expect(agent.world).toBe(model.world);
      expect(agent.x).toBe(5); // 50 displacement, width 45.
      expect(agent.y).toBe(-22); // Original y=0 mapped to centered world.
      expect(model.grid.agentsAt(model.grid.fieldAt(agent)!)).toContain(agent);
      const dto = model
        .read()
        .rabbits.find(
          (rabbit) => "displayId" in agent && rabbit.id === agent.displayId,
        )!;
      expect(dto.total).toBe(50);
      expect(dto.x).toBe(agent.x);
      expect(dto.y).toBe(agent.y + 22);
      expect(dto.id).not.toBe(agent.id);
    }
    const bottom = model.grid.fieldAt({ x: 5, y: -22 })!;
    expect(bottom.agentQuant).toBe(2);
    expect(model.grid.agentsAt(bottom)).toHaveLength(2);
    expect(model.read().distribution).toEqual([{ x: 5, count: 2 }]);
    const before = model.read();
    population[0]!.move({ by: { x: 45 } });
    expect(population[0]!.x).toBe(5);
    expect(model.read()).toEqual(before);
    expect(model.read().tick).toBe(model.world.tick.value);
  });

  test("Three Doors racers retain canonical identity, use world movement, and share exactly one Tick", () => {
    const model = doors({ number: 20, seed: 17 });
    const population = model.world.agents;
    const before = model.read();
    expect(population).toHaveLength(20);
    expect(model.world.space?.boundary).toEqual({ x: "wrap", y: "hard" });
    model.advance();
    expect(model.world.agents).toEqual(population);
    expect(model.world.tick.value).toBe(1);
    for (const agent of population) {
      expect(agent.world).toBe(model.world);
      const dto = model
        .read()
        .racers.find(
          (racer) => "displayId" in agent && racer.id === agent.displayId,
        )!;
      expect(dto.x).toBe(agent.x);
      expect(dto.y).toBe(agent.y);
      expect(dto.id).not.toBe(agent.id);
      expect(dto.y).toBe(-35 + dto.wins);
    }
    expect(before.racers.every((racer) => racer.y === -35)).toBe(true);
    const first = population[0]!;
    const x = first.x;
    first.move({ by: { x: 71 } });
    expect(first.x).toBeCloseTo(x, 10);
    expect(model.world.tick.value).toBe(1);
    model.advance(1000);
    expect(model.read().done).toBe(true);
    expect(model.read().tick).toBe(model.world.tick.value);
    expect(population.some((agent) => agent.y === 35)).toBe(true);
  });

  test("canonical IDs differ across replay instances while display DTOs remain deterministic", () => {
    for (const make of [birthdays, galton, rabbits, doors]) {
      const a = make({ seed: 17 });
      const b = make({ seed: 17 });
      a.advance();
      b.advance();
      expect(a.read()).toEqual(b.read());
      expect(a.world.agents.length).toBeGreaterThan(0);
      expect(a.world.agents[0]!.id).not.toBe(b.world.agents[0]!.id);
      expect(a.world.agents.every((agent) => agent.world === a.world)).toBe(
        true,
      );
      expect(b.world.agents.every((agent) => agent.world === b.world)).toBe(
        true,
      );
      expect(Reflect.set(a, "world", b.world)).toBe(false);
    }
  });
});
