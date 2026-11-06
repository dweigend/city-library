import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "initialFirms", label: "Initial firms" }, { field: "distribute", label: "Distribute firms" }],
  source: { url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-PathDependence", label: "Original NetLogo model · Rand and Wilensky · CC BY-NC-SA 3.0" },
  actions: [{ label: "Disturb", run: instance => instance.disturb() }],
  live: [
    { field: "regionSize", label: "Region radius", value: state => state.parameters.regionSize, set: (instance, value) => instance.setRules({ regionSize: Number(value) }) },
    { field: "increasingReturns", label: "Increasing returns", value: state => state.parameters.increasingReturns, set: (instance, value) => instance.setRules({ increasingReturns: Number(value) }) },
    { field: "attempts", label: "Search attempts", value: state => state.parameters.attempts, set: (instance, value) => instance.setRules({ attempts: Number(value) }) },
    { field: "birth", label: "Birth", value: state => state.parameters.birth, set: (instance, value) => instance.setRules({ birth: Boolean(value) }) },
  ],
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Firms", value: state => state.counts.firms },
    { label: "Settled", value: state => state.counts.settled },
    { label: "Searching", value: state => state.counts.searching },
    { label: "Largest regional population", value: state => state.largestPopulation },
    { label: "Maximum cell occupancy", value: state => state.maximumOccupants },
    { label: "Setup warning", value: state => state.warnings.join(" ") || "—" },
  ],
  views: [
    { type: "inspector", label: "Selected", value: (state, id) => state.firms.find(firm => firm.id === id) ?? state.cells.find(cell => cell.id === id) },
    { type: "spatial", label: "Firms and field quality", data: state => ({ width: state.width, height: state.height,
      cells: state.cells.map(cell => ({ id: cell.id, x: cell.x, y: cell.y, color: netLogoColor(cell.quality * 10 + 50) })),
      // Fixed symbols and numeric inspection replace the source's relative-size glyphs.
      agents: state.firms.map(firm => ({ ...firm, color: "#d73229", size: 8, shape: "circle" as const })),
    }) },
    { type: "bar", label: "Residents · occupied fields by occupant count", series: state => [
      { label: "Occupied fields", points: state.histogram.counts.map((count, index) => ({ x: (state.histogram.edges[index]! + state.histogram.edges[index + 1]!) / 2, y: count })) },
    ] },
  ],
});
