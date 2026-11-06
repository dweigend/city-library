import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed"],
  live: {
    leaveTrail: {
      set: (instance, value) => instance.setParameters({ leaveTrail: value }),
    },
  },
  actions: [
    {
      label: "Kill transitory cells",
      run: (instance) => instance.killTransitoryCells(),
    },
    {
      label: "Kill original stem cell",
      run: (instance) => instance.killOriginalStemCell(),
    },
    {
      label: "Kill moving stem cell",
      run: (instance) => instance.killMovingStemCell(),
    },
  ],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Tumor.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Cell count", value: (state) => state.cellCount },
  ],
  views: [
    {
      type: "spatial",
      label: "Tumor",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.cells.map((agent) => ({
          ...agent,
          size: agent.size * 3,
        })),
        segments: state.trails,
      }),
    },
    {
      type: "line",
      label: "Living cells",
      series: (state) => [
        {
          label: "Cells alive",
          color: "#888888",
          points: state.history.flatMap((point) => [
            { x: point.tick, y: point.cellCount },
          ]),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-biology-b07:tumor:f47f5edc51141c107582ae5b30d23f613cbef305f6b2cb6bbea13c46298f0630";
export const ui = { ...binding, model, sourceMarker };
