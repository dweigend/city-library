/** NetLogo Sunflower Emergent (Wilensky, 2009). Complete notices: NOTICE.md. */
import { Agent, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface SunflowerParameters {
  seed: number;
  ringDist: number;
  particleSize: number;
  fixedTemps: boolean;
  showTemps: boolean;
  energyApproximation: "inverse distance" | "exponential";
  alpha: number;
  beta: number;
}
export const inputs: Inputs<SunflowerParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  ringDist: { kind: "number", default: 0.2, min: 0.01, max: 1 },
  particleSize: { kind: "number", default: 1.8, min: 0.1, max: 3 },
  fixedTemps: { kind: "boolean", default: false },
  showTemps: { kind: "boolean", default: true },
  energyApproximation: {
    kind: "choice",
    default: "inverse distance",
    options: ["inverse distance", "exponential"],
  },
  alpha: { kind: "number", default: 3, min: 1, max: 3 },
  beta: { kind: "number", default: 0.6, min: 0, max: 1 },
};
type Particle = Agent<{ temporary: boolean; size: number }>;
export function create(options: Partial<SunflowerParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ x: 161, y: 161, boundary: "hard" }, { random });
  const particles = () =>
    (world.agents as readonly Particle[]).filter(
      (particle) => !particle.temporary,
    );
  let numTempParticles = 0;
  let stopped = false;
  // NetLogo tick occurs while the temporary candidates are still visible.
  // Retain that exact detached view frame without retaining a second live population.
  let tempFrame: {
    id: string;
    x: number;
    y: number;
    heading: number;
    size: number;
    color: string;
  }[] = [];

  function createParticle(radius: number, temporary: boolean) {
    const particle = Agent.add(
      { temporary, size: temporary ? 1 : settings.particleSize },
      {
        orientation: {
          heading: random.number({ min: 0, max: 360, integer: true }),
        },
      },
    );
    world.add(particle);
    particle.move(radius);
    return particle;
  }
  function potentialEnergy(candidate: Particle) {
    if (settings.energyApproximation === "exponential" && settings.beta === 0)
      throw new RangeError("NetLogo exponential energy divides by beta = 0.");
    return stats.describe(
      particles().map((particle) => {
        const distance = candidate.distanceTo(particle);
        if (settings.energyApproximation === "exponential")
          return Math.exp(-distance / settings.beta);
        return 1 / distance ** settings.alpha;
      }),
    ).sum;
  }
  function go() {
    const distance = settings.ringDist * (particles().length + 1);
    const count = settings.fixedTemps ? 360 : Math.floor(distance * 30 + 0.5);
    const temporary: Particle[] = [];
    for (let index = 0; index < count; index++)
      temporary.push(createParticle(distance, true));
    numTempParticles = temporary.length;
    let minimum = Infinity;
    let winners: Particle[] = [];
    for (const candidate of temporary) {
      const energy = potentialEnergy(candidate);
      if (energy < minimum) {
        minimum = energy;
        winners = [candidate];
      } else if (energy === minimum) winners.push(candidate);
    }
    const winner = random.sample(winners)[0];
    if (winner) {
      const permanent = winner.copy();
      permanent.temporary = false;
      permanent.size = settings.particleSize;
      world.add(permanent);
    }
    tempFrame = settings.showTemps
      ? temporary.map((particle) => ({
          id: particle.id,
          x: particle.x,
          y: particle.y,
          heading: particle.heading,
          size: 1,
          color: "#59ae39",
        }))
      : [];
    for (const particle of temporary) particle.delete();
  }
  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      if (settings.ringDist * (particles().length + 1) >= 80) {
        stopped = true;
        break;
      }
      stopped = false;
      run(world, go);
    }
  }
  function setParameters(update: Partial<Omit<SunflowerParameters, "seed">>) {
    if (Object.keys(update).some((key) => key === "seed"))
      throw new TypeError("Seed is setup-only.");
    settings = parameters(inputs, { ...settings, ...update });
    stopped = settings.ringDist * (particles().length + 1) >= 80;
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 161,
      height: 161,
      parameters: { ...settings },
      stopped,
      numTempParticles,
      particles: particles().map((particle) => ({
        id: particle.id,
        x: particle.x,
        y: particle.y,
        heading: particle.heading,
        size: particle.size,
        color: "#e5cb38",
      })),
      temporaryParticles: tempFrame.map((particle) => ({ ...particle })),
    };
  }
  createParticle(settings.ringDist, false);
  world.tick.advance();
  return { advance, read, setParameters, potentialEnergy, createParticle, go };
}
export const model = {
  title: "Sunflower Emergent",
  inputs,
  create,
} satisfies Definition<SunflowerParameters, ReturnType<typeof create>>;
