import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "numRecyclers", label: "Recyclers" }, { field: "numWastefuls", label: "Wastefuls" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-Recycling",
    label: "Original NetLogo model · Felsen and Wilensky · CC BY-NC-SA 3.0",
  },
  live: [
    { field: "maxStoredEnergy", label: "Maximum energy", value: state => state.parameters.maxStoredEnergy, set: (instance, value) => instance.setRules({ maxStoredEnergy: Number(value) }) },
    { field: "recyclingWasteCost", label: "Waste recycling cost", value: state => state.parameters.recyclingWasteCost, set: (instance, value) => instance.setRules({ recyclingWasteCost: Number(value) }) },
    { field: "resourceRegeneration", label: "Resource regeneration", value: state => state.parameters.resourceRegeneration, set: (instance, value) => instance.setRules({ resourceRegeneration: Number(value) }) },
    { field: "agentsSeekResources", label: "Seek resources", value: state => state.parameters.agentsSeekResources, set: (instance, value) => instance.setRules({ agentsSeekResources: Boolean(value) }) },
    { field: "showEnergy", label: "Show energy", value: state => state.parameters.showEnergy, set: (instance, value) => instance.setRules({ showEnergy: Boolean(value) }) },
  ],
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Recyclers", value: state => state.counts.recyclers },
    { label: "Wastefuls", value: state => state.counts.wastefuls },
    { label: "New (%)", value: state => state.landPercentages.new.toFixed(2) },
    { label: "Recycled (%)", value: state => state.landPercentages.recycled.toFixed(2) },
    { label: "Waste (%)", value: state => state.landPercentages.waste.toFixed(2) },
  ],
  views: [
    { type: "inspector", label: "Selected", value: (state, id) => state.people.find(person => person.id === id) ?? state.cells.find(cell => cell.id === id) },
    { type: "spatial", label: "People and resources", data: state => ({
      width: state.width, height: state.height, showLabels: state.parameters.showEnergy,
      cells: state.cells.map(cell => ({ id: cell.id, x: cell.x, y: cell.y, color: cell.resource === "new" ? "#4f8736" : cell.resource === "recycled" ? "#9ec850" : "#d6ae45" })),
      agents: state.people.map(person => ({ ...person, label: String(Math.round(person.energy)), color: person.kind === "recycler" ? "#234f9b" : "#a4212b", size: 9, shape: "circle" as const })),
    }) },
    { type: "line", label: "Populations", series: state => [
      { label: "Recyclers", color: "#234f9b", points: state.history.map(point => ({ x: point.tick, y: point.recyclers })) },
      { label: "Wastefuls", color: "#a4212b", points: state.history.map(point => ({ x: point.tick, y: point.wastefuls })) },
    ] },
    { type: "line", label: "Land types (%)", series: state => [
      { label: "New", color: "#4f8736", points: state.history.map(point => ({ x: point.tick, y: point.new })) },
      { label: "Recycled", color: "#9ec850", points: state.history.map(point => ({ x: point.tick, y: point.recycled })) },
      { label: "Waste", color: "#d6ae45", points: state.history.map(point => ({ x: point.tick, y: point.waste })) },
    ] },
  ],
});
