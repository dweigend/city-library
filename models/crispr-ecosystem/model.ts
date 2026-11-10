/** NetLogo CRISPR Ecosystem. Source-specific defense and resource equations. */
import { Agent, Grid, Random, World, stats, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface EcosystemParameters {
  seed: number;
  initialBacteriumCount: number;
  initialVirusCount: number;
  maxVirusTypeCount: number;
  infectionChance: number;
  spacerLossChance: number;
  crispr: boolean;
  plottedVirus: number;
}
export const inputs: Inputs<EcosystemParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialBacteriumCount: {
    kind: "number",
    default: 50,
    min: 0,
    max: 100,
    integer: true,
  },
  initialVirusCount: {
    kind: "number",
    default: 250,
    min: 0,
    max: 1000,
    integer: true,
  },
  maxVirusTypeCount: {
    kind: "number",
    default: 50,
    min: 1,
    max: 100,
    integer: true,
  },
  infectionChance: { kind: "number", default: 5, min: 0, max: 10 },
  spacerLossChance: { kind: "number", default: 1, min: 0, max: 2 },
  crispr: { kind: "boolean", default: true },
  plottedVirus: { kind: "number", default: 35, min: 0, max: 99, integer: true },
};
type Organism = Agent<{
  who: number;
  group: "bacterium" | "virus";
  energy: number;
  array: number[];
  sequence: number;
}>;
export function create(options: Partial<EcosystemParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 33, y: 33, boundary: "wrap" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { foodEnergy: 50, countdown: 0 } });
  world.add(grid);
  let who = 0;
  let stopped = false;
  let plotVirus = settings.plottedVirus;
  const virusHistory = new Set<number>();
  const coevolutionHistory: {
    tick: number;
    focalVirusPercent: number;
    focalArrayPercent: number;
  }[] = [];
  const history: {
    tick: number;
    bacteriumCount: number;
    virusCount: number;
    relativeAbundance: { sequence: number; percentage: number }[];
    focalVirusPercent: number;
    focalArrayPercent: number;
  }[] = [];
  const all = () => world.agents as readonly Organism[];
  const bacteria = () => all().filter((p) => p.group === "bacterium");
  const viruses = () => all().filter((p) => p.group === "virus");
  const shuffled = (values: readonly Organism[]) =>
    random.sample(values, {
      sampleCount: values.length,
      algorithm: "fisher-yates-descending",
    });
  function randomPosition(p: Organism) {
    p.move({
      to: { x: -16 + random.number() * 32, y: -16 + random.number() * 32 },
    });
  }
  function addOrganism(group: Organism["group"], energy = 0, sequence = 0) {
    const p = world.add(
      Agent.create(
        { who: who++, group, energy, sequence, array: [] as number[] },
        {
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      ),
    );
    randomPosition(p);
    return p;
  }
  function setupWorld() {
    for (const field of grid.fields) {
      field.foodEnergy = 50;
      field.countdown = 0;
    }
    for (let i = 0; i < settings.initialBacteriumCount; i++)
      addOrganism(
        "bacterium",
        random.number({ distribution: "normal", mean: 50, deviation: 10 }),
      );
    for (let i = 0; i < settings.initialVirusCount; i++)
      addOrganism(
        "virus",
        0,
        random.number({ min: 0, max: settings.maxVirusTypeCount, integer: true }),
      );
  }
  function focalVirusPercent() {
    return (
      (100 * viruses().filter((p) => p.sequence === plotVirus).length) /
      Math.max(1, viruses().length)
    );
  }
  function focalArrayPercent() {
    const arrays = bacteria().flatMap((p) => p.array);
    return (
      (100 * arrays.filter((sequence) => sequence === plotVirus).length) /
      Math.max(1, arrays.length)
    );
  }
  function averageArrayLength() {
    const mean = stats.describe(bacteria().map((p) => p.array.length)).mean;
    if (mean === undefined)
      throw new RangeError("Source mean requires at least one bacterium.");
    return mean;
  }
  function stdDevArrayLength() {
    const deviation = stats.describe(
      bacteria().map((p) => p.array.length),
      { sample: true },
    ).standardDeviation;
    if (deviation === undefined)
      throw new RangeError(
        "Source standard deviation requires at least two bacteria.",
      );
    return deviation;
  }
  function plotNewVirus() {
    plotVirus = settings.plottedVirus;
    // Only this source plot is cleared; population and relative-abundance histories remain.
    coevolutionHistory.length = 0;
  }
  function updateVirusPlot(tick = world.tick.value + 1) {
    for (const p of viruses()) virusHistory.add(p.sequence);
    coevolutionHistory.push({
      tick,
      focalVirusPercent: focalVirusPercent(),
      focalArrayPercent: focalArrayPercent(),
    });
    history.push({
      tick,
      bacteriumCount: bacteria().length,
      virusCount: viruses().length,
      focalVirusPercent: focalVirusPercent(),
      focalArrayPercent: focalArrayPercent(),
      relativeAbundance: [...virusHistory].map((sequence) => ({
        sequence,
        percentage:
          (100 * viruses().filter((p) => p.sequence === sequence).length) /
          Math.max(1, viruses().length),
      })),
    });
  }
  function setupVirusPlot() {
    virusHistory.clear();
    plotVirus = settings.plottedVirus;
    updateVirusPlot(0);
  }
  function setup() {
    for (const p of all()) p.delete();
    world.tick.reset();
    who = 0;
    stopped = false;
    history.length = 0;
    coevolutionHistory.length = 0;
    setupWorld();
    setupVirusPlot();
  }
  function moveBacteria(p: Organism) {
    p.energy--;
    p.rotate(random.number() * 90 - random.number() * 90);
    p.move(0.25);
  }
  function bacteriaEatFood(p: Organism) {
    const field = grid.fieldAt(p)!;
    if (field.foodEnergy > 25) {
      field.foodEnergy -= 25;
      p.energy += 5;
    }
    if (field.foodEnergy <= 25) field.countdown = 25;
  }
  function reproduceBacteria(p: Organism) {
    if (p.energy <= 100) return;
    p.energy /= 2;
    const child = world.add(
      Agent.create(
        {
          who: who++,
          group: "bacterium" as const,
          energy: p.energy,
          sequence: p.sequence,
          array: [...p.array],
        },
        { position: { x: p.x, y: p.y }, orientation: { heading: p.heading } },
      ),
    );
    child.rotate(random.number({ min: 0, max: 360, integer: true }));
    child.move(0.25);
  }
  function spacerLoss(p: Organism) {
    if (p.array.length > 0 && random.number() * 100 < settings.spacerLossChance)
      p.array.pop();
  }
  function bacteriaLive() {
    for (const p of shuffled(bacteria())) {
      moveBacteria(p);
      bacteriaEatFood(p);
      reproduceBacteria(p);
      spacerLoss(p);
      if (p.energy <= 0) p.delete();
    }
  }
  function moveVirus(p: Organism) {
    p.rotate(random.number() * 90 - random.number() * 90);
    p.move(0.1);
  }
  function replicate(p: Organism, host: Organism) {
    host.delete();
    if (random.number() < 0.05)
      p.sequence = random.number({
        min: 0,
        max: settings.maxVirusTypeCount,
        integer: true,
      });
    for (let i = 0; i < 19; i++)
      world.add(
        Agent.create(
          {
            who: who++,
            group: "virus" as const,
            energy: 0,
            array: [] as number[],
            sequence: p.sequence,
          },
          { position: { x: p.x, y: p.y }, orientation: { heading: p.heading } },
        ),
      );
  }
  function infect(p: Organism) {
    const targets = bacteria().filter(
      (b) => grid.fieldAt(b) === grid.fieldAt(p),
    );
    if (targets.length === 0) return;
    const target = random.sample(targets, { sampleCount: 1 })[0]!;
    if (random.number() * 100 >= settings.infectionChance) return;
    const roll = random.number() * 100;
    if (!settings.crispr) {
      if (roll < 50) p.delete();
      else replicate(p, target);
      return;
    }
    const matching = target.array.includes(p.sequence);
    const success = matching ? 8 : 30;
    const degradation = matching ? 83 : 55;
    if (roll < success) replicate(p, target);
    else {
      if (roll >= success + degradation) target.array.unshift(p.sequence);
      p.delete();
    }
  }
  function maybeDegrade(p: Organism) {
    if (random.number() * 100 < 1) p.delete();
  }
  function virusesLive() {
    for (const p of shuffled(viruses())) {
      moveVirus(p);
      infect(p);
      if (all().includes(p)) maybeDegrade(p);
    }
  }
  function replenishFood() {
    for (const f of grid.fields) {
      f.countdown--;
      if (f.countdown <= 0) {
        random.number({ min: 0, max: 1, integer: true });
        f.foodEnergy = Math.min(100, f.foodEnergy + 2.5);
      }
      if (f.foodEnergy < 0) {
        f.foodEnergy = 0;
        f.countdown = 25;
      }
    }
  }
  function growFood() {
    return grid.fields.map((f) => ({
      id: f.id,
      size: Math.max(5, f.foodEnergy) / 100,
    }));
  }
  function go() {
    bacteriaLive();
    virusesLive();
    replenishFood();
    updateVirusPlot();
  }
  function advance(stepCount = 1) {
    validateStepCount(stepCount);
    for (let i = 0; i < stepCount; i++) {
      if (bacteria().length === 0 || viruses().length === 0) {
        stopped = true;
        break;
      }
      stopped = false;
      run(world, go);
    }
  }
  function setParameters(
    update: Partial<
      Omit<EcosystemParameters, "seed" | "initialBacteriumCount" | "initialVirusCount">
    >,
  ) {
    if (
      Object.keys(update).some((k) =>
        ["seed", "initialBacteriumCount", "initialVirusCount"].includes(k),
      )
    )
      throw new TypeError("Setup parameters are immutable.");
    settings = parseParameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 33,
      height: 33,
      stopped,
      parameters: { ...settings },
      plotVirus,
      focalVirusPercent: focalVirusPercent(),
      focalArrayPercent: focalArrayPercent(),
      averageArrayLength: bacteria().length > 0 ? averageArrayLength() : null,
      stdDevArrayLength: bacteria().length > 1 ? stdDevArrayLength() : null,
      virusSequences: viruses().map((p) => p.sequence),
      arraySequences: bacteria().flatMap((p) => p.array),
      arrayLengths: bacteria().map((p) => p.array.length),
      bacteriaCount: bacteria().length,
      virusCount: viruses().length,
      coevolutionHistory: coevolutionHistory.map((p) => ({ ...p })),
      history: history.map((p) => ({
        ...p,
        relativeAbundance: p.relativeAbundance.map((x) => ({ ...x })),
      })),
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        foodEnergy: f.foodEnergy,
        countdown: f.countdown,
        color: `rgb(${Math.round(180 - f.foodEnergy * 0.9)} ${Math.round(200 - f.foodEnergy * 0.6)} ${Math.round(230 - f.foodEnergy * 1.4)})`,
      })),
      agents: all().map((p) => ({
        id: p.id,
        who: p.who,
        group: p.group,
        x: p.x,
        y: p.y,
        heading: p.heading,
        color: p.group === "bacterium" ? "#ee952c" : "#a855cc",
        size: p.group === "bacterium" ? 5 : 3,
        energy: p.energy,
        sequence: p.sequence,
        array: [...p.array],
      })),
    };
  }
  setup();
  return {
    advance,
    read,
    setup,
    setupWorld,
    setupVirusPlot,
    updateVirusPlot,
    plotNewVirus,
    focalVirusPercent,
    focalArrayPercent,
    averageArrayLength,
    stdDevArrayLength,
    randomPosition,
    moveBacteria,
    bacteriaEatFood,
    reproduceBacteria,
    spacerLoss,
    bacteriaLive,
    moveVirus,
    infect,
    replicate,
    maybeDegrade,
    virusesLive,
    replenishFood,
    growFood,
    go,
    setParameters,
    world,
    grid,
  };
}
export const model = {
  title: "CRISPR Ecosystem",
  inputs,
  create,
} satisfies Definition<EcosystemParameters, ReturnType<typeof create>>;
