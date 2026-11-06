/** Adapted from NetLogo Paths (Grider and Wilensky, 2015); see NOTICE.md. */
import { Agent, Grid, Random, World, geometry, run } from "city-library";
import type { Field, Position } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface PathsParameters {
  seed: number;
  walkerCount: number;
  minimumRoutePopularity: number;
  walkerVisionDist: number;
  popularityDecayRate: number;
  popularityPerStep: number;
  showPopularity: boolean;
}
export const inputs: Inputs<PathsParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  walkerCount: {
    kind: "number",
    default: 250,
    min: 0,
    max: 1000,
    integer: true,
  },
  minimumRoutePopularity: { kind: "number", default: 80, min: 0, max: 100 },
  walkerVisionDist: { kind: "number", default: 10, min: 0, max: 30 },
  popularityDecayRate: { kind: "number", default: 4, min: 0, max: 100 },
  popularityPerStep: { kind: "number", default: 20, min: 0, max: 100 },
  showPopularity: { kind: "boolean", default: false },
};
type PatchState = { popularity: number; route: boolean };
type Patch = Field<PatchState>;
type Walker = Agent<{ kind: "walker"; goal: Patch }>;
type Building = Agent<{ kind: "building" }>;

export function create(options: Partial<PathsParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const space = { x: 101, y: 101, boundary: "wrap" } as const;
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: { popularity: 0, route: false } });
  world.add(grid);
  const walkers = () =>
    world.agents.filter(
      (agent) => (agent as Walker).kind === "walker",
    ) as Walker[];
  const buildings = () =>
    world.agents.filter(
      (agent) => (agent as Building).kind === "building",
    ) as Building[];
  function choose<T>(values: readonly T[]): T {
    const selected = random.sample(values, { count: 1 })[0];
    if (selected === undefined)
      throw new RangeError("Cannot choose from an empty set.");
    return selected;
  }
  for (let index = 0; index < settings.walkerCount; index++) {
    const goal = choose(grid.fields);
    const walker = Agent.add(
      { kind: "walker" as const, goal: null as unknown as Patch },
      {
        position: {
          x: -50.5 + random.number() * 101,
          y: -50.5 + random.number() * 101,
        },
        orientation: { heading: Math.floor(random.number() * 360) },
      },
    );
    // Framework references are assigned after initialization, preserving canonical field identity.
    walker.goal = goal;
    world.add(walker);
  }
  function toggleBuilding(position: Position) {
    const patch = grid.fieldAt(position);
    if (!patch) throw new RangeError("Building position is outside the world.");
    const nearby = buildings().filter(
      (building) => building.distanceTo(patch) <= 4,
    );
    if (nearby.length) {
      for (const building of nearby) building.delete();
    } else {
      world.add(Agent.add({ kind: "building" as const }, { position: patch }));
    }
  }
  function becomeMorePopular(patch: Patch) {
    patch.popularity += settings.popularityPerStep;
    if (patch.popularity >= settings.minimumRoutePopularity) patch.route = true;
  }
  function bestWayTo(walker: Walker, destination: Patch) {
    const distanceToGoal = walker.distanceTo(destination);
    const candidates = grid.fields.filter(
      (patch) =>
        patch.route &&
        walker.distanceTo(patch) <= settings.walkerVisionDist &&
        geometry.distance(patch, destination, { space }) < distanceToGoal - 1,
    );
    if (candidates.length === 0) return destination;
    // In the original patch task, [distance self] is zero for every candidate.
    // Preserve that all-way tie instead of silently replacing self with myself.
    return choose(candidates);
  }
  function walkTowardsGoal(walker: Walker) {
    const patch = grid.fieldAt(walker)!;
    if (!patch.route) becomeMorePopular(patch);
    walker.rotate({ towards: bestWayTo(walker, walker.goal) });
    walker.move(1);
  }
  function moveWalkers() {
    const active = walkers();
    for (const walker of random.sample(active, {
      count: active.length,
      compatibility: "legacy-shuffle",
    })) {
      if (grid.fieldAt(walker) === walker.goal) {
        const destinations = buildings();
        walker.goal =
          destinations.length >= 2
            ? grid.fieldAt(choose(destinations))!
            : choose(grid.fields);
      } else walkTowardsGoal(walker);
    }
  }
  function decayPopularity() {
    // A temporary query result over canonical agents, not a second occupancy owner.
    const occupied = new Set(walkers().map((walker) => grid.fieldAt(walker)));
    for (const patch of grid.fields) {
      if (!occupied.has(patch)) {
        patch.popularity *= (100 - settings.popularityDecayRate) / 100;
        if (patch.popularity < 1) patch.route = false;
      }
    }
  }
  function step(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++)
      run(world, () => {
        moveWalkers();
        decayPopularity();
      });
    return count;
  }
  function setParameters(
    update: Partial<Omit<PathsParameters, "seed" | "walkerCount">>,
  ) {
    if (
      Object.keys(update).some((key) => key === "seed" || key === "walkerCount")
    )
      throw new TypeError("Only live parameters may change.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function snapshot() {
    return {
      tick: world.tick.value,
      width: 101,
      height: 101,
      parameters: { ...settings },
      cells: grid.fields.map((patch) => ({
        id: patch.id,
        x: patch.x,
        y: patch.y,
        popularity: patch.popularity,
        route: patch.route,
        color: patch.route
          ? "#8d8d8d"
          : settings.showPopularity
            ? `hsl(120 75% ${Math.min(90, 5 + (85 * (patch.popularity + settings.minimumRoutePopularity * 3)) / Math.max(1, settings.minimumRoutePopularity * 6))}%)`
            : "#4caa22",
      })),
      walkers: walkers().map((walker) => ({
        id: walker.id,
        x: walker.x,
        y: walker.y,
        heading: walker.heading,
        goalId: walker.goal.id,
        color: "#f4de21",
      })),
      buildings: buildings().map((building) => ({
        id: building.id,
        x: building.x,
        y: building.y,
        color: "#dd3838",
      })),
    };
  }
  return {
    step,
    advance: step,
    snapshot,
    read: snapshot,
    setParameters,
    toggleBuilding,
    bestWayTo,
    becomeMorePopular,
    walkTowardsGoal,
    moveWalkers,
    decayPopularity,
  };
}
export const model = { title: "Paths", inputs, create } satisfies Definition<
  PathsParameters,
  ReturnType<typeof create>
>;
