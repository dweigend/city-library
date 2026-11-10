import { defineUI, indexedColor, type Observation } from "../../ui/index.ts";
import { model, patterns } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed", "initialization", "density"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/CA1DElementary",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "Setup single", run: (m) => m.setupSingle() },
    { label: "Setup random", run: (m) => m.setupRandom() },
    {
      label: "Continue",
      run: (m) => m.continueRun(),
      enabled: (s) => s.done && !s.rulesShown,
    },
    { label: "Show rules", run: (m) => m.showRules() },
    ...patterns.map((pattern) => ({
      label: pattern,
      run: (m: ReturnType<typeof model.create>) =>
        m.setRuleBit(
          pattern,
          !m.read().rules.find((r) => r.pattern === pattern)!.next,
        ),
      pressed: (s: Observation<typeof model>) =>
        s.rules.find((r) => r.pattern === pattern)!.next,
    })),
  ],
  change: (instance, changes) => instance.setRules(changes),
  live: {
    rule: {},
    autoContinue: {},
    foreground: {},
    background: {},
  },
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
          color: indexedColor(c.colorNumber),
        })),
      }),
    },
    { type: "table", label: "Rule table", rows: (s) => s.rules },
  ],
});
