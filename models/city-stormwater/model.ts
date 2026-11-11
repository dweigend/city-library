/** Original hourly storm water balance for two synthetic plots, a soil store and a throttled basin. */
import { Grid, World, run, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export type StormPattern = "single" | "double";
export interface StormwaterParameters {
  rainMmPerHour: number;
  infiltrationMmPerHour: number;
  retentionCapacityM3: number;
  outletM3PerHour: number;
  stormPattern: StormPattern;
}

export const inputs: Inputs<StormwaterParameters> = {
  rainMmPerHour: { kind: "number", default: 10, min: 0, max: 100 },
  infiltrationMmPerHour: { kind: "number", default: 6, min: 0, max: 100 },
  retentionCapacityM3: { kind: "number", default: 60, min: 0, max: 1000 },
  outletM3PerHour: { kind: "number", default: 4, min: 0, max: 100 },
  stormPattern: { kind: "choice", default: "single", options: ["single", "double"] },
};

const plotAreaM2 = 2000;
const imperviousShares = [0.8, 0.2];
const plotIds = ["plot:sealed", "plot:green"];
const soilCapacityMm = 20;
const percolationMmPerHour = 1;
const cubicMetersPerMillimeterSquareMeter = 0.001;
const firstStormHours = [0, 1, 2];
const secondStormHours = [8, 9, 10];
const hoursPerDay = 24;

export function create(options: Partial<StormwaterParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  const world = World.create();
  const catchment = Grid.create({ x: 2, y: 1, boundary: "hard" }, {
    state: { areaM2: plotAreaM2, imperviousShare: 0, soilStorageMm: 0, intervalInfiltrationMm: 0, intervalRunoffM3: 0 },
  });
  world.add(catchment);
  catchment.fields.forEach((plot, index) => { plot.imperviousShare = imperviousShares[index]!; });
  const totals = { rainM3: 0, infiltratedM3: 0, percolatedM3: 0, runoffM3: 0, dischargedM3: 0, overflowM3: 0 };
  let storedM3 = 0;
  const interval = { rainM3: 0, runoffM3: 0, dischargedM3: 0, overflowM3: 0 };
  const history = storage.history({ capacity: 2 * hoursPerDay + 1 });

  const perviousAreaM2 = (plot: (typeof catchment.fields)[number]) => plot.areaM2 * (1 - plot.imperviousShare);
  function soilStorageM3() {
    return catchment.fields.reduce((sum, plot) => sum + plot.soilStorageMm * perviousAreaM2(plot) * cubicMetersPerMillimeterSquareMeter, 0);
  }
  function balanceErrorM3() {
    return totals.rainM3 - soilStorageM3() - totals.percolatedM3 - storedM3 - totals.dischargedM3 - totals.overflowM3;
  }
  function isStormHour(hour: number) {
    const dayHour = hour % hoursPerDay;
    return firstStormHours.includes(dayHour) || (parameters.stormPattern === "double" && secondStormHours.includes(dayHour));
  }

  function record() {
    history.add({ tick: world.tick.value, values: {
      ...totals, storedM3, soilStorageM3: soilStorageM3(), balanceErrorM3: balanceErrorM3(),
      intervalRainM3: interval.rainM3, intervalRunoffM3: interval.runoffM3,
      intervalDischargedM3: interval.dischargedM3, intervalOverflowM3: interval.overflowM3,
    } });
  }

  function collectRain() {
    const rainMm = isStormHour(world.tick.value) ? parameters.rainMmPerHour : 0;
    interval.rainM3 = 0;
    interval.runoffM3 = 0;
    for (const plot of catchment.fields) {
      const pervious = perviousAreaM2(plot);
      // Infiltration declines as the soil store fills (dry soil takes the full rate).
      const infiltrationMm = Math.min(rainMm,
        parameters.infiltrationMmPerHour * (1 - plot.soilStorageMm / soilCapacityMm),
        soilCapacityMm - plot.soilStorageMm);
      plot.soilStorageMm += infiltrationMm;
      const percolationMm = Math.min(percolationMmPerHour, plot.soilStorageMm);
      plot.soilStorageMm -= percolationMm;
      plot.intervalInfiltrationMm = infiltrationMm;
      plot.intervalRunoffM3 = (rainMm * plot.areaM2 - infiltrationMm * pervious) * cubicMetersPerMillimeterSquareMeter;
      interval.rainM3 += rainMm * plot.areaM2 * cubicMetersPerMillimeterSquareMeter;
      interval.runoffM3 += plot.intervalRunoffM3;
      totals.infiltratedM3 += infiltrationMm * pervious * cubicMetersPerMillimeterSquareMeter;
      totals.percolatedM3 += percolationMm * pervious * cubicMetersPerMillimeterSquareMeter;
    }
    totals.rainM3 += interval.rainM3;
    totals.runoffM3 += interval.runoffM3;
    const availableM3 = storedM3 + interval.runoffM3;
    interval.dischargedM3 = Math.min(parameters.outletM3PerHour, availableM3);
    const remainingM3 = availableM3 - interval.dischargedM3;
    interval.overflowM3 = Math.max(0, remainingM3 - parameters.retentionCapacityM3);
    storedM3 = remainingM3 - interval.overflowM3;
    totals.dischargedM3 += interval.dischargedM3;
    totals.overflowM3 += interval.overflowM3;
  }

  record();
  return {
    advance(steps = 1) {
      validateStepCount(steps);
      for (let index = 0; index < steps; index += 1) {
        run(world, collectRain);
        record();
      }
    },
    setRain(mmPerHour: number) {
      parameters = updateParameters(inputs, parameters, { rainMmPerHour: mmPerHour }, ["rainMmPerHour"]);
    },
    setInfiltration(mmPerHour: number) {
      parameters = updateParameters(inputs, parameters, { infiltrationMmPerHour: mmPerHour }, ["infiltrationMmPerHour"]);
    },
    setStormPattern(stormPattern: StormPattern) {
      parameters = updateParameters(inputs, parameters, { stormPattern }, ["stormPattern"]);
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...parameters }),
        areaM2: catchment.fields.reduce((area, plot) => area + plot.areaM2, 0),
        imperviousAreaM2: catchment.fields.reduce((area, plot) => area + plot.areaM2 * plot.imperviousShare, 0),
        ...totals,
        storedM3,
        soilStorageM3: soilStorageM3(),
        intervalRainM3: interval.rainM3,
        intervalRunoffM3: interval.runoffM3,
        intervalDischargedM3: interval.dischargedM3,
        intervalOverflowM3: interval.overflowM3,
        isRainingNextHour: isStormHour(world.tick.value),
        fillFraction: parameters.retentionCapacityM3 === 0 ? 0 : storedM3 / parameters.retentionCapacityM3,
        balanceErrorM3: balanceErrorM3(),
        plots: Object.freeze(catchment.fields.map((plot, index) => Object.freeze({
          id: plotIds[index]!,
          x: plot.x,
          y: plot.y,
          areaM2: plot.areaM2,
          imperviousShare: plot.imperviousShare,
          soilStorageMm: plot.soilStorageMm,
          soilFillFraction: plot.soilStorageMm / soilCapacityMm,
          intervalInfiltrationMm: plot.intervalInfiltrationMm,
          intervalRunoffM3: plot.intervalRunoffM3,
        }))),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Urban Stormwater",
  description: "Storm pulses on a sealed and a green plot: soil that fills up, a throttled basin and overflow. Compare infiltration with retention for one and two storms. Synthetic hourly water balance.",
  inputs,
  create,
} satisfies Definition<StormwaterParameters, ReturnType<typeof create>>;
