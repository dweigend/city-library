import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Center temperature", value: state => state.centerTemperature, format: (value: number) => value.toFixed(2) },
    { label: "Temperature sum", value: state => state.totalTemperature, format: (value: number) => value.toFixed(2) },
  ],
  views: [
    { type: "spatial", label: "Field temperatures · blue 20 → red 24 or more", data: temperatureMap },
  ],
});

/** An annotated heat map: each field is one cell, colored and labelled by temperature. */
function temperatureMap(state: Observation<typeof model>): SpatialData {
  return {
    width: gridSize,
    height: gridSize,
    cells: state.fields.map(field => ({ id: field.id, x: field.x, y: field.y, color: temperatureColor(field.temperature) })),
    labels: state.fields.map(field => ({ x: field.x, y: field.y, text: field.temperature.toFixed(2) })),
    agents: [],
    description: `Three by three fields. Center temperature ${state.centerTemperature.toFixed(2)}, sum ${state.totalTemperature.toFixed(2)}.`,
  };
}

function temperatureColor(temperature: number): string {
  const hotPercent = 100 * Math.max(0, Math.min(1, (temperature - coolestTemperature) / (hottestTemperature - coolestTemperature)));
  return `color-mix(in oklab, ${coolColor} ${100 - hotPercent}%, ${hotColor} ${hotPercent}%)`;
}

// A fixed scale keeps colors comparable across ticks. Fields settle between 20 and about
// 22 within a few ticks, so the hot end sits at 24 (the 28-degree start clamps to it).
const gridSize = 3;
const coolestTemperature = 20;
const hottestTemperature = 24;
const coolColor = indexedColor(105);
const hotColor = indexedColor(15);
