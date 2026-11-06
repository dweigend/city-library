/** Mandelbrot, Wilensky (1997), CC BY-NC-SA 3.0. Full source and notices: source.nlogox / NOTICE.md. */
import { Agent, Grid, Random, World } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  numTurtles: number;
  throw: number;
  scaleFactor: number;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  numTurtles: {
    kind: "number",
    default: 1500,
    min: 0,
    max: 1500,
    integer: true,
  },
  throw: { kind: "number", default: 10, min: 0, max: 99, integer: true },
  scaleFactor: {
    kind: "number",
    default: 100,
    min: 1,
    max: 500,
    integer: true,
  },
};
type Turtle = Agent<{
  sourceIndex: number;
  previousCount: number;
  color: string;
  hidden: boolean;
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const grid = Grid.add(
    { x: 301, y: 301, boundary: "hard" },
    { state: { cReal: 0, cImaginary: 0, zReal: 0, zImaginary: 0, counter: 0 } },
  );
  const world = World.add(grid.space, { random });
  world.add(grid);
  const fields = grid.fields;
  const setupScale = settings.scaleFactor;
  // All90601 canonical Fields are eagerly initialized, including unvisited patches.
  for (const field of fields) {
    field.cReal = field.x / setupScale;
    field.cImaginary = field.y / setupScale;
  }
  function turtles() {
    return world.agents as readonly Turtle[];
  }
  function randomCoordinate() {
    return random.number() * 301 - 150.5;
  }
  function setupTurtles() {
    for (let i = 0; i < settings.numTurtles; i++) {
      const heading = Math.floor(random.number() * 360),
        x = randomCoordinate(),
        y = randomCoordinate();
      world.add(
        Agent.add(
          { sourceIndex: i, previousCount: 0, color: "#16a34a", hidden: false },
          { position: { x, y }, orientation: { heading } },
        ),
      );
    }
  }
  function mandelbrotCalcAndColor() {
    // This temporary set deduplicates occupied canonical Fields, not domain state.
    const occupied = new Set(turtles().map((t) => grid.fieldAt(t)!));
    const eligible: Turtle[] = [];
    for (const field of occupied)
      if (Math.hypot(field.zReal, field.zImaginary) <= 2 && field.counter < 115)
        eligible.push(...(grid.agentsAt(field) as readonly Turtle[]));
    for (const t of random.sample(eligible, {
      count: eligible.length,
      compatibility: "legacy-shuffle",
    })) {
      const p = grid.fieldAt(t)!,
        oldReal = p.zReal;
      p.zReal = p.cReal + oldReal * oldReal - p.zImaginary * p.zImaginary;
      p.zImaginary = p.cImaginary + 2 * oldReal * p.zImaginary;
      p.counter++;
    }
  }
  function step() {
    const population = turtles();
    for (const turtle of random.sample(population, {
      count: population.length,
      compatibility: "legacy-shuffle",
    })) {
      const from = { x: turtle.x, y: turtle.y };
      turtle.move(1);
      // Delivered movement clips hard boundaries. NetLogo's preflight instead
      // relocates. Attempt/measure/restore uses only canonical public movement.
      if (
        turtle.distanceTo(from) < 1 - 1e-10 ||
        turtle.x >= 150.5 ||
        turtle.y >= 150.5
      ) {
        turtle.move({ to: from });
        turtle.move({ to: { x: randomCoordinate(), y: randomCoordinate() } });
      }
    }
  }
  function wiggle() {
    const population = turtles();
    for (const turtle of random.sample(population, {
      count: population.length,
      compatibility: "legacy-shuffle",
    })) {
      turtle.rotate(Math.floor(random.number() * 10));
      turtle.rotate(-Math.floor(random.number() * 10));
    }
  }
  function climb() {
    const population = turtles();
    for (const turtle of random.sample(population, {
      count: population.length,
      compatibility: "legacy-shuffle",
    })) {
      const field = grid.fieldAt(turtle)!;
      if (field.counter >= turtle.previousCount) {
        turtle.previousCount = field.counter;
        turtle.color = "#eab308";
        const from = { x: turtle.x, y: turtle.y };
        turtle.move(settings.throw);
        // Source jump is all-or-nothing, unlike the public move's clipping.
        if (
          turtle.distanceTo(from) <
            settings.throw - 1e-10 * Math.max(1, settings.throw) ||
          turtle.x >= 150.5 ||
          turtle.y >= 150.5
        )
          turtle.move({ to: from });
      } else {
        turtle.previousCount = field.counter;
        turtle.color = "#2563eb";
        turtle.rotate(180);
      }
    }
  }
  function go() {
    mandelbrotCalcAndColor();
    step();
    wiggle();
    climb();
    world.tick.advance();
  }
  setupTurtles();
  return {
    get world() {
      return world;
    },
    get grid() {
      return grid;
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) go();
    },
    hideTurtles() {
      for (const t of turtles()) t.hidden = true;
    },
    setRules(
      change: Partial<Pick<Parameters, "throw" | "scaleFactor" | "numTurtles">>,
    ) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 301,
        height: 301,
        parameters: settings,
        setupScale,
        maxIterations: 115,
        // Sparse display records are derived from the full canonical Grid.
        patches: Object.freeze(
          fields
            .filter((p) => p.counter > 0)
            .map((p) =>
              Object.freeze({
                id: `${p.x},${p.y}`,
                x: p.x,
                y: p.y,
                cReal: p.cReal,
                cImaginary: p.cImaginary,
                zReal: p.zReal,
                zImaginary: p.zImaginary,
                counter: p.counter,
              }),
            ),
        ),
        turtles: Object.freeze(
          turtles().map((t) =>
            Object.freeze({
              id: String(t.sourceIndex),
              x: t.x,
              y: t.y,
              heading: t.heading,
              previousCount: t.previousCount,
              color: t.color,
              hidden: t.hidden,
            }),
          ),
        ),
        computedPatches: fields.filter((p) => p.counter > 0).length,
        iterations: fields.reduce((n, p) => n + p.counter, 0),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Mandelbrot",
  description:
    "Moving turtles allocate complex-iteration work to patches. Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
