/** NetLogo Binomial Rabbits, Uri Wilensky (1997), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  number: number;
  hops: number;
  xScaling: number;
  hop1: number;
  hop2: number;
  hop3: number;
  ratio1: number;
  ratio2: number;
  ratio3: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  number: { kind: "number", default: 2400, min: 1, max: 4000, integer: true },
  hops: { kind: "number", default: 20, min: 0, max: 99, integer: true },
  xScaling: { kind: "number", default: 1, min: 1, max: 10, integer: true },
  hop1: { kind: "number", default: 1, min: -5, max: 5, integer: true },
  hop2: { kind: "number", default: -1, min: -5, max: 5, integer: true },
  hop3: { kind: "number", default: 0, min: -5, max: 5, integer: true },
  ratio1: { kind: "number", default: 1, min: 0, max: 10, integer: true },
  ratio2: { kind: "number", default: 1, min: 0, max: 10, integer: true },
  ratio3: { kind: "number", default: 0, min: 0, max: 10, integer: true },
};
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create(
    { x: 45, y: 45, boundary: { x: "wrap", y: "hard" } },
    { random },
  );
  const grid = Grid.create(
    { x: 45, y: 45, boundary: { x: "wrap", y: "hard" } },
    { state: { agentQuant: 0 } },
  );
  world.add(grid);
  // Stable references to canonical Fields, never a copied spatial state.
  const fields = grid.fields;
  type Rabbit = Agent<{ displayId: string; total: number; step: number }>;
  const rabbits = () => world.agents as readonly Rabbit[];
  // source model's y=0..44 is translated to the library's centered y=-22..22.
  // Unwrapped displacement is a scientific scalar; Agent.move owns its wrapped position.
  for (let i = 0; i < settings.number; i++)
    world.add(
      Agent.create(
        { displayId: `rabbit-${i}`, total: 0, step: 0 },
        { position: { x: 0, y: -22 } },
      ),
    );
  const steps = [settings.hop1, settings.hop2, settings.hop3, 0, 0],
    ratios = [settings.ratio1, settings.ratio2, settings.ratio3, 0, 0];
  const ky = settings.number / 44 / 0.9;
  let mean = 0,
    yScale = 0;
  function setStep(rabbit: Rabbit) {
    const n = random.number() * ratios.reduce((a, b) => a + b, 0);
    let sum = ratios[0]!;
    rabbit.step = steps[0]!;
    if (n <= sum) return;
    for (let i = 1; i < 5; i++) {
      sum += ratios[i]!;
      if (n <= sum) {
        rabbit.step = steps[i]!;
        return;
      }
    }
    rabbit.step = steps[4]!;
  }
  function hopping() {
    const population = rabbits();
    for (const rabbit of random.sample(population, {
      count: population.length,
      algorithm: "fisher-yates-descending",
    })) {
      setStep(rabbit);
      rabbit.total += rabbit.step;
      rabbit.move({ to: { x: rabbit.total / settings.xScaling, y: rabbit.y } });
    }
  }
  function plotViolet() {
    mean =
      rabbits().reduce((a, rabbit) => a + rabbit.total, 0) / settings.number;
  }
  function plotYellow() {
    for (const field of fields) field.agentQuant = grid.agentsAt(field).length;
    const most = Math.max(...fields.map((field) => field.agentQuant));
    const kyDistr = most / ky / Math.trunc(0.8 * 45);
    yScale = 100 * kyDistr * ky;
  }
  function goOneHop() {
    run(world, () => {
      hopping();
      plotViolet();
      plotYellow();
    });
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
        if (settings.hops === world.tick.value) break;
        goOneHop();
      }
    },
    goOneHop,
    setRules(change: Partial<Pick<Parameters, "hops" | "xScaling">>) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 45,
        height: 45,
        parameters: settings,
        rabbits: Object.freeze(
          rabbits().map((rabbit) =>
            Object.freeze({
              id: rabbit.displayId,
              total: rabbit.total,
              x: rabbit.x,
              y: rabbit.y + 22,
              step: rabbit.step,
            }),
          ),
        ),
        mean,
        xScale: 44 * settings.xScaling,
        yScale,
        distribution: Object.freeze(
          fields
            .filter((field) => field.agentQuant > 0)
            .map((field) =>
              Object.freeze({ x: field.x, count: field.agentQuant }),
            )
            .sort((a, b) => a.x - b.x),
        ),
        done: settings.hops === world.tick.value,
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Binomial Rabbits",
  description:
    "Weighted rabbit hops and their wrapped distribution. Uri Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
