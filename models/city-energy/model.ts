/** Original synthetic hourly energy dispatch with a solar day and an evening peak; no empirical forecast. */
import { World, run, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export interface EnergyParameters {
  solarCapacityKw: number;
  windOutputKw: number;
  batteryCapacityKwh: number;
  initialBatteryKwh: number;
  batteryPowerKw: number;
  electricityNetworkCapacityKw: number;
  heatNetworkCapacityKw: number;
  demandScale: number;
  flexibleShare: number;
}
export const inputs: Inputs<EnergyParameters> = {
  solarCapacityKw: { kind: "number", default: 12, min: 0, max: 1000 },
  windOutputKw: { kind: "number", default: 2, min: 0, max: 1000 },
  batteryCapacityKwh: { kind: "number", default: 8, min: 0, max: 1000 },
  initialBatteryKwh: { kind: "number", default: 4, min: 0, max: 1000 },
  batteryPowerKw: { kind: "number", default: 4, min: 0, max: 1000 },
  electricityNetworkCapacityKw: { kind: "number", default: 5, min: 0, max: 1000 },
  heatNetworkCapacityKw: { kind: "number", default: 3, min: 0, max: 1000 },
  demandScale: { kind: "number", default: 1, min: 0, max: 10 },
  flexibleShare: { kind: "number", default: 0, min: 0, max: 0.5 },
};
export interface EnergyFlow {
  electricityDemandKwh: number;
  heatDemandKwh: number;
  solarKwh: number;
  windKwh: number;
  renewableKwh: number;
  batteryChargeKwh: number;
  batteryDischargeKwh: number;
  electricityNetworkKwh: number;
  heatNetworkKwh: number;
  electricityUnmetKwh: number;
  heatUnmetKwh: number;
  curtailedKwh: number;
  electricityBalanceKwh: number;
  heatBalanceKwh: number;
}
type NetworkKey = "electricityNetworkCapacityKw" | "heatNetworkCapacityKw";

const hoursPerDay = 24;
const sunriseHour = 6;
const daylightHours = 12;
// Electricity demand per hour of day (kWh at demandScale 1): night, morning, day, evening peak, late evening.
const electricityProfileKwh = [5, 5, 5, 5, 5, 5, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 12, 12, 12, 12, 7, 7, 7];
const eveningPeakHours = [17, 18, 19, 20];
const middayHours = [11, 12, 13, 14];
const daytimeHeatKwh = 2;
const nightHeatKwh = 4;

function emptyDay() {
  return { demandKwh: 0, renewableKwh: 0, importKwh: 0, unmetKwh: 0, curtailedKwh: 0, heatUnmetKwh: 0 };
}

/** Hourly electricity demand after moving the flexible share of each evening hour to midday. */
function electricityDemand(hour: number, parameters: EnergyParameters) {
  let demand = electricityProfileKwh[hour]!;
  const peakIndex = eveningPeakHours.indexOf(hour);
  const middayIndex = middayHours.indexOf(hour);
  if (peakIndex >= 0) demand -= electricityProfileKwh[hour]! * parameters.flexibleShare;
  if (middayIndex >= 0) demand += electricityProfileKwh[eveningPeakHours[middayIndex]!]! * parameters.flexibleShare;
  return demand * parameters.demandScale;
}

function solarOutput(hour: number, parameters: EnergyParameters) {
  const isDaylight = hour >= sunriseHour && hour < sunriseHour + daylightHours;
  // Evaluated at the middle of the hour.
  return isDaylight ? parameters.solarCapacityKw * Math.sin(Math.PI * (hour + 0.5 - sunriseHour) / daylightHours) : 0;
}

export function create(options: Partial<EnergyParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  if (parameters.initialBatteryKwh > parameters.batteryCapacityKwh) {
    throw new RangeError("Initial battery energy exceeds its capacity.");
  }
  const world = World.create();
  const history = storage.history({ capacity: 2 * hoursPerDay + 1 });
  let batteryKwh = parameters.initialBatteryKwh;
  let totalElectricityUnmetKwh = 0;
  let totalHeatUnmetKwh = 0;
  let today = emptyDay();
  let lastDay = emptyDay();
  let flow: EnergyFlow = {
    electricityDemandKwh: 0, heatDemandKwh: 0, solarKwh: 0, windKwh: 0, renewableKwh: 0,
    batteryChargeKwh: 0, batteryDischargeKwh: 0, electricityNetworkKwh: 0,
    heatNetworkKwh: 0, electricityUnmetKwh: 0, heatUnmetKwh: 0,
    curtailedKwh: 0, electricityBalanceKwh: 0, heatBalanceKwh: 0,
  };
  function record() {
    history.add({ tick: world.tick.value, values: { ...flow, batteryKwh } });
  }
  function settleHour() {
    const hour = world.tick.value % hoursPerDay;
    if (hour === 0) today = emptyDay();
    // Each interval is one hour: kW × 1 h = kWh.
    const electricityDemandKwh = electricityDemand(hour, parameters);
    const heatDemandKwh = (hour >= sunriseHour && hour < sunriseHour + daylightHours ? daytimeHeatKwh : nightHeatKwh) * parameters.demandScale;
    const solarKwh = solarOutput(hour, parameters);
    const windKwh = parameters.windOutputKw;
    const renewableKwh = solarKwh + windKwh;
    const deficitKwh = Math.max(0, electricityDemandKwh - renewableKwh);
    const surplusKwh = Math.max(0, renewableKwh - electricityDemandKwh);
    const batteryDischargeKwh = Math.min(deficitKwh, batteryKwh, parameters.batteryPowerKw);
    const electricityNetworkKwh = Math.min(deficitKwh - batteryDischargeKwh, parameters.electricityNetworkCapacityKw);
    const electricityUnmetKwh = deficitKwh - batteryDischargeKwh - electricityNetworkKwh;
    const batteryChargeKwh = Math.min(surplusKwh, parameters.batteryCapacityKwh - batteryKwh, parameters.batteryPowerKw);
    const curtailedKwh = surplusKwh - batteryChargeKwh;
    const heatNetworkKwh = Math.min(heatDemandKwh, parameters.heatNetworkCapacityKw);
    const heatUnmetKwh = heatDemandKwh - heatNetworkKwh;
    batteryKwh += batteryChargeKwh - batteryDischargeKwh;
    totalElectricityUnmetKwh += electricityUnmetKwh;
    totalHeatUnmetKwh += heatUnmetKwh;
    today.demandKwh += electricityDemandKwh;
    today.renewableKwh += renewableKwh;
    today.importKwh += electricityNetworkKwh;
    today.unmetKwh += electricityUnmetKwh;
    today.curtailedKwh += curtailedKwh;
    today.heatUnmetKwh += heatUnmetKwh;
    if (hour === hoursPerDay - 1) lastDay = { ...today };
    flow = {
      electricityDemandKwh, heatDemandKwh, solarKwh, windKwh, renewableKwh, batteryChargeKwh,
      batteryDischargeKwh, electricityNetworkKwh, heatNetworkKwh,
      electricityUnmetKwh, heatUnmetKwh, curtailedKwh,
      electricityBalanceKwh: renewableKwh + batteryDischargeKwh + electricityNetworkKwh
        + electricityUnmetKwh - electricityDemandKwh - batteryChargeKwh - curtailedKwh,
      heatBalanceKwh: heatNetworkKwh + heatUnmetKwh - heatDemandKwh,
    };
  }
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, settleHour);
        record();
      }
    },
    setNetworkCapacity(changes: Partial<Pick<EnergyParameters, NetworkKey>>) {
      parameters = updateParameters(inputs, parameters, changes, ["electricityNetworkCapacityKw", "heatNetworkCapacityKw"]);
    },
    setFlexibleShare(value: number) {
      parameters = updateParameters(inputs, parameters, { flexibleShare: value }, ["flexibleShare"]);
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        intervalHour: world.tick.value === 0 ? null : (world.tick.value - 1) % hoursPerDay,
        parameters: Object.freeze({ ...parameters }),
        batteryKwh,
        flow: Object.freeze({ ...flow }),
        today: Object.freeze({ ...today }),
        lastDay: Object.freeze({ ...lastDay }),
        demandProfile: Object.freeze(Array.from({ length: hoursPerDay }, (_, hour) => Object.freeze({
          hour, electricityKwh: electricityDemand(hour, parameters), solarKwh: solarOutput(hour, parameters),
        }))),
        totalElectricityUnmetKwh,
        totalHeatUnmetKwh,
        history: history.samples,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Urban Energy Supply",
  description: "A solar day, an evening peak, a finite battery and an import limit. Compare more solar, more storage and shifted demand. Synthetic hourly supply and demand.",
  inputs,
  create,
} satisfies Definition<EnergyParameters, ReturnType<typeof create>>;
