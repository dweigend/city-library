/** Original teaching example. Invented hourly loads; no empirical demand forecast. */
import { World, run, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface EnergyParameters {
  householdCount: number;
  shiftedShare: number;
}
export const inputs: Inputs<EnergyParameters> = {
  householdCount: { kind: "number", default: 12, min: 1, max: 100, integer: true },
  shiftedShare: { kind: "number", default: 0.5, min: 0, max: 1, step: 0.1 },
};
interface DemandState {
  demandKw: number;
  energyKwh: number;
}
export const demandMeasurement = measurements.define((state: DemandState) => ({
  demandKw: state.demandKw,
  energyKwh: state.energyKwh,
}));
export function create(options: Partial<EnergyParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const world = World.create();
  const baseHouseholdKw = 0.3;
  const applianceHouseholdKw = 0.9;
  const loads = { demandKw: settings.householdCount * baseHouseholdKw, energyKwh: 0 };
  const history = storage.history({ capacity: 120 });
  function record() {
    history.add({ tick: world.tick.value, values: demandMeasurement.read(loads) });
  }
  record();
  function step() {
    const hour = world.tick.value % 24;
    const evening = hour >= 18 && hour < 21 ? 1 - settings.shiftedShare : 0;
    const midday = hour >= 12 && hour < 15 ? settings.shiftedShare : 0;
    loads.demandKw = settings.householdCount * (baseHouseholdKw + applianceHouseholdKw * (evening + midday));
    // Each successful interval represents one hour: kW × hour = kWh.
    loads.energyKwh += loads.demandKw;
  }
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, step);
        record();
      }
    },
    setShiftedShare(value: number) {
      settings = parseParameters(inputs, { ...settings, shiftedShare: value });
    },
    exportMeasurements() {
      return history.samples;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        hour: world.tick.value % 24,
        parameters: settings,
        ...demandMeasurement.read(loads),
        householdDemandKw: loads.demandKw / settings.householdCount,
        householdBaseKw: baseHouseholdKw,
        householdPeakKw: baseHouseholdKw + applianceHouseholdKw,
        // Demand describes the completed interval, before run increments the tick.
        demandHour: world.tick.value === 0 ? 0 : (world.tick.value - 1) % 24,
        history: history.samples,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Household Energy Demand", description: "Households move a share of appliance use to other hours, changing hourly electricity demand. Synthetic loads.",
  inputs,
  create,
} satisfies Definition<EnergyParameters, ReturnType<typeof create>>;
