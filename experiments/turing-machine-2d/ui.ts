import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model, type TuringParameters } from "./model.ts";
const ruleFields = [
  "off0Turn",
  "off0State",
  "off0On",
  "off1Turn",
  "off1State",
  "off1On",
  "on0Turn",
  "on0State",
  "on0On",
  "on1Turn",
  "on1State",
  "on1On",
] as const;
export const ui = defineUI(model, {
  setup: [
    { field: "width" },
    { field: "height" },
    { field: "seed" },
    { field: "heads" },
    { field: "colorPaths" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/TuringMachine2D",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "Setup example", run: (instance) => instance.setupExample() },
  ],
  live: [
    {
      field: "example",
      value: (state) => state.parameters.example,
      set: (instance, value) =>
        instance.setConfiguration({ example: Number(value) }),
    },
    ...ruleFields.map((field) => ({
      field,
      label: `${field.startsWith("off") ? "Off" : "On"} / state ${field.includes("0") ? 0 : 1}: ${field.endsWith("Turn") ? "turn" : field.endsWith("State") ? "next state" : "write on"}`,
      value: (state: ReturnType<ReturnType<typeof model.create>["read"]>) =>
        state.parameters[field],
      set: (
        instance: ReturnType<typeof model.create>,
        value: string | number | boolean,
      ) =>
        instance.setConfiguration({
          [field]: value,
        } as Partial<TuringParameters>),
    })),
  ],
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "On cells",
      value: (state) => state.cells.filter((cell) => cell.on).length,
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Tape and heads",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells.map((cell) => ({
          ...cell,
          color: netLogoColor(cell.colorNumber),
        })),
        agents: state.agents.map((agent) => ({
          ...agent,
          color: netLogoColor(agent.foreground),
          size: 7,
          shape: "triangle" as const,
        })),
      }),
    },
    {
      type: "inspector",
      label: "Head",
      value: (state, id) => {
        const head = state.agents.find((agent) => agent.id === id);
        return head
          ? {
              who: head.who,
              x: head.x,
              y: head.y,
              heading: head.heading,
              state: head.state,
            }
          : undefined;
      },
    },
    {
      type: "table",
      label: "Transition rules",
      rows: (state) =>
        state.rules.map((rule, index) => ({
          tape: index < 2 ? "off" : "on",
          state: index % 2,
          nextState: rule[0],
          turn: rule[1],
          writeOn: rule[2],
        })),
    },
  ],
});
