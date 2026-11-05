/** NetLogo Three Doors, Uri Wilensky (1998), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  number: number;
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
  number: { kind: "number", default: 300, min: 1, max: 1000, integer: true },
  gradation: { kind: "boolean", default: false },
};
export function create(options: Partial<Parameters> = {}) {
  const settings = parameters(inputs, options),
    random = Random.add({ seed: settings.seed }),
    world = World.add({ random });
  let done = false;
  const racers = Array.from({ length: settings.number }, (_, i) => ({
    id: `racer-${i}`,
    hunch: settings.gradation
      ? 100 * random.number()
      : 100 * Math.floor(2 * random.number()),
    x: 71 * random.number() - 35.5,
    y: -35,
    prize: 0,
    guess: 0,
    otherDoor: 0,
    wins: 0,
    games: 0,
  }));
  function makeChoices(r: (typeof racers)[number]) {
    r.prize = Math.floor(3 * random.number());
    r.guess = Math.floor(3 * random.number());
    r.otherDoor =
      r.guess === r.prize
        ? random.sample([0, 1, 2].filter((d) => d !== r.guess))[0]!
        : r.prize;
  }
  function doSwitch(r: (typeof racers)[number]) {
    if (100 * random.number() < r.hunch) r.guess = r.otherDoor;
  }
  function awardPrizes(r: (typeof racers)[number]) {
    r.games++;
    if (r.guess === r.prize) {
      r.wins++;
      if (!done) r.y++;
    }
    if (r.y === 35) done = true;
  }
  function go() {
    for (const r of random.sample(racers, {
      count: racers.length,
      compatibility: "legacy-shuffle",
    })) {
      makeChoices(r);
      doSwitch(r);
      awardPrizes(r);
    }
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count && !done; i++) run(world, go);
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 71,
        height: 71,
        parameters: settings,
        done,
        racers: Object.freeze(racers.map((r) => Object.freeze({ ...r }))),
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
