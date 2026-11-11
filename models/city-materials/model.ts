/** Original illustrative kg/day material balance with a waste pulse; recovered mass leaves the waste boundary. */
import { World, run, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export interface MaterialParameters {
  wasteGeneration: number;
  collectionCapacity: number;
  reuseFraction: number;
  recyclingFraction: number;
  initialUncollected: number;
  pulseExtraKg: number;
  pulseStartDay: number;
  pulseDays: number;
}

type PolicyKey = "wasteGeneration" | "collectionCapacity" | "reuseFraction" | "recyclingFraction";
export type MaterialPolicy = Pick<MaterialParameters, PolicyKey>;

export interface MaterialFlows {
  readonly generated: number;
  readonly collected: number;
  readonly reused: number;
  readonly recycled: number;
  readonly disposed: number;
}

export const inputs: Inputs<MaterialParameters> = {
  wasteGeneration: { kind: "number", default: 100, min: 0, max: 1_000_000 },
  collectionCapacity: { kind: "number", default: 120, min: 0, max: 1_000_000 },
  reuseFraction: { kind: "number", default: 0.1, min: 0, max: 1 },
  recyclingFraction: { kind: "number", default: 0.4, min: 0, max: 1 },
  initialUncollected: { kind: "number", default: 0, min: 0, max: 1_000_000 },
  pulseExtraKg: { kind: "number", default: 150, min: 0, max: 1_000_000 },
  pulseStartDay: { kind: "number", default: 10, min: 0, max: 3650, integer: true },
  pulseDays: { kind: "number", default: 5, min: 0, max: 3650, integer: true },
};
const policyKeys: readonly PolicyKey[] = ["wasteGeneration", "collectionCapacity", "reuseFraction", "recyclingFraction"];

export function create(options: Partial<MaterialParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  const world = World.create();
  const history = storage.history({ capacity: 366 });
  let uncollected = parameters.initialUncollected;
  let flows: MaterialFlows = { generated: 0, collected: 0, reused: 0, recycled: 0, disposed: 0 };
  const totals = { generated: 0, reused: 0, recycled: 0, disposed: 0 };
  let peakBacklog = uncollected;
  let peakBacklogDay = 0;
  let clearedDay: number | null = null;

  function isPulseDay(dayIndex: number) {
    return dayIndex >= parameters.pulseStartDay && dayIndex < parameters.pulseStartDay + parameters.pulseDays;
  }

  function balanceError() {
    return parameters.initialUncollected + totals.generated
      - (uncollected + totals.reused + totals.recycled + totals.disposed);
  }

  function processDay() {
    const dayIndex = world.tick.value;
    const generated = parameters.wasteGeneration + (isPulseDay(dayIndex) ? parameters.pulseExtraKg : 0);
    const available = uncollected + generated;
    const collected = Math.min(available, parameters.collectionCapacity);
    const reused = collected * parameters.reuseFraction;
    const afterReuse = collected - reused;
    const recycled = afterReuse * parameters.recyclingFraction;
    const disposed = afterReuse - recycled;
    uncollected = available - collected;
    flows = { generated, collected, reused, recycled, disposed };
    totals.generated += generated;
    totals.reused += reused;
    totals.recycled += recycled;
    totals.disposed += disposed;
    const day = dayIndex + 1;
    if (uncollected > peakBacklog) {
      peakBacklog = uncollected;
      peakBacklogDay = day;
    }
    const pulseEnded = dayIndex >= parameters.pulseStartDay + parameters.pulseDays - 1;
    if (clearedDay === null && pulseEnded && uncollected === 0) clearedDay = day;
  }

  function record() {
    history.add({ tick: world.tick.value, values: {
      uncollected, ...flows, balanceError: balanceError(),
    } });
  }

  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let day = 0; day < stepCount; day++) {
        run(world, processDay);
        record();
      }
    },
    setPolicy(changes: Partial<MaterialPolicy>) {
      parameters = updateParameters(inputs, parameters, changes, policyKeys);
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...parameters }),
        uncollected,
        flows: Object.freeze({ ...flows }),
        totals: Object.freeze({ ...totals }),
        peakBacklog,
        peakBacklogDay,
        clearedDay,
        isPulseTomorrow: isPulseDay(world.tick.value),
        balanceError: balanceError(),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Urban Material Cycles",
  description: "A festival week doubles the waste: collection capacity, reuse, recycling and disposal, with uncollected waste as a visible stock and an explicit mass balance.",
  inputs,
  create,
} satisfies Definition<MaterialParameters, ReturnType<typeof create>>;
