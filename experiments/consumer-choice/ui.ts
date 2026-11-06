import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "numConsumers", label: "Consumers" },
    { field: "avgConnections", label: "Average connections" },
    { field: "initialOrangePercent", label: "Initial orange (%)" },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Consumer%20Choice.nlogox",
    label: "Original NetLogo model · Jager & Wang · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "normInfluence",
      label: "Norm influence",
      value: (s) => s.parameters.normInfluence,
      set: (m, v) => m.setParameters({ normInfluence: Number(v) }),
    },
    {
      field: "informationExchange",
      label: "Information exchange",
      value: (s) => s.parameters.informationExchange,
      set: (m, v) => m.setParameters({ informationExchange: Number(v) }),
    },
    {
      field: "exploration",
      label: "Exploration",
      value: (s) => s.parameters.exploration,
      set: (m, v) => m.setParameters({ exploration: Number(v) }),
    },
    {
      field: "qualityOrange",
      label: "Orange quality",
      value: (s) => s.parameters.qualityOrange,
      set: (m, v) => m.setParameters({ qualityOrange: Number(v) }),
    },
    {
      field: "qualityBlue",
      label: "Blue quality",
      value: (s) => s.parameters.qualityBlue,
      set: (m, v) => m.setParameters({ qualityBlue: Number(v) }),
    },
  ],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Orange", value: (s) => s.orangeCount },
    { label: "Blue", value: (s) => s.blueCount },
    {
      label: "Clustering",
      value: (s) => (s.cluster === null ? "—" : s.cluster.toFixed(3)),
    },
  ],
  views: [
    {
      type: "network",
      label: "Consumer connections",
      nodes: (s) =>
        s.consumers.map((a) => ({
          id: a.id,
          label: String(a.who),
          position: { x: a.x * 12, y: a.y * 12 },
          color: a.choice === 0 ? "#e58b20" : "#377ac7",
          size:
            4 *
            (1 +
              4 *
                (a.choice === 0
                  ? s.parameters.qualityOrange
                  : s.parameters.qualityBlue)),
        })),
      edges: (s) =>
        s.edges.map((e) => ({
          ...e,
          color:
            s.parameters.normInfluence === 0 &&
            s.parameters.informationExchange === 0
              ? "#aaaaaa"
              : "#666666",
        })),
    },
    {
      type: "inspector",
      label: "Consumer",
      value: (s, id) => {
        const a = s.consumers.find((a) => a.id === id);
        return a
          ? {
              who: a.who,
              product: a.choice === 0 ? "orange" : "blue",
              satisfaction: a.satisfaction[a.choice]!,
              orangeExperience: a.personalExperience[0]!,
              blueExperience: a.personalExperience[1]!,
              orangeUtility: a.utilities[0]!,
              blueUtility: a.utilities[1]!,
            }
          : undefined;
      },
    },
    {
      type: "line",
      label: "Market shares (consumers)",
      series: (s) => [
        {
          label: "Orange",
          color: "#e58b20",
          points: s.history.map((p) => ({ x: p.tick, y: p.orangeCount })),
        },
        {
          label: "Blue",
          color: "#377ac7",
          points: s.history.map((p) => ({ x: p.tick, y: p.blueCount })),
        },
      ],
    },
    {
      type: "line",
      label: "Consumer clustering",
      series: (s) => [
        {
          label: "Same-choice neighbor fraction",
          points: s.history
            .filter((p) => p.cluster !== null)
            .map((p) => ({ x: p.tick, y: p.cluster! })),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-social-b02:consumer-choice:b8973c79622215eee5fb4aa29abf5c92cd80480b1d1c81c7d5c8d5b569d15236";

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };
