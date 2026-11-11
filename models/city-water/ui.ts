import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData, type SpatialSegment } from "../../ui/index.ts";
import { model } from "./model.ts";

const colors = {
  water: indexedColor(95),
  supply: indexedColor(105),
  conserved: indexedColor(65),
  shortage: indexedColor(15),
  spill: indexedColor(85),
  wastewater: indexedColor(35),
  treated: indexedColor(55),
  untreated: indexedColor(25),
  trigger: scientificPalette.waiting,
  outline: scientificPalette.neutral,
};

export const ui = defineUI(model, {
  setup: [
    { field: "reservoirCapacityM3", label: "Reservoir capacity (m³)" },
    { field: "initialStoredM3", label: "Initial storage (m³)" },
    { field: "dryInflowM3PerDay", label: "Dry-spell inflow (m³/day)" },
    { field: "drySpellStartDay", label: "Dry spell starts after (days)" },
    { field: "drySpellDays", label: "Dry spell length (days)" },
    { field: "demandM3PerDay", label: "Demand (m³/day)" },
  ],
  live: {
    conservationTrigger: { label: "Save when storage is below (fraction)", set: (instance, value) => instance.setConservationRule({ conservationTrigger: value }) },
    conservationShare: { label: "Demand cut while saving (share)", set: (instance, value) => instance.setConservationRule({ conservationShare: value }) },
    inflowM3PerDay: { label: "Normal inflow (m³/day)", set: (instance, value) => instance.setInflow(value) },
    treatmentCapacityM3PerDay: { label: "Treatment (m³/day)", set: (instance, value) => instance.setTreatmentCapacity(value) },
  },
  monitors: [
    { label: "Day", value: state => state.tick },
    { label: "Reservoir (m³)", value: state => state.storedM3, format: volume },
    { label: "Savings rule tomorrow", value: state => state.parameters.conservationShare === 0 ? "Off (cut 0)" : state.isSavingTomorrow ? "Cutting demand" : "Not triggered" },
    { label: "Shortage total (m³)", value: state => state.totalShortageM3, format: volume },
    { label: "Worst day cut (%)", value: state => state.worstDayCutShare * 100, format: (value: number) => value.toFixed(0) },
    { label: "Days with a demand cut", value: state => state.conservationDayCount },
    { label: "Balance residual (m³)", value: state => state.balanceErrorM3, format: residual },
  ],
  views: [
    { type: "spatial", label: "Water path on the last completed day (m³/day) · line width ∝ volume · amber line: savings trigger (only while a cut is set)", data: waterScene },
    { type: "line", label: "Reservoir storage and savings trigger (trigger shown while a cut is set)", xAxis: { label: "Day" }, yAxis: { unit: "m³" },
      series: state => [
        { label: "Stored", color: colors.water, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.storedM3! })) },
        ...(state.parameters.conservationShare > 0 ? [{ label: "Savings trigger", color: colors.trigger,
          points: state.history.map(sample => ({ x: sample.tick, y: state.parameters.conservationTrigger * state.parameters.reservoirCapacityM3 })) }] : []),
      ] },
    { type: "line", label: "Daily demand and who carries the deficit · per completed day", xAxis: { label: "Day" }, yAxis: { unit: "m³/day" },
      series: state => [
        dailySeries(state, "Supplied", colors.supply, "suppliedM3"),
        dailySeries(state, "Saved by request", colors.conserved, "conservedM3"),
        dailySeries(state, "Shortage", colors.shortage, "shortageM3"),
        dailySeries(state, "Inflow", colors.water, "inflowM3"),
      ] },
  ],
});

type State = Observation<typeof model>;
type Point = { x: number; y: number };
const reservoir = { x: -2.4, y: 0, width: 1.6, height: 3 };
const city: Point = { x: 0.9, y: -0.5 };
const plant: Point = { x: 3.3, y: -0.5 };

function waterScene(state: State): SpatialData {
  const scale = Math.max(1, state.parameters.demandM3PerDay, state.parameters.inflowM3PerDay);
  const width = (volumeM3: number) => volumeM3 <= 1e-9 ? 0 : 1 + 7 * Math.min(1, volumeM3 / scale);
  const reservoirBottom = reservoir.y - reservoir.height / 2;
  const fill = Math.min(1, state.storageFraction);
  const triggerY = reservoirBottom + reservoir.height * state.parameters.conservationTrigger;
  const segments: SpatialSegment[] = [
    { from: { x: -4.7, y: 1.1 }, to: { x: reservoir.x - 0.8, y: 1.1 }, color: colors.water, width: width(state.inflowM3) },
    { from: { x: reservoir.x + 0.8, y: 1.3 }, to: { x: -0.4, y: 1.9 }, color: colors.spill, width: width(state.spillM3) },
    { from: { x: reservoir.x + 0.8, y: city.y }, to: { x: city.x - 0.7, y: city.y }, color: colors.supply, width: width(state.suppliedM3) },
    { from: { x: city.x + 0.7, y: city.y }, to: { x: plant.x - 0.6, y: plant.y }, color: colors.wastewater, width: width(state.wastewaterM3) },
    { from: { x: plant.x, y: plant.y - 0.4 }, to: { x: plant.x, y: -1.9 }, color: colors.treated, width: width(state.treatedM3) },
    // The untreated outlet rises on the right; treated water has its own downward lane.
    { from: { x: plant.x + 0.6, y: plant.y }, to: { x: 4.6, y: plant.y }, color: colors.untreated, width: width(state.untreatedM3) },
    { from: { x: 4.6, y: plant.y }, to: { x: 4.6, y: 1.1 }, color: colors.untreated, width: width(state.untreatedM3) },
    { from: { x: 4.6, y: 1.1 }, to: { x: plant.x, y: 1.1 }, color: colors.untreated, width: width(state.untreatedM3) },
  ];
  if (state.parameters.conservationShare > 0) segments.push({ from: { x: reservoir.x - 0.8, y: triggerY }, to: { x: reservoir.x + 0.8, y: triggerY }, color: colors.trigger, width: 2 });
  const agents: SpatialAgent[] = [
    { id: "reservoir", x: reservoir.x, y: reservoir.y, shape: "rectangle", extent: { width: reservoir.width, height: reservoir.height },
      filled: false, stroke: colors.outline, strokeWidth: 2, selectable: false },
    { id: "city", ...city, shape: "rectangle", extent: { width: 1.4, height: 0.8 }, filled: false, stroke: colors.outline, strokeWidth: 2, selectable: false },
    { id: "plant", ...plant, shape: "rectangle", extent: { width: 1.2, height: 0.8 }, filled: false, stroke: colors.outline, strokeWidth: 2, selectable: false },
  ];
  if (fill > 0) agents.unshift({ id: "reservoir:water", x: reservoir.x, y: reservoirBottom + reservoir.height * fill / 2, selectable: false,
    shape: "rectangle", extent: { width: reservoir.width - 0.1, height: reservoir.height * fill }, color: colors.water });
  const m3 = (value: number) => value.toFixed(0);
  const labels = [
    { x: -3.2, y: 2.2, text: `Inflow ${m3(state.inflowM3)}${state.wasDrySpellDay ? " · dry" : ""}` },
    { x: reservoir.x, y: reservoirBottom - 0.3, text: `Reservoir ${m3(state.storedM3)} m³` },
    { x: -0.3, y: 2.2, text: `Spill ${m3(state.spillM3)}` },
    { x: city.x - 0.35, y: city.y + 0.6, text: `City ${m3(state.suppliedM3)}/${m3(state.demandM3)}` },
    { x: city.x, y: city.y - 0.7, text: `Saved ${m3(state.conservedM3)} · short ${m3(state.shortageM3)}` },
    { x: plant.x - 0.2, y: plant.y + 0.8, text: `Sewage ${m3(state.wastewaterM3)}` },
    { x: plant.x, y: -2.15, text: `Treated ${m3(state.treatedM3)}` },
    { x: plant.x, y: 1.55, text: `Untreated ${m3(state.untreatedM3)}` },
  ];
  return {
    width: 10, height: 5, agents, segments, labels,
    description: `Day ${state.tick}: reservoir ${m3(state.storedM3)} of ${m3(state.parameters.reservoirCapacityM3)} cubic meters. Inflow ${m3(state.inflowM3)}, supplied ${m3(state.suppliedM3)} of ${m3(state.demandM3)} demanded, saved ${m3(state.conservedM3)}, shortage ${m3(state.shortageM3)}, treated ${m3(state.treatedM3)}, untreated ${m3(state.untreatedM3)}, spill ${m3(state.spillM3)}.`,
  };
}

function volume(value: number) { return value.toFixed(1); }

/** Rounding-level residuals read as zero; larger ones keep their exponent. */
function residual(value: number) { return Math.abs(value) < 1e-6 ? "≈ 0 (< 1e-6)" : value.toExponential(1); }

function dailySeries(state: State, label: string, color: string, key: "suppliedM3" | "conservedM3" | "shortageM3" | "inflowM3") {
  return { label, color, points: state.history.filter(sample => sample.tick > 0).map(sample => ({ x: sample.tick, y: sample.values[key]! })) };
}
