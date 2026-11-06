import { defineUI } from "../../ui/index.ts";
import { model, type IteratedParameters } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  live: (
    [
      "humanStrategy",
      "computerStrategy",
      "selectComputerStrategy",
      "displayHistory",
    ] as const
  ).map((field) => ({
    field,
    value: (s) => s.parameters[field],
    set: (m, value) =>
      m.setRules({ [field]: value } as Partial<IteratedParameters>),
  })),
  actions: [{ label: "Play once", run: (m) => m.play() }],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Prisoner's%20Dilemma/Prisoner's%20Dilemma%20Two%20Person%20Iterated.nlogox",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Round", value: (s) => s.tick },
    { label: "Human score", value: (s) => s.human.score },
    { label: "Computer score", value: (s) => s.computer.score },
  ],
  views: [
    {
      type: "table",
      label: "Players",
      rows: (s) => [
        {
          player: "Human",
          score: s.human.score,
          average: s.human.averageScore,
          lastAction: s.human.defectNow ? "Defect" : "Cooperate",
        },
        {
          player: "Computer",
          score: s.computer.score,
          average: s.computer.averageScore,
          lastAction: s.computer.defectNow ? "Defect" : "Cooperate",
        },
      ],
    },
    {
      type: "line",
      label: "Average score (includes initial 3)",
      series: (s) => [
        {
          label: "Human",
          points: s.history.map((p) => ({ x: p.tick, y: p.humanAverage })),
        },
        {
          label: "Computer",
          color: "#315bd5",
          points: s.history.map((p) => ({ x: p.tick, y: p.computerAverage })),
        },
      ],
    },
    {
      type: "table",
      label: "History",
      rows: (s) => s.output.slice(-12).map((message) => ({ message })),
    },
  ],
});
