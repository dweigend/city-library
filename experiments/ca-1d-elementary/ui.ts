import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model, patterns } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "width" },
    { field: "height" },
    { field: "seed" },
    { field: "initialization" },
    { field: "density" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/CA1DElementary",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "Setup single", run: (m) => m.setupSingle() },
    { label: "Setup random", run: (m) => m.setupRandom() },
    { label: "Continue", run: (m) => m.continueRun(), enabled: (s) => s.done },
    { label: "Show rules", run: (m) => m.showRules() },
    ...patterns.map((pattern) => ({
      label: pattern,
      run: (m: ReturnType<typeof model.create>) =>
        m.setRuleBit(
          pattern,
          !m.read().rules.find((r) => r.pattern === pattern)!.next,
        ),
      pressed: (s: ReturnType<ReturnType<typeof model.create>["read"]>) =>
        s.rules.find((r) => r.pattern === pattern)!.next,
    })),
  ],
  live: [
    {
      field: "rule",
      value: (s) => s.parameters.rule,
      set: (m, v) => m.setRules({ rule: Number(v) }),
    },
    {
      field: "autoContinue",
      value: (s) => s.parameters.autoContinue,
      set: (m, v) => m.setRules({ autoContinue: Boolean(v) }),
    },
    {
      field: "foreground",
      value: (s) => s.parameters.foreground,
      set: (m, v) => m.setRules({ foreground: Number(v) }),
    },
    {
      field: "background",
      value: (s) => s.parameters.background,
      set: (m, v) => m.setRules({ background: Number(v) }),
    },
  ],
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Row", value: (s) => s.row },
  ],
  views: [
    {
      type: "grid",
      label: "Rows",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color: netLogoColor(c.colorNumber),
        })),
      }),
    },
    { type: "table", label: "Rule table", rows: (s) => s.rules },
  ],
});
