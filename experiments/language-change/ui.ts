import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const binding = defineUI(model, {
  setup: [{ field: "seed" }, { field: "numNodes", label: "Language users" }],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Language%20Change.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "percentGrammar1",
      label: "Grammar 1 on redistribution (%)",
      value: (s) => s.parameters.percentGrammar1,
      set: (m, v) => m.setParameters({ percentGrammar1: Number(v) }),
    },
    {
      field: "updateAlgorithm",
      label: "Learning rule",
      value: (s) => s.parameters.updateAlgorithm,
      set: (m, v) =>
        m.setParameters({
          updateAlgorithm: String(v) as "individual" | "threshold" | "reward",
        }),
    },
    {
      field: "thresholdVal",
      label: "Threshold",
      value: (s) => s.parameters.thresholdVal,
      set: (m, v) => m.setParameters({ thresholdVal: Number(v) }),
    },
    {
      field: "sinkState1",
      label: "Grammar 1 is a sink",
      value: (s) => s.parameters.sinkState1,
      set: (m, v) => m.setParameters({ sinkState1: Boolean(v) }),
    },
    {
      field: "logistic",
      label: "Logistic speech bias",
      value: (s) => s.parameters.logistic,
      set: (m, v) => m.setParameters({ logistic: Boolean(v) }),
    },
    {
      field: "alpha",
      label: "Alpha",
      value: (s) => s.parameters.alpha,
      set: (m, v) => m.setParameters({ alpha: Number(v) }),
    },
  ],
  actions: [
    { label: "Reset states", run: (m) => m.resetNodes() },
    { label: "Redistribute grammars", run: (m) => m.redistributeGrammars() },
  ],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Mean grammar state", value: (s) => s.meanState.toFixed(4) },
    { label: "Grammar 0", value: (s) => s.grammar0 },
    { label: "Grammar 1", value: (s) => s.grammar1 },
  ],
  views: [
    {
      type: "network",
      label: "Language network",
      nodes: (s) =>
        s.nodes.map((a) => ({
          id: a.id,
          label: String(a.who),
          position: { x: a.x * 7, y: a.y * 7 },
          color: `hsl(0 75% ${15 + 70 * a.state}%)`,
          size: 14,
        })),
      edges: (s) => s.links.map((e) => ({ ...e, color: "#929292" })),
    },
    {
      type: "inspector",
      label: "Language user",
      value: (s, id) => {
        const a = s.nodes.find((a) => a.id === id);
        return a
          ? {
              who: a.who,
              originalGrammar: a.origState,
              currentGrammar: a.state,
              spokenGrammar: a.spokenState,
            }
          : undefined;
      },
    },
    {
      type: "line",
      label: "Mean state of language users",
      series: (s) => [
        {
          label: "Mean grammar state",
          color: "#cc4444",
          points: s.history.map((p) => ({ x: p.tick, y: p.meanState })),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-social-b02:language-change:99f71d55846902f726fdbe73059d852e9b8510a9102a3524dad3f625d8763e9f";

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };
