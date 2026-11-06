import { defineUI } from "../../ui/index.ts";
import { model, type DLAParameters } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "width" }, { field: "height" }, { field: "seed" }],
  source: { url: "https://ccl.northwestern.edu/netlogo/models/DLA", label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0" },
  live: (["maxParticles", "wiggleAngle", "useWholeWorld"] as const).map(field => ({ field, value: s => s.parameters[field], set: (m, v) => m.setRules({ [field]: v } as Partial<DLAParameters>) })),
  complete: s => s.done,
  monitors: [{ label: "Tick", value: s => s.tick }, { label: "Radius", value: s => s.radius.toFixed(3) }, { label: "Walkers", value: s => s.agents.length }],
  views: [{ type: "spatial", label: "Aggregate and walkers", data: s => ({ width: s.width, height: s.height, cells: s.cells.map(c => ({ ...c, color: c.occupied ? "#59b03c" : "#000000" })), agents: s.agents.map(a => ({ ...a, color: "#e4413b", size: 3, shape: "circle" as const })) }) }, { type: "inspector", label: "Walker", value: (s, id) => s.agents.find(a => a.id === id) }],
});
