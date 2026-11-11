import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

// Fixed sequential scale: 15 °C maps to dark orange, 50 °C to pale orange (70 palette bins).
const scaleMinimumC = 15;
const scaleMaximumC = 50;
const blockColors = [indexedColor(15), indexedColor(35), indexedColor(55)];
// Mid gray stays visible on light and dark chart backgrounds.
const airColor = indexedColor(5);
const shadeColor = indexedColor(52);

export const ui = defineUI(model, {
  setup: [
    { field: "airTemperatureC", label: "Daily mean air temperature (°C)" },
    { field: "initialTemperatureC", label: "Initial surface temperature (°C)" },
    { field: "solarFluxWm2", label: "Peak solar flux at noon (W/m²)" },
  ],
  change: (instance, changes) => instance.setPolicy(changes),
  live: {
    shadeFraction: { label: "Shade (share of sunlight blocked)" },
    waterAvailability: { label: "Watering (share of full evapotranspiration)" },
  },
  monitors: [
    { label: "Clock", value: state => `Day ${Math.floor(state.tick / 24) + 1} · ${String(state.clockHour).padStart(2, "0")}:00` },
    { label: "Sun last hour (W/m²)", value: state => state.solarNowWm2, format: (value: number) => value.toFixed(0) },
    { label: "Air last hour (°C)", value: state => state.airTemperatureC, format: celsius },
    { label: "Sealed − planted (K)", value: state => state.blocks[0]!.temperatureC - state.blocks[2]!.temperatureC, format: celsius },
    { label: "Cooling water (kg)", value: state => state.irrigationWaterKg, format: (value: number) => value.toFixed(0) },
    { label: "Budget residual (J)", value: state => state.balanceResidualJ, format: residual },
  ],
  views: [
    { type: "spatial", label: `Surface temperature · fixed scale ${scaleMinimumC}–${scaleMaximumC} °C, darker cooler, paler hotter · second line: difference to air · outlined green band = shade`, data: heatScene },
    { type: "line", label: "Surface and air temperature", xAxis: { label: "Time", unit: "h" }, yAxis: { label: "Temperature", unit: "°C" },
      series: state => [
        { label: "Sealed", color: blockColors[0], points: state.history.map(sample => ({ x: sample.tick, y: sample.values.sealedTemperatureC! })) },
        { label: "Mixed", color: blockColors[1], points: state.history.map(sample => ({ x: sample.tick, y: sample.values.mixedTemperatureC! })) },
        { label: "Planted", color: blockColors[2], points: state.history.map(sample => ({ x: sample.tick, y: sample.values.plantedTemperatureC! })) },
        { label: "Air", color: airColor, points: state.history.filter(sample => sample.tick > 0).map(sample => ({ x: sample.tick, y: sample.values.airTemperatureC! })) },
      ] },
    { type: "line", label: "Cooling water used · cumulative", xAxis: { label: "Time", unit: "h" }, yAxis: { unit: "kg" },
      series: state => [{ label: "Irrigation water", color: indexedColor(95), points: state.history.map(sample => ({ x: sample.tick, y: sample.values.irrigationWaterKg! })) }] },
    { type: "inspector", label: "Block budget in the last hour", value: (state, selected) => {
      const block = state.blocks.find(candidate => candidate.id === selected);
      return block ? {
        block: block.label,
        "Sealed fraction": block.sealedFraction,
        "Heat capacity (MJ/m²K)": block.heatCapacityJm2K / 1e6,
        "Surface (°C)": celsius(block.temperatureC),
        "Absorbed sun (W/m²)": block.absorbedSolarWm2.toFixed(0),
        "Evapotranspiration (W/m²)": block.evapotranspirationWm2.toFixed(0),
        "Sensible loss (W/m²)": withoutNegativeZero(block.sensibleLossWm2).toFixed(0),
        "Net (W/m²)": withoutNegativeZero(block.netFluxWm2).toFixed(0),
      } : undefined;
    } },
  ],
});

type State = Observation<typeof model>;

function temperatureColor(temperatureC: number) {
  const share = Math.min(1, Math.max(0, (temperatureC - scaleMinimumC) / (scaleMaximumC - scaleMinimumC)));
  return indexedColor(21 + 7 * share);
}

function heatScene(state: State): SpatialData {
  const blockX = (index: number) => (index - 1) * 2.6;
  const agents: SpatialAgent[] = state.blocks.map((block, index) => ({
    id: block.id, x: blockX(index), y: 0.3, shape: "rectangle", extent: { width: 2.2, height: 1.4 },
    color: temperatureColor(block.temperatureC),
  }));
  const shade = state.parameters.shadeFraction;
  if (shade > 0) state.blocks.forEach((block, index) => agents.push({
    id: `${block.id}:shade`, x: blockX(index) - 1.1 + 1.1 * shade, y: 1.12, shape: "rectangle",
    extent: { width: 2.2 * shade, height: 0.18 }, color: shadeColor, stroke: scientificPalette.neutral, strokeWidth: 1, selectable: false,
  }));
  // Color bar for the fixed scale.
  const barSteps = 14;
  for (let step = 0; step < barSteps; step += 1) {
    const temperatureC = scaleMinimumC + (step + 0.5) * (scaleMaximumC - scaleMinimumC) / barSteps;
    agents.push({ id: `scale:${step}`, x: -2.6 + step * 5.2 / barSteps + 5.2 / barSteps / 2, y: -2.1, shape: "rectangle",
      extent: { width: 5.2 / barSteps, height: 0.22 }, color: temperatureColor(temperatureC), selectable: false });
  }
  const labels = [
    { x: 0, y: 2.2, text: `Sun ${state.solarNowWm2.toFixed(0)} W/m² · air ${celsius(state.airTemperatureC)} °C` },
    ...state.blocks.flatMap((block, index) => [
      { x: blockX(index), y: 1.6, text: block.label },
      { x: blockX(index), y: -0.72, text: `${celsius(block.temperatureC)} °C` },
      { x: blockX(index), y: -1.1, text: `${signedKelvin(block.temperatureC - state.airTemperatureC)} vs air` },
      { x: blockX(index), y: -1.48, text: `ET ${block.evapotranspirationWm2.toFixed(0)} W/m²` },
    ]),
    { x: -3.25, y: -2.1, text: `${scaleMinimumC}` },
    { x: 3.4, y: -2.1, text: `${scaleMaximumC} °C` },
  ];
  return {
    width: 8.4, height: 5.2, agents, labels,
    description: `Hour ${state.clockHour}: sun ${state.solarNowWm2.toFixed(0)} watts per square meter, air ${celsius(state.airTemperatureC)} degrees. Surfaces: ${state.blocks.map(block => `${block.label} ${celsius(block.temperatureC)}`).join(", ")} degrees Celsius.`,
  };
}

/** Signed temperature difference; display rounding never shows −0.0. */
function signedKelvin(value: number) {
  const text = celsius(value);
  return `${text.startsWith("-") ? "−" + text.slice(1) : "+" + text} K`;
}

/** Rounding-level residuals read as zero; larger ones keep their exponent. */
function residual(value: number) {
  return Math.abs(value) < 1e-6 ? "≈ 0 (< 1e-6)" : value.toExponential(1);
}

function withoutNegativeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

function celsius(value: number) {
  const text = value.toFixed(1);
  return text === "-0.0" ? "0.0" : text;
}
