/** Original teaching example. Invented hourly loads; no empirical demand forecast. */
import { World, run, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface EnergyParameters { households: number; shiftedShare: number }
export const inputs: Inputs<EnergyParameters> = {
  households: { kind: "number", default: 12, min: 1, max: 100, integer: true },
  shiftedShare: { kind: "number", default: 0.5, min: 0, max: 1, step: 0.1 },
};
interface DemandState { demandKw: number; energyKwh: number }
export const demandMeasurement = measurements.define((state: DemandState) => ({
  demandKw: state.demandKw, energyKwh: state.energyKwh,
}));
export function create(options: Partial<EnergyParameters> = {}) {
  let settings = parameters(inputs, options);
  const world = World.add();
  const loads = { demandKw: settings.households * 0.3, energyKwh: 0 };
  const history = storage.history({ capacity: 120 });
  function record() { history.add({ tick: world.tick.value, values: demandMeasurement.read(loads) }); }
  record();
  function step() {
    const hour = world.tick.value % 24;
    const evening = hour >= 18 && hour < 21 ? 1 - settings.shiftedShare : 0;
    const midday = hour >= 12 && hour < 15 ? settings.shiftedShare : 0;
    loads.demandKw = settings.households * (0.3 + 0.9 * (evening + midday));
    // Each successful interval represents one hour: kW × hour = kWh.
    loads.energyKwh += loads.demandKw;
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let index = 0; index < count; index += 1) { run(world, step); record(); }
    },
    setShiftedShare(value: number) {
      settings = parameters(inputs, { ...settings, shiftedShare: value });
    },
    exportMeasurements() { return history.samples; },
    read() {
      return Object.freeze({ tick: world.tick.value, hour: world.tick.value % 24,
        parameters: settings, ...demandMeasurement.read(loads), history: history.samples, done: false });
    },
  };
}
export const model = {
  title: "Household Energy Demand", description: "Illustrative hourly appliance shifting with explicit bounded measurements; synthetic loads.",
  inputs, create,
} satisfies Definition<EnergyParameters, ReturnType<typeof create>>;
