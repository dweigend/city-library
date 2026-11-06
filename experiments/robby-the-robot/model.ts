/** Mitchell, Tisue & Wilensky (2012), CC0; exact source and attribution adjacent. */
import { Agent, Grid, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const actions = [
  "move-north",
  "move-east",
  "move-south",
  "move-west",
  "move-random",
  "stay-put",
  "pick-up-can",
] as const;
export type RobbyAction = (typeof actions)[number];
export interface RobbyParameters {
  seed: number;
  populationSize: number;
  mutationRate: number;
  numberOfGenerations: number;
}
export const inputs: Inputs<RobbyParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  populationSize: {
    kind: "number",
    default: 100,
    min: 20,
    max: 500,
    step: 2,
    integer: true,
  },
  mutationRate: { kind: "number", default: 0.01, min: 0, max: 1 },
  numberOfGenerations: {
    kind: "number",
    default: 100,
    min: 1,
    max: 1000,
    integer: true,
  },
};
export function actionNumber(a: RobbyAction) {
  const n = actions.indexOf(a);
  if (n < 0) throw new TypeError("Unknown Robby action.");
  return n + 1;
}
export function actionSymbol(a: RobbyAction) {
  return ["\u2191", "\u2192", "\u2193", "\u2190", "+", "x", "\u25CF"][
    actionNumber(a) - 1
  ]!;
}
export function occurrences(
  a: RobbyAction,
  chromosome: readonly RobbyAction[],
) {
  return chromosome.filter((b) => b === a).length;
}
export function robbyState(
  north: 0 | 1 | 2,
  east: 0 | 1 | 2,
  south: 0 | 1 | 2,
  west: 0 | 1 | 2,
  here: 0 | 1,
) {
  return north * 81 + east * 27 + south * 9 + west * 3 + here;
}
export function chromosomeDistance(a: readonly number[], b: readonly number[]) {
  if (
    a.length !== 7 ||
    b.length !== 7 ||
    [...a, ...b].some((n) => !Number.isFinite(n) || n < 0)
  )
    throw new RangeError("Seven allele counts required.");
  const squared = a.reduce((sum, n, i) => sum + (n - b[i]!) ** 2, 0);
  return Math.min(9, (9 * Math.sqrt(squared)) / ((273 * Math.sqrt(2)) / 10));
}
export interface TrialInput {
  strategy: readonly RobbyAction[];
  cans: readonly {
    x: number;
    y: number;
  }[];
  x: number;
  y: number;
  score?: number;
}
export function create(options: Partial<RobbyParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed }),
    world = World.add({ x: 10, y: 10, boundary: "hard" }, { random }),
    grid = Grid.add(
      { x: 10, y: 10, boundary: "hard" },
      { state: { can: false, collected: false } },
    );
  world.add(grid);
  const fields = grid.fields;
  let nextId = 0;
  function individual(chromosome: readonly RobbyAction[]) {
    return world.add(
      Agent.add({
        sourceId: nextId++,
        chromosome: [...chromosome],
        fitness: 0,
        scaledFitness: 0,
        alleleDistribution: actions.map((a) => occurrences(a, chromosome)),
      }),
    );
  }
  let population: ReturnType<typeof individual>[] = [],
    robot: Agent<{
      kind: string;
      score: number;
      strategy: RobbyAction[];
    }> | null = null,
    bestChromosome: RobbyAction[] = [],
    bestFitness = 0,
    stepCounter = 0,
    visuals = false,
    fixtureTrial = false;
  let displayBest: ReturnType<typeof individual> | null = null;
  const output: string[] = [],
    history: {
      tick: number;
      bestFitness: number;
    }[] = [],
    trail: {
      from: {
        x: number;
        y: number;
      };
      to: {
        x: number;
        y: number;
      };
    }[] = [];
  function initializeRobot(strategy: readonly RobbyAction[]) {
    if (robot) robot.delete();
    robot = world.add(
      Agent.add(
        { kind: "robot", score: 0, strategy: [...strategy] },
        { position: { x: -4.5, y: -4.5 } },
      ),
    );
    return robot;
  }
  function randomAction() {
    return actions[Math.floor(random.number() * actions.length)]!;
  }
  function distributeCans() {
    for (const f of random.sample(fields, {
      count: fields.length,
      compatibility: "legacy-shuffle",
    })) {
      f.can = random.number() < 0.5;
      f.collected = false;
    }
  }
  function state() {
    if (!robot) throw new Error("No robot.");
    const x = Math.round(robot.x + 4.5),
      y = Math.round(robot.y + 4.5);
    const sense = (dx: number, dy: number): 0 | 1 | 2 =>
      x + dx < 0 || x + dx > 9 || y + dy < 0 || y + dy > 9
        ? 2
        : fields[x + dx + 10 * (y + dy)]!.can
          ? 1
          : 0;
    return robbyState(
      sense(0, 1),
      sense(1, 0),
      sense(0, -1),
      sense(-1, 0),
      fields[x + 10 * y]!.can ? 1 : 0,
    );
  }
  function executeAction(action: RobbyAction) {
    if (!robot) throw new Error("No robot.");
    const from = { x: robot.x + 4.5, y: robot.y + 4.5 };
    if (action === "move-random") {
      executeAction(
        (["move-north", "move-south", "move-east", "move-west"] as const)[
          Math.floor(random.number() * 4)
        ]!,
      );
      return;
    }
    if (action === "pick-up-can") {
      const f = grid.fieldAt(robot)!;
      robot.score += f.can ? 10 : -1;
      if (f.can && visuals) f.collected = true;
      f.can = false;
      return;
    }
    if (action === "stay-put") return;
    const i = actions.indexOf(action);
    if (i < 0 || i > 3) throw new TypeError("Unknown Robby action.");
    const dirs = [
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
      ] as const,
      d = dirs[i]!;
    robot.rotate(i * 90 - robot.heading);
    const x = from.x + d.x,
      y = from.y + d.y;
    if (x < 0 || x > 9 || y < 0 || y > 9) robot.score -= 5;
    else {
      robot.move({ by: d });
      if (visuals) {
        trail.push({ from, to: { x, y } });
        if (trail.length > 20000) trail.shift();
      }
    }
  }
  function calculatePopulationFitnesses() {
    for (const p of population) {
      let sum = 0;
      for (let environment = 0; environment < 20; environment++) {
        initializeRobot(p.chromosome);
        distributeCans();
        for (let n = 0; n < 100; n++) executeAction(robot!.strategy[state()]!);
        sum += robot!.score;
      }
      p.fitness = sum / 20;
      p.scaledFitness = p.fitness < -100 ? 0 : (p.fitness + 100) / 600;
    }
  }
  function bestIndividual() {
    const maximum = Math.max(...population.map((p) => p.fitness)),
      ties = population.filter((p) => p.fitness === maximum);
    return ties[Math.floor(random.number() * ties.length)]!;
  }
  function reportBest() {
    const best = bestIndividual();
    displayBest = best;
    bestChromosome = [...best.chromosome];
    bestFitness = best.fitness;
    output.push(
      `generation ${world.tick.value}:`,
      `  best fitness = ${bestFitness}`,
      `  best strategy: ${bestChromosome.map(actionSymbol).join(" ")}`,
    );
    if (output.length > 600) output.splice(0, output.length - 600);
    history.push({ tick: world.tick.value, bestFitness });
    if (history.length > 2001) history.shift();
  }
  function crossover(a: readonly RobbyAction[], b: readonly RobbyAction[]) {
    const split = 1 + Math.floor(random.number() * 242);
    return [
      [...a.slice(0, split), ...b.slice(split)],
      [...b.slice(0, split), ...a.slice(split)],
    ];
  }
  function mutate(p: (typeof population)[number]) {
    p.chromosome = p.chromosome.map((a) =>
      random.number() < settings.mutationRate ? randomAction() : a,
    );
  }
  function createNextGeneration() {
    const old = [...population],
      children: typeof population = [];
    const select = () => {
      const sampled = random.sample(old, { count: 15 });
      const max = Math.max(...sampled.map((p) => p.fitness)),
        ties = sampled.filter((p) => p.fitness === max);
      return ties[Math.floor(random.number() * ties.length)]!;
    };
    for (let n = 0; n < settings.populationSize / 2; n++) {
      const a = select(),
        b = select(),
        crossed = crossover(a.chromosome, b.chromosome);
      children.push(individual(crossed[0]!), individual(crossed[1]!));
    }
    for (const p of old) p.delete();
    population = children;
    for (const p of random.sample(population, {
      count: population.length,
      compatibility: "legacy-shuffle",
    }))
      mutate(p);
  }
  function validateStrategy(strategy: readonly RobbyAction[]) {
    if (
      !Array.isArray(strategy) ||
      strategy.length !== 243 ||
      strategy.some((a) => !actions.includes(a))
    )
      throw new RangeError("A complete 243-action strategy is required.");
  }
  function setTrial(s: TrialInput) {
    validateStrategy(s.strategy);
    if (
      !Number.isSafeInteger(s.x) ||
      !Number.isSafeInteger(s.y) ||
      s.x < 0 ||
      s.x > 9 ||
      s.y < 0 ||
      s.y > 9 ||
      !Number.isFinite(s.score ?? 0) ||
      !Array.isArray(s.cans) ||
      s.cans.some(
        (c) =>
          !Number.isSafeInteger(c.x) ||
          !Number.isSafeInteger(c.y) ||
          c.x < 0 ||
          c.x > 9 ||
          c.y < 0 ||
          c.y > 9,
      ) ||
      new Set(s.cans.map((c) => c.x + 10 * c.y)).size !== s.cans.length
    )
      throw new RangeError("Invalid trial fixture.");
    fields.forEach((f) => {
      f.can = false;
      f.collected = false;
    });
    for (const c of s.cans) fields[c.x + 10 * c.y]!.can = true;
    initializeRobot(s.strategy);
    robot!.move({ to: { x: s.x - 4.5, y: s.y - 4.5 } });
    robot!.score = s.score ?? 0;
    stepCounter = 1;
    visuals = true;
    fixtureTrial = true;
    trail.length = 0;
  }
  function showEnvironment() {
    if (world.tick.value === 0) return;
    visuals = true;
    fixtureTrial = false;
    trail.length = 0;
    output.length = 0;
    distributeCans();
    initializeRobot(bestChromosome);
    stepCounter = 1;
    output.push("Setting up a new random can distribution");
  }
  function showStrategies() {
    if (!visuals) return;
    visuals = false;
    fixtureTrial = false;
    output.length = 0;
    trail.length = 0;
    for (const f of fields) {
      f.can = false;
      f.collected = false;
    }
    if (robot) {
      robot.delete();
      robot = null;
    }
    displayBest = bestIndividual();
    output.push(
      `generation ${world.tick.value}:`,
      `  best fitness = ${displayBest.fitness}`,
      `  best strategy: ${displayBest.chromosome.map(actionSymbol).join(" ")}`,
    );
  }
  function trialStep() {
    if (world.tick.value === 0 && !fixtureTrial) return;
    if (stepCounter > 100) {
      stepCounter = 0;
      visuals = false;
    }
    if (stepCounter === 1)
      output.push(
        "Stepping through the best strategy found at this generation",
      );
    if (robot) {
      const action = robot.strategy[state()]!;
      executeAction(action);
      output.push(
        `${stepCounter}) ${action} (${actionSymbol(action)}), ${stepCounter === 100 ? "final-score" : "score"} = ${robot.score}`,
      );
      stepCounter++;
    }
    if (output.length > 600) output.splice(0, output.length - 600);
  }
  for (let i = 0; i < settings.populationSize; i++)
    population.push(individual(Array.from({ length: 243 }, randomAction)));
  calculatePopulationFitnesses();
  reportBest();
  return {
    advance(count = 1) {
      stepCount(count);
      fixtureTrial = false;
      for (let i = 0; i < count; i++) {
        run(world, () => {
          createNextGeneration();
          calculatePopulationFitnesses();
        });
        reportBest();
      }
    },
    advanceToLimit() {
      if (world.tick.value < settings.numberOfGenerations) {
        run(world, () => {
          createNextGeneration();
          calculatePopulationFitnesses();
        });
        reportBest();
      }
    },
    setTrial,
    trialStep,
    showEnvironment,
    showStrategies,
    state,
    executeAction,
    randomAction,
    distributeCans,
    crossover,
    calculatePopulationFitnesses,
    createNextGeneration,
    setParameters(patch: Partial<RobbyParameters>) {
      if (
        Reflect.ownKeys(patch).some(
          (k) =>
            !["populationSize", "mutationRate", "numberOfGenerations"].includes(
              String(k),
            ),
        )
      )
        throw new TypeError("Setup-only parameter.");
      settings = parameters(inputs, { ...settings, ...patch });
    },
    read() {
      const best = displayBest?.alive ? displayBest : population[0]!;
      return {
        width: 10,
        height: 10,
        tick: world.tick.value,
        parameters: { ...settings },
        bestChromosome: [...bestChromosome],
        bestFitness,
        displayBestId: String(best.sourceId),
        stepCounter,
        visuals,
        randomState: random.state,
        robot: robot
          ? {
              x: robot.x + 4.5,
              y: robot.y + 4.5,
              heading: robot.heading,
              score: robot.score,
              strategy: [...robot.strategy],
            }
          : null,
        cans: fields
          .filter((f) => f.can)
          .map((f) => ({ x: f.x + 4.5, y: f.y + 4.5 })),
        cells: fields.map((f) => ({
          id: f.id,
          x: f.x,
          y: f.y,
          can: f.can,
          collected: f.collected,
        })),
        population: population.map((p) => ({
          id: String(p.sourceId),
          chromosome: [...p.chromosome],
          fitness: p.fitness,
          scaledFitness: p.scaledFitness,
          alleleDistribution: [...p.alleleDistribution],
          displayDistance: chromosomeDistance(
            p.alleleDistribution,
            best.alleleDistribution,
          ),
        })),
        fitnessSummary: stats.describe(population.map((p) => p.fitness)),
        output: [...output],
        history: history.map((p) => ({ ...p })),
        trail: trail.map((t) => ({ from: { ...t.from }, to: { ...t.to } })),
      };
    },
  };
}
export const model = {
  title: "Robby the Robot",
  description:
    "Robot strategies evaluated in 20 fresh environments with 100 actions each. Mitchell, Tisue and Wilensky (2012), CC0.",
  inputs,
  create,
} satisfies Definition<RobbyParameters, ReturnType<typeof create>>;
