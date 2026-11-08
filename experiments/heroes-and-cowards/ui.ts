import { defineUI } from "../../ui/index.ts";
import { model, presets } from "./model.ts";
const binding = defineUI(model, {
  complete: (s) => Boolean(s.diagnostic),
  setup: ["seed", "number", "personalities"],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/IABM%20Textbook/chapter%202/Heroes%20and%20Cowards.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: presets.map((p) => ({
    label: p.label,
    run: (m) => m.preset(p.seed),
  })),
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "People", value: (s) => s.agents.length },
    { label: "Movement", value: (s) => s.diagnostic ?? "Active" },
  ],
  views: [
    {
      type: "spatial",
      label: "Friends and enemies",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: s.agents.map((a) => ({
          ...a,
          size: 7,
          shape: "triangle" as const,
          color: a.personality === "brave" ? "#3675db" : "#d83838",
        })),
      }),
    },
    {
      type: "inspector",
      label: "Selected person",
      value: (s, id) => s.agents.find((a) => a.id === id),
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-social-b02:heroes-and-cowards:dc605f80d321c18a7e6711f85f1c5e58ea2e4780451369b94977a49a7d87c280";

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };
