import { defineUI, type Observation } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  change: (instance, changes) => instance.setRules(changes),
  live: {
    youSilent: {},
    partnerSilent: {},
    partnerSilenceKnown: {},
  },
  actions: [{ label: "Answer", run: (m) => m.answer() }],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Prisoner's%20Dilemma/Prisoner's%20Dilemma%20Basic.nlogox",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Answers (no native clock)", value: (s) => s.rounds },
    { label: "Sentence (years)", value: (s) => s.years ?? "Choose and answer" },
  ],
  views: [
    {
      type: "table",
      label: "Answer",
      rows: answerRows,
    },
    {
      type: "table",
      label: "Your jail time (years)",
      rows: yourJailTimeYearsRows,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function answerRows(
  s: UIObservation,
): readonly Readonly<Record<string, string | number | boolean>>[] {
  return [
    {
      Outcome: s.message,
      Partner:
        s.years === null
          ? "Not answered"
          : s.partnerIsSilent
            ? "Silent"
            : "Confessed",
      Expression: s.face,
    },
  ];
}

function yourJailTimeYearsRows(): readonly Readonly<
  Record<string, string | number | boolean>
>[] {
  return [
    {
      "Your choice": "Silent",
      "Partner silent": 1,
      "Partner confesses": 5,
    },
    {
      "Your choice": "Confess",
      "Partner silent": 0,
      "Partner confesses": 3,
    },
  ];
}
