/** NetLogo El Farol (Rand & Wilensky, 2007), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface ElFarolParameters {
  memorySize: number;
  strategyCount: number;
  overcrowdingThreshold: number;
  seed: number;
}
export const inputs: Inputs<ElFarolParameters> = {
  memorySize: { kind: "number", default: 5, min: 1, max: 10, integer: true },
  strategyCount: {
    kind: "number",
    default: 10,
    min: 1,
    max: 20,
    integer: true,
  },
  overcrowdingThreshold: {
    kind: "number",
    default: 60,
    min: 0,
    max: 100,
    integer: true,
  },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
};
export function predictAttendance(
  strategy: readonly number[],
  subhistory: readonly number[],
): number {
  if (
    strategy.length !== subhistory.length + 1 ||
    ![...strategy, ...subhistory].every(Number.isFinite)
  )
    throw new RangeError(
      "A strategy needs one intercept plus one weight per historical week.",
    );
  return (
    100 * strategy[0]! +
    subhistory.reduce(
      (sum, attendance, i) => sum + attendance * strategy[i + 1]!,
      0,
    )
  );
}
/** Native bounded initial score and last-wins ties. If all scores exceed the bound, retain the previous strategy. */
export function bestStrategy(
  strategies: readonly (readonly number[])[],
  history: readonly number[],
  memorySize: number,
  previous = 0,
) {
  if (
    !Number.isInteger(memorySize) ||
    memorySize < 1 ||
    history.length < 2 * memorySize ||
    !strategies.length ||
    previous < 0 ||
    previous >= strategies.length
  )
    throw new RangeError("Invalid strategy history.");
  let scoreBound = memorySize * 100 + 1,
    selected = previous,
    prediction = 0;
  const scores: number[] = [];
  strategies.forEach((strategy, index) => {
    let score = 0;
    for (let week = 1; week <= memorySize; week++) {
      prediction = predictAttendance(
        strategy,
        history.slice(week, week + memorySize),
      );
      score += Math.abs(history[week - 1]! - prediction);
    }
    scores.push(score);
    if (score <= scoreBound) {
      scoreBound = score;
      selected = index;
    }
  });
  return Object.freeze({ selected, prediction, scores: Object.freeze(scores) });
}
export interface Patron {
  strategies: number[][];
  bestStrategy: number;
  attend: boolean;
  prediction: number;
  scores: readonly number[];
}
export function create(options: Partial<ElFarolParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 35, y: 35, boundary: "wrap" as const };
  const world = World.create(space, { random }),
    grid = Grid.create(space);
  world.add(grid);
  type Person = ReturnType<typeof Agent.create<Patron>>;
  const people = () => world.agents as readonly Person[];
  const homes = grid.fields.filter((p) => p.y < 0 || (p.x < 0 && p.y >= 0));
  const bar = grid.fields.filter((p) => p.x > 0 && p.y > 0);
  let attendance = 0,
    crowded = false;
  const history: number[] = [],
    plotHistory: Readonly<{ tick: number; attendance: number }>[] = [];
  function person(id: string) {
    const p = people().find((p) => p.id === id);
    if (!p) throw new RangeError("Unknown patron.");
    return p;
  }
  function randomStrategy() {
    return Array.from(
      { length: settings.memorySize + 1 },
      () => 1 - random.number({ max: 2 }),
    );
  }
  function updateStrategies(id: string) {
    const p = person(id),
      result = bestStrategy(
        p.strategies,
        history,
        settings.memorySize,
        p.bestStrategy,
      );
    p.bestStrategy = result.selected;
    p.prediction = result.prediction;
    p.scores = result.scores;
  }
  function moveToEmptyOneOf(id: string, destination: "home" | "bar") {
    const p = person(id),
      locations = destination === "home" ? homes : bar;
    let target = random.sample(locations)[0]!;
    p.move({ to: target });
    while (grid.agentsAt(target).some((q) => q !== p)) {
      target = random.sample(locations)[0]!;
      p.move({ to: target });
    }
  }
  function record() {
    plotHistory.push(Object.freeze({ tick: world.tick.value, attendance }));
    if (plotHistory.length > 1001) plotHistory.splice(1, 1);
  }
  function setup() {
    for (const p of [...people()]) p.delete();
    history.length = 0;
    plotHistory.length = 0;
    crowded = false;
    for (let i = 0; i < settings.memorySize * 2; i++)
      history.push(random.number({ max: 100, integer: true }));
    attendance = history[0]!;
    for (let i = 0; i < 100; i++) {
      const p = Agent.create<Patron>({
        strategies: [],
        bestStrategy: 0,
        attend: false,
        prediction: 0,
        scores: [],
      });
      world.add(p);
      moveToEmptyOneOf(p.id, "home");
      p.strategies = Array.from(
        { length: settings.strategyCount },
        randomStrategy,
      );
      updateStrategies(p.id);
    }
    world.tick.reset();
    record();
  }
  function go() {
    crowded = false;
    for (const p of random.sample(people(), {
      sampleCount: people().length,
      algorithm: "fisher-yates-descending",
    })) {
      p.prediction = predictAttendance(
        p.strategies[p.bestStrategy]!,
        history.slice(0, settings.memorySize),
      );
      p.attend = p.prediction <= settings.overcrowdingThreshold;
    }
    for (const p of random.sample(people(), {
      sampleCount: people().length,
      algorithm: "fisher-yates-descending",
    }))
      moveToEmptyOneOf(p.id, p.attend ? "bar" : "home");
    attendance = bar.reduce(
      (sum, field) => sum + grid.agentsAt(field).length,
      0,
    );
    crowded = attendance > settings.overcrowdingThreshold;
    history.unshift(attendance);
    history.pop();
    for (const p of random.sample(people(), {
      sampleCount: people().length,
      algorithm: "fisher-yates-descending",
    }))
      updateStrategies(p.id);
  }
  setup();
  return {
    setup,
    randomStrategy,
    updateStrategies,
    moveToEmptyOneOf,
    setRules(
      changes: Partial<Pick<ElFarolParameters, "overcrowdingThreshold">>,
    ) {
      settings = parseParameters(inputs, { ...settings, ...changes });
    },
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        run(world, go);
        record();
      }
    },
    read() {
      return Object.freeze({

        tick: world.tick.value,
        width: 35,
        height: 35,
        parameters: settings,
        attendance,
        crowded,
        history: Object.freeze([...history]),
        plotHistory: Object.freeze([...plotHistory]),
        people: Object.freeze(
          people().map((p) =>
            Object.freeze({
              id: p.id,
              x: p.x,
              y: p.y,
              attend: p.attend,
              prediction: p.prediction,
              bestStrategy: p.bestStrategy,
              strategies: Object.freeze(
                p.strategies.map((s) => Object.freeze([...s])),
              ),
              scores: Object.freeze([...p.scores]),
            }),
          ),
        ),
        cells: Object.freeze(
          grid.fields.map((p) =>
            Object.freeze({
              id: p.id,
              x: p.x,
              y: p.y,
              area:
                p.y < 0 || (p.x < 0 && p.y >= 0)
                  ? "home"
                  : p.x > 0 && p.y > 0
                    ? "bar"
                    : "neutral",
            }),
          ),
        ),
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "El Farol",
  description:
    "Adaptive attendance predictions · Rand & Wilensky · CC BY-NC-SA 3.0",
  inputs,
  create,
} satisfies Definition<ElFarolParameters, ReturnType<typeof create>>;
