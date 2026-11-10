/** Adapted from Wilensky's Urban Suite - Positive Feedback (2007).
 * Copyright 2007 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md/source.nlogox.
 * Public Grid composition; Mulberry setup and omitted irrelevant ask shuffles
 * do not reproduce NetLogo's random stream. Scientific steps are deterministic.
 */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface FeedbackParameters { seed: number; alpha: number; mooreNeighborhood: boolean }
export const inputs: Inputs<FeedbackParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  alpha: { kind: "number", default: 1.1, min: 0, max: 2, step: 0.01 },
  mooreNeighborhood: { kind: "boolean", default: false },
};
interface FeedbackSample { readonly tick: number; readonly totalActivity: number; readonly maxActivity: number }

export function create(options: Partial<FeedbackParameters> = {}) {
  let settings = parameters(inputs, options);
  const width = 21, height = 21;
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: width, y: height, boundary: "wrap" }, { random });
  const grid = Grid.create({ x: width, y: height, boundary: "wrap" }, { state: { activity: 0 } });
  world.add(grid);
  const fields = grid.fields;
  const history: Readonly<FeedbackSample>[] = [];
  for (const field of fields) field.activity = random.number(); // setup is NOT normalized

  function measurement() {
    return { totalActivity: fields.reduce((sum, field) => sum + field.activity, 0), maxActivity: Math.max(...fields.map(field => field.activity)) };
  }
  function record() {
    const sample = Object.freeze({ tick: world.tick.value, ...measurement() });
    if (history.at(-1)?.tick === sample.tick) history[history.length - 1] = sample;
    else history.push(sample);
    if (history.length > 1001) history.splice(1, 1);
  }
  function amplifyAndNormalize() {
    // All powers use the complete old field. Commit before source normalization.
    const staged = fields.map(field => {
      const base = settings.mooreNeighborhood
        ? (field.activity + grid.neighbors(field, { neighborhood: "moore" }).reduce((sum, neighbor) => sum + neighbor.activity, 0)) / 9
        : field.activity;
      return Math.pow(base, settings.alpha);
    });
    for (const [index, field] of fields.entries()) field.activity = staged[index]!;
    const scalingFactor = Math.max(...staged);
    if (scalingFactor === 0) throw new RangeError("Cannot normalize an all-zero activity field.");
    for (const field of fields) field.activity /= scalingFactor;
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) { run(world, amplifyAndNormalize); record(); }
    },
    setRules(rules: Partial<Pick<FeedbackParameters, "alpha" | "mooreNeighborhood">>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => typeof key !== "string" || !["alpha", "mooreNeighborhood"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only live feedback rule data.");
      settings = parameters(inputs, { ...settings, ...rules });
      record();
    },
    setActivities(values: readonly number[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length !== fields.length || Reflect.ownKeys(values).length !== values.length + 1)
        throw new RangeError("Supply one activity per field.");
      const copied: number[] = [];
      for (let i = 0; i < values.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = descriptor && "value" in descriptor ? descriptor.value : undefined;
        if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) throw new RangeError("Activities must be finite data in [0,1].");
        copied.push(value);
      }
      if (settings.alpha !== 0 && !copied.some(value => value > 0)) throw new RangeError("An all-zero activity fixture requires alpha zero.");
      for (const [index, field] of fields.entries()) field.activity = copied[index]!;
      record();
    },
    read() {
      return Object.freeze({
        tick: world.tick.value, width, height, parameters: settings, ...measurement(),
        cells: Object.freeze(fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y, activity: field.activity }))),
        activityDistribution: Object.freeze(fields.map(field => field.activity).sort((a, b) => b - a)),
        history: Object.freeze([...history]), randomState: random.state, done: false as const,
      });
    },
  };
}
export const model = {
  title: "Urban Suite - Positive Feedback",
  description: "Nonlinear local activity and global maximum normalization. Adapted from Wilensky (2007), CC BY-NC-SA3.0.",
  inputs, create,
} satisfies Definition<FeedbackParameters, ReturnType<typeof create>>;
