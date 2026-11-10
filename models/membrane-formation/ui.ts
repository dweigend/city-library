import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "waterCount", "lipidCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    waterWaterForce: {},
    waterOilForce: {},
    tooCloseForce: {},
    randomForce: {},
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Membrane%20Formation.nlogox",
    label: "Source attribution · NetLogo model · Wilensky · CC BY-NC-SA 3.0",
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
          to: nearestWrappedImage(edge.from, edge.to, state),
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

/** Draw a lipid bond across the torus edge as a short line instead of across the whole world. */
function nearestWrappedImage(
  from: { x: number; y: number },
  to: { x: number; y: number },
  world: { width: number; height: number },
) {
  const unwrap = (offset: number, size: number) => offset - size * Math.round(offset / size);
  return {
    x: from.x + unwrap(to.x - from.x, world.width),
    y: from.y + unwrap(to.y - from.y, world.height),
  };
}

export { model };

export const ui = { ...binding, model };
