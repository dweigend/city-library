import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
const binding = defineUI(model, {
  setup: [
    "seed",
    { field: "initialCopDensity", label: "Initial police (%)" },
    { field: "initialAgentDensity", label: "Initial citizens (%)" },
    { field: "vision", label: "Vision (fields)" },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Rebellion.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    governmentLegitimacy: {
      set: (m, v) => m.setParameters({ governmentLegitimacy: v }),
    },
    maxJailTerm: {
      label: "Maximum jail term",
      set: (m, v) => m.setParameters({ maxJailTerm: v }),
    },
    movement: {
      label: "Citizen movement",
      set: (m, v) => m.setParameters({ movement: v }),
    },
    visualization: {
      label: "Symbols",
      set: (m, v) => m.setParameters({ visualization: v }),
    },
  },
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
      data: citizensAndPoliceData,
    },
    {
      type: "inspector",
      label: "Citizen or police officer",
      value: citizenOrPoliceOfficerInspector,
    },
    {
      type: "line",
      label: "All citizen types",
      series: allCitizenTypesSeries,
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-social-b02:rebellion:859b52417ee69fda8f0f193be666828f9023bef4fce6b84f1d07e09836a53fce";

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };

type UIObservation = Observation<typeof model>;

function citizensAndPoliceData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    agents: s.agents
      .toSorted((a, b) => Number(a.kind === "cop") - Number(b.kind === "cop"))
      .map((a) => ({
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
  };
}

function citizenOrPoliceOfficerInspector(
  s: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
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
}

function allCitizenTypesSeries(s: UIObservation): readonly Series[] {
  return [
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
  ];
}
