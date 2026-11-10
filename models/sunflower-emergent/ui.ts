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
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Particles", value: (state) => state.particles.length },
    { label: "Temporary candidates", value: (state) => state.temporaryParticleCount },
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

export const ui = { ...binding, model };
