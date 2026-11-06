import { defineUI } from "../../ui/index.ts";
import { model, type BasicParameters } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  live: (["youSilent", "partnerSilent", "partnerSilenceKnown"] as const).map(
    (field) => ({
      field,
      value: (s) => s.parameters[field],
      set: (m, value) =>
        m.setRules({ [field]: value } as Partial<BasicParameters>),
    }),
  ),
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
      rows: (s) => [
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
      ],
    },
    {
      type: "table",
      label: "Your jail time (years)",
      rows: () => [
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
      ],
    },
  ],
});
