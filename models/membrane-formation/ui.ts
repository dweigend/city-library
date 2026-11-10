import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "waterCount", "lipidCount"],
  live: {
    waterWaterForce: {
      set: (instance, value) =>
        instance.setParameters({ waterWaterForce: value }),
    },
    waterOilForce: {
      set: (instance, value) =>
        instance.setParameters({ waterOilForce: value }),
    },
    tooCloseForce: {
      set: (instance, value) =>
        instance.setParameters({ tooCloseForce: value }),
    },
    randomForce: {
      set: (instance, value) => instance.setParameters({ randomForce: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Membrane%20Formation.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Molecules", value: (state) => state.agents.length },
    { label: "Lipids", value: (state) => state.edges.length },
    {
      label: "Hydrophobic isolation",
      value: (state) => state.hydrophobicIsolation,
      format: (value: number) => value.toFixed(3),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Membrane Formation",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({ ...agent, size: 6 })),
        segments: state.edges.map((edge) => ({
          from: edge.from,
          to: edge.to,
          color: "#888888",
          width: 1,
        })),
      }),
    },
    {
      type: "line",
      label: "Hydrophobic isolation",
      series: (state) => [
        {
          label: "Ratio",
          color: "#888888",
          points: state.history.flatMap((point) => [
            { x: point.tick, y: point.hydrophobicIsolation },
          ]),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-biology-b07:membrane-formation:4f3a41013090830c53ee055eac6625b1d3fcba981df7ab8d67822af037f7733d";
export const ui = { ...binding, model, sourceMarker };
