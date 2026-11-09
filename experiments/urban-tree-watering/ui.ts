import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  live: { dailyLiters: { label: "Daily water (L)", set: (instance, value) => instance.setDailyLiters(value) } },
  monitors: [{ label: "Day", value: state => state.tick }, { label: "Used today (L)", value: state => state.wateredLiters },
    { label: "Total water (L)", value: state => state.totalWaterLiters }],
  views: [
    { type: "spatial", label: "Trees · red dry / green moist · blue allocated water", data: treesData },
    { type: "line", label: "Mean moisture", xAxis: { unit: "day" }, yAxis: { unit: "L" },
      series: state => [{ label: "Moisture", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.meanMoisture! })) }] },
    { type: "inspector", label: "Tree", value: (state, selected) => {
      const tree = state.trees.find(tree => tree.id === selected || `water:${tree.id}` === selected);
      return tree ? { tree: tree.label, moistureLiters: tree.moistureLiters, receivedLiters: tree.receivedLiters } : undefined;
    } },
  ],
});

type State = Observation<typeof model>;
export function treesData(state: State): SpatialData {
  // Planting rows are a stable display layout; the model has no geographic tree positions.
  const columns = Math.ceil(Math.sqrt(state.trees.length));
  const rows = Math.ceil(state.trees.length / columns);
  const trees = state.trees.map((tree, index) => ({ ...tree,
    x: (index % columns - (columns - 1) / 2) * 2,
    y: ((rows - 1) / 2 - Math.floor(index / columns)) * 2,
  }));
  return {
    width: columns * 2 + 2, height: rows * 2 + 2, showLabels: false,
    agents: trees.flatMap(tree => [
      { id: tree.id, x: tree.x, y: tree.y, size: 10 + 18 * tree.moistureLiters / state.moistureCapacityLiters,
        color: moistureColor(tree.moistureLiters / state.moistureCapacityLiters) },
      ...(tree.receivedLiters > 0 ? [{ id: `water:${tree.id}`, x: tree.x + 0.45, y: tree.y - 0.5,
        size: 7 + Math.min(7, tree.receivedLiters), color: netLogoColor(105), shape: "triangle" as const, heading: 180 }] : []),
    ]),
    segments: trees.map(tree => ({ from: { x: tree.x, y: tree.y - 0.25 }, to: { x: tree.x, y: tree.y - 0.8 }, color: netLogoColor(35), width: 3 })),
  };
}

function moistureColor(fraction: number): string {
  const moistPercent = 100 * Math.max(0, Math.min(1, fraction));
  return `color-mix(in srgb, ${netLogoColor(15)} ${100 - moistPercent}%, ${netLogoColor(55)} ${moistPercent}%)`;
}
