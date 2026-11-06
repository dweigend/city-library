/** Adapted from Wilensky's Urban Suite - Structure from Randomness 1 (2007).
 * Copyright 2007 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md/source.nlogox.
 * Canonical Fields own activity, staged activity and source-time numeric color.
 * Mulberry choices and omitted order-independent ask shuffles are target RNG
 * adaptations; a matching seed does not reproduce NetLogo trajectories.
 */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface StructureParameters { seed: number; keepAddingRandomness: boolean }
export const inputs: Inputs<StructureParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  keepAddingRandomness: { kind: "boolean", default: false },
};
interface StructureSample { readonly tick: number; readonly totalActivity: number; readonly maxAbsoluteActivity: number }

export function create(options: Partial<StructureParameters> = {}) {
  let settings = parameters(inputs, options);
  const width = 130, height = 130;
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ x: width, y: height, boundary: "wrap" }, { random });
  const grid = Grid.add({ x: width, y: height, boundary: "wrap" }, { state: { activity: 0, newActivity: 0, colorNumber: 0 } });
  world.add(grid);
  const fields = grid.fields;
  // Immutable canonical-neighbor projections; the Grid remains the topology owner.
  const faces = fields.map(field => grid.neighbors(field, { neighborhood: "faces" }));
  const history: Readonly<StructureSample>[] = [];

  function measureActivity() {
    let totalActivity = 0, maxAbsoluteActivity = 0;
    for (const field of fields) {
      totalActivity += field.activity;
      maxAbsoluteActivity = Math.max(maxAbsoluteActivity, Math.abs(field.activity));
    }
    return { totalActivity, maxAbsoluteActivity };
  }
  function recolorPatches() {
    const scale = measureActivity().maxAbsoluteActivity;
    // Native recolor fails after activity commit. Retain old colors and tick.
    if (scale === 0) throw new RangeError("Division by zero while recoloring an all-zero activity field.");
    for (const field of fields) field.colorNumber = 5 + 4.9 * field.activity / scale;
  }
  function recordCompletedState() {
    const sample = Object.freeze({ tick: world.tick.value, ...measureActivity() });
    if (history.at(-1)?.tick === sample.tick) history[history.length - 1] = sample;
    else history.push(sample);
    if (history.length > 1001) history.splice(1, 1);
  }
  function averageAddNoiseAndCommit() {
    for (const [index, field] of fields.entries())
      field.newActivity = (field.activity + faces[index]!.reduce((sum, neighbor) => sum + neighbor.activity, 0)) / 5;
    if (settings.keepAddingRandomness)
      for (const field of fields) field.newActivity += random.sample([1, -1])[0]!;
    for (const field of fields) field.activity = field.newActivity;
    recolorPatches();
  }

  for (const field of fields) field.activity = random.sample([-1, 1])[0]!;
  recolorPatches();
  recordCompletedState();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) { run(world, averageAddNoiseAndCommit); recordCompletedState(); }
    },
    setRules(rules: Partial<Pick<StructureParameters, "keepAddingRandomness">>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => key !== "keepAddingRandomness" || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only the live randomness rule as data.");
      settings = parameters(inputs, { ...settings, ...rules });
      recordCompletedState();
    },
    setActivities(values: readonly number[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length !== fields.length || Reflect.ownKeys(values).length !== values.length + 1)
        throw new RangeError("Supply one finite activity per field.");
      const copied: number[] = [];
      for (let i = 0; i < values.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = descriptor && "value" in descriptor ? descriptor.value : undefined;
        if (typeof value !== "number" || !Number.isFinite(value)) throw new RangeError("Activities must be finite data values.");
        copied.push(value);
      }
      // An explicit fixture restriction, rather than a repair of source step errors.
      if (!copied.some(value => value !== 0)) throw new RangeError("An activity fixture must contain a nonzero value.");
      for (const [index, field] of fields.entries()) field.activity = copied[index]!;
      recolorPatches();
      recordCompletedState();
    },
    read() {
      return Object.freeze({
        tick: world.tick.value, width, height, parameters: settings, ...measureActivity(),
        cells: Object.freeze(fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y, activity: field.activity, colorNumber: field.colorNumber }))),
        activityDistribution: Object.freeze(fields.map(field => field.activity).sort((a, b) => b - a)),
        history: Object.freeze([...history]), randomState: random.state, done: false as const,
      });
    },
  };
}
export const model = {
  title: "Urban Suite - Structure from Randomness 1",
  description: "Staged self-and-four-face averaging with optional signed noise and relative grayscale. Adapted from Wilensky (2007), CC BY-NC-SA3.0.",
  inputs, create,
} satisfies Definition<StructureParameters, ReturnType<typeof create>>;
