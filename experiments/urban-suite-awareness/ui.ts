import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "people" }, { field: "centers" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-Awareness",
    label: "Original NetLogo model · Felsen and Wilensky · CC BY-NC-SA 3.0",
  },
  drawing: {
    toggleLabel: "Place centers",
    enabled: () => true,
    intent(instance, intent) {
      if (intent.phase !== "end") instance.placeCenter(intent.position);
    },
  },
  live: [{
    field: "nonUsageLimit", label: "Non-usage limit",
    value: state => state.parameters.nonUsageLimit,
    set: (instance, value) => instance.setRules({ nonUsageLimit: Number(value) }),
  }],
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Unaware", value: state => state.counts.unaware },
    { label: "Aware", value: state => state.counts.aware },
    { label: "Well-informed", value: state => state.counts.wellInformed },
    { label: "Activists", value: state => state.counts.activists },
    { label: "Centers", value: state => state.counts.centers },
    { label: "Mean awareness", value: state => state.meanAwareness?.toFixed(3) ?? "—" },
    { label: "Mean non-usage", value: state => state.meanNonUsage?.toFixed(3) ?? "—" },
  ],
  views: [
    { type: "inspector", label: "Selected", value(state, id) {
      const person = state.people.find(person => person.id === id);
      if (person) return person;
      const cell = state.cells.find(cell => cell.id === id);
      return cell ? { ...cell, center: cell.center ?? "none" } : undefined;
    } },
    { type: "spatial", label: "People and awareness centers", data: state => ({
      width: state.width, height: state.height,
      cells: state.cells.map(cell => ({ id: cell.id, x: cell.x, y: cell.y,
        color: cell.center === "original" ? "#2e7d32" : cell.center === "created" ? "#355fa5" : "#171717" })),
      agents: state.people.map(person => ({ ...person, color: `hsl(120 45% ${85 - person.awareness * 2}%)`, size: 8, shape: "circle" as const })),
    }) },
    { type: "line", label: "Awareness levels", series: state => [
      { label: "Unaware", color: "#777777", points: state.history.map(point => ({ x: point.tick, y: point.unaware })) },
      { label: "Aware", color: "#b4c68a", points: state.history.map(point => ({ x: point.tick, y: point.aware })) },
      { label: "Well-informed", color: "#61a76a", points: state.history.map(point => ({ x: point.tick, y: point.wellInformed })) },
      { label: "Activists", color: "#26733b", points: state.history.map(point => ({ x: point.tick, y: point.activists })) },
    ] },
    { type: "line", label: "Mean awareness", series: state => [{ label: "Awareness", points: state.history.flatMap(point => point.meanAwareness === null ? [] : [{ x: point.tick, y: point.meanAwareness }]) }] },
    { type: "line", label: "Centers", series: state => [{ label: "Centers", color: "#355fa5", points: state.history.map(point => ({ x: point.tick, y: point.centers })) }] },
  ],
});
