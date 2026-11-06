import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "initialCopDensity", label: "Initial police (%)" },
    { field: "initialAgentDensity", label: "Initial citizens (%)" },
    { field: "vision", label: "Vision (patches)" },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Rebellion.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "governmentLegitimacy",
      label: "Government legitimacy",
      value: (s) => s.parameters.governmentLegitimacy,
      set: (m, v) => m.setParameters({ governmentLegitimacy: Number(v) }),
    },
    {
      field: "maxJailTerm",
      label: "Maximum jail term",
      value: (s) => s.parameters.maxJailTerm,
      set: (m, v) => m.setParameters({ maxJailTerm: Number(v) }),
    },
    {
      field: "movement",
      label: "Citizen movement",
      value: (s) => s.parameters.movement,
      set: (m, v) => m.setParameters({ movement: Boolean(v) }),
    },
    {
      field: "visualization",
      label: "Symbols",
      value: (s) => s.parameters.visualization,
      set: (m, v) =>
        m.setParameters({ visualization: String(v) as "2D" | "3D" }),
    },
  ],
  actions: [{ label: "Watch one", run: (m) => m.watchOne() }],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Police", value: (s) => s.copCount },
    { label: "Citizens", value: (s) => s.agentCount },
    { label: "Quiet", value: (s) => s.quietCount },
    { label: "Active", value: (s) => s.activeCount },
    { label: "Jailed", value: (s) => s.jailedCount },
    {
      label: "Watched citizen",
      value: (s) => s.agents.find((a) => a.id === s.watchedId)?.who ?? "—",
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Citizens and police",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: s.agents.toSorted((a, b) => Number(a.kind === "cop") - Number(b.kind === "cop")).map((a) => ({
          id: a.id,
          label: String(a.who),
          x: a.x - 19.5,
          y: a.y - 19.5,
          color:
            a.kind === "cop"
              ? "#27a9c2"
              : a.active
                ? "#d94141"
                : a.jailTerm > 0
                  ? "#696969"
                  : `hsl(120 50% ${30 + 35 * (1 - a.grievance)}%)`,
          shape: a.kind === "cop" ? ("triangle" as const) : ("circle" as const),
          size: s.parameters.visualization === "3D" ? 10 : 7,
        })),
      }),
    },
    {
      type: "inspector",
      label: "Citizen or police officer",
      value: (s, id) => {
        const a = s.agents.find((a) => a.id === (id ?? s.watchedId));
        return a
          ? {
              who: a.who,
              kind: a.kind,
              hardship: a.hardship,
              riskAversion: a.riskAversion,
              grievance: a.grievance,
              active: a.active,
              jailTerm: a.jailTerm,
            }
          : undefined;
      },
    },
    {
      type: "line",
      label: "All citizen types",
      series: (s) => [
        {
          label: "Quiet",
          color: "#40914b",
          points: s.history.map((p) => ({ x: p.tick, y: p.quietCount })),
        },
        {
          label: "Jailed",
          color: "#797979",
          points: s.history.map((p) => ({ x: p.tick, y: p.jailedCount })),
        },
        {
          label: "Active",
          color: "#d94141",
          points: s.history.map((p) => ({ x: p.tick, y: p.activeCount })),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-social-b02:rebellion:859b52417ee69fda8f0f193be666828f9023bef4fce6b84f1d07e09836a53fce";

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };
