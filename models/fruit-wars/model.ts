/** NetLogo Fruit Wars, Wilensky 2019; CC BY-NC-SA 3.0, see NOTICE.md. */
import { Agent, Grid, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
type Visualization =
  | "None"
  | "Reactive Aggression"
  | "Proactive Aggression"
  | "Strength"
  | "Speed"
  | "Intelligence";
export interface Parameters {
  seed: number;
  initialFruitBushes: number;
  initialForagers: number;
  ticksToFlee: number;
  rateOfMutation: number;
  collaborationBonus: number;
  maxAge: number;
  bushGrowthChance: number;
  showEnergy: boolean;
  visualization: Visualization;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialFruitBushes: {
    kind: "number",
    default: 40,
    min: 0,
    max: 40,
    integer: true,
  },
  initialForagers: {
    kind: "number",
    default: 40,
    min: 1,
    max: 100,
    integer: true,
  },
  ticksToFlee: { kind: "number", default: 49, min: 0, max: 100, integer: true },
  rateOfMutation: { kind: "number", default: 1, min: 0, max: 10, step: 0.1 },
  collaborationBonus: {
    kind: "number",
    default: 5,
    min: 0.1,
    max: 5,
    step: 0.01,
  },
  maxAge: { kind: "number", default: 500, min: 1, max: 500, integer: true },
  bushGrowthChance: {
    kind: "number",
    default: 6,
    min: 0,
    max: 100,
    integer: true,
  },
  showEnergy: { kind: "boolean", default: false },
  visualization: {
    kind: "choice",
    default: "Reactive Aggression",
    options: [
      "None",
      "Reactive Aggression",
      "Proactive Aggression",
      "Strength",
      "Speed",
      "Intelligence",
    ],
  },
};
export function genomeTraits(genome: readonly number[]) {
  if (genome.length !== 240 || genome.some((v) => v !== 0 && v !== 1))
    throw new RangeError("Expected 240 binary alleles.");
  const sum = (offset: number) =>
      genome.slice(offset, offset + 60).reduce((a, b) => a + b, 0),
    a = sum(0),
    b = sum(60);
  return {
    intelligence: Math.min(a, b),
    speed: Math.abs(a - b),
    strength: 60 - Math.max(a, b),
    reactiveAggression: sum(120),
    proactiveAggression: sum(180),
  };
}
type Forager = Agent<
  ReturnType<typeof genomeTraits> & {
    kind: "forager";
    genome: number[];
    energy: number;
    foraging: boolean;
    fleeing: boolean;
    fleeingTurns: number;
    age: number;
  }
>;
type Bush = Agent<{ kind: "bush"; amount: number; color: number }>;
type Death = Agent<{ kind: "death"; age: number }>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    space = { x: 65, y: 65, boundary: "wrap" as const },
    world = World.create(space, { random }),
    grid = Grid.create(space);
  world.add(grid);
  const foragers = () =>
      world.agents.filter(
        (a): a is Forager => (a as Forager | Bush | Death).kind === "forager",
      ),
    bushes = () =>
      world.agents.filter(
        (a): a is Bush => (a as Forager | Bush | Death).kind === "bush",
      ),
    deaths = () =>
      world.agents.filter(
        (a): a is Death => (a as Forager | Bush | Death).kind === "death",
      );
  const integer = (n: number) => Math.floor(random.number() * n),
    shuffle = <T>(a: readonly T[]) =>
      random.sample(a, { count: a.length, algorithm: "fisher-yates-descending" }),
    pick = <T>(a: readonly T[]) => random.sample(a)[0]!;
  let murderCount = 0,
    starvationCount = 0,
    ageDeathCount = 0,
    totalForaged = 0,
    forageCount = 0,
    totalPopulation = 0,
    averagePopulation = 0,
    avgForage = 0;
  function growFruitBushes(count: number) {
    const sites = grid.fields.filter(
      (f) =>
        f.x % 3 === 0 &&
        f.y % 3 === 0 &&
        Math.abs(f.x - 32) > 1 &&
        Math.abs(f.x + 32) > 1 &&
        Math.abs(f.y - 32) > 1 &&
        Math.abs(f.y + 32) > 1 &&
        !grid.agentsAt(f, { source: bushes() }).length,
    );
    if (count > sites.length)
      throw new Error("Source grow-fruit-bushes: not enough eligible fields.");
    for (const f of random.sample(sites, { count }))
      world.add(
        Agent.create(
          {
            kind: "bush" as const,
            amount: 500 + integer(501),
            color: pick([15, 105, 25, 45]),
          },
          { position: f },
        ),
      );
  }
  function spawn(
    genome: number[],
    position: { x: number; y: number },
    heading: number,
  ) {
    const f = Agent.create(
      {
        kind: "forager" as const,
        genome: [...genome],
        energy: 100,
        foraging: false,
        fleeing: false,
        fleeingTurns: 0,
        age: 0,
        ...genomeTraits(genome),
      },
      { position, orientation: { heading } },
    );
    world.add(f);
    return f;
  }
  function markDeath(a: Forager) {
    world.add(
      Agent.create(
        { kind: "death" as const, age: 0 },
        { position: { x: a.x, y: a.y } },
      ),
    );
    a.delete();
  }
  const nearby = (a: Forager, r: number) =>
    a.neighbors({ source: foragers(), radius: r }) as readonly Forager[];
  const nearbyBushes = (a: Forager, r: number) =>
    a.neighbors({ source: bushes(), radius: r }) as readonly Bush[];
  function arrive(a: Forager) {
    const others = nearby(a, 0.1);
    if (!others.length) {
      a.foraging = true;
      return;
    }
    if (random.number() < a.reactiveAggression / 60) {
      let count = 0,
        strength = 0;
      for (const other of shuffle(others)) {
        if (random.number() < other.proactiveAggression / 60) {
          count++;
          strength += other.strength;
        } else {
          other.foraging = false;
          other.fleeing = true;
          other.fleeingTurns = settings.ticksToFlee;
        }
      }
      if (count > 0) {
        const denominator = strength * 0.75 + a.strength;
        if (denominator === 0)
          throw new Error(
            "Source arrive: division by zero (combined strength = 0).",
          );
        if (random.number() < a.strength / denominator) {
          murderCount += count;
          for (const other of shuffle(nearby(a, 0.1).filter((f) => f.foraging)))
            markDeath(other);
        } else {
          murderCount++;
          markDeath(a);
        }
      } else a.foraging = true;
    } else {
      let okay = true;
      if (others.length === 1)
        for (const other of others)
          if (random.number() < other.reactiveAggression / 60) okay = false;
      if (okay) a.foraging = true;
      else {
        a.fleeing = true;
        a.fleeingTurns = settings.ticksToFlee;
      }
    }
  }
  function forage(a: Forager) {
    const other = nearby(a, 0.1).filter((f) => f.foraging),
      group = [a, ...other];
    const rate = other.length
      ? (group.reduce((n, f) => n + f.intelligence, 0) / (group.length * 20)) *
        10 *
        settings.collaborationBonus
      : 10;
    const b = pick(nearbyBushes(a, 0.1));
    b.amount -= 10;
    if (b.amount < 0) b.delete();
    a.energy += rate;
    forageCount++;
    totalForaged += rate;
  }
  function moveForager(a: Forager) {
    if (!a.alive) return;
    if (a.fleeing) {
      a.rotate(-(integer(31) - 15));
      a.move(a.speed / 60);
      a.fleeingTurns--;
      if (a.fleeingTurns === 0) a.fleeing = false;
    } else if (nearbyBushes(a, 0.1).length && a.foraging) forage(a);
    else {
      a.foraging = false;
      const inFive = nearbyBushes(a, 5);
      if (inFive.length) {
        const best = Math.min(...inFive.map((b) => a.distanceTo(b)));
        a.rotate({
          towards: pick(inFive.filter((b) => a.distanceTo(b) === best)),
        });
      } else a.rotate(-(integer(31) - 15));
      const inOne = nearbyBushes(a, 1);
      if (inOne.length) {
        a.move({ to: pick(inOne) });
        arrive(a);
        if (!a.alive) return;
      } else {
        a.move(a.speed / 60);
        a.energy--;
      }
      if (a.energy < 0) {
        starvationCount++;
        a.delete();
        return;
      }
      if (a.energy > 200) {
        a.energy -= 100;
        const genome = a.genome.map((bit) =>
          random.number() * 100 < settings.rateOfMutation ? 1 - bit : bit,
        );
        spawn(genome, { x: a.x, y: a.y }, a.heading);
      }
    }
    a.age++;
    if (a.age > settings.maxAge) {
      ageDeathCount++;
      a.delete();
    }
  }
  const history: {
    tick: number;
    population: number;
    averagePopulation: number;
    avgForage: number;
    murderRate: number;
    starvationRate: number;
    ageDeathRate: number;
    strength: number | null;
    speed: number | null;
    intelligence: number | null;
    reactiveAggression: number | null;
    proactiveAggression: number | null;
  }[] = [];
  function mortality() {
    const total = murderCount + starvationCount + ageDeathCount;
    return {
      murderRate: total ? (100 * murderCount) / total : 0,
      starvationRate: total ? (100 * starvationCount) / total : 0,
      ageDeathRate: total ? (100 * ageDeathCount) / total : 0,
    };
  }
  function means() {
    const agents = foragers();
    const mean = (key: keyof ReturnType<typeof genomeTraits>) =>
      agents.length ? stats.describe(agents.map((a) => a[key])).mean! : null;
    return {
      strength: mean("strength"),
      speed: mean("speed"),
      intelligence: mean("intelligence"),
      reactiveAggression: mean("reactiveAggression"),
      proactiveAggression: mean("proactiveAggression"),
    };
  }
  function record() {
    history.push({
      tick: world.tick.value,
      population: foragers().length,
      averagePopulation,
      avgForage,
      ...mortality(),
      ...means(),
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  growFruitBushes(settings.initialFruitBushes);
  for (let i = 0; i < settings.initialForagers; i++)
    spawn(
      Array.from({ length: 240 }, () => integer(2)),
      { x: random.number() * 65 - 32.5, y: random.number() * 65 - 32.5 },
      integer(360),
    );
  record();
  function go() {
    for (const d of shuffle(deaths())) {
      d.age++;
      if (d.age > 10) d.delete();
    }
    if (integer(100) < settings.bushGrowthChance) growFruitBushes(1);
    for (const f of shuffle(foragers())) moveForager(f);
    avgForage = forageCount ? totalForaged / forageCount : 0;
    totalPopulation += foragers().length;
    averagePopulation =
      world.tick.value === 0 ? 0 : totalPopulation / world.tick.value;
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count && foragers().length; i++) {
        run(world, go);
        record();
      }
    },
    growFruitBushes,
    setRules(
      value: Pick<
        Partial<Parameters>,
        | "ticksToFlee"
        | "rateOfMutation"
        | "collaborationBonus"
        | "maxAge"
        | "bushGrowthChance"
        | "showEnergy"
        | "visualization"
      >,
    ) {
      settings = parameters(inputs, { ...settings, ...value });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 65,
        height: 65,
        parameters: settings,
        sourceMarker: "fruit-wars:source-v1",
        done: foragers().length === 0,
        murderCount,
        starvationCount,
        ageDeathCount,
        deathCount: 0,
        totalForaged,
        forageCount,
        totalPopulation,
        averagePopulation,
        avgForage,
        ...mortality(),
        ...means(),
        aggressionHistograms: Object.freeze({
          reactiveAggression: stats.histogram(
            foragers().map((a) => a.reactiveAggression),
            { edges: Array.from({ length: 62 }, (_, i) => i) },
          ),
          proactiveAggression: stats.histogram(
            foragers().map((a) => a.proactiveAggression),
            { edges: Array.from({ length: 62 }, (_, i) => i) },
          ),
        }),
        foragers: Object.freeze(
          foragers().map((a) =>
            Object.freeze({
              id: a.id,
              x: a.x,
              y: a.y,
              heading: a.heading,
              energy: a.energy,
              age: a.age,
              genome: Object.freeze([...a.genome]),
              foraging: a.foraging,
              fleeing: a.fleeing,
              fleeingTurns: a.fleeingTurns,
              strength: a.strength,
              speed: a.speed,
              intelligence: a.intelligence,
              reactiveAggression: a.reactiveAggression,
              proactiveAggression: a.proactiveAggression,
            }),
          ),
        ),
        bushes: Object.freeze(
          bushes().map((b) =>
            Object.freeze({
              id: b.id,
              x: b.x,
              y: b.y,
              amount: b.amount,
              color: b.color,
            }),
          ),
        ),
        deaths: Object.freeze(
          deaths().map((d) =>
            Object.freeze({ id: d.id, x: d.x, y: d.y, age: d.age }),
          ),
        ),
        history: Object.freeze(history.map((h) => Object.freeze({ ...h }))),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Fruit Wars",
  description:
    "Foraging, heritable traits and conflict · Wilensky · CC BY-NC-SA 3.0",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
