import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData, type SpatialSegment } from "../../ui/index.ts";
import { model } from "./model.ts";

const westColor = indexedColor(65);
const eastColor = indexedColor(105);
const linkColor = indexedColor(5);
const removedColor = scientificPalette.unavailable;
// Links weaker than this dispersal kernel value are not drawn.
const visibleLinkWeight = 0.05;

export const ui = defineUI(model, {
  setup: [
    { field: "initialOccupancy", label: "Initial occupancy (share)" },
    { field: "dispersalRate", label: "Dispersal rate (per year)" },
    { field: "extinctionRate", label: "Extinction rate (per year)" },
  ],
  live: {
    restorationPlan: { label: "Extra hectare of habitat", set: (instance, value) => instance.setRestorationPlan(value) },
    permeability: { label: "City permeability between patches", set: (instance, value) => instance.setPermeability(value) },
    vegetationQuality: { label: "Habitat quality", set: (instance, value) => instance.setVegetationQuality(value) },
  },
  actions: [
    { label: "Remove or restore the bridge patch", run: instance => {
      const bridge = instance.read().patches.find(patch => patch.id === "bridge")!;
      instance.setPatchHabitat("bridge", !bridge.isHabitat);
    }, pressed: state => !state.patches.find(patch => patch.id === "bridge")!.isHabitat },
    { label: "Remove or restore selected patch", enabled: (state, selected) => state.patches.some(patch => patch.id === selected && patch.id !== "stepping-stone"),
      run: (instance, selected) => {
        const patch = instance.read().patches.find(candidate => candidate.id === selected);
        if (patch) instance.setPatchHabitat(patch.id, !patch.isHabitat);
      } },
  ],
  monitors: [
    { label: "Year", value: state => state.tick },
    { label: "Mean occupancy", value: state => state.meanOccupancy, format: (value: number) => value.toFixed(3) },
    { label: "East occupancy", value: state => state.eastOccupancy, format: (value: number) => value.toFixed(3) },
    { label: "Occupied area (ha, expected)", value: state => state.occupiedAreaHa, format: (value: number) => value.toFixed(2) },
  ],
  views: [
    { type: "spatial", label: "Habitat patches on a km map · size = area, fill shade = expected occupancy (pale = likely occupied, value below) · outline: green West, blue East region · gray lines = dispersal links, wider = stronger", data: habitatScene },
    { type: "line", label: "Expected occupancy by region", xAxis: { label: "Year" }, yAxis: { label: "Occupied share", unit: "0–1" },
      series: state => [
        { label: "West", color: westColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.westOccupancy! })) },
        { label: "East", color: eastColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.eastOccupancy! })) },
        { label: "All patches", color: indexedColor(5), points: state.history.map(sample => ({ x: sample.tick, y: sample.values.meanOccupancy! })) },
      ] },
    { type: "bar", label: "Occupancy by patch", xAxis: { label: "Patch" }, yAxis: { unit: "0–1" },
      series: state => [{ label: "Expected occupancy", color: westColor, points: state.patches.map(patch => ({ x: patch.label, y: patch.isHabitat ? patch.occupancy : 0 })) }] },
    { type: "inspector", label: "Selected patch", value: (state, selected) => {
      const patch = state.patches.find(candidate => candidate.id === selected);
      return patch ? {
        patch: patch.label, "Area (ha)": patch.areaHa, habitat: patch.isHabitat ? "Yes" : "Removed",
        occupancy: patch.occupancy.toFixed(3), connectivity: patch.connectivity.toFixed(3),
        "Gain last year": patch.colonizationGain.toFixed(3), "Loss last year": patch.extinctionLoss.toFixed(3),
      } : undefined;
    } },
  ],
});

type State = Observation<typeof model>;

function occupancyColor(occupancy: number) {
  return indexedColor(51 + 7 * Math.min(1, Math.max(0, occupancy)));
}

function habitatScene(state: State): SpatialData {
  const habitats = state.patches.filter(patch => patch.isHabitat);
  const segments: SpatialSegment[] = [];
  const permeability = state.parameters.permeability;
  for (const [index, first] of habitats.entries()) {
    for (const second of habitats.slice(index + 1)) {
      const weight = permeability === 0 ? 0 : Math.exp(-Math.hypot(first.xKm - second.xKm, first.yKm - second.yKm) / permeability);
      if (weight >= visibleLinkWeight) segments.push({ from: { x: first.xKm, y: first.yKm }, to: { x: second.xKm, y: second.yKm },
        color: linkColor, width: 0.5 + 4 * weight });
    }
  }
  const agents: SpatialAgent[] = state.patches.map(patch => ({
    id: patch.id, x: patch.xKm, y: patch.yKm, size: 10 + 6 * Math.sqrt(patch.areaHa),
    color: patch.isHabitat ? occupancyColor(patch.occupancy) : removedColor, filled: patch.isHabitat,
    stroke: patch.isHabitat ? (patch.isEast ? eastColor : westColor) : removedColor, strokeWidth: 2,
  }));
  // Values below each patch; names stay in the bar chart and inspector to keep the map readable on phones.
  const labels = [
    { x: -3, y: 1.7, text: "West" },
    { x: 2.6, y: 1.7, text: "East" },
    ...state.patches.map(patch => ({ x: patch.xKm, y: patch.yKm - 0.5 - 0.06 * Math.sqrt(patch.areaHa),
      text: patch.isHabitat ? patch.occupancy.toFixed(2) : "removed" })),
  ];
  return {
    width: 8.6, height: 3.8, agents, segments, labels,
    description: `Year ${state.tick}: ${habitats.length} habitat patches, mean expected occupancy ${state.meanOccupancy.toFixed(2)}, east ${state.eastOccupancy.toFixed(2)}. Permeability ${permeability}. ${state.patches.filter(patch => !patch.isHabitat).map(patch => patch.label).join(", ") || "No patch"} removed.`,
  };
}
