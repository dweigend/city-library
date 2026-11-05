/** NetLogo Galton Box, Uri Wilensky (2002), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  numberOfRows: number;
  numberOfBalls: number;
  chanceOfBouncingRight: number;
  pileUp: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  numberOfRows: { kind: "number", default: 11, min: 1, max: 15, integer: true },
  numberOfBalls: {
    kind: "number",
    default: 75,
    min: 1,
    max: 1000,
    integer: true,
  },
  chanceOfBouncingRight: {
    kind: "number",
    default: 50,
    min: 0,
    max: 100,
    integer: true,
  },
  pileUp: { kind: "boolean", default: true },
};
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed }),
    world = World.add({ random });
  const pegs = new Set<string>(),
    balls: { id: string; x: number; y: number; piled: boolean }[] = [],
    counters: { x: number; y: number; count: number }[] = [];
  let created = 0,
    nextId = 0;
  function propagate(x: number, y: number) {
    if (y < 28 - 2 * settings.numberOfRows) return;
    const key = `${x},${y}`;
    if (pegs.has(key)) return;
    pegs.add(key);
    propagate(x - 1, y - 2);
    propagate(x + 1, y - 2);
  }
  function yellowAt(x: number, y: number) {
    return pegs.has(`${x},${y}`);
  }
  function counter(x: number, y: number) {
    return (
      (yellowAt(x + 1, y + 2) || yellowAt(x - 1, y + 2)) &&
      !yellowAt(x - 2, y) &&
      !yellowAt(x + 2, y)
    );
  }
  function setup() {
    propagate(0, 28);
    for (let y = -30; y <= 30; y++)
      for (let x = -17; x <= 17; x++)
        if (counter(x, y)) counters.push({ x, y, count: 0 });
  }
  setup();
  function full() {
    return counters.some((c) =>
      balls.some((b) => b.piled && b.x === c.x && b.y === c.y - 1),
    );
  }
  function timeForNewBall() {
    return (
      created < settings.numberOfBalls &&
      !balls.some((b) => !b.piled && b.x === 0 && b.y === 29)
    );
  }
  function newBall() {
    balls.push({ id: `ball-${nextId++}`, x: 0, y: 30, piled: false });
    created++;
  }
  function doneFalling(b: (typeof balls)[number]) {
    return (
      b.y === -29 ||
      balls.some(
        (other) => other.piled && other.x === b.x && other.y === b.y - 1,
      )
    );
  }
  function fall(b: (typeof balls)[number]) {
    if (yellowAt(b.x, b.y - 1))
      b.x += random.number() * 100 < settings.chanceOfBouncingRight ? 1 : -1;
    else {
      b.y--;
      if (doneFalling(b)) b.piled = true;
    }
  }
  function prepareGo() {
    if (timeForNewBall()) newBall();
    if (full()) {
      const counterY = counters[0]!.y;
      for (let i = balls.length - 1; i >= 0; i--)
        if (!balls[i]!.piled && balls[i]!.y > counterY) {
          balls.splice(i, 1);
          created--;
        }
    }
    return balls.some((b) => !b.piled);
  }
  function go() {
    const falling = balls.filter((b) => !b.piled);
    for (const b of random.sample(falling, {
      count: falling.length,
      compatibility: "legacy-shuffle",
    }))
      fall(b);
    for (const b of [...balls])
      if (!b.piled) {
        const c = counters.find((c) => c.x === b.x && c.y === b.y);
        if (c) {
          c.count++;
          if (!settings.pileUp) balls.splice(balls.indexOf(b), 1);
        }
      }
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        if (!prepareGo()) break;
        run(world, go);
      }
    },
    setRules(
      change: Partial<
        Pick<Parameters, "numberOfBalls" | "chanceOfBouncingRight" | "pileUp">
      >,
    ) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 35,
        height: 61,
        parameters: settings,
        balls: created,
        particles: Object.freeze(balls.map((b) => Object.freeze({ ...b }))),
        pegs: Object.freeze(
          [...pegs].map((p) => {
            const [x, y] = p.split(",").map(Number);
            return Object.freeze({ x: x!, y: y! });
          }),
        ),
        counters: Object.freeze(counters.map((c) => Object.freeze({ ...c }))),
        full: full(),
        done:
          !balls.some((b) => !b.piled) &&
          (created >= settings.numberOfBalls || full()),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Galton Box",
  description:
    "Falling balls, staggered pegs and accumulating piles. Uri Wilensky (2002), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
