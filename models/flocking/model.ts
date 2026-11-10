/** NetLogo Flocking, Wilensky (1998), CC BY-NC-SA 3.0; exact source/NOTICE retained. */
import { Agent, Random, World, run, geometry } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface FlockingParameters {
  seed: number;
  population: number;
  vision: number;
  minimumSeparation: number;
  maxAlignTurn: number;
  maxCohereTurn: number;
  maxSeparateTurn: number;
}
export const inputs: Inputs<FlockingParameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  population: {
    kind: "number",
    default: 300,
    min: 1,
    max: 1000,
    integer: true,
  },
  vision: { kind: "number", default: 5, min: 0, max: 10, step: 0.5 },
  minimumSeparation: { kind: "number", default: 1, min: 0, max: 5, step: 0.25 },
  maxAlignTurn: { kind: "number", default: 5, min: 0, max: 20, step: 0.25 },
  maxCohereTurn: { kind: "number", default: 3, min: 0, max: 20, step: 0.25 },
  maxSeparateTurn: {
    kind: "number",
    default: 1.5,
    min: 0,
    max: 20,
    step: 0.25,
  },
};
type Bird = Agent<{
  shade: number;
  flockmateIds: string[];
  nearestNeighbor: string | null;
}>;
/** NetLogo subtract-headings uses the clockwise +180 tie. */
export function headingDifference(target: number, current: number) {
  if (![target, current].every(Number.isFinite))
    throw new RangeError("Headings must be finite.");
  const d = (((target - current) % 360) + 360) % 360;
  return d > 180 ? d - 360 : d;
}
/** Source average-heading-towards-flockmates reporter, including its coincident-point error. */
export function averageHeadingTowardsFlockmates(
  bird: Agent,
  mates: readonly Agent[],
) {
  if (mates.length === 0) throw new RangeError("Cohesion requires flockmates.");
  let dx = 0,
    dy = 0;
  for (const mate of mates) {
    const away = mate.directionTo(bird);
    if (!away)
      throw new RangeError(
        "No heading is defined between coincident flockmates.",
      );
    const vector = geometry.direction({ heading: away.heading + 180 });
    dx += vector.x / mates.length;
    dy += vector.y / mates.length;
  }
  return dx === 0 && dy === 0
    ? bird.heading
    : (Math.atan2(dx, dy) * 180) / Math.PI;
}
export function create(options: Partial<FlockingParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const width = 71,
    height = 71;
  const world = World.create(
    { x: width, y: height, boundary: "wrap" },
    { random },
  );
  const birds = () => world.agents as readonly Bird[];
  for (let i = 0; i < settings.population; i++)
    world.add(
      Agent.create(
        {
          shade: Math.floor(random.number() * 7),
          flockmateIds: [] as string[],
          nearestNeighbor: null as string | null,
        },
        {
          position: {
            x: random.number() * width - width / 2,
            y: random.number() * height - height / 2,
          },
          orientation: { heading: Math.floor(random.number() * 360) },
        },
      ),
    );
  const shuffle = () =>
    random.sample(birds(), {
      count: birds().length,
      compatibility: "legacy-shuffle",
    });
  function turn(bird: Bird, angle: number, limit: number) {
    bird.rotate(Math.max(-limit, Math.min(limit, angle)));
  }
  function flock(bird: Bird) {
    const mates = bird.neighbors({ source: birds(), radius: settings.vision });
    bird.flockmateIds = mates.map((b) => b.id);
    bird.nearestNeighbor = null;
    if (!mates.length) return;
    const distances = mates.map((b) => bird.distanceTo(b)),
      distance = Math.min(...distances);
    const nearest = random.sample(
      mates.filter((_, i) => distances[i] === distance),
      { count: 1 },
    )[0]!;
    bird.nearestNeighbor = nearest.id;
    if (distance < settings.minimumSeparation) {
      turn(
        bird,
        headingDifference(bird.heading, nearest.heading),
        settings.maxSeparateTurn,
      );
      return;
    }
    let dx = 0,
      dy = 0;
    for (const mate of mates) {
      const vector = geometry.direction({ heading: mate.heading });
      dx += vector.x;
      dy += vector.y;
    }
    const average =
      dx === 0 && dy === 0
        ? bird.heading
        : (Math.atan2(dx, dy) * 180) / Math.PI;
    turn(bird, headingDifference(average, bird.heading), settings.maxAlignTurn);
    const towards = averageHeadingTowardsFlockmates(bird, mates);
    turn(
      bird,
      headingDifference(towards, bird.heading),
      settings.maxCohereTurn,
    );
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++)
        run(world, () => {
          for (const bird of shuffle()) flock(bird);
          for (let substep = 0; substep < 5; substep++)
            for (const bird of shuffle()) bird.move(0.2);
        });
    },
    setRules(rules: Partial<Omit<FlockingParameters, "seed" | "population">>) {
      if (
        typeof rules !== "object" ||
        rules === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(
          (key) =>
            typeof key !== "string" ||
            ![
              "vision",
              "minimumSeparation",
              "maxAlignTurn",
              "maxCohereTurn",
              "maxSeparateTurn",
            ].includes(key) ||
            !("value" in Object.getOwnPropertyDescriptor(rules, key)!),
        )
      )
        throw new TypeError("Supply only live rule data.");
      settings = parameters(inputs, { ...settings, ...rules });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width,
        height,
        parameters: settings,
        birds: Object.freeze(
          birds().map((b) =>
            Object.freeze({
              id: b.id,
              x: b.x,
              y: b.y,
              heading: b.heading,
              shade: b.shade,
              flockmateIds: Object.freeze([...b.flockmateIds]),
              nearestNeighbor: b.nearestNeighbor,
            }),
          ),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Flocking",
  description:
    "Sequential separation, circular alignment and cohesion. Wilensky (1998), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<FlockingParameters, ReturnType<typeof create>>;
