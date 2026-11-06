import { defineUI } from "../../ui/index.ts";
import { netLogoColor } from "../../ui/palette/netlogo-color.ts";
import { model, type CrystalParameters } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "width", label: "Metal width" }, { field: "height", label: "Metal height" }, { field: "seed" }, { field: "initMetalTemp", label: "Initial metal temperature" }, { field: "circle" }],
  source: { url: "https://ccl.northwestern.edu/netlogo/models/CrystallizationBasic", label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0" },
  live: (["meltingTemp", "roomTemp", "histogram"] as const).map(field => ({ field, value: s => s.parameters[field], set: (m, v) => m.setRules({ [field]: v } as Partial<CrystalParameters>) })),
  complete: s => s.done,
  monitors: [{ label: "Tick", value: s => s.tick }, { label: "Average metal temperature", value: s => s.averageMetalTemp.toFixed(3) }, { label: "Source frozen count", value: s => s.numFrozen }],
  views: [
    { type: "spatial", label: "Metal atoms", data: s => ({ width: s.width, height: s.height, agents: s.atoms.map(a => ({ ...a, color: netLogoColor(a.color), shape: "triangle" as const, size: 7 })) }) },
    { type: "bar", label: "Temperatures", series: s => s.parameters.histogram ? s.histogram.map(bin => ({ label: `${Math.round(bin.lower)}–${Math.round(bin.upper)}`, color: netLogoColor(bin.color), points: [{ x: bin.index, y: bin.count }] })) : [] },
    { type: "line", label: "Number solidified", series: s => [{ label: "Source frozen count", points: s.history.map(p => ({ x: p.tick, y: p.numFrozen })) }] },
    { type: "line", label: "Average metal temperature", series: s => [{ label: "Average", color: "#e4413b", points: s.history.map(p => ({ x: p.tick, y: p.averageMetalTemp })) }] },
    { type: "inspector", label: "Atom", value: (s, id) => s.atoms.find(a => a.id === id) },
  ],
});
