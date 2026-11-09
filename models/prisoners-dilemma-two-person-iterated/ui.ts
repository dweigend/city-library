import { defineUI, type Observation } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  change: (instance, changes) => instance.setRules(changes),
  live: {
    humanStrategy: {},
    computerStrategy: {},
    selectComputerStrategy: {},
    displayHistory: {},
  },
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
      rows: playersRows,
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
      rows: (s) => s.output.slice(-12).map((message) => ({ Message: message })),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function playersRows(
  s: UIObservation,
): readonly Readonly<Record<string, string | number | boolean>>[] {
  return [
    {
      Player: "Human",
      Score: s.human.score,
      Average: s.human.averageScore,
      "Last action": s.human.defectNow ? "Defect" : "Cooperate",
    },
    {
      Player: "Computer",
      Score: s.computer.score,
      Average: s.computer.averageScore,
      "Last action": s.computer.defectNow ? "Defect" : "Cooperate",
    },
  ];
}
