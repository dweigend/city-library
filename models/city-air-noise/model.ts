/** Original synthetic street corridor: box-model pollutant transport and energetic sound addition. */
import { Grid, World, run, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export interface AirNoiseParameters {
  trafficVehiclesPerHour: number;
  transportFraction: number;
  decayFraction: number;
  receptorDistanceM: number;
}
type PolicyKey = "trafficVehiclesPerHour" | "transportFraction" | "receptorDistanceM";

export const inputs: Inputs<AirNoiseParameters> = {
  trafficVehiclesPerHour: { kind: "number", default: 600, min: 0, max: 6000 },
  transportFraction: { kind: "number", default: 0.5, min: 0, max: 1 },
  decayFraction: { kind: "number", default: 0.25, min: 0, max: 1 },
  receptorDistanceM: { kind: "number", default: 10, min: 5, max: 100 },
};
const policyKeys: readonly PolicyKey[] = ["trafficVehiclesPerHour", "transportFraction", "receptorDistanceM"];

const BOX_COUNT = 8;
const BOX_LENGTH_METERS = 100;
const BOX_VOLUME_CUBIC_METERS = 1000;
const STREET_BOX_INDEXES = Object.freeze([1, 2]);
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const EMISSION_MICROGRAMS_PER_VEHICLE = 1000;
const REFERENCE_TRAFFIC_VEHICLES_PER_MINUTE = 1;
const REFERENCE_DISTANCE_METERS = 10;
const SOURCE_REFERENCE_DECIBELS = 60;
const BACKGROUND_DECIBELS = 40;
const REFERENCE_INTENSITY_WATTS_PER_SQUARE_METER = 1e-12;

function boxCenterMeters(index: number) {
  return BOX_LENGTH_METERS * (index + 0.5);
}

export function create(options: Partial<AirNoiseParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  const world = World.create();
  const grid = Grid.create({ x: BOX_COUNT, y: 1 }, { state: {
    massMicrograms: 0,
    concentrationExposureMicrogramMinutesPerCubicMeter: 0,
    noiseExposureJoulesPerSquareMeter: 0,
  } });
  world.add(grid);
  const fields = [...grid.fields].sort((left, right) => left.x - right.x);
  const history = storage.history({ capacity: 240 });
  let emittedMassMicrograms = 0;
  let decayedMassMicrograms = 0;
  let exitedMassMicrograms = 0;

  function getField(index: number) {
    const field = fields[index];
    if (!field) throw new Error("Missing corridor field.");
    return field;
  }

  function emissionPerStreetBox() {
    return parameters.trafficVehiclesPerHour / MINUTES_PER_HOUR * EMISSION_MICROGRAMS_PER_VEHICLE;
  }

  /** Sound energies add: background plus each street box as a point source at the receptor distance. */
  function soundAt(index: number) {
    let relativeIntensity = 10 ** (BACKGROUND_DECIBELS / 10);
    for (const source of STREET_BOX_INDEXES) {
      const distanceSquared = (boxCenterMeters(index) - boxCenterMeters(source)) ** 2 + parameters.receptorDistanceM ** 2;
      relativeIntensity += parameters.trafficVehiclesPerHour / MINUTES_PER_HOUR / REFERENCE_TRAFFIC_VEHICLES_PER_MINUTE
        * 10 ** (SOURCE_REFERENCE_DECIBELS / 10) * REFERENCE_DISTANCE_METERS ** 2 / distanceSquared;
    }
    return {
      noiseDecibels: 10 * Math.log10(relativeIntensity),
      intensityWattsPerSquareMeter: relativeIntensity * REFERENCE_INTENSITY_WATTS_PER_SQUARE_METER,
    };
  }

  function concentrations() {
    return fields.map(field => field.massMicrograms / BOX_VOLUME_CUBIC_METERS);
  }

  function retainedMassMicrograms() {
    return fields.reduce((total, field) => total + field.massMicrograms, 0);
  }

  function summary() {
    const values = concentrations();
    const maximum = Math.max(...values);
    return {
      meanConcentrationMicrogramsPerCubicMeter: values.reduce((sum, value) => sum + value, 0) / BOX_COUNT,
      maximumConcentrationMicrogramsPerCubicMeter: maximum,
      hotspotIndex: values.indexOf(maximum),
      maximumNoiseDecibels: Math.max(...fields.map((_, index) => soundAt(index).noiseDecibels)),
    };
  }

  function record() {
    const values = summary();
    history.add({ tick: world.tick.value, values: {
      meanConcentrationMicrogramsPerCubicMeter: values.meanConcentrationMicrogramsPerCubicMeter,
      maximumConcentrationMicrogramsPerCubicMeter: values.maximumConcentrationMicrogramsPerCubicMeter,
      farEndConcentrationMicrogramsPerCubicMeter: getField(BOX_COUNT - 1).massMicrograms / BOX_VOLUME_CUBIC_METERS,
      maximumNoiseDecibels: values.maximumNoiseDecibels,
    } });
  }

  function step() {
    const emission = emissionPerStreetBox();
    for (const index of STREET_BOX_INDEXES) getField(index).massMicrograms += emission;
    emittedMassMicrograms += emission * STREET_BOX_INDEXES.length;
    const beforeTransport = fields.map(field => field.massMicrograms);
    exitedMassMicrograms += beforeTransport[BOX_COUNT - 1]! * parameters.transportFraction;
    const transported = beforeTransport.map((mass, index) => mass * (1 - parameters.transportFraction)
      + (beforeTransport[index - 1] ?? 0) * parameters.transportFraction);
    for (const [index, mass] of transported.entries()) {
      const field = getField(index);
      const decay = mass * parameters.decayFraction;
      decayedMassMicrograms += decay;
      field.massMicrograms = mass - decay;
      // One minute: right-endpoint concentration; sound is constant throughout the step.
      field.concentrationExposureMicrogramMinutesPerCubicMeter += field.massMicrograms / BOX_VOLUME_CUBIC_METERS;
      field.noiseExposureJoulesPerSquareMeter += soundAt(index).intensityWattsPerSquareMeter * SECONDS_PER_MINUTE;
    }
  }

  record();
  return {
    advance(steps = 1) {
      validateStepCount(steps);
      for (let index = 0; index < steps; index += 1) {
        run(world, step);
        record();
      }
    },
    setTraffic(value: number) {
      parameters = updateParameters(inputs, parameters, { trafficVehiclesPerHour: value }, ["trafficVehiclesPerHour"]);
    },
    setPolicy(changes: Partial<Pick<AirNoiseParameters, PolicyKey>>) {
      parameters = updateParameters(inputs, parameters, changes, policyKeys);
    },
    read() {
      const values = summary();
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...parameters }),
        streetBoxIndexes: STREET_BOX_INDEXES,
        emissionMicrogramsPerMinute: emissionPerStreetBox() * STREET_BOX_INDEXES.length,
        emittedMassMicrograms, decayedMassMicrograms, exitedMassMicrograms,
        retainedMassMicrograms: retainedMassMicrograms(),
        meanConcentrationMicrogramsPerCubicMeter: values.meanConcentrationMicrogramsPerCubicMeter,
        maximumConcentrationMicrogramsPerCubicMeter: values.maximumConcentrationMicrogramsPerCubicMeter,
        hotspotReceptorId: `receptor:${values.hotspotIndex}`,
        maximumNoiseDecibels: values.maximumNoiseDecibels,
        receptors: Object.freeze(fields.map((field, index) => Object.freeze({
          id: `receptor:${index}`,
          xMeters: boxCenterMeters(index),
          yMeters: parameters.receptorDistanceM,
          isStreetBox: STREET_BOX_INDEXES.includes(index),
          massMicrograms: field.massMicrograms,
          concentrationMicrogramsPerCubicMeter: field.massMicrograms / BOX_VOLUME_CUBIC_METERS,
          concentrationExposureMicrogramMinutesPerCubicMeter: field.concentrationExposureMicrogramMinutesPerCubicMeter,
          noiseExposureJoulesPerSquareMeter: field.noiseExposureJoulesPerSquareMeter,
          ...soundAt(index),
        }))),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Air and Noise Exposure",
  description: "A street corridor with wind-driven air boxes and energetic sound addition. Compare less traffic, more ventilation and receptor distance. No city calibration or health prediction.",
  inputs, create,
} satisfies Definition<AirNoiseParameters, ReturnType<typeof create>>;
