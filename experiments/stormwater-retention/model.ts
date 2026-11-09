/** Original synthetic runoff/retention balance; no hydraulic or drainage-design claim. */
import { Grid, World, run, continuous, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface StormwaterParameters { rainMmPerHour: number; capacityM3: number }
export const inputs: Inputs<StormwaterParameters> = {
  rainMmPerHour: { kind: "number", default: 20, min: 0, max: 50, integer: true },
  capacityM3: { kind: "number", default: 3, min: 1, max: 10, integer: true },
};
export function create(options: Partial<StormwaterParameters> = {}) {
  let settings = parameters(inputs, options);
  const world = World.add();
  const catchment = Grid.add({ x: 3, y: 3, boundary: "hard" }, { state: { areaM2: 10, runoffShare: 0.5 } });
  world.add(catchment);
  const state = { storedM3: 0, inflowM3: 0, dischargedM3: 0, overflowM3: 0, capacityCrossings: 0 };
  let lastCrossingHour: number | undefined;
  const measure = measurements.define((values: typeof state) => ({ ...values }));
  const cubicMetersPerMillimeterSquareMeter = 0.001;
  const hourlyDrainageCapacityM3 = 0.2;
  const history = storage.history({ capacity: 120 });
  function record() { history.add({ tick: world.tick.value, values: measure.read(state) }); }
  function step() {
    // One millimeter over one square meter is 0.001 cubic meters.
    const inflow = catchment.fields.reduce((sum, field) => sum + field.areaM2 * field.runoffShare * settings.rainMmPerHour * cubicMetersPerMillimeterSquareMeter, 0);
    const drainageM3 = Math.min(hourlyDrainageCapacityM3, state.storedM3 + inflow);
    const raw = continuous.linear({ value: state.storedM3, rate: inflow - drainageM3, duration: 1 });
    const crossing = continuous.crossing({ from: state.storedM3, to: raw, threshold: settings.capacityM3, duration: 1, direction: "rising" });
    if (crossing) { state.capacityCrossings += 1; lastCrossingHour = world.tick.value + crossing.elapsed; }
    state.inflowM3 += inflow;
    state.dischargedM3 += drainageM3;
    state.overflowM3 += Math.max(0, raw - settings.capacityM3);
    state.storedM3 = Math.min(settings.capacityM3, raw);
  }
  record();
  return {
    advance(count = 1) { stepCount(count); for (let index = 0; index < count; index += 1) { run(world, step); record(); } },
    setRain(value: number) { settings = parameters(inputs, { ...settings, rainMmPerHour: value }); },
    read() { return Object.freeze({ tick: world.tick.value, parameters: settings, ...measure.read(state),
      lastCrossingHour: lastCrossingHour ?? "none", history: history.samples, done: false }); },
  };
}
export const model = { title: "Stormwater Retention",
  description: "Illustrative catchment mass balance and linear capacity crossings; synthetic rainfall and outflow.", inputs, create,
} satisfies Definition<StormwaterParameters, ReturnType<typeof create>>;
