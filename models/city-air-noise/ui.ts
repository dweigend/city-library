import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData, type SpatialSegment } from "../../ui/index.ts";
import { model } from "./model.ts";

// Fixed air scale 0–20 µg/m³ in the brown family (dark clean → pale polluted); noise uses size and the violet family.
const airScaleMaximum = 20;
const noiseColor = indexedColor(115);
const streetColor = indexedColor(4);
const windColor = indexedColor(95);
const vehicleColor = scientificPalette.waiting;

export const ui = defineUI(model, {
  setup: [{ field: "decayFraction", label: "Decay fraction / min" }],
  change: (instance, changes) => instance.setPolicy(changes),
  live: {
    trafficVehiclesPerHour: { label: "Traffic per street box (vehicles/h)" },
    transportFraction: { label: "Ventilation (share moved downwind / min)" },
    receptorDistanceM: { label: "Receptor distance from street (m)" },
  },
  monitors: [
    { label: "Minute", value: state => state.tick },
    { label: "Corridor mean (µg/m³)", value: state => state.meanConcentrationMicrogramsPerCubicMeter, format: (value: number) => value.toFixed(2) },
    { label: "Hotspot (µg/m³)", value: state => state.maximumConcentrationMicrogramsPerCubicMeter, format: (value: number) => value.toFixed(2) },
    { label: "Hotspot at (m)", value: state => state.receptors.find(receptor => receptor.id === state.hotspotReceptorId)!.xMeters },
    { label: "Loudest receptor (dB)", value: state => state.maximumNoiseDecibels, format: (value: number) => value.toFixed(1) },
  ],
  views: [
    { type: "spatial", label: `Street corridor · box shade = air in µg/m³ (fixed 0–${airScaleMaximum}, dark clean, paler more polluted, gray outline per box) · violet circles = receptors with sound level in dB, larger louder`, data: corridorScene },
    { type: "bar", label: "Air along the corridor", xAxis: { label: "Distance downwind", unit: "m" }, yAxis: { unit: "µg/m³" },
      series: state => [{ label: "Concentration", color: indexedColor(35), points: state.receptors.map(receptor => ({ x: `${receptor.xMeters}`, y: receptor.concentrationMicrogramsPerCubicMeter })) }] },
    { type: "bar", label: "Noise along the corridor", xAxis: { label: "Distance downwind", unit: "m" }, yAxis: { unit: "dB" },
      series: state => [{ label: "Sound level", color: noiseColor, points: state.receptors.map(receptor => ({ x: `${receptor.xMeters}`, y: receptor.noiseDecibels })) }] },
    { type: "line", label: "Corridor mean versus hotspot and far end", xAxis: { label: "Minute" }, yAxis: { unit: "µg/m³" },
      series: state => [
        { label: "Mean", color: indexedColor(5), points: state.history.map(sample => ({ x: sample.tick, y: sample.values.meanConcentrationMicrogramsPerCubicMeter! })) },
        { label: "Hotspot", color: indexedColor(25), points: state.history.map(sample => ({ x: sample.tick, y: sample.values.maximumConcentrationMicrogramsPerCubicMeter! })) },
        { label: "Far end (750 m)", color: windColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.farEndConcentrationMicrogramsPerCubicMeter! })) },
      ] },
    { type: "table", label: "Receptor exposure since setup", rows: state => state.receptors.map(receptor => ({
      "At (m)": receptor.xMeters,
      "Air (µg/m³)": receptor.concentrationMicrogramsPerCubicMeter.toFixed(2),
      "Dose (µg·min/m³)": receptor.concentrationExposureMicrogramMinutesPerCubicMeter.toFixed(0),
      "Sound (dB)": receptor.noiseDecibels.toFixed(1),
    })) },
  ],
});

type State = Observation<typeof model>;
// Scene x: corridor meters / 100 shifted so 0–800 m spans −4…4.
const sceneX = (meters: number) => meters / 100 - 4;

function airColor(concentration: number) {
  const share = Math.min(1, Math.max(0, concentration / airScaleMaximum));
  return indexedColor(31 + 7 * share);
}

function corridorScene(state: State): SpatialData {
  const boxTop = 1.3;
  const boxHeight = 1.2;
  const streetY = boxTop - boxHeight - 0.35;
  // Receptor distance 5–100 m drawn as 0.25–1.4 scene units below the street.
  const receptorY = streetY - 0.25 - 1.15 * (state.parameters.receptorDistanceM - 5) / 95;
  const agents: SpatialAgent[] = [];
  const labels: { x: number; y: number; text: string }[] = [];
  const segments: SpatialSegment[] = [];
  for (const receptor of state.receptors) {
    const x = sceneX(receptor.xMeters);
    // A thin outline keeps clean (dark) air boxes visible on the dark canvas.
    agents.push({ id: `box:${receptor.id}`, x, y: boxTop - boxHeight / 2, shape: "rectangle", extent: { width: 0.94, height: boxHeight },
      color: airColor(receptor.concentrationMicrogramsPerCubicMeter), stroke: scientificPalette.unavailable, strokeWidth: 1, selectable: false });
    labels.push({ x, y: boxTop + 0.25, text: receptor.concentrationMicrogramsPerCubicMeter.toFixed(1) });
    // Each 10 dB above the 40 dB background adds 4 px to the receptor symbol.
    agents.push({ id: receptor.id, x, y: receptorY, size: 6 + 0.4 * Math.max(0, receptor.noiseDecibels - 40), color: noiseColor });
    labels.push({ x, y: receptorY - 0.45, text: receptor.noiseDecibels.toFixed(0) });
  }
  const streetStart = sceneX(state.streetBoxIndexes[0]! * 100);
  const streetEnd = sceneX((state.streetBoxIndexes.at(-1)! + 1) * 100);
  segments.push({ from: { x: streetStart, y: streetY }, to: { x: streetEnd, y: streetY }, color: streetColor, width: 6 });
  // One vehicle symbol per 300 vehicles/h per box, at most six per box.
  const vehicleCount = Math.min(12, Math.ceil(state.parameters.trafficVehiclesPerHour / 300) * state.streetBoxIndexes.length);
  for (let index = 0; index < vehicleCount; index += 1) {
    agents.push({ id: `vehicle:${index}`, x: streetStart + (index + 0.5) * (streetEnd - streetStart) / vehicleCount, y: streetY,
      size: 7, shape: "triangle", heading: 90, color: vehicleColor, selectable: false });
  }
  const windLength = 0.4 + 2.6 * state.parameters.transportFraction;
  segments.push({ from: { x: -1.3, y: boxTop + 0.65 }, to: { x: -1.3 + windLength, y: boxTop + 0.65 }, color: windColor, width: 3 },
    { from: { x: -1.3 + windLength, y: boxTop + 0.65 }, to: { x: -1.3 + windLength - 0.18, y: boxTop + 0.77 }, color: windColor, width: 3 },
    { from: { x: -1.3 + windLength, y: boxTop + 0.65 }, to: { x: -1.3 + windLength - 0.18, y: boxTop + 0.53 }, color: windColor, width: 3 });
  labels.push({ x: -2.5, y: boxTop + 0.65, text: "Wind" }, { x: streetStart - 0.65, y: streetY, text: "Street" });
  return {
    width: 9, height: 3.6, agents, labels, segments,
    description: `Minute ${state.tick}. Air concentration from upwind to downwind: ${state.receptors.map(receptor => receptor.concentrationMicrogramsPerCubicMeter.toFixed(1)).join(", ")} micrograms per cubic meter. Noise: ${state.receptors.map(receptor => receptor.noiseDecibels.toFixed(0)).join(", ")} decibels at ${state.parameters.receptorDistanceM} meters from the street.`,
  };
}
