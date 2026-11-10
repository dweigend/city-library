import { describe, expect, test } from "bun:test";
import {
  create as perceptron,
  sign,
  targetAnswer as signedTarget,
} from "../models/artificial-neural-net-perceptron/model.ts";
import {
  create as multilayer,
  sigmoid,
  step,
} from "../models/artificial-neural-net-multilayer/model.ts";
import { create as dining } from "../models/dining-philosophers/model.ts";
import { create as pagerank } from "../models/pagerank/model.ts";
import {
  create as genetic,
  hammingDistance,
  calculateFitness,
} from "../models/simple-genetic-algorithm/model.ts";

describe("neural source equations and action boundaries", () => {
  test("strict signed threshold, all truth functions and single-example update", () => {
    expect(sign(0)).toBe(-1);
    expect(sign(0.01)).toBe(1);
    expect(
      ["or", "xor", "and", "nor", "nand"].map((f) =>
        signedTarget(f as Parameters<typeof signedTarget>[0], 1, 1),
      ),
    ).toEqual([1, -1, 1, -1, -1]);
    const p = perceptron({ learningRate: 0.5, targetFunction: "or" });
    p.setScenario({ weights: [0, 0, 0], inputs: [1, -1] });
    p.trainExample(1, -1);
    expect(p.read().weights).toEqual([1, 1, -1]);
    expect(p.read().epochError).toBe(4);
    expect(p.read().activations[3]).toBe(-1);
    expect(p.read().tick).toBe(0);
    const weights = p.read().weights;
    p.test(-1, -1);
    expect(p.read().weights).toEqual(weights);
    expect(p.read().tick).toBe(0);
  });
  test("zero second weight has explicit vertical or degenerate geometry", () => {
    const p = perceptron();
    p.setScenario({ weights: [2, 1, 0], inputs: [1, 1] });
    expect(p.read().boundary).toEqual({
      kind: "vertical",
      points: [
        { x: -2, y: -2 },
        { x: -2, y: 2 },
      ],
    });
    p.setScenario({ weights: [0, 0, 0], inputs: [-1, -1] });
    expect(p.read().boundary.kind).toBe("degenerate");
  });
  test("multilayer hidden deltas use old outgoing weights before all updates", () => {
    const n = multilayer({ targetFunction: "xor", learningRate: 0.5 });
    const w = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    n.setScenario({ weights: w, inputs: [1, 0] });
    const h1 = 1 / (1 + Math.exp(-0.5)),
      h2 = 1 / (1 + Math.exp(-0.7)),
      out = 1 / (1 + Math.exp(-(0.3 + 0.8 * h1 + 0.9 * h2)));
    const eo = out * (1 - out) * (1 - out),
      e1 = h1 * (1 - h1) * 0.8 * eo,
      e2 = h2 * (1 - h2) * 0.9 * eo;
    n.trainExample(1, 0);
    const s = n.read();
    expect(s.activations.slice(3)).toEqual([h1, h2, out]);
    [e1, e2, eo].forEach((e, i) => expect(s.errors[i + 3]).toBeCloseTo(e, 14));
    const expected = [
      0.1 + 0.5 * e1,
      0.2 + 0.5 * e2,
      0.3 + 0.5 * eo,
      0.4 + 0.5 * e1,
      0.5 + 0.5 * e2,
      0.6,
      0.7,
      0.8 + 0.5 * eo * h1,
      0.9 + 0.5 * eo * h2,
    ];
    expected.forEach((e, i) => expect(s.weights[i]).toBeCloseTo(e, 14));
    expect(s.epochError).toBeCloseTo((1 - out) ** 2, 14);
    expect(s.tick).toBe(0);
    expect(sigmoid(0)).toBe(0.5);
    expect(step(0.5)).toBe(0);
    expect(step(0.500001)).toBe(1);
  });
  test("zero learning rate retains weights through real epochs and errors remain defined", () => {
    for (const make of [perceptron, multilayer]) {
      const m = make({ seed: 51, learningRate: 0, examplesPerEpoch: 13 });
      const before = m.read().weights;
      m.advance(4);
      expect(m.read().weights).toEqual(before);
      expect(m.read().tick).toBe(4);
      expect(m.read().history).toHaveLength(4);
      expect(Number.isFinite(m.read().epochError)).toBe(true);
    }
  });
  test("invalid neural interventions are atomic and observations detached", () => {
    const p = perceptron();
    let before = p.read();
    expect(() =>
      p.setScenario({ weights: [1, 2, NaN], inputs: [1, 1] }),
    ).toThrow();
    expect(p.read()).toEqual(before);
    expect(() =>
      p.setScenario({ weights: Array(3), inputs: [1, 1] }),
    ).toThrow();
    expect(p.read()).toEqual(before);
    expect(() => p.setParameters({ learningRate: 2 })).toThrow();
    expect(p.read()).toEqual(before);
    expect(() => p.test(0, 1)).toThrow();
    expect(p.read()).toEqual(before);
    expect(Object.isFrozen(before.weights)).toBe(true);
    const n = multilayer();
    const s = n.read();
    expect(() =>
      n.setScenario({ weights: Array(9).fill(0), inputs: [-1, 0] }),
    ).toThrow();
    expect(n.read()).toEqual(s);
  });
});

describe("philosopher asynchronous resource protocol", () => {
  test("defaults, hungry barrier and later consumption", () => {
    const d = dining();
    expect(d.read().philosophers).toHaveLength(20);
    expect(d.read().forks.filter((f) => f.marked)).toHaveLength(1);
    expect(d.read().thinkingPhilosopherCount).toBe(20);
    d.setParameters({ hungryChance: 1, fullChance: 1 });
    d.activate(0);
    expect(d.read().philosophers[0]!.state).toBe("hungry");
    d.activate(0);
    expect(d.read().philosophers[0]!.state).toBe("eating");
    expect(d.read().philosophers[0]!.mealCount).toBe(0);
    d.activate(0);
    expect(d.read().philosophers[0]!.mealCount).toBe(1);
    expect(d.read().philosophers[0]!.state).toBe("thinking");
    expect(d.read().tick).toBe(3);
  });
  test("native deadlock continues ticking without hidden reset or repair", () => {
    const d = dining({ philosopherCount: 3 });
    d.setScenario({
      states: ["hungry", "hungry", "hungry"],
      owners: [0, 1, 2],
      marked: [true, false, false],
    });
    d.advance(100);
    expect(d.read().tick).toBe(100);
    expect(d.read().hungryPhilosopherCount).toBe(3);
    expect(d.read().eatingPhilosopherCount).toBe(0);
    expect(d.read().forks.map((f) => f.owner)).toEqual([0, 1, 2]);
    d.setParameters({ cooperation: true });
    d.advance(10);
    expect(d.read().hungryPhilosopherCount).toBe(3); // toggling does not release held resources.
  });
  test("one marked fork and adjacent exclusive ownership across cooperative activation", () => {
    const d = dining({ philosopherCount: 5, cooperation: true, seed: 18 });
    let previous = d.read().philosophers.map((p) => p.mealCount);
    for (let i = 0; i < 500; i++) {
      d.advance();
      const s = d.read();
      expect(s.thinkingPhilosopherCount + s.hungryPhilosopherCount + s.eatingPhilosopherCount).toBe(5);
      expect(s.forks.filter((f) => f.marked)).toHaveLength(1);
      for (const f of s.forks)
        if (f.owner !== null) expect([f.id, (f.id + 1) % 5]).toContain(f.owner);
      for (const p of s.philosophers) {
        expect(p.mealCount).toBeGreaterThanOrEqual(previous[p.id]!);
        if (p.state === "eating") {
          expect(s.forks[p.id]!.owner).toBe(p.id);
          expect(s.forks[(p.id + 4) % 5]!.owner).toBe(p.id);
        }
      }
      previous = s.philosophers.map((p) => p.mealCount);
    }
  });
  test("invalid fork ownership and population changes leave state untouched", () => {
    const d = dining({ philosopherCount: 3 }),
      before = d.read();
    expect(() =>
      d.setScenario({
        states: ["thinking", "thinking", "thinking"],
        owners: [2, null, null],
        marked: [true, false, false],
      }),
    ).toThrow();
    expect(d.read()).toEqual(before);
    expect(() => d.activate(3)).toThrow();
    expect(d.read()).toEqual(before);
    expect(() => d.setParameters({ philosopherCount: 5 } as never)).toThrow();
    expect(d.read()).toEqual(before);
  });
});

describe("PageRank canonical directed networks", () => {
  test("native network sizes and directed adjacencies", () => {
    const a = pagerank().read();
    expect(a.parameters.calculationMethod).toBe("random-surfer");
    expect(a.pages).toHaveLength(11);
    expect(a.edges).toHaveLength(17);
    expect(a.surfers).toHaveLength(0);
    expect(a.totalRank).toBeCloseTo(1, 14);
    expect(a.edges.filter((e) => e.to === 0).map((e) => e.from)).toEqual([3]);
    expect(a.edges.filter((e) => e.from === 0)).toHaveLength(0);
    const b = pagerank({ networkChoice: "example-2" }).read();
    expect(b.pages.map((p) => p.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(b.edges).toHaveLength(18);
    const c = pagerank({ networkChoice: "preferential-attachment" }).read();
    expect(c.pages).toHaveLength(100);
    expect(c.edges).toHaveLength(196);
    expect(
      new Set(
        c.edges.map((e) => [e.from, e.to].sort((x, y) => x - y).join("-")),
      ).size,
    ).toBe(196);
  });
  test("synchronous old ranks and damping preserve rank mass including isolated pages", () => {
    const p = pagerank({ calculationMethod: "diffusion", dampingFactor: 1 });
    p.setScenario({
      pages: [
        { id: 0, rank: 1 },
        { id: 1, rank: 0 },
        { id: 2, rank: 0 },
      ],
      edges: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
      ],
    });
    p.advance();
    expect(p.read().pages.map((p) => p.rank)).toEqual([0, 1, 0]);
    p.advance();
    expect(p.read().pages.map((p) => p.rank)).toEqual([0, 0, 1]);
    p.advance();
    for (const page of p.read().pages) expect(page.rank).toBeCloseTo(1 / 3, 14);
    p.setParameters({ dampingFactor: 0 });
    p.advance();
    for (const page of p.read().pages) expect(page.rank).toBeCloseTo(1 / 3, 14);
    expect(p.read().totalRank).toBeCloseTo(1, 14);
  });
  test("surfers increment OLD page visits and method changes keep cumulative visits", () => {
    const p = pagerank({ dampingFactor: 1, surferCount: 1 });
    p.setScenario({
      pages: [
        { id: 0, rank: 0.5 },
        { id: 1, rank: 0.5 },
      ],
      edges: [
        { from: 0, to: 1 },
        { from: 1, to: 0 },
      ],
      surfers: [{ currentPage: 0 }],
    });
    p.advance();
    expect(p.read().pages.map((p) => p.visitCount)).toEqual([1, 0]);
    expect(p.read().surfers[0]!.currentPage).toBe(1);
    expect(p.read().pages.map((p) => p.rank)).toEqual([1, 0]);
    p.advance();
    expect(p.read().pages.map((p) => p.visitCount)).toEqual([1, 1]);
    p.setParameters({ calculationMethod: "diffusion" });
    p.advance();
    expect(p.read().surfers).toHaveLength(0);
    expect(p.read().pages.map((p) => p.visitCount)).toEqual([1, 1]);
    p.setParameters({ calculationMethod: "random-surfer", surferCount: 5 });
    p.advance();
    expect(p.read().pages.reduce((s, p) => s + p.visitCount, 0)).toBe(7);
  });
  test("invalid network fixtures do not mutate live graph or random state", () => {
    const p = pagerank(),
      before = p.read();
    expect(() =>
      p.setScenario({
        pages: [{ id: 1, rank: 1 }],
        edges: [{ from: 1, to: 2 }],
      }),
    ).toThrow();
    expect(p.read()).toEqual(before);
    expect(() =>
      p.setScenario({ pages: [{ id: 1, rank: 0 }], edges: [] }),
    ).toThrow();
    expect(p.read()).toEqual(before);
    expect(() =>
      p.setParameters({ networkChoice: "example-2" } as never),
    ).toThrow();
    expect(p.read()).toEqual(before);
  });
});

describe("binary-genotype scientific helpers and reproduction", () => {
  test("five pinned Hamming cases and strict invalid array contract", () => {
    expect(hammingDistance([0, 1], [0, 1])).toBe(0);
    expect(hammingDistance([0, 1], [1, 0])).toBe(1);
    expect(hammingDistance([0, 0, 1, 1], [0, 1, 0, 1])).toBe(0.5);
    expect(hammingDistance([0], [1])).toBe(1);
    expect(hammingDistance([0, 1, 0], [0, 1, 1])).toBe(1 / 3);
    for (const [a, b] of [
      [[], []],
      [[0], [0, 1]],
      [
        [0, 2],
        [0, 1],
      ],
      [
        [0, NaN],
        [0, 1],
      ],
      [
        [0, Infinity],
        [0, 1],
      ],
      [Array(2), [0, 1]],
      [[0, 1], Array(2)],
    ] as [number[], number[]][]) {
      const beforeA = [...a],
        beforeB = [...b];
      expect(() => hammingDistance(a, b)).toThrow();
      expect([...a]).toEqual(beforeA);
      expect([...b]).toEqual(beforeB);
    }
    expect(() => hammingDistance("01" as never, [0, 1])).toThrow();
    expect(() => hammingDistance(new Set([0, 1]) as never, [0, 1])).toThrow();
  });
  test("source normalized diversity reaches one and no-variation reproduction preserves zeroes", () => {
    const g = genetic({
      width: 4,
      populationSize: 5,
      crossoverRate: 100,
      mutationRate: 0,
    });
    g.setScenario({
      genomes: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
      ],
    });
    expect(g.diversity()).toBe(1);
    g.setScenario({ genomes: Array.from({ length: 5 }, () => [0, 0, 0, 0]) });
    g.advance(5);
    expect(g.read().tick).toBe(5);
    expect(g.read().population).toHaveLength(5);
    expect(g.read().population.every((p) => p.fitness === 0)).toBe(true);
    g.setParameters({ populationSize: 10, crossoverRate: 0 });
    g.advance();
    expect(g.read().population).toHaveLength(10);
  });
  test("single-point crossover excludes endpoints and preserves combined bit counts", () => {
    const g = genetic({ width: 4 });
    for (let i = 0; i < 20; i++) {
      const [a, b] = g.crossover([0, 0, 0, 0], [1, 1, 1, 1]);
      expect(a).toHaveLength(4);
      expect(b).toHaveLength(4);
      expect(a[0]).toBe(0);
      expect(a[3]).toBe(1);
      expect(b[0]).toBe(1);
      expect(b[3]).toBe(0);
      expect(calculateFitness(a) + calculateFitness(b)).toBe(4);
    }
  });
  test("all-ones preflight cannot advance time and invalid genomes are atomic", () => {
    const g = genetic({ width: 4, populationSize: 5 });
    g.setScenario({ genomes: Array.from({ length: 5 }, () => [1, 1, 1, 1]) });
    const before = g.read();
    g.advance(20);
    expect(g.read()).toEqual(before);
    expect(() =>
      g.setScenario({
        genomes: [
          [0, 0, 0, 0],
          [0, 0, 2, 0],
          [0, 0, 0, 0],
        ],
      }),
    ).toThrow();
    expect(g.read()).toEqual(before);
    expect(() => g.setParameters({ width: 5 } as never)).toThrow();
    expect(g.read()).toEqual(before);
  });
});

describe("isolated replay and bounded observations", () => {
  test("each public factory replays independently and read never draws", () => {
    for (const make of [perceptron, multilayer, dining, pagerank, genetic]) {
      const a = make({ seed: 101 }),
        b = make({ seed: 101 });
      expect(a.read()).toEqual(b.read());
      a.advance(3);
      const saved = a.read();
      expect(a.read()).toEqual(saved);
      expect(b.read().tick).toBe(0);
      b.advance(3);
      expect(a.read()).toEqual(b.read());
    }
  });
  test("long-running history is bounded while scientific tick keeps advancing", () => {
    const d = dining({ philosopherCount: 3, hungryChance: 0 });
    d.advance(1010);
    expect(d.read().history).toHaveLength(1001);
    expect(d.read().history[0]!.tick).toBe(10);
    expect(d.read().tick).toBe(1010);
  });
});
