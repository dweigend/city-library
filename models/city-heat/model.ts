/** Original synthetic hourly surface energy budget with a day and night cycle; constants are teaching assumptions. */
import { Grid, World, run, continuous, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export interface HeatParameters {
  airTemperatureC: number;
  initialTemperatureC: number;
  solarFluxWm2: number;
  shadeFraction: number;
  waterAvailability: number;
}
type PolicyKey = "shadeFraction" | "waterAvailability";
export type HeatPolicy = Partial<Pick<HeatParameters, PolicyKey>>;

export const inputs: Inputs<HeatParameters> = {
  airTemperatureC: { kind: "number", default: 26, min: -20, max: 45 },
  initialTemperatureC: { kind: "number", default: 22, min: -20, max: 60 },
  solarFluxWm2: { kind: "number", default: 800, min: 0, max: 1200 },
  shadeFraction: { kind: "number", default: 0, min: 0, max: 1 },
  waterAvailability: { kind: "number", default: 0.5, min: 0, max: 1 },
};

const secondsPerHour = 3600;
const hoursPerDay = 24;
const blockAreaM2 = 100;
const plantedHeatCapacityJm2K = 500_000;
const sealedHeatCapacityIncrease = 500_000;
const sensibleConductanceWm2K = 20;
const plantedAbsorptivity = 0.6;
const sealedAbsorptivityIncrease = 0.2;
const maximumEvapotranspirationWm2 = 300;
const latentHeatJPerKg = 2.45e6;
const airTemperatureAmplitudeC = 5;
const warmestAirHour = 15;
const sunriseHour = 6;
const daylightHours = 12;
const blockLabels = ["Sealed", "Mixed", "Planted"];
const sealedFractions = [1, 0.5, 0];
const historyCapacity = 2 * hoursPerDay + 1;

/** Air temperature and sunlight for the hour starting at `hour`, evaluated mid-hour. */
function drivers(hour: number, parameters: HeatParameters) {
  const middle = hour % hoursPerDay + 0.5;
  // Sine peaks six hours after its zero crossing, so the warmest air falls at 15:00.
  const airC = parameters.airTemperatureC + airTemperatureAmplitudeC * Math.sin(2 * Math.PI * (middle - (warmestAirHour - 6)) / hoursPerDay);
  const isDaylight = middle > sunriseHour && middle < sunriseHour + daylightHours;
  const solarWm2 = isDaylight ? parameters.solarFluxWm2 * Math.sin(Math.PI * (middle - sunriseHour) / daylightHours) : 0;
  return { airC, solarWm2 };
}

export function create(options: Partial<HeatParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  const world = World.create();
  const grid = Grid.create({ x: sealedFractions.length, y: 1, boundary: "hard" }, { state: {
    temperatureC: parameters.initialTemperatureC,
    sealedFraction: 0,
    heatCapacityJm2K: plantedHeatCapacityJm2K,
    absorbedSolarWm2: 0,
    evapotranspirationWm2: 0,
    sensibleLossWm2: 0,
    netFluxWm2: 0,
  } });
  grid.fields.forEach((field, index) => {
    field.sealedFraction = sealedFractions[index]!;
    field.heatCapacityJm2K = plantedHeatCapacityJm2K + sealedHeatCapacityIncrease * field.sealedFraction;
  });
  world.add(grid);
  const history = storage.history({ capacity: historyCapacity });
  let lastAirC = drivers(0, parameters).airC;
  let lastSolarWm2 = 0;
  let netEnergyJ = 0;
  let cumulativeNetEnergyJ = 0;
  let irrigationWaterKg = 0;

  function storedEnergyJ() {
    return grid.fields.reduce((sum, field) => sum +
      (field.temperatureC - parameters.initialTemperatureC) * field.heatCapacityJm2K * blockAreaM2, 0);
  }

  function record() {
    history.add({ tick: world.tick.value, values: {
      airTemperatureC: lastAirC,
      solarWm2: lastSolarWm2,
      sealedTemperatureC: grid.fields[0]!.temperatureC,
      mixedTemperatureC: grid.fields[1]!.temperatureC,
      plantedTemperatureC: grid.fields[2]!.temperatureC,
      irrigationWaterKg,
      balanceResidualJ: storedEnergyJ() - cumulativeNetEnergyJ,
    } });
  }

  function step() {
    const { airC, solarWm2 } = drivers(world.tick.value, parameters);
    lastAirC = airC;
    lastSolarWm2 = solarWm2;
    netEnergyJ = 0;
    for (const field of grid.fields) {
      const absorptivity = plantedAbsorptivity + sealedAbsorptivityIncrease * field.sealedFraction;
      field.absorbedSolarWm2 = solarWm2 * absorptivity * (1 - parameters.shadeFraction);
      // Plants transpire with sunlight; watering sets how much of the maximum they reach.
      const sunShare = parameters.solarFluxWm2 === 0 ? 0 : solarWm2 / parameters.solarFluxWm2;
      field.evapotranspirationWm2 = maximumEvapotranspirationWm2 * (1 - field.sealedFraction) * parameters.waterAvailability * sunShare;
      field.sensibleLossWm2 = sensibleConductanceWm2K * (field.temperatureC - airC);
      field.netFluxWm2 = field.absorbedSolarWm2 - field.evapotranspirationWm2 - field.sensibleLossWm2;
      field.temperatureC = continuous.linear({
        value: field.temperatureC,
        rate: field.netFluxWm2 / field.heatCapacityJm2K,
        duration: secondsPerHour,
      });
      netEnergyJ += field.netFluxWm2 * secondsPerHour * blockAreaM2;
      irrigationWaterKg += field.evapotranspirationWm2 * secondsPerHour * blockAreaM2 / latentHeatJPerKg;
    }
    cumulativeNetEnergyJ += netEnergyJ;
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
    setPolicy(changes: HeatPolicy) {
      parameters = updateParameters(inputs, parameters, changes, ["shadeFraction", "waterAvailability"]);
    },
    read() {
      const energy = storedEnergyJ();
      return Object.freeze({
        tick: world.tick.value,
        clockHour: world.tick.value % hoursPerDay,
        parameters: Object.freeze({ ...parameters }),
        airTemperatureC: lastAirC,
        solarNowWm2: lastSolarWm2,
        meanTemperatureC: grid.fields.reduce((sum, field) => sum + field.temperatureC, 0) / grid.fields.length,
        netEnergyJ,
        cumulativeNetEnergyJ,
        storedEnergyJ: energy,
        balanceResidualJ: energy - cumulativeNetEnergyJ,
        irrigationWaterKg,
        blocks: Object.freeze(grid.fields.map((field, index) => Object.freeze({
          id: `block-${index}`,
          label: blockLabels[index]!,
          x: field.x, y: field.y,
          sealedFraction: field.sealedFraction,
          heatCapacityJm2K: field.heatCapacityJm2K,
          temperatureC: field.temperatureC,
          absorbedSolarWm2: field.absorbedSolarWm2,
          evapotranspirationWm2: field.evapotranspirationWm2,
          sensibleLossWm2: field.sensibleLossWm2,
          netFluxWm2: field.netFluxWm2,
        }))),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Urban Heat",
  description: "Sealed, mixed and planted blocks through a synthetic day and night: absorbed sun, stored heat, shade and evapotranspiration. Synthetic surface temperatures.",
  inputs,
  create,
} satisfies Definition<HeatParameters, ReturnType<typeof create>>;
