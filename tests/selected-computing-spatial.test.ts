import { describe, test, expect } from "bun:test";
import {
  create as annealing,
  fieldEnergy,
} from "../models/simulated-annealing/model.ts";
import { create as clustering } from "../models/k-means-clustering/model.ts";
import { create as swarm } from "../models/particle-swarm-optimization/model.ts";
import {
  create as robby,
  robbyState,
  actionNumber,
  actionSymbol,
  chromosomeDistance,
} from "../models/robby-the-robot/model.ts";
import { create as factory } from "../models/robotic-factory/model.ts";
describe("B18 Simulated Annealing native rules", () => {
  test("native450bright patches, directed anisotropic energy and exact1000 attempts", () => {
    const a = annealing();
    expect(a.read().brightness.filter((x) => x === 1)).toHaveLength(450);
    expect(a.read().tick).toBe(0);
    expect(fieldEnergy(0, 0, 0, 0, 0)).toBe(2);
    expect(fieldEnergy(0, 1, 1, 0, 0)).toBe(4);
    expect(fieldEnergy(0, 0, 0, 1, 1)).toBe(0);
    a.advance(3);
    expect(a.read().attempts).toBe(3000);
    expect(a.read().temperature).toBeCloseTo(0.99 ** 3, 14);
    expect(a.read().brightness.reduce((x, y) => x + y, 0)).toBe(450);
  });
  test("T0equal switch and rejection rollback; read is detached and RNG-neutral", () => {
    const a = annealing({ width: 4, height: 4 });
    a.setScenario({ brightness: Array(16).fill(0), temperature: 0 });
    expect(a.attemptSwap(0, 0, 1, 0)).toBe(false);
    const same = a.read();
    a.read().brightness[0] = 1;
    expect(a.read()).toEqual(same);
    expect(() => a.setScenario({ brightness: [1] })).toThrow();
    expect(a.read()).toEqual(same);
    expect(() => a.setParameters({ width: 6 })).toThrow();
    expect(a.read()).toEqual(same);
    const striped = Array.from({ length: 16 }, (_, i) => i % 2);
    a.setScenario({ brightness: striped, temperature: 0 });
    a.setParameters({ acceptEqualChanges: true });
    const before = a.read();
    expect(a.attemptSwap(0, 0, 1, 0)).toBe(false);
    expect(a.read().brightness).toEqual(before.brightness);
  });
  test("target seeded replay and no-temperature automatic stop", () => {
    const a = annealing({ width: 6, height: 6, seed: 29, coolingRate: 50 }),
      b = annealing({ width: 6, height: 6, seed: 29, coolingRate: 50 });
    a.advance(15);
    b.advance(15);
    expect(a.read().brightness).toEqual(b.read().brightness);
    expect(a.read().randomState).toEqual(b.read().randomState);
    expect(a.read().tick).toBe(15);
  });
});
describe("B18 K-Means native source contract", () => {
  test("native per-cluster rounded default140points and seven centroids", () => {
    const k = clustering();
    expect(k.read().points).toHaveLength(140);
    expect(k.read().centroids).toHaveLength(7);
    expect(k.read().points.every((p) => p.cluster === null)).toBe(true);
    expect(k.read().tick).toBe(0);
  });
  test("assign/update non-ticking, empty clusters retained and strict threshold", () => {
    const k = clustering({
      numClusters: 2,
      numCentroids: 2,
      numDataPoints: 10,
    });
    k.setScenario({
      points: [
        { x: 0, y: 0 },
        { x: 0.2, y: 0 },
      ],
      centroids: [
        { x: 0, y: 0 },
        { x: 20, y: 20 },
      ],
    });
    k.advance();
    expect(k.read().centroids[0]!.x).toBe(0.1);
    expect(k.read().anyCentroidsMoved).toBe(false);
    expect(k.read().centroids[1]!.x).toBe(20);
    k.advance(100);
    expect(k.read().tick).toBe(1);
    k.resetCentroids();
    expect(k.read().tick).toBe(0);
    expect(k.read().anyCentroidsMoved).toBe(true);
    expect(k.read().points.every((p) => p.cluster === null)).toBe(true);
  });
  test("rejected scenario is atomic and observations preserve stream", () => {
    const k = clustering({ seed: 9 });
    const s = k.read();
    expect(() =>
      k.setScenario({
        points: [{ x: Infinity, y: 0 }],
        centroids: [{ x: 0, y: 0 }],
      }),
    ).toThrow();
    expect(k.read()).toEqual(s);
    k.read().points[0]!.x = 1000;
    expect(k.read()).toEqual(s);
    k.setParameters({ numCentroids: 3 });
    expect(k.read().centroids).toHaveLength(7);
    k.resetCentroids();
    expect(k.read().centroids).toHaveLength(3);
  });
});
describe("B18 PSO actual landscape and update phases", () => {
  test("native201square,50particles,global best remains zero after setup", () => {
    const p = swarm();
    const s = p.read();
    expect(s.cells).toHaveLength(40401);
    expect(s.particles).toHaveLength(50);
    expect(s.globalBestValue).toBe(0);
    expect(s.landscape.filter((v) => v === 1)).toHaveLength(1);
    expect(Math.min(...s.landscape)).toBe(0);
    expect(s.parameters.particleInertia).toBe(0.98);
    expect(s.tick).toBe(0);
  });
  test("velocity axis clipping and wrapped motion; arriving optimum noticed NEXT go", () => {
    const p = swarm({
      width: 5,
      height: 5,
      populationSize: 1,
      landscapeSmoothness: 0,
      particleInertia: 1,
      particleSpeedLimit: 1,
    });
    const landscape = Array(25).fill(0);
    landscape[13] = 1;
    p.setScenario({ landscape, particles: [{ x: 0, y: 0, vx: 5, vy: 0 }] });
    p.advance();
    expect(p.read().particles[0]!.x).toBe(1);
    expect(p.read().particles[0]!.vx).toBe(1);
    expect(p.read().globalBestValue).toBe(0);
    expect(p.read().tick).toBe(1);
    p.advance();
    expect(p.read().globalBestValue).toBe(1);
    expect(p.read().tick).toBe(1);
  });
  test("inertia0 and attraction0 yields no movement; scenario invalid is atomic", () => {
    const p = swarm({
      width: 5,
      height: 5,
      populationSize: 1,
      landscapeSmoothness: 0,
      particleInertia: 0,
      attractionToPersonalBest: 0,
      attractionToGlobalBest: 0,
    });
    const landscape = Array(25).fill(0);
    landscape[24] = 1;
    p.setScenario({ landscape, particles: [{ x: 0, y: 0, vx: 5, vy: -4 }] });
    p.advance();
    expect(p.read().particles[0]!.x).toBe(0);
    expect(p.read().particles[0]!.y).toBe(0);
    const s = p.read();
    expect(() =>
      p.setScenario({
        landscape: Array(25).fill(0),
        particles: [{ x: 0, y: 0, vx: 0, vy: 0 }],
      }),
    ).toThrow();
    expect(p.read()).toEqual(s);
    expect(p.read()).toEqual(s);
  });
});
describe("B18 Robby full native fitness and intervention actions", () => {
  test("ternary sensor weights, action map and source273 display normalization", () => {
    expect(robbyState(2, 2, 2, 2, 1)).toBe(241);
    expect(robbyState(1, 0, 2, 2, 0)).toBe(105);
    expect(actionNumber("pick-up-can")).toBe(7);
    expect(actionSymbol("move-west")).toBe("\u2190");
    expect(
      chromosomeDistance([243, 0, 0, 0, 0, 0, 0], [243, 0, 0, 0, 0, 0, 0]),
    ).toBe(0);
    expect(
      chromosomeDistance([243, 0, 0, 0, 0, 0, 0], [0, 243, 0, 0, 0, 0, 0]),
    ).toBe(9);
  });
  test("real20x100 evaluations, same seed replay, defaults and live next-population", () => {
    const r = robby({ populationSize: 20, seed: 13 }),
      b = robby({ populationSize: 20, seed: 13 });
    expect(r.read().population).toHaveLength(20);
    expect(
      r
        .read()
        .population.every(
          (p) => p.chromosome.length === 243 && Number.isFinite(p.fitness),
        ),
    ).toBe(true);
    r.advance();
    b.advance();
    expect(r.read().population).toEqual(b.read().population);
    expect(r.read().randomState).toEqual(b.read().randomState);
    expect(r.read().tick).toBe(1);
    const chosen = r.read();
    const best = chosen.population.find((p) => p.id === chosen.displayBestId)!;
    expect(best.displayDistance).toBe(0);
    expect(best.chromosome).toEqual(chosen.bestChromosome);
    r.setParameters({ populationSize: 22, mutationRate: 1 });
    r.advance();
    expect(r.read().population).toHaveLength(22);
    expect(r.read().tick).toBe(2);
  });
  test("native gen0display guard, explicit trial fixture, wall/can actions, non-ticking trial", () => {
    const r = robby({ populationSize: 20 });
    r.showEnvironment();
    expect(r.read().visuals).toBe(false);
    r.setTrial({
      strategy: Array(243).fill("move-south"),
      cans: [],
      x: 0,
      y: 0,
    });
    expect(r.state()).toBe(24);
    r.trialStep();
    expect(r.read().robot!.score).toBe(-5);
    expect(r.read().tick).toBe(0);
    const s = r.read();
    expect(() => r.setTrial({ strategy: [], cans: [], x: 0, y: 0 })).toThrow();
    expect(r.read()).toEqual(s);
    r.setTrial({
      strategy: Array(243).fill("pick-up-can"),
      cans: [{ x: 0, y: 0 }],
      x: 0,
      y: 0,
    });
    r.trialStep();
    expect(r.read().robot!.score).toBe(10);
    r.trialStep();
    expect(r.read().robot!.score).toBe(9);
    r.showStrategies();
    expect(r.read().robot).toBe(null);
  });
});
describe("B18 Robotic Factory canonical source quirks", () => {
  test("nine machines, default robots5energy350dock10 and first old-heading motion", () => {
    const f = factory();
    const s = f.read();
    expect(s.machines).toHaveLength(9);
    expect(s.robots).toHaveLength(5);
    expect(s.robots.every((r) => r.energy === 350)).toBe(true);
    expect(s.newSheets).toBe(10);
    expect(s.productsReady).toBe(0);
    expect(s.tick).toBe(0);
    const r = s.robots[0]!,
      d = s.machines.find((m) => m.kind === "loading-dock")!;
    f.setScenario({
      robots: [
        {
          ...r,
          x: 0,
          y: 0,
          heading: 0,
          energy: 100,
          product: 1,
          destination: d.id,
        },
      ],
    });
    f.advance();
    const now = f.read().robots[0]!;
    expect(now.y).toBeCloseTo(1, 12);
    expect(now.x).toBeCloseTo(0, 12);
    expect(now.energy).toBe(98);
  });
  test("finisher queued>1 startup and four/seven countdown; finish called publicly has no tick", () => {
    const f = factory({ numberOfRobots: 3 });
    const fin = f
      .read()
      .machines.find((m) => m.kind === "finisher" && m.deluxeLevel === 1)!;
    f.setScenario({ machines: [{ ...fin, queuedSupply: 1, supply: 0 }] });
    f.finish();
    expect(f.read().machines.find((m) => m.id === fin.id)!.buildCounter).toBe(
      0,
    );
    f.setScenario({ machines: [{ ...fin, queuedSupply: 2, supply: 0 }] });
    f.finish();
    expect(f.read().machines.find((m) => m.id === fin.id)!.buildCounter).toBe(
      3,
    );
    f.finish();
    f.finish();
    f.finish();
    const result = f.read().machines.find((m) => m.id === fin.id)!;
    expect(result.product).toBe(1);
    expect(result.queuedSupply).toBe(1);
    expect(result.processingOrder).toBe(false);
    expect(f.read().tick).toBe(0);
  });
  test("invalid destination errors retain partial state and do not tick", () => {
    const f = factory({ numberOfRobots: 3 });
    const s = f.read(),
      r = s.robots[0]!,
      c = s.machines.find((m) => m.kind === "cutter")!;
    f.setScenario({
      robots: [{ ...r, destination: null }],
      machines: [{ ...c, supply: 1 }],
    });
    expect(() => f.advance()).toThrow();
    expect(f.read().tick).toBe(0);
    expect(f.read().diagnostic).toContain("nobody");
    expect(f.read().machines.find((m) => m.id === c.id)!.product).toBe(1);
  });
  test("read and rejected intervention preserve canonical state/RNG; fullCharge is live", () => {
    const f = factory({ numberOfRobots: 3 }),
      s = f.read();
    expect(() =>
      f.setScenario({ robots: [{ ...s.robots[0]!, x: 100 }] }),
    ).toThrow();
    expect(f.read()).toEqual(s);
    f.read().robots[0]!.energy = 999;
    expect(f.read()).toEqual(s);
    f.setParameters({ fullCharge: 5 });
    expect(f.read().robots.every((r) => r.energy === 350)).toBe(true);
    expect(f.read().parameters.fullCharge).toBe(5);
    expect(() => f.setParameters({ numberOfRobots: 4 })).toThrow();
  });
});
