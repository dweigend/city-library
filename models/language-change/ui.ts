import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const binding = defineUI(model, {
  setup: ["seed", { field: "numNodes", label: "Language users" }],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Language%20Change.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    percentGrammar1: {
      label: "Grammar 1 on redistribution (%)",
    },
    updateAlgorithm: {
      label: "Learning rule",
    },
    thresholdVal: {
      label: "Threshold",
    },
    sinkState1: {
      label: "Grammar 1 is a sink",
    },
    logistic: {
      label: "Logistic speech bias",
    },
    alpha: {},
  },
  actions: [
    { label: "Reset states", run: (m) => m.resetNodes() },
    { label: "Redistribute grammars", run: (m) => m.redistributeGrammars() },
  ],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Mean grammar state",
      value: (s) => s.meanState,
      format: (value: number) => value.toFixed(4),
    },
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
          color: grammarColor(a.state),
          size: 14,
        })),
      edges: (s) => s.edges.map((e) => ({ ...e, color: "#929292" })),
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

function grammarColor(state: number): string {
  const red = Math.round(70 + 155 * state);
  const green = Math.round(135 - 45 * state);
  const blue = Math.round(220 - 130 * state);
  return `rgb(${red}, ${green}, ${blue})`;
}
