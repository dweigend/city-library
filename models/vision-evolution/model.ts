/** NetLogo Vision Evolution, Wilensky (2018), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, geometry, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const sourceMarker = "b08-vision-evolution-source-composition-v1";
export interface Parameters {
  seed: number;
  initialNumberFish: number;
  initialNumberFood: number;
  energyGainFromFood: number;
  foodReplenishRate: number;
  mutationRate: number;
  reproductionRate: number;
  eyeCost: number;
  showVision: boolean;
  maxEyeSize: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  initialNumberFish: {
    kind: "number",
    default: 50,
    min: 0,
    max: 250,
    integer: true,
  },
  initialNumberFood: {
    kind: "number",
    default: 80,
    min: 0,
    max: 250,
    integer: true,
  },
  energyGainFromFood: {
    kind: "number",
    default: 100,
    min: 0,
    max: 300,
    integer: true,
  },
  foodReplenishRate: {
    kind: "number",
    default: 65,
    min: 0,
    max: 100,
    integer: true,
  },
  mutationRate: { kind: "number", default: 0.1, min: 0, max: 1, step: 0.01 },
  reproductionRate: {
    kind: "number",
    default: 35,
    min: 0,
    max: 100,
    integer: true,
  },
  eyeCost: { kind: "number", default: 9, min: 0, max: 10, step: 0.1 },
  showVision: { kind: "boolean", default: true },
  maxEyeSize: { kind: "number", default: 5, min: 1, max: 10, integer: true },
};
export type Fish = Agent<{
  group: "fish";
  eyeSize: number;
  landMobility: number;
  landFoodPreference: number;
  energy: number;
  fovRadius: number;
}>;
type Food = Agent<{ group: "food" }>;
export function visionRadius(eyeSize: number, y: number, maxEyeSize: number) {
  return y < 0 ? eyeSize / maxEyeSize + 3 : eyeSize ** 2 + 3;
}
export function energyCost(
  eyeSize: number,
  landMobility: number,
  y: number,
  eyeCost: number,
) {
  return (
    Math.abs((y < 0 ? landMobility : 1 - landMobility) * 10 - 0.5) +
    Math.abs((eyeSize - 1) / (11 - eyeCost))
  );
}
export function weightedDistance(
  distance: number,
  preyY: number,
  preference: number,
) {
  return (
    distance * Math.exp((preyY < 0 ? preference - 0.5 : 0.5 - preference) * 3)
  );
}
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = {
    x: 101,
    y: 101,
    boundary: { x: "wrap" as const, y: "hard" as const },
  };
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  const fish = () =>
    world.agents.filter((a): a is Fish => (a as Fish | Food).group === "fish");
  const food = () =>
    world.agents.filter((a): a is Food => (a as Fish | Food).group === "food");
  const history: {
    tick: number;
    fish: number;
    food: number;
    terrestrialEye: number;
    aquaticEye: number;
  }[] = [];
  function makeFood() {
    const prey = Agent.create(
      { group: "food" as const },
      {
        position: {
          x: random.number() * 101 - 50.5,
          y: random.number() * 101 - 50.5,
        },
        orientation: {
          heading: random.number({ min: 0, max: 360, integer: true }),
        },
      },
    );
    world.add(prey);
    return prey;
  }
  function makeFish(
    state: Partial<{
      eyeSize: number;
      landMobility: number;
      landFoodPreference: number;
      energy: number;
      x: number;
      y: number;
      heading: number;
    }> = {},
  ) {
    const agent = Agent.create(
      {
        group: "fish" as const,
        eyeSize: state.eyeSize ?? 1,
        landMobility: state.landMobility ?? 0,
        landFoodPreference: state.landFoodPreference ?? random.number(),
        energy:
          state.energy ?? random.number() * 2 * settings.energyGainFromFood,
        fovRadius: 0,
      },
      {
        position: {
          x: state.x ?? random.number() * 101 - 50.5,
          y: state.y ?? -random.number({ min: 0, max: 50, integer: true }),
        },
        orientation: {
          heading:
            state.heading ?? random.number({ min: 0, max: 360, integer: true }),
        },
      },
    );
    world.add(agent);
    agent.fovRadius = visionRadius(agent.eyeSize, agent.y, settings.maxEyeSize);
    return agent;
  }
  function setup() {
    world.delete(world.agents);
    world.tick.reset();
    history.length = 0;
    for (let n = 0; n < settings.initialNumberFood; n++) makeFood();
    for (let n = 0; n < settings.initialNumberFish; n++) makeFish();
    record();
  }
  function mutate(value: number, rate: number, lower: number, upper: number) {
    return Math.max(
      lower,
      Math.min(upper, value + random.number() * 2 * rate - rate),
    );
  }
  function move(agent: Fish) {
    const step =
      (agent.y < 0 ? 1 - agent.landMobility : agent.landMobility) +
      random.number() * 0.1;
    const radius = visionRadius(agent.eyeSize, agent.y, settings.maxEyeSize);
    const visible = agent.neighbors({ source: food(), radius });
    const distances = visible.map((prey) => ({
      prey,
      distance: weightedDistance(
        agent.distanceTo(prey),
        prey.y,
        agent.landFoodPreference,
      ),
    }));
    const minimum = Math.min(...distances.map((p) => p.distance));
    const prey = random.sample(
      distances.filter((p) => p.distance === minimum),
    )[0]?.prey;
    if (prey) {
      agent.rotate({ towards: prey });
      if (agent.distanceTo(prey) < step) agent.move({ to: prey });
      else agent.move(step);
    } else {
      agent.rotate(random.number({ min: 0, max: 50, integer: true }));
      agent.rotate(-random.number({ min: 0, max: 50, integer: true }));
      const direction = geometry.direction({ heading: agent.heading });
      const ahead = geometry.normalize(
        { x: agent.x + direction.x * step, y: agent.y + direction.y * step },
        { space, endpoints: "half-open" },
      );
      if (!ahead) agent.rotate(-random.number() * 180);
      // Preserve the source's second, unguarded forward move (can throw at a hard border).
      agent.move(step);
    }
    agent.fovRadius = radius;
  }
  function consumeEnergy(agent: Fish) {
    agent.energy -= energyCost(
      agent.eyeSize,
      agent.landMobility,
      agent.y,
      settings.eyeCost,
    );
  }
  function eatFood(agent: Fish) {
    const prey = random.sample(
      grid.agentsAt(grid.fieldAt(agent)!, { source: food() }),
    )[0];
    if (prey) {
      prey.delete();
      agent.energy += settings.energyGainFromFood;
    }
  }
  function death(agent: Fish) {
    if (agent.energy < 0) agent.delete();
  }
  function reproduce(agent: Fish) {
    if (
      random.number({ min: 0, max: 100, integer: true }) >=
        settings.reproductionRate ||
      agent.energy <=
        (100 / settings.reproductionRate) * settings.energyGainFromFood
    )
      return;
    agent.energy /= 2;
    const child = agent.copy();
    child.eyeSize = mutate(
      child.eyeSize,
      settings.mutationRate * 3,
      1,
      settings.maxEyeSize,
    );
    child.landMobility = mutate(
      child.landMobility,
      settings.mutationRate,
      0,
      1,
    );
    child.landFoodPreference = mutate(
      child.landFoodPreference,
      settings.mutationRate,
      0,
      1,
    );
    child.fovRadius = visionRadius(child.eyeSize, child.y, settings.maxEyeSize);
    world.add(child);
    move(agent);
  }
  function replenishFood() {
    if (
      random.number({ min: 0, max: 100, integer: true }) <
      settings.foodReplenishRate
    )
      makeFood();
  }
  function record() {
    history.push({
      tick: world.tick.value,
      fish: fish().length,
      food: food().length,
      terrestrialEye:
        stats.describe(
          fish()
            .filter((a) => a.landMobility >= 0.5)
            .map((a) => a.eyeSize),
        ).mean ?? 1,
      aquaticEye:
        stats.describe(
          fish()
            .filter((a) => a.landMobility < 0.5)
            .map((a) => a.eyeSize),
        ).mean ?? 1,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function advance(steps = 1) {
    stepCount(steps);
    for (let n = 0; n < steps; n++) {
      if (!fish().length) break;
      for (const agent of random.sample(fish(), {
        count: fish().length,
        compatibility: "legacy-shuffle",
      })) {
        move(agent);
        consumeEnergy(agent);
        eatFood(agent);
        death(agent);
        if (agent.alive) reproduce(agent);
      }
      replenishFood();
      world.tick.advance();
      record();
    }
  }
  function read() {
    return {
      sourceMarker,
      parameters: { ...settings },
      randomState: random.state,
      width: 101,
      height: 101,
      tick: world.tick.value,
      done: !fish().length,
      fish: fish().map((a) => ({
        id: a.id,
        x: a.x,
        y: a.y,
        heading: a.heading,
        eyeSize: a.eyeSize,
        landMobility: a.landMobility,
        landFoodPreference: a.landFoodPreference,
        energy: a.energy,
        fovRadius: a.fovRadius,
      })),
      food: food().map((a) => ({ id: a.id, x: a.x, y: a.y })),
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        water: f.y <= 0,
      })),
      eyeSizeHistogram: stats.histogram(
        fish().map((a) => a.eyeSize),
        {
          edges: Array.from(
            { length: 11 },
            (_, i) =>
              1 + (i * (Math.max(1.000001, settings.maxEyeSize) - 1)) / 10,
          ),
        },
      ),
      landMobilityHistogram: stats.histogram(
        fish().map((a) => a.landMobility),
        { edges: Array.from({ length: 11 }, (_, i) => i / 10) },
      ),
      foodPreferenceHistogram: stats.histogram(
        fish().map((a) => a.landFoodPreference),
        { edges: Array.from({ length: 11 }, (_, i) => i / 10) },
      ),
      history: history.map((p) => ({ ...p })),
    };
  }
  function setParameters(change: Partial<Parameters>) {
    settings = parameters(inputs, { ...settings, ...change });
  }
  setup();
  return {
    read,
    advance,
    setup,
    setParameters,
    makeFood,
    makeFish,
    move,
    consumeEnergy,
    eatFood,
    death,
    reproduce,
    replenishFood,
    mutate,
  };
}
export const model: Definition<Parameters, ReturnType<typeof create>> = {
  title: "Vision Evolution",
  inputs,
  create,
};
