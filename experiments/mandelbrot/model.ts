/** Mandelbrot, Wilensky (1997), CC BY-NC-SA 3.0. Full source and notices: source.nlogox / NOTICE.md. */
import { Random } from "city-library";
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
interface Patch {
  id: string;
  x: number;
  y: number;
  cReal: number;
  cImaginary: number;
  zReal: number;
  zImaginary: number;
  counter: number;
}
interface Turtle {
  id: string;
  x: number;
  y: number;
  heading: number;
  previousCount: number;
  color: string;
  hidden: boolean;
}
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  let tick = 0;
  const patches = new Map<string, Patch>();
  const turtles: Turtle[] = [];
  function randomCoordinate() {
    return random.number() * 301 - 150.5;
  }
  function setupTurtles() {
    for (let i = 0; i < settings.numTurtles; i++)
      turtles.push({
        id: String(i),
        heading: Math.floor(random.number() * 360),
        x: randomCoordinate(),
        y: randomCoordinate(),
        previousCount: 0,
        color: "#16a34a",
        hidden: false,
      });
  }
  // Unvisited patches have exactly zero z and counter. Their c is fixed at setup scale.
  const setupScale = settings.scaleFactor;
  function patchHere(t: { x: number; y: number }) {
    const x = Math.floor(t.x + 0.5),
      y = Math.floor(t.y + 0.5),
      id = `${x},${y}`;
    let p = patches.get(id);
    if (!p) {
      p = {
        id,
        x,
        y,
        cReal: x / setupScale,
        cImaginary: y / setupScale,
        zReal: 0,
        zImaginary: 0,
        counter: 0,
      };
      patches.set(id, p);
    }
    return p;
  }
  function mandelbrotCalcAndColor() {
    const eligible = turtles.filter((t) => {
      const p = patchHere(t);
      return Math.hypot(p.zReal, p.zImaginary) <= 2 && p.counter < 115;
    });
    for (const t of random.sample(eligible, {
      count: eligible.length,
      compatibility: "legacy-shuffle",
    })) {
      const p = patchHere(t),
        oldReal = p.zReal;
      p.zReal = p.cReal + oldReal * oldReal - p.zImaginary * p.zImaginary;
      p.zImaginary = p.cImaginary + 2 * oldReal * p.zImaginary;
      p.counter++;
    }
  }
  function destination(t: Turtle, distance: number) {
    const radians = (t.heading * Math.PI) / 180;
    return {
      x: t.x + Math.sin(radians) * distance,
      y: t.y + Math.cos(radians) * distance,
    };
  }
  function inWorld(p: { x: number; y: number }) {
    return p.x >= -150.5 && p.x < 150.5 && p.y >= -150.5 && p.y < 150.5;
  }
  function step() {
    for (const t of turtles) {
      const p = destination(t, 1);
      if (inWorld(p)) {
        t.x = p.x;
        t.y = p.y;
      } else {
        t.x = randomCoordinate();
        t.y = randomCoordinate();
      }
    }
  }
  function wiggle() {
    for (const t of random.sample(turtles, {
      count: turtles.length,
      compatibility: "legacy-shuffle",
    }))
      t.heading =
        (t.heading +
          Math.floor(random.number() * 10) -
          Math.floor(random.number() * 10) +
          360) %
        360;
  }
  function climb() {
    for (const t of turtles) {
      const p = patchHere(t);
      if (p.counter >= t.previousCount) {
        t.previousCount = p.counter;
        t.color = "#eab308";
        const dest = destination(t, settings.throw);
        if (inWorld(dest)) {
          t.x = dest.x;
          t.y = dest.y;
        }
      } else {
        t.previousCount = p.counter;
        t.color = "#2563eb";
        t.heading = (t.heading + 180) % 360;
      }
    }
  }
  function go() {
    mandelbrotCalcAndColor();
    step();
    wiggle();
    climb();
    tick++;
  }
  setupTurtles();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) go();
    },
    hideTurtles() {
      for (const t of turtles) t.hidden = true;
    },
    setRules(
      change: Partial<Pick<Parameters, "throw" | "scaleFactor" | "numTurtles">>,
    ) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      return Object.freeze({
        tick,
        width: 301,
        height: 301,
        parameters: settings,
        setupScale,
        maxIterations: 115,
        patches: Object.freeze(
          [...patches.values()].map((p) => Object.freeze({ ...p })),
        ),
        turtles: Object.freeze(turtles.map((t) => Object.freeze({ ...t }))),
        computedPatches: [...patches.values()].filter((p) => p.counter > 0)
          .length,
        iterations: [...patches.values()].reduce((n, p) => n + p.counter, 0),
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
