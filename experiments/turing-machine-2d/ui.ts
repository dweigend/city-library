import { defineUI, netLogoColor, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed", "heads", "colorPaths"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/TuringMachine2D",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "Setup example", run: (instance) => instance.setupExample() },
  ],
  live: {
    example: {
      set: (instance, value) => instance.setConfiguration({ example: value }),
    },
    off0Turn: {
      label: `${"off0Turn".startsWith("off") ? "Off" : "On"} / state ${"off0Turn".includes("0") ? 0 : 1}: ${"off0Turn".endsWith("Turn") ? "turn" : "off0Turn".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ off0Turn: value }),
    },
    off0State: {
      label: `${"off0State".startsWith("off") ? "Off" : "On"} / state ${"off0State".includes("0") ? 0 : 1}: ${"off0State".endsWith("Turn") ? "turn" : "off0State".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ off0State: value }),
    },
    off0On: {
      label: `${"off0On".startsWith("off") ? "Off" : "On"} / state ${"off0On".includes("0") ? 0 : 1}: ${"off0On".endsWith("Turn") ? "turn" : "off0On".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ off0On: value }),
    },
    off1Turn: {
      label: `${"off1Turn".startsWith("off") ? "Off" : "On"} / state ${"off1Turn".includes("0") ? 0 : 1}: ${"off1Turn".endsWith("Turn") ? "turn" : "off1Turn".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ off1Turn: value }),
    },
    off1State: {
      label: `${"off1State".startsWith("off") ? "Off" : "On"} / state ${"off1State".includes("0") ? 0 : 1}: ${"off1State".endsWith("Turn") ? "turn" : "off1State".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ off1State: value }),
    },
    off1On: {
      label: `${"off1On".startsWith("off") ? "Off" : "On"} / state ${"off1On".includes("0") ? 0 : 1}: ${"off1On".endsWith("Turn") ? "turn" : "off1On".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ off1On: value }),
    },
    on0Turn: {
      label: `${"on0Turn".startsWith("off") ? "Off" : "On"} / state ${"on0Turn".includes("0") ? 0 : 1}: ${"on0Turn".endsWith("Turn") ? "turn" : "on0Turn".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ on0Turn: value }),
    },
    on0State: {
      label: `${"on0State".startsWith("off") ? "Off" : "On"} / state ${"on0State".includes("0") ? 0 : 1}: ${"on0State".endsWith("Turn") ? "turn" : "on0State".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ on0State: value }),
    },
    on0On: {
      label: `${"on0On".startsWith("off") ? "Off" : "On"} / state ${"on0On".includes("0") ? 0 : 1}: ${"on0On".endsWith("Turn") ? "turn" : "on0On".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ on0On: value }),
    },
    on1Turn: {
      label: `${"on1Turn".startsWith("off") ? "Off" : "On"} / state ${"on1Turn".includes("0") ? 0 : 1}: ${"on1Turn".endsWith("Turn") ? "turn" : "on1Turn".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ on1Turn: value }),
    },
    on1State: {
      label: `${"on1State".startsWith("off") ? "Off" : "On"} / state ${"on1State".includes("0") ? 0 : 1}: ${"on1State".endsWith("Turn") ? "turn" : "on1State".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ on1State: value }),
    },
    on1On: {
      label: `${"on1On".startsWith("off") ? "Off" : "On"} / state ${"on1On".includes("0") ? 0 : 1}: ${"on1On".endsWith("Turn") ? "turn" : "on1On".endsWith("State") ? "next state" : "write on"}`,
      set: (instance, value) => instance.setConfiguration({ on1On: value }),
    },
  },
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
      data: tapeAndHeadsData,
    },
    {
      type: "inspector",
      label: "Head",
      value: headInspector,
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

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function tapeAndHeadsData(state: UIObservation): SpatialData {
  return {
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
  };
}

function headInspector(
  state: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
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
}
