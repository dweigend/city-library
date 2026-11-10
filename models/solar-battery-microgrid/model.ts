/** Original hourly energy-balance teaching model. Lossless storage, synthetic solar cycle. */
import { Random, World, run, continuous, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface BatteryParameters { seed: number; solarKw: number; demandKw: number }
export const inputs: Inputs<BatteryParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  solarKw: { kind: "number", default: 4, min: 0, max: 8, step: 0.5 },
  demandKw: { kind: "number", default: 2, min: 0, max: 8, step: 0.5 },
};
export function create(options: Partial<BatteryParameters> = {}) {
  const settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  const solarPhase = Math.floor(random.number() * 24);
  const capacityKwh = 10;
  const reserveKwh = 2;
  const state = { energyKwh: 5, importedKwh: 0, exportedKwh: 0, reserveCrossingCount: 0 };
  let lastCrossingHour: number | undefined;
  const measure = measurements.define((values: typeof state) => ({ ...values }));
  const history = storage.history({ capacity: 120 });
  function record() {
    history.add({ tick: world.tick.value, values: measure.read(state) });
  }
  function step() {
    const hour = (world.tick.value + solarPhase) % 24;
    const solarKw = hour >= 6 && hour < 18 ? settings.solarKw : 0;
    const unconstrainedEnergyKwh = continuous.linear({ value: state.energyKwh, rate: solarKw - settings.demandKw, duration: 1 });
    const crossing = continuous.crossing({ from: state.energyKwh, to: unconstrainedEnergyKwh, threshold: reserveKwh, duration: 1, direction: "falling" });
    if (crossing) {
      state.reserveCrossingCount += 1;
      lastCrossingHour = world.tick.value + crossing.elapsed;
    }
    state.importedKwh += Math.max(0, reserveKwh - unconstrainedEnergyKwh);
    state.exportedKwh += Math.max(0, unconstrainedEnergyKwh - capacityKwh);
    state.energyKwh = Math.min(capacityKwh, Math.max(reserveKwh, unconstrainedEnergyKwh));
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
    read() {
      const samples = history.samples;
      const previous = samples.at(-2)?.values;
      const interval = world.tick.value === 0 ? 0 : world.tick.value - 1;
      const solarHour = (interval + solarPhase) % 24;
      return Object.freeze({
        tick: world.tick.value,
        ...measure.read(state),
        capacityKwh,
        reserveKwh,
        solarKw: solarHour >= 6 && solarHour < 18 ? settings.solarKw : 0,
        demandKw: settings.demandKw,
        intervalImportedKwh: state.importedKwh - (previous?.importedKwh ?? 0),
        intervalExportedKwh: state.exportedKwh - (previous?.exportedKwh ?? 0),
        lastCrossingHour: lastCrossingHour ?? "none",
        solarPhase,
        history: samples,
        done: false,
      });
    },
  };
}
export const model = { title: "Solar Battery Microgrid",
  description: "Illustrative lossless hourly storage with linear reserve crossings; no grid engineering forecast.", inputs, create,
} satisfies Definition<BatteryParameters, ReturnType<typeof create>>;
