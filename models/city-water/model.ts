/** Original synthetic daily water balance with a dry spell and a storage-triggered savings rule. */
import { World, run, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export interface WaterParameters {
  reservoirCapacityM3: number;
  initialStoredM3: number;
  inflowM3PerDay: number;
  dryInflowM3PerDay: number;
  drySpellStartDay: number;
  drySpellDays: number;
  demandM3PerDay: number;
  conservationTrigger: number;
  conservationShare: number;
  wastewaterShare: number;
  treatmentCapacityM3PerDay: number;
}
type RuleKey = "conservationTrigger" | "conservationShare";

export const inputs: Inputs<WaterParameters> = {
  reservoirCapacityM3: { kind: "number", default: 10000, min: 1, max: 1_000_000 },
  initialStoredM3: { kind: "number", default: 8000, min: 0, max: 1_000_000 },
  inflowM3PerDay: { kind: "number", default: 220, min: 0, max: 1_000_000 },
  dryInflowM3PerDay: { kind: "number", default: 40, min: 0, max: 1_000_000 },
  drySpellStartDay: { kind: "number", default: 20, min: 0, max: 3650, integer: true },
  drySpellDays: { kind: "number", default: 60, min: 0, max: 3650, integer: true },
  demandM3PerDay: { kind: "number", default: 200, min: 0, max: 1_000_000 },
  conservationTrigger: { kind: "number", default: 1, min: 0, max: 1 },
  conservationShare: { kind: "number", default: 0, min: 0, max: 0.6 },
  wastewaterShare: { kind: "number", default: 0.8, min: 0, max: 1 },
  treatmentCapacityM3PerDay: { kind: "number", default: 120, min: 0, max: 1_000_000 },
};

export function create(options: Partial<WaterParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  if (parameters.initialStoredM3 > parameters.reservoirCapacityM3) {
    throw new RangeError("Initial storage must not exceed reservoir capacity.");
  }
  const world = World.create();
  const history = storage.history({ capacity: 366 });
  const state = {
    storedM3: parameters.initialStoredM3,
    inflowM3: 0, spillM3: 0, demandM3: 0, requestM3: 0, conservedM3: 0, suppliedM3: 0, shortageM3: 0,
    consumedM3: 0, wastewaterM3: 0, treatedM3: 0, untreatedM3: 0,
    totalInflowM3: 0, totalSpillM3: 0, totalSuppliedM3: 0, totalShortageM3: 0, totalConservedM3: 0,
    totalConsumedM3: 0, totalTreatedM3: 0, totalUntreatedM3: 0,
    worstDayShortageM3: 0, worstDayCutShare: 0, conservationDayCount: 0, shortageDayCount: 0,
  };
  const measure = measurements.define((values: typeof state) => ({
    ...values,
    balanceErrorM3: parameters.initialStoredM3 + values.totalInflowM3
      - values.storedM3 - values.totalSpillM3 - values.totalConsumedM3
      - values.totalTreatedM3 - values.totalUntreatedM3,
  }));

  function isDrySpell(dayIndex: number) {
    return dayIndex >= parameters.drySpellStartDay && dayIndex < parameters.drySpellStartDay + parameters.drySpellDays;
  }

  /** A saving day requests a real cut: storage is below the trigger and the cut share is positive. */
  function isSaving() {
    return parameters.conservationShare > 0
      && state.storedM3 / parameters.reservoirCapacityM3 < parameters.conservationTrigger;
  }

  function record() {
    history.add({ tick: world.tick.value, values: measure.read(state) });
  }

  function step() {
    const saving = isSaving();
    state.inflowM3 = isDrySpell(world.tick.value) ? parameters.dryInflowM3PerDay : parameters.inflowM3PerDay;
    state.demandM3 = parameters.demandM3PerDay;
    state.requestM3 = state.demandM3 * (saving ? 1 - parameters.conservationShare : 1);
    state.conservedM3 = state.demandM3 - state.requestM3;
    // Spill happens before withdrawal; treatment never replenishes supply.
    const availableM3 = state.storedM3 + state.inflowM3;
    state.spillM3 = Math.max(0, availableM3 - parameters.reservoirCapacityM3);
    const retainedM3 = Math.min(parameters.reservoirCapacityM3, availableM3);
    state.suppliedM3 = Math.min(state.requestM3, retainedM3);
    state.shortageM3 = state.requestM3 - state.suppliedM3;
    state.storedM3 = retainedM3 - state.suppliedM3;
    state.wastewaterM3 = state.suppliedM3 * parameters.wastewaterShare;
    state.consumedM3 = state.suppliedM3 - state.wastewaterM3;
    state.treatedM3 = Math.min(state.wastewaterM3, parameters.treatmentCapacityM3PerDay);
    state.untreatedM3 = state.wastewaterM3 - state.treatedM3;
    state.totalInflowM3 += state.inflowM3;
    state.totalSpillM3 += state.spillM3;
    state.totalSuppliedM3 += state.suppliedM3;
    state.totalShortageM3 += state.shortageM3;
    state.totalConservedM3 += state.conservedM3;
    state.totalConsumedM3 += state.consumedM3;
    state.totalTreatedM3 += state.treatedM3;
    state.totalUntreatedM3 += state.untreatedM3;
    state.worstDayShortageM3 = Math.max(state.worstDayShortageM3, state.shortageM3);
    if (state.demandM3 > 0) {
      state.worstDayCutShare = Math.max(state.worstDayCutShare, (state.demandM3 - state.suppliedM3) / state.demandM3);
    }
    if (saving) state.conservationDayCount += 1;
    if (state.shortageM3 > 0) state.shortageDayCount += 1;
  }

  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, step);
        record();
      }
    },
    setConservationRule(changes: Partial<Pick<WaterParameters, RuleKey>>) {
      parameters = updateParameters(inputs, parameters, changes, ["conservationTrigger", "conservationShare"]);
    },
    setConservationShare(value: number) {
      parameters = updateParameters(inputs, parameters, { conservationShare: value }, ["conservationShare"]);
    },
    setTreatmentCapacity(value: number) {
      parameters = updateParameters(inputs, parameters, { treatmentCapacityM3PerDay: value }, ["treatmentCapacityM3PerDay"]);
    },
    setInflow(value: number) {
      parameters = updateParameters(inputs, parameters, { inflowM3PerDay: value }, ["inflowM3PerDay"]);
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...parameters }),
        ...measure.read(state),
        storageFraction: state.storedM3 / parameters.reservoirCapacityM3,
        isSavingTomorrow: isSaving(),
        isDrySpellTomorrow: isDrySpell(world.tick.value),
        wasDrySpellDay: world.tick.value > 0 && isDrySpell(world.tick.value - 1),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Water and Wastewater",
  description: "A reservoir through a dry spell: compare early modest savings with late rationing. Wastewater treatment is a separate limit. Synthetic daily volume balance.",
  inputs,
  create,
} satisfies Definition<WaterParameters, ReturnType<typeof create>>;
