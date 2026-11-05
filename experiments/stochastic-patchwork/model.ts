/** NetLogo Stochastic Patchwork, Abrahamson and Wilensky (2004), CC BY-NC-SA 3.0. */
import { Random, World, run } from "city-library";
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
  const random = Random.add({ seed: settings.seed }),
    world = World.add({ random });
  const half = (settings.blockSide - 1) / 2;
  const cells = Array.from({ length: 441 }, (_, i) => {
    const x = (i % 21) - 10,
      y = Math.floor(i / 21) - 10;
    return {
      id: `patch-${i}`,
      x,
      y,
      inBlock: Math.abs(x) <= half && Math.abs(y) <= half,
      target: false,
      drawn: false,
    };
  });
  const block = cells.filter((c) => c.inBlock),
    samples: number[] = [],
    histogram = new Map<number, number>();
  function go() {
    for (const p of random.sample(block, {
      count: block.length,
      compatibility: "legacy-shuffle",
    })) {
      p.target = random.number() * 100 < settings.targetPercent;
      p.drawn = true;
    }
    const percent = (100 * block.filter((p) => p.target).length) / block.length;
    samples.unshift(percent);
    histogram.set(percent, (histogram.get(percent) ?? 0) + 1);
  }
  return {
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
        targetCount: block.filter((p) => p.target).length,
        cells: Object.freeze(cells.map((p) => Object.freeze({ ...p }))),
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
