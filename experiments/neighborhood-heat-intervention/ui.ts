import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  live: { shadeCooling: { set: (instance, value) => instance.setShadeCooling(value) } },
  monitors: [{ label: "Tick", value: state => state.tick }, { label: "Mean heat index", value: state => state.meanHeat, format: (value: number) => value.toFixed(2) }],
  views: [
    { type: "spatial", label: "Neighborhood heat · blue 0 → red 30 · green hatching = shade", data: heatMap },
    { type: "inspector", label: "Selected field", value: (state, selected) => {
      const field = state.fields.find(field => field.id === selected);
      return field ? { field: field.field, shaded: field.shaded, heatIndex: field.heatIndex.toFixed(2) } : undefined;
    } },
    { type: "line", label: "Mean heat index", yAxis: { label: "Index units" },
      series: state => [{ label: "Mean heat", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.meanHeat! })) }] },
  ],
});

export function heatMap(state: Observation<typeof model>): SpatialData {
  return {
    width: state.width,
    height: state.height,
    cells: state.fields.map(field => ({ id: field.id, x: field.x, y: field.y,
      color: heatColor(field.heatIndex) })),
    // Hatching depicts the existing shade property; it is neither a resident nor new domain geometry.
    segments: state.fields.filter(field => field.shaded).flatMap(field => [-hatchOffset, hatchOffset].map(offset => ({
      from: { x: field.x - hatchExtent + offset, y: field.y - hatchExtent },
      to: { x: field.x + hatchExtent + offset, y: field.y + hatchExtent },
      color: shadeColor, width: hatchWidth,
    }))),
    agents: [],
  };
}

export function heatColor(heatIndex: number): string {
  const hotPercent = 100 * Math.max(0, Math.min(1, heatIndex / maximumHeatIndex));
  return `color-mix(in srgb, ${coolColor} ${100 - hotPercent}%, ${hotColor} ${hotPercent}%)`;
}

// View geometry in field-coordinate units; palette endpoints remain fixed across ticks.
const hatchOffset = 0.16;
const hatchExtent = 0.2;
const hatchWidth = 1.6;
const shadeColor = netLogoColor(65);
const maximumHeatIndex = 30;
const coolColor = netLogoColor(105);
const hotColor = netLogoColor(15);
