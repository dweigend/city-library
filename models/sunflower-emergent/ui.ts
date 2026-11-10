import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";
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
      label: "Sunflower Spirals · view grows with the pattern",
      data: sunflowerData,
    },
  ],
});

export { model };

export const ui = { ...binding, model };

/**
 * The pattern grows outward from the centre over hundreds of ticks. The view frames the
 * grown pattern (at least an eighth of the world) and scales particles with that zoom,
 * so early spirals are as legible as the finished head.
 */
function sunflowerData(state: Observation<typeof model>): SpatialData {
  const particles = [...state.temporaryParticles, ...state.particles];
  const radius = Math.max(0, ...particles.map((particle) => Math.hypot(particle.x, particle.y)));
  const extent = Math.min(state.width, Math.max(state.width / 8, (radius + framePadding) * 2));
  const zoom = state.width / extent;
  return {
    width: extent,
    height: extent * (state.height / state.width),
    agents: particles.map((particle) => ({ ...particle, size: particle.size * sourcePatchPixels * Math.min(zoom, maximumParticleZoom) })),
    description: `${state.particles.length} seeds within radius ${radius.toFixed(1)} of ${state.width / 2} patches.`,
  };
}

// The source view draws 3 pixels per patch; padding keeps outer seeds inside the frame.
const sourcePatchPixels = 3;
const framePadding = 4;
// Beyond 4x the crowded first seeds merge into one disc, so particle growth stops there.
const maximumParticleZoom = 4;
