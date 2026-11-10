/** NetLogo Three Doors, Uri Wilensky (1998), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Agent, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  contestantCount: number;
  gradation: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  contestantCount: { kind: "number", default: 300, min: 1, max: 1000, integer: true },
  gradation: { kind: "boolean", default: false },
};
export function create(options: Partial<Parameters> = {}) {
  const settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create(
    { x: 71, y: 71, boundary: { x: "wrap", y: "hard" } },
    { random },
  );
  type Racer = Agent<{
    displayId: string;
    hunch: number;
    prize: number;
    guess: number;
    otherDoor: number;
    winCount: number;
    gameCount: number;
  }>;
  const racers = () => world.agents as readonly Racer[];
  let done = false;
  for (let i = 0; i < settings.contestantCount; i++) {
    const hunch = settings.gradation
      ? 100 * random.number()
      : 100 * Math.floor(2 * random.number());
    world.add(
      Agent.create(
        {
          displayId: `racer-${i}`,
          hunch,
          prize: 0,
          guess: 0,
          otherDoor: 0,
          winCount: 0,
          gameCount: 0,
        },
        {
          position: { x: 71 * random.number() - 35.5, y: -35 },
          orientation: { heading: 0 },
        },
      ),
    );
  }
  function makeChoices(racer: Racer) {
    racer.prize = Math.floor(3 * random.number());
    racer.guess = Math.floor(3 * random.number());
    racer.otherDoor =
      racer.guess === racer.prize
        ? random.sample([0, 1, 2].filter((door) => door !== racer.guess))[0]!
        : racer.prize;
  }
  function doSwitch(racer: Racer) {
    if (100 * random.number() < racer.hunch) racer.guess = racer.otherDoor;
  }
  function awardPrizes(racer: Racer) {
    racer.gameCount++;
    if (racer.guess === racer.prize) {
      racer.winCount++;
      if (!done) racer.move(1);
    }
    if (racer.y === 35) done = true;
  }
  function go() {
    const population = racers();
    for (const racer of random.sample(population, {
      sampleCount: population.length,
      algorithm: "fisher-yates-descending",
    })) {
      makeChoices(racer);
      doSwitch(racer);
      awardPrizes(racer);
    }
  }
  return {
    get world() {
      return world;
    },
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount && !done; i++) run(world, go);
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 71,
        height: 71,
        parameters: settings,
        done,
        racers: Object.freeze(
          racers().map((racer) =>
            Object.freeze({
              id: racer.displayId,
              hunch: racer.hunch,
              x: racer.x,
              y: racer.y,
              prize: racer.prize,
              guess: racer.guess,
              otherDoor: racer.otherDoor,
              winCount: racer.winCount,
              gameCount: racer.gameCount,
            }),
          ),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Three Doors",
  description:
    "Monty Hall switching strategies race to the finish. Uri Wilensky (1998), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
