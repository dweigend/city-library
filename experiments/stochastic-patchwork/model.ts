/** NetLogo Stochastic Patchwork, Abrahamson and Wilensky (2004), CC BY-NC-SA 3.0. */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  blockSide: number;
  targetPercent: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  blockSide: {
    kind: "number",
    default: 3,
    min: 1,
    max: 17,
    step: 2,
    integer: true,
  },
  targetPercent: {
    kind: "number",
    default: 50,
    min: 0,
    max: 100,
    integer: true,
  },
};
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ x: 21, y: 21, boundary: "wrap" }, { random });
  const grid = Grid.add(
    { x: 21, y: 21, boundary: "wrap" },
    { state: { displayId: "", inBlock: false, target: false, drawn: false } },
  );
  world.add(grid);
  // Stable references to canonical Fields, never a copied spatial state.
  const fields = grid.fields;
  const half = (settings.blockSide - 1) / 2;
  fields.forEach((field, i) => {
    field.displayId = `patch-${i}`;
    field.inBlock = Math.abs(field.x) <= half && Math.abs(field.y) <= half;
  });
  const block = fields.filter((field) => field.inBlock);
  const samples: number[] = [],
    histogram = new Map<number, number>();
  function go() {
    for (const field of random.sample(block, {
      count: block.length,
      compatibility: "legacy-shuffle",
    })) {
      field.target = random.number() * 100 < settings.targetPercent;
      field.drawn = true;
    }
    const percent =
      (100 * block.filter((field) => field.target).length) / block.length;
    samples.unshift(percent);
    histogram.set(percent, (histogram.get(percent) ?? 0) + 1);
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
      for (let i = 0; i < count; i++) run(world, go);
    },
    setRules(change: Partial<Pick<Parameters, "targetPercent">>) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 21,
        height: 21,
        parameters: settings,
        targetCount: block.filter((field) => field.target).length,
        cells: Object.freeze(
          fields.map((field) =>
            Object.freeze({
              id: field.displayId,
              x: field.x,
              y: field.y,
              inBlock: field.inBlock,
              target: field.target,
              drawn: field.drawn,
            }),
          ),
        ),
        samples: Object.freeze([...samples]),
        histogram: Object.freeze(
          [...histogram]
            .sort((a, b) => a[0] - b[0])
            .map(([percent, count]) => Object.freeze({ percent, count })),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Stochastic Patchwork",
  description:
    "Independent colored patches and the distribution of sample means. Abrahamson and Wilensky (2004), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
