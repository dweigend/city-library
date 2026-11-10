/** NetLogo Galton Box, Uri Wilensky (2002), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
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
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: 35, y: 61, boundary: "hard" }, { random });
  const grid = Grid.create(
    { x: 35, y: 61, boundary: "hard" },
    {
      state: {
        color: 0,
        counter: false,
        count: 0,
      },
    },
  );
  world.add(grid);
  // Stable references to canonical Fields, never a copied spatial state.
  const fields = grid.fields;
  type Ball = Agent<{ displayId: string; piled: boolean }>;
  const balls = () => world.agents as readonly Ball[];
  let created = 0,
    nextId = 0;
  function propagate(x: number, y: number) {
    if (y < 28 - 2 * settings.numberOfRows) return;
    const field = grid.fieldAt({ x, y });
    if (!field || field.color === 45) return;
    field.color = 45;
    propagate(x - 1, y - 2);
    propagate(x + 1, y - 2);
  }
  function yellowAt(x: number, y: number) {
    return grid.fieldAt({ x, y })?.color === 45;
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
    for (const field of fields) field.counter = counter(field.x, field.y);
    for (const field of fields) if (field.counter) field.color = 52;
  }
  setup();
  const counters = fields.filter((field) => field.counter);
  // Grid owns the indexed occupancy and updates it on Agent.move/delete.
  function ballsAt(x: number, y: number) {
    const field = grid.fieldAt({ x, y });
    return field ? (grid.agentsAt(field) as readonly Ball[]) : [];
  }
  function full() {
    return counters.some((field) =>
      ballsAt(field.x, field.y - 1).some((ball) => ball.piled),
    );
  }
  function timeForNewBall() {
    return (
      created < settings.numberOfBalls &&
      !ballsAt(0, 29).some((ball) => !ball.piled)
    );
  }
  function newBall() {
    world.add(
      Agent.create(
        { displayId: `ball-${nextId++}`, piled: false },
        { position: { x: 0, y: 30 } },
      ),
    );
    created++;
  }
  function doneFalling(ball: Ball) {
    return (
      ball.y === -29 || ballsAt(ball.x, ball.y - 1).some((other) => other.piled)
    );
  }
  function fall(ball: Ball) {
    if (yellowAt(ball.x, ball.y - 1))
      ball.move({
        by: {
          x: random.number() * 100 < settings.chanceOfBouncingRight ? 1 : -1,
        },
      });
    else {
      ball.move({ by: { y: -1 } });
      if (doneFalling(ball)) ball.piled = true;
    }
  }
  function prepareGo() {
    if (timeForNewBall()) newBall();
    if (full()) {
      const counterY = counters[0]!.y;
      for (const ball of balls())
        if (!ball.piled && ball.y > counterY) {
          ball.delete();
          created--;
        }
    }
    return balls().some((ball) => !ball.piled);
  }
  function go() {
    const falling = balls().filter((ball) => !ball.piled);
    for (const ball of random.sample(falling, {
      count: falling.length,
      algorithm: "fisher-yates-descending",
    }))
      fall(ball);
    for (const ball of balls())
      if (!ball.piled) {
        const field = grid.fieldAt(ball)!;
        if (field.counter) {
          field.count++;
          if (!settings.pileUp) ball.delete();
        }
      }
  }
  return {
    get world() {
      return world;
    },
    get grid() {
      return grid;
    },
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
        particles: Object.freeze(
          balls().map((ball) =>
            Object.freeze({
              id: ball.displayId,
              x: ball.x,
              y: ball.y,
              piled: ball.piled,
            }),
          ),
        ),
        pegs: Object.freeze(
          fields
            .filter((field) => field.color === 45)
            .map((field) => Object.freeze({ x: field.x, y: field.y })),
        ),
        counters: Object.freeze(
          counters.map((field) =>
            Object.freeze({ x: field.x, y: field.y, count: field.count }),
          ),
        ),
        full: full(),
        done:
          !balls().some((ball) => !ball.piled) &&
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
