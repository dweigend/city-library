/** Adapted from Wilensky's Urban Suite - Structure from Randomness 2 (2007).
 * Copyright 2007 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md/source.nlogox.
 * Canonical Fields own potential, staged potential and persistent whitening.
 * Mulberry noise and omitted order-independent ask shuffles intentionally have
 * a different continuation from NetLogo; same-seed trajectories are not claimed.
 */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface StructureParameters { seed: number; threshold: number }
export const inputs: Inputs<StructureParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  threshold: { kind: "number", default: 4.5, min: 0, max: 10, step: 0.1 },
};
interface StructureSample {
  readonly tick: number;
  readonly totalPotential: number;
  readonly meanPotential: number;
  readonly meanPotentialTimesTen: number;
  readonly maxPotential: number;
  readonly counts: Readonly<{ currentAboveThreshold: number; activated: number }>;
}

export function create(options: Partial<StructureParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const width = 130, height = 130;
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: width, y: height, boundary: "wrap" }, { random });
  const grid = Grid.create({ x: width, y: height, boundary: "wrap" }, { state: { potential: 0, newPotential: 0, activated: false } });
  world.add(grid);
  const fields = grid.fields;
  const faces = fields.map(field => grid.neighbors(field, { neighborhood: "faces" }));
  const history: Readonly<StructureSample>[] = [];

  function measurePotential() {
    let totalPotential = 0, maxPotential = -Infinity, currentAboveThreshold = 0, activated = 0;
    for (const field of fields) {
      totalPotential += field.potential;
      maxPotential = Math.max(maxPotential, field.potential);
      currentAboveThreshold += Number(field.potential > settings.threshold);
      activated += Number(field.activated);
    }
    const meanPotential = totalPotential / fields.length;
    return { totalPotential, meanPotential, meanPotentialTimesTen: meanPotential * 10, maxPotential,
      counts: Object.freeze({ currentAboveThreshold, activated }) };
  }
  function recordCompletedState() {
    const sample = Object.freeze({ tick: world.tick.value, ...measurePotential() });
    if (history.at(-1)?.tick === sample.tick) history[history.length - 1] = sample;
    else history.push(sample);
    if (history.length > 1001) history.splice(1, 1);
  }
  function averageAddNoiseAndActivate() {
    for (const [index, field] of fields.entries())
      field.newPotential = (field.potential + faces[index]!.reduce((sum, neighbor) => sum + neighbor.potential, 0)) / 5 + random.sample([1, -1])[0]!;
    for (const field of fields) {
      field.potential = field.newPotential;
      if (field.potential > settings.threshold) field.activated = true;
    }
  }
  function copyFixture<T extends number | boolean>(values: readonly T[], expected: "number" | "boolean"): T[] {
    if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length !== fields.length || Reflect.ownKeys(values).length !== values.length + 1)
      throw new RangeError("Supply one data value per field.");
    const copied: T[] = [];
    for (let i = 0; i < values.length; i++) {
      const descriptor = Object.getOwnPropertyDescriptor(values, String(i));
      const value: unknown = descriptor && "value" in descriptor ? descriptor.value : undefined;
      if (typeof value !== expected || (typeof value === "number" && !Number.isFinite(value))) throw new TypeError(`Supply finite ${expected} field data.`);
      copied.push(value as T);
    }
    return copied;
  }

  // Source setup leaves every field black, independent of the initial threshold.
  for (const field of fields) field.potential = random.sample([1, -1])[0]!;
  recordCompletedState();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) { run(world, averageAddNoiseAndActivate); recordCompletedState(); }
    },
    setRules(rules: Partial<Pick<StructureParameters, "threshold">>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => key !== "threshold" || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only the live threshold rule as data.");
      settings = parseParameters(inputs, { ...settings, ...rules });
      recordCompletedState();
    },
    setPotentials(values: readonly number[]) {
      const copied = copyFixture(values, "number");
      for (const [index, field] of fields.entries()) field.potential = copied[index]!;
      recordCompletedState();
    },
    setActivations(values: readonly boolean[]) {
      const copied = copyFixture(values, "boolean");
      for (const [index, field] of fields.entries()) field.activated = copied[index]!;
      recordCompletedState();
    },
    read() {
      return Object.freeze({
        tick: world.tick.value, width, height, parameters: settings, ...measurePotential(),
        cells: Object.freeze(fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y,
          potential: field.potential, activated: field.activated, colorNumber: field.activated ? 9.9 : 0 }))),
        history: Object.freeze([...history]), randomState: random.state, done: false as const,
      });
    },
  };
}
export const model = {
  title: "Urban Suite - Structure from Randomness 2",
  description: "Noisy staged potential averaging with persistent threshold activation. Adapted from Wilensky (2007), CC BY-NC-SA3.0.",
  inputs, create,
} satisfies Definition<StructureParameters, ReturnType<typeof create>>;
