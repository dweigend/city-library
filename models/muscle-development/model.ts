/** NetLogo Muscle Development (Wilensky, 2002). Complete notices: NOTICE.md. */
import { Agent, Grid, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface MuscleParameters {
  seed: number;
  daysBetweenWorkouts: number;
  hoursOfSleep: number;
  intensity: number;
  lift: boolean;
  slowTwitchFibers: number;
}
export const inputs: Inputs<MuscleParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  daysBetweenWorkouts: {
    kind: "number",
    default: 5,
    min: 1,
    max: 30,
    integer: true,
  },
  hoursOfSleep: { kind: "number", default: 8, min: 0, max: 12 },
  intensity: { kind: "number", default: 95, min: 50, max: 100 },
  lift: { kind: "boolean", default: true },
  slowTwitchFibers: { kind: "number", default: 50, min: 0, max: 100 },
};
type Fiber = Agent<{ fiberSize: number; maxSize: number }>;

export function create(options: Partial<MuscleParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 17, y: 17, boundary: "wrap" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space, {
    state: { anabolicHormone: 50, catabolicHormone: 52 },
  });
  world.add(grid);
  const fibers = () => world.agents as readonly Fiber[];
  const history: {
    tick: number;
    muscleMass: number;
    anabolic: number;
    catabolic: number;
  }[] = [];

  function regulateHormones() {
    grid.diffuse("anabolicHormone", { rate: 0.75, neighborhood: "moore" });
    grid.diffuse("catabolicHormone", { rate: 0.75, neighborhood: "moore" });
    for (const field of grid.fields) {
      field.anabolicHormone = Math.max(
        50,
        Math.min(200, field.anabolicHormone),
      );
      field.catabolicHormone = Math.max(
        52,
        Math.min(250, field.catabolicHormone),
      );
    }
  }
  function regulateMuscleFibers(fiber: Fiber) {
    fiber.fiberSize = Math.max(1, Math.min(fiber.maxSize, fiber.fiberSize));
  }
  function newMuscleFibers() {
    for (const field of random.sample(grid.fields, {
      count: grid.fields.length,
      algorithm: "fisher-yates-descending",
    })) {
      let maxSize = 4;
      for (let trial = 0; trial < 20; trial++) {
        if (random.number() * 100 > settings.slowTwitchFibers) maxSize++;
      }
      const fiber = Agent.create(
        { maxSize, fiberSize: (0.2 + random.number() * 0.4) * maxSize },
        { position: field },
      );
      world.add(fiber);
      regulateMuscleFibers(fiber);
    }
  }
  function performDailyActivity() {
    for (const fiber of fibers()) {
      const field = grid.fieldAt(fiber)!;
      field.catabolicHormone += 2 * Math.log10(fiber.fiberSize);
      field.anabolicHormone += 2.5 * Math.log10(fiber.fiberSize);
    }
  }
  function liftWeights() {
    for (const fiber of random.sample(fibers(), {
      count: fibers().length,
      algorithm: "fisher-yates-descending",
    })) {
      if (random.number() < (settings.intensity / 100) ** 2) {
        const field = grid.fieldAt(fiber)!;
        field.anabolicHormone += Math.log10(fiber.fiberSize) * 55;
        field.catabolicHormone += Math.log10(fiber.fiberSize) * 44;
      }
    }
  }
  function sleep() {
    for (const field of grid.fields) {
      field.catabolicHormone -=
        0.5 * Math.log10(field.catabolicHormone) * settings.hoursOfSleep;
      field.anabolicHormone -=
        0.48 * Math.log10(field.anabolicHormone) * settings.hoursOfSleep;
    }
  }
  function grow(fiber: Fiber) {
    const field = grid.fieldAt(fiber)!;
    fiber.fiberSize -= 0.2 * Math.log10(field.catabolicHormone);
    fiber.fiberSize +=
      0.2 *
      Math.min(
        Math.log10(field.anabolicHormone),
        1.05 * Math.log10(field.catabolicHormone),
      );
  }
  function developMuscle() {
    for (const fiber of fibers()) {
      grow(fiber);
      regulateMuscleFibers(fiber);
    }
  }
  function record() {
    history.push({
      tick: world.tick.value,
      muscleMass: stats.describe(fibers().map((fiber) => fiber.fiberSize)).sum,
      anabolic: stats.describe(
        grid.fields.map((field) => field.anabolicHormone),
      ).mean!,
      catabolic: stats.describe(
        grid.fields.map((field) => field.catabolicHormone),
      ).mean!,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function go() {
    performDailyActivity();
    if (settings.lift && world.tick.value % settings.daysBetweenWorkouts === 0)
      liftWeights();
    sleep();
    regulateHormones();
    developMuscle();
  }
  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      run(world, go);
      record();
    }
  }
  function setParameters(
    update: Partial<Omit<MuscleParameters, "seed" | "slowTwitchFibers">>,
  ) {
    if (
      Object.keys(update).some(
        (key) =>
          ![
            "daysBetweenWorkouts",
            "hoursOfSleep",
            "intensity",
            "lift",
          ].includes(key),
      )
    )
      throw new TypeError("Only live parameters may change.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 17,
      height: 17,
      parameters: { ...settings },
      muscleMass: stats.describe(fibers().map((fiber) => fiber.fiberSize)).sum,
      fibers: fibers().map((fiber) => ({
        id: fiber.id,
        x: fiber.x,
        y: fiber.y,
        fiberSize: fiber.fiberSize,
        maxSize: fiber.maxSize,
        size: Math.max(0.2, Math.min(1, fiber.fiberSize / 20)),
        color: "#b22b2b",
      })),
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        anabolicHormone: field.anabolicHormone,
        catabolicHormone: field.catabolicHormone,
        color: `rgb(${Math.round((field.catabolicHormone / 250) * 255)} ${Math.round((field.anabolicHormone / 200) * 255)} 0)`,
      })),
      history: history.map((point) => ({ ...point })),
    };
  }
  regulateHormones();
  newMuscleFibers();
  record();
  return {
    advance,
    read,
    setParameters,
    newMuscleFibers,
    regulateHormones,
    regulateMuscleFibers,
    performDailyActivity,
    liftWeights,
    sleep,
    grow,
    developMuscle,
    go,
  };
}
export const model = {
  title: "Muscle Development",
  description: "Lifting, sleep and hormone responses build or shrink modeled muscle fibers over time.",
  inputs,
  create,
} satisfies Definition<MuscleParameters, ReturnType<typeof create>>;
