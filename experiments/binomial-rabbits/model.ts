/** NetLogo Binomial Rabbits, Uri Wilensky (1997), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Random, World, run } from "city-library";
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
  const random = Random.add({ seed: settings.seed }),
    world = World.add({ random });
  // Source captures hop/ratio sliders in setup, but reads hops/x-scaling live.
  const steps = [settings.hop1, settings.hop2, settings.hop3, 0, 0],
    ratios = [settings.ratio1, settings.ratio2, settings.ratio3, 0, 0];
  const rabbits = Array.from({ length: settings.number }, (_, i) => ({
    id: `rabbit-${i}`,
    total: 0,
    x: 0,
    y: 0,
    step: 0,
  }));
  const ky = settings.number / 44 / 0.9;
  let mean = 0,
    yScale = 0;
  const distribution = new Map<number, number>();
  function setStep(r: (typeof rabbits)[number]) {
    const n = random.number() * ratios.reduce((a, b) => a + b, 0);
    let sum = ratios[0]!;
    r.step = steps[0]!;
    if (n <= sum) return;
    for (let i = 1; i < 5; i++) {
      sum += ratios[i]!;
      if (n <= sum) {
        r.step = steps[i]!;
        return;
      }
    }
    r.step = steps[4]!;
  }
  function hopping() {
    for (const r of random.sample(rabbits, {
      count: rabbits.length,
      compatibility: "legacy-shuffle",
    })) {
      setStep(r);
      r.total += r.step;
      r.x = ((((r.total / settings.xScaling + 22.5) % 45) + 45) % 45) - 22.5;
    }
  }
  function plotViolet() {
    mean = rabbits.reduce((a, r) => a + r.total, 0) / settings.number;
  }
  function plotYellow() {
    distribution.clear();
    for (const r of rabbits) {
      const x = Math.floor(r.x + 0.5);
      distribution.set(x, (distribution.get(x) ?? 0) + 1);
    }
    const most = Math.max(...distribution.values());
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
        rabbits: Object.freeze(rabbits.map((r) => Object.freeze({ ...r }))),
        mean,
        xScale: 44 * settings.xScaling,
        yScale,
        distribution: Object.freeze(
          [...distribution]
            .sort((a, b) => a[0] - b[0])
            .map(([x, count]) => Object.freeze({ x, count })),
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
