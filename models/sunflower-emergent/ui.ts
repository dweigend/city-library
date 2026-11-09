import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    ringDist: {},
    particleSize: {},
    fixedTemps: {},
    showTemps: {},
    energyApproximation: {},
    alpha: {},
    beta: {},
  },
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Sunflower%20Emergent.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Particles", value: (state) => state.particles.length },
    { label: "Temporary candidates", value: (state) => state.numTempParticles },
  ],
  views: [
    {
      type: "spatial",
      label: "Sunflower Emergent",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: [...state.temporaryParticles, ...state.particles].map(
          (agent) => ({ ...agent, size: agent.size * 3 }),
        ),
      }),
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-biology-b07:sunflower-emergent:0e0e3d39384a9b2cde33f248f46c0711cf2f7742f39405dc0907485ab1a67cd8";
export const ui = { ...binding, model, sourceMarker };
