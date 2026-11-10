/** Adapted from Wilensky (2025), CC BY-NC-SA 3.0; exact source/notices adjacent. */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export type Neighborhood = "Moore" | "von Neumann";
export const presets = {
  "133": [1, 3, 3, "Moore"],
  "3-color bootstrap": [2, 11, 3, "Moore"],
  amoeba: [3, 10, 2, "von Neumann"],
  "black and white": [3, 23, 2, "von Neumann"],
  "diamond spirals": [1, 1, 14, "von Neumann"],
  cubism: [2, 5, 3, "von Neumann"],
  "cyclic spirals": [3, 5, 8, "Moore"],
  "fossil debris": [2, 9, 4, "Moore"],
  macaroni: [2, 4, 5, "Moore"],
  multistrands: [5, 15, 6, "Moore"],
  "percolation mix": [5, 10, 8, "Moore"],
  "weak spirals": [4, 9, 7, "Moore"],
  "Greenberg–Hastings": [3, 5, 8, "Moore"],
  imperfect: [1, 2, 4, "Moore"],
  "lava lamp": [2, 10, 3, "Moore"],
  maps: [2, 3, 5, "von Neumann"],
  perfect: [1, 3, 4, "Moore"],
  "squarish spirals": [2, 2, 6, "von Neumann"],
  stripes: [3, 4, 5, "von Neumann"],
  "turbulent phase": [2, 5, 8, "Moore"],
} as const;
export type Preset = "none" | "custom" | keyof typeof presets;
export interface CyclicParameters {
  width: number;
  height: number;
  seed: number;
  preset: Preset;
  neighborhood: Neighborhood;
  radius: number;
  stateCount: number;
  threshold: number;
}
export const inputs: Inputs<CyclicParameters> = {
  width: { kind: "number", default: 201, min: 3, max: 501, integer: true },
  height: { kind: "number", default: 201, min: 3, max: 501, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  preset: {
    kind: "choice",
    default: "none",
    options: [
      "none",
      "custom",
      ...(Object.keys(presets) as (keyof typeof presets)[]),
    ],
  },
  neighborhood: {
    kind: "choice",
    default: "Moore",
    options: ["Moore", "von Neumann"],
  },
  radius: { kind: "number", default: 3, min: 1, max: 6, integer: true },
  stateCount: { kind: "number", default: 3, min: 2, max: 14, integer: true },
  threshold: { kind: "number", default: 3, min: 1, max: 168, integer: true },
};
export function cyclicOffsets(radius: number, neighborhood: Neighborhood) {
  if (
    !Number.isSafeInteger(radius) ||
    radius < 1 ||
    radius > 6 ||
    !["Moore", "von Neumann"].includes(neighborhood)
  )
    throw new RangeError("Invalid cyclic neighborhood.");
  const offsets: { x: number; y: number }[] = [];
  for (let y = -radius; y <= radius; y++)
    for (let x = -radius; x <= radius; x++)
      if (
        (x !== 0 || y !== 0) &&
        (neighborhood === "Moore" || Math.abs(x) + Math.abs(y) <= radius)
      )
        offsets.push(Object.freeze({ x, y }));
  return Object.freeze(offsets);
}
export function cyclicTransition(
  state: number,
  successors: number,
  stateCount: number,
  threshold: number,
) {
  if (
    !Number.isSafeInteger(state) ||
    state < 0 ||
    state >= stateCount ||
    !Number.isSafeInteger(successors) ||
    successors < 0 ||
    !Number.isSafeInteger(stateCount) ||
    stateCount < 2 ||
    !Number.isSafeInteger(threshold) ||
    threshold < 1
  )
    throw new RangeError("Invalid cyclic transition.");
  return successors >= threshold ? (state + 1) % stateCount : state;
}
export function create(options: Partial<CyclicParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd centered dimensions.");
  if (settings.preset !== "none" && settings.preset !== "custom") {
    const [radius, threshold, stateCount, neighborhood] =
      presets[settings.preset];
    settings = parameters(inputs, {
      ...settings,
      radius,
      threshold,
      stateCount,
      neighborhood,
    });
  }
  const { width, height } = settings,
    random = Random.create({ seed: settings.seed }),
    space = { x: width, y: height, boundary: "wrap" as const };
  const world = World.create(space, { random }),
    grid = Grid.create(space, { state: { state: 0 } });
  world.add(grid);
  const colorList = Object.freeze(
    random.sample(
      // Actual NetLogo Web `show base-colors`, verified in original Chromium.
      [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135],
      { count: settings.stateCount, order: "source" },
    ),
  );
  const offsets = cyclicOffsets(settings.radius, settings.neighborhood);
  const neighborhoods = grid.fields.map((f) => [
    ...new Set(
      offsets.map((p) => grid.fieldAt({ x: f.x + p.x, y: f.y + p.y })!),
    ),
  ]);
  for (const f of grid.fields)
    f.state = Math.floor(random.number() * settings.stateCount);
  function go() {
    const next = grid.fields.map((f, i) =>
      cyclicTransition(
        f.state,
        neighborhoods[i]!.filter(
          (n) => n.state === (f.state + 1) % settings.stateCount,
        ).length,
        settings.stateCount,
        settings.threshold,
      ),
    );
    grid.fields.forEach((f, i) => {
      f.state = next[i]!;
    });
  }
  return {
    advance(count = 1) {
      stepCount(count);
      run(world, go, count);
    },
    setThreshold(threshold: number) {
      settings = parameters(inputs, { ...settings, threshold });
    },
    setCells(values: readonly number[]) {
      if (
        !Array.isArray(values) ||
        values.length !== grid.fields.length ||
        Reflect.ownKeys(values).length !== values.length + 1 ||
        Array.from({ length: values.length }, (_, i) =>
          Object.getOwnPropertyDescriptor(values, String(i)),
        ).some(
          (d) =>
            !d ||
            !("value" in d) ||
            !Number.isSafeInteger(d.value) ||
            d.value < 0 ||
            d.value >= settings.stateCount,
        )
      )
        throw new RangeError("Provide one valid cycle state per field.");
      grid.fields.forEach((f, i) => {
        f.state = values[i]!;
      });
    },
    read() {
      return Object.freeze({
        width,
        height,
        tick: world.tick.value,
        done: false,
        parameters: settings,
        randomState: random.state,
        colorList,
        neighborCount: offsets.length,
        warning:
          settings.threshold > offsets.length
            ? "Threshold exceeds the number of neighbors."
            : "",
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              state: f.state,
              colorNumber: colorList[f.state]!,
            }),
          ),
        ),
      });
    },
  };
}
export const model = {
  title: "Cyclic CA",
  description:
    "Successor-state competition on cached periodic neighborhoods. Wilensky (2025), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<CyclicParameters, ReturnType<typeof create>>;
