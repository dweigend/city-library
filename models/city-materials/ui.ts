import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData, type SpatialSegment } from "../../ui/index.ts";
import { model } from "./model.ts";

const colors = {
  generated: indexedColor(35), uncollected: indexedColor(25), collected: indexedColor(105),
  reused: indexedColor(65), recycled: indexedColor(85), disposed: indexedColor(15),
};

export const ui = defineUI(model, {
  setup: [
    { field: "initialUncollected", label: "Initial uncollected (kg)" },
    { field: "pulseExtraKg", label: "Festival extra waste (kg/day)" },
    { field: "pulseStartDay", label: "Days before the festival" },
    { field: "pulseDays", label: "Festival length (days)" },
  ],
  change: (instance, changes) => instance.setPolicy(changes),
  live: {
    wasteGeneration: { label: "Normal waste (kg/day)" },
    collectionCapacity: { label: "Collection capacity (kg/day)" },
    reuseFraction: { label: "Reuse share of collected" },
    recyclingFraction: { label: "Recycling share after reuse" },
  },
  monitors: [
    { label: "Day", value: state => state.tick },
    { label: "Festival tomorrow", value: state => state.isPulseTomorrow ? "Yes" : "No" },
    { label: "Uncollected (kg)", value: state => state.uncollected, format: (value: number) => value.toFixed(0) },
    { label: "Peak backlog (kg)", value: state => state.peakBacklog, format: (value: number) => value.toFixed(0) },
    { label: "Streets clear again on day", value: state => state.clearedDay ?? "Not yet" },
    { label: "Balance error (kg)", value: state => state.balanceError, format: (value: number) => Math.abs(value) < 1e-6 ? "≈ 0 (< 1e-6)" : value.toExponential(1) },
  ],
  views: [
    { type: "spatial", label: "Material flows on the last completed day (kg/day) · line width ∝ flow · the bin shows the uncollected stock (kg); a triangle on the rim means the stock exceeds the bin scale", data: flowScene },
    { type: "line", label: "Uncollected waste · stock", xAxis: { label: "Day" }, yAxis: { unit: "kg" },
      series: state => [{ label: "Uncollected", color: colors.uncollected, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.uncollected! })) }] },
    { type: "line", label: "Daily flows · per completed day (coincident generated/collected lines mean all new waste was collected)", xAxis: { label: "Day" }, yAxis: { unit: "kg/day" },
      series: state => [
        dailySeries(state, "Generated", colors.generated, sample => sample.generated!),
        dailySeries(state, "Collected", colors.collected, sample => sample.collected!),
        dailySeries(state, "Reused or recycled", colors.recycled, sample => sample.reused! + sample.recycled!),
        dailySeries(state, "Disposed", colors.disposed, sample => sample.disposed!),
      ] },
    { type: "bar", label: "Where collected waste went · since setup", xAxis: { label: "Destination" }, yAxis: { unit: "kg" },
      series: state => [{ label: "Total", color: colors.collected, points: [
        { x: "Reused", y: state.totals.reused }, { x: "Recycled", y: state.totals.recycled }, { x: "Disposed", y: state.totals.disposed },
      ] }] },
  ],
});

type State = Observation<typeof model>;
const wholeKilograms = new Intl.NumberFormat("en", { maximumFractionDigits: 0 });
type Point = { x: number; y: number };
const nodes: Record<string, Point> = {
  generated: { x: -3.8, y: 0.3 }, bin: { x: -1.6, y: 0.1 }, collected: { x: 0.8, y: 0.3 },
  reused: { x: 3.6, y: 1.4 }, recycled: { x: 3.6, y: 0.3 }, disposed: { x: 3.6, y: -0.8 },
};

function flowScene(state: State): SpatialData {
  const flows = state.flows;
  const flowScale = Math.max(1, state.parameters.collectionCapacity, state.parameters.wasteGeneration + state.parameters.pulseExtraKg);
  const width = (kg: number) => kg <= 1e-9 ? 0 : 1 + 7 * Math.min(1, kg / flowScale);
  // The bin's scale holds a whole festival's surplus or five normal days, so fills stay comparable within a run.
  const binScaleKg = Math.max(500, state.parameters.pulseExtraKg * state.parameters.pulseDays, 5 * state.parameters.wasteGeneration);
  const fill = Math.min(1, state.uncollected / binScaleKg);
  const overScale = state.uncollected > binScaleKg;
  const bin = nodes.bin!;
  const binHeight = 2.2;
  const segments: SpatialSegment[] = [
    { from: { x: nodes.generated!.x + 0.6, y: nodes.generated!.y }, to: { x: bin.x - 0.55, y: nodes.generated!.y }, color: colors.generated, width: width(flows.generated) },
    { from: { x: bin.x + 0.55, y: nodes.collected!.y }, to: { x: nodes.collected!.x - 0.7, y: nodes.collected!.y }, color: colors.collected, width: width(flows.collected) },
    ...(["reused", "recycled", "disposed"] as const).map(key => ({
      from: { x: nodes.collected!.x + 0.7, y: nodes.collected!.y }, to: { x: nodes[key]!.x - 1.0, y: nodes[key]!.y },
      color: colors[key], width: width(flows[key]),
    })),
  ];
  const box = (id: string, color: string): SpatialAgent => ({
    id, ...nodes[id]!, shape: "rectangle", extent: { width: 1.2, height: 0.6 }, filled: false, stroke: color, strokeWidth: 2, selectable: false,
  });
  const agents: SpatialAgent[] = [
    box("generated", colors.generated),
    { id: "collected", ...nodes.collected!, shape: "rectangle", extent: { width: 1.4, height: 0.6 }, filled: false, stroke: colors.collected, strokeWidth: 2, selectable: false },
    { id: "reused", ...nodes.reused!, shape: "rectangle", extent: { width: 2.0, height: 0.5 }, filled: false, stroke: colors.reused, strokeWidth: 2, selectable: false },
    { id: "recycled", ...nodes.recycled!, shape: "rectangle", extent: { width: 2.0, height: 0.5 }, filled: false, stroke: colors.recycled, strokeWidth: 2, selectable: false },
    { id: "disposed", ...nodes.disposed!, shape: "rectangle", extent: { width: 2.0, height: 0.5 }, filled: false, stroke: colors.disposed, strokeWidth: 2, selectable: false },
    { id: "bin", ...bin, shape: "rectangle", extent: { width: 1.1, height: binHeight }, filled: false, stroke: scientificPalette.neutral, strokeWidth: 2, selectable: false },
  ];
  // Above the bin's scale the fill stops at full; an arrow on the rim marks the overflow.
  if (overScale) agents.push({ id: "bin:over-scale", x: bin.x, y: bin.y + binHeight / 2 + 0.02, size: 14, shape: "triangle",
    color: colors.uncollected, stroke: scientificPalette.neutral, strokeWidth: 1.5, selectable: false });
  if (fill > 0) agents.unshift({ id: "bin:stock", x: bin.x, y: bin.y - binHeight / 2 + binHeight * fill / 2, shape: "rectangle",
    extent: { width: 1.0, height: binHeight * fill }, color: colors.uncollected, selectable: false });
  const kg = (value: number) => wholeKilograms.format(value);
  const labels = [
    // Names above each box, the day's amount inside, so narrow screens keep text within its box.
    { x: nodes.generated!.x, y: nodes.generated!.y + 0.55, text: "Waste" },
    { x: nodes.generated!.x, y: nodes.generated!.y, text: kg(flows.generated) },
    { x: bin.x, y: bin.y + binHeight / 2 + 0.3, text: `Uncollected ${kg(state.uncollected)} kg` },
    { x: bin.x, y: bin.y - binHeight / 2 - 0.3, text: overScale ? `> scale ${kg(binScaleKg)} kg` : `scale ${kg(binScaleKg)} kg` },
    { x: nodes.collected!.x, y: nodes.collected!.y + 0.6, text: "Collected" },
    { x: nodes.collected!.x, y: nodes.collected!.y - 0.65, text: `capacity ${kg(state.parameters.collectionCapacity)}` },
    { x: nodes.collected!.x, y: nodes.collected!.y, text: kg(flows.collected) },
    ...(["reused", "recycled", "disposed"] as const).flatMap(key => [
      { x: nodes[key]!.x, y: nodes[key]!.y + 0.5, text: key[0]!.toUpperCase() + key.slice(1) },
      { x: nodes[key]!.x, y: nodes[key]!.y, text: kg(flows[key]) },
    ]),
  ];
  return {
    width: 9.6, height: 4.6, agents, segments, labels,
    description: `Day ${state.tick}: generated ${kg(flows.generated)} kilograms, collected ${kg(flows.collected)} of ${kg(state.parameters.collectionCapacity)} capacity, reused ${kg(flows.reused)}, recycled ${kg(flows.recycled)}, disposed ${kg(flows.disposed)}. Uncollected stock ${kg(state.uncollected)} kilograms.`,
  };
}

type Values = Readonly<Record<string, number | undefined>>;
function dailySeries(state: State, label: string, color: string, value: (values: Values) => number) {
  return { label, color, points: state.history.filter(sample => sample.tick > 0).map(sample => ({ x: sample.tick, y: value(sample.values) })) };
}
