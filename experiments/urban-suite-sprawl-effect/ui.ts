import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "smoothness", label: "Setup smoothing passes" }, { field: "population", label: "Setup population" }],
  source: { url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-SprawlEffect", label: "Original NetLogo model · Felsen and Wilensky · CC BY-NC-SA 3.0" },
  live: [
    { field: "maxAttraction", label: "Maximum attraction", value: state => state.parameters.maxAttraction, set: (instance, value) => instance.setRules({ maxAttraction: Number(value) }) },
    { field: "seekerSearchAngle", label: "Search angle", value: state => state.parameters.seekerSearchAngle, set: (instance, value) => instance.setRules({ seekerSearchAngle: Number(value) }) },
    { field: "seekerPatience", label: "Seeker patience", value: state => state.parameters.seekerPatience, set: (instance, value) => instance.setRules({ seekerPatience: Number(value) }) },
    { field: "waitBetweenSeeking", label: "House waiting time", value: state => state.parameters.waitBetweenSeeking, set: (instance, value) => instance.setRules({ waitBetweenSeeking: Number(value) }) },
  ],
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Seekers", value: state => state.counts.seekers },
    { label: "Houses", value: state => state.counts.houses },
    { label: "Build threshold", value: state => state.buildThreshold },
    { label: "Total attraction", value: state => state.totalAttraction.toPrecision(6) },
  ],
  views: [
    { type: "inspector", label: "Selected", value: (state, id) => state.agents.find(agent => agent.id === id) ?? state.cells.find(cell => cell.id === id) },
    { type: "spatial", label: "Seekers, houses and attraction", data: state => ({ width: state.width, height: state.height,
      cells: state.cells.map(cell => ({ id: cell.id, x: cell.x, y: cell.y, color: netLogoColor(cell.colorNumber) })),
      agents: state.agents.map(agent => ({ ...agent, color: agent.kind === "house" ? "#ffffff" : "#d73229", size: 7, shape: agent.kind === "house" ? "circle" as const : "triangle" as const })),
    }) },
    { type: "line", label: "Residents", series: state => [
      { label: "Seekers", color: "#d73229", points: state.history.map(point => ({ x: point.tick, y: point.seekers })) },
      { label: "Houses", points: state.history.map(point => ({ x: point.tick, y: point.houses })) },
    ] },
  ],
});
