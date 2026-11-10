/** Stonedahl & Wilensky (2008), CC BY-NC-SA 3.0; source notices adjacent. */
import { Agent, Grid, Random, World, run, stats, geometry } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface SwarmParameters {
  width: number;
  height: number;
  seed: number;
  landscapeSmoothness: number;
  populationSize: number;
  particleInertia: number;
  particleSpeedLimit: number;
  attractionToPersonalBest: number;
  attractionToGlobalBest: number;
  highlightMode: "none" | "best-found" | "true-best";
  trailsMode: "none" | "tails" | "traces";
}
export const inputs: Inputs<SwarmParameters> = {
  width: { kind: "number", default: 201, min: 3, max: 301, integer: true },
  height: { kind: "number", default: 201, min: 3, max: 301, integer: true },
  seed: { kind: "number", default: 1, integer: true },
  landscapeSmoothness: {
    kind: "number",
    default: 20,
    min: 0,
    max: 100,
    integer: true,
  },
  populationSize: {
    kind: "number",
    default: 50,
    min: 1,
    max: 100,
    integer: true,
  },
  particleInertia: { kind: "number", default: 0.98, min: 0, max: 1, step: 0.01 },
  particleSpeedLimit: { kind: "number", default: 10, min: 1, max: 20, integer: true },
  attractionToPersonalBest: { kind: "number", default: 2, min: 0, max: 2, step: 0.1 },
  attractionToGlobalBest: { kind: "number", default: 1, min: 0, max: 2, step: 0.1 },
  highlightMode: {
    kind: "choice",
    default: "none",
    options: ["none", "best-found", "true-best"],
  },
  trailsMode: {
    kind: "choice",
    default: "none",
    options: ["none", "tails", "traces"],
  },
};
export interface ParticleInput {
  x: number;
  y: number;
  vx: number;
  vy: number;
  personalBestValue?: number;
  personalBestX?: number;
  personalBestY?: number;
}
export function create(options: Partial<SwarmParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const { width, height } = settings,
    space = { x: width, y: height, boundary: "wrap" as const },
    random = Random.create({ seed: settings.seed }),
    world = World.create(space, { random });
  const grid = Grid.create(space, { state: { val: 0 } });
  world.add(grid);
  const fields = grid.fields;
  let nextId = 0;
  function particle(p: ParticleInput) {
    return world.add(
      Agent.create(
        {
          sourceId: nextId++,
          vx: p.vx,
          vy: p.vy,
          personalBestValue:
            p.personalBestValue ?? grid.fieldAt({ x: p.x, y: p.y })!.val,
          personalBestX: p.personalBestX ?? p.x,
          personalBestY: p.personalBestY ?? p.y,
        },
        {
          position: { x: p.x, y: p.y },
          orientation: { heading: Math.floor(random.number() * 360) },
        },
      ),
    );
  }
  let particles: ReturnType<typeof particle>[] = [],
    globalBestValue = 0,
    globalBestX = 0,
    globalBestY = 0,
    trueBest = fields[0]!;
  const trails: {
    from: {
      x: number;
      y: number;
    };
    to: {
      x: number;
      y: number;
    };
    particle: number;
  }[] = [];
  const history: {
    tick: number;
    best: number;
  }[] = [];
  function record() {
    history.push({ tick: world.tick.value, best: globalBestValue });
    if (history.length > 2001) history.shift();
  }
  function setupLandscape() {
    for (const f of fields) f.val = random.number();
    for (let i = 0; i < settings.landscapeSmoothness; i++)
      grid.diffuse("val", { rate: 1, neighborhood: "moore" });
    const summary = stats.describe(fields.map((f) => f.val));
    if (summary.max === summary.min)
      throw new RangeError("Native landscape normalization divides by zero.");
    for (const f of fields)
      f.val =
        (0.99999 * (f.val - summary.min!)) / (summary.max! - summary.min!);
    const max = Math.max(...fields.map((f) => f.val));
    const maxima = fields.filter((f) => f.val === max);
    trueBest = maxima[Math.floor(random.number() * maxima.length)]!;
    trueBest.val = 1;
  }
  function updateBests() {
    for (const p of random.sample(particles, {
      sampleCount: particles.length,
      algorithm: "fisher-yates-descending",
    })) {
      const val = grid.fieldAt(p)!.val;
      if (val > p.personalBestValue) {
        p.personalBestValue = val;
        p.personalBestX = p.x;
        p.personalBestY = p.y;
      }
    }
    const max = Math.max(...particles.map((p) => p.personalBestValue)),
      ties = particles.filter((p) => p.personalBestValue === max),
      best = ties[Math.floor(random.number() * ties.length)]!;
    if (globalBestValue < best.personalBestValue) {
      globalBestValue = best.personalBestValue;
      globalBestX = best.personalBestX;
      globalBestY = best.personalBestY;
    }
  }
  function moveParticles() {
    if (settings.trailsMode !== "traces") trails.length = 0;
    for (const p of random.sample(particles, {
      sampleCount: particles.length,
      algorithm: "fisher-yates-descending",
    })) {
      const from = { x: p.x, y: p.y };
      p.vx *= settings.particleInertia;
      p.vy *= settings.particleInertia;
      p.rotate({ towards: { x: p.personalBestX, y: p.personalBestY } });
      let dist = p.distanceTo({ x: p.personalBestX, y: p.personalBestY }),
        dir = geometry.direction({ heading: p.heading });
      p.vx +=
        (1 - settings.particleInertia) *
        settings.attractionToPersonalBest *
        random.number() *
        dist *
        dir.x;
      p.vy +=
        (1 - settings.particleInertia) *
        settings.attractionToPersonalBest *
        random.number() *
        dist *
        dir.y;
      p.rotate({ towards: { x: globalBestX, y: globalBestY } });
      dist = p.distanceTo({ x: globalBestX, y: globalBestY });
      dir = geometry.direction({ heading: p.heading });
      p.vx +=
        (1 - settings.particleInertia) *
        settings.attractionToGlobalBest *
        random.number() *
        dist *
        dir.x;
      p.vy +=
        (1 - settings.particleInertia) *
        settings.attractionToGlobalBest *
        random.number() *
        dist *
        dir.y;
      p.vx = Math.max(
        -settings.particleSpeedLimit,
        Math.min(settings.particleSpeedLimit, p.vx),
      );
      p.vy = Math.max(
        -settings.particleSpeedLimit,
        Math.min(settings.particleSpeedLimit, p.vy),
      );
      const d = p.directionTo({ x: p.x + p.vx, y: p.y + p.vy });
      if (d) p.rotate({ towards: { x: p.x + p.vx, y: p.y + p.vy } });
      // Preserve source wrapped facing then Euclidean magnitude, including long velocity vectors.
      const magnitude = Math.hypot(p.vx, p.vy);
      let vector = geometry.direction({ heading: p.heading });
      // Exact cardinal components avoid floating drift at source integer cardinal moves.
      const by = {
        x: Math.abs(vector.x) < 1e-15 ? 0 : vector.x * magnitude,
        y: Math.abs(vector.y) < 1e-15 ? 0 : vector.y * magnitude,
      };
      p.move({ by });
      if (settings.trailsMode !== "none")
        trails.push({ from, to: { x: p.x, y: p.y }, particle: p.sourceId });
    }
    if (trails.length > 20000) trails.splice(0, trails.length - 20000);
  }
  function setScenario(s: {
    landscape: readonly number[];
    particles: readonly ParticleInput[];
    globalBest?: {
      value: number;
      x: number;
      y: number;
    };
  }) {
    if (
      !s ||
      !Array.isArray(s.landscape) ||
      s.landscape.length !== fields.length ||
      s.landscape.some((v) => !Number.isFinite(v) || v < 0 || v > 1) ||
      s.landscape.filter((v) => v === 1).length !== 1 ||
      !Array.isArray(s.particles) ||
      !s.particles.length
    )
      throw new RangeError(
        "One unique landscape optimum and particles required.",
      );
    for (const p of s.particles) {
      if (
        ![
          p.x,
          p.y,
          p.vx,
          p.vy,
          p.personalBestValue ?? 0,
          p.personalBestX ?? p.x,
          p.personalBestY ?? p.y,
        ].every(Number.isFinite) ||
        p.x < -width / 2 ||
        p.x >= width / 2 ||
        p.y < -height / 2 ||
        p.y >= height / 2 ||
        (p.personalBestValue ?? 0) < 0 ||
        (p.personalBestValue ?? 0) > 1
      )
        throw new RangeError("Invalid particle.");
    }
    if (
      s.globalBest &&
      (![s.globalBest.value, s.globalBest.x, s.globalBest.y].every(
        Number.isFinite,
      ) ||
        s.globalBest.value < 0 ||
        s.globalBest.value > 1)
    )
      throw new RangeError("Invalid global best.");
    for (const p of particles) p.delete();
    fields.forEach((f, i) => (f.val = s.landscape[i]!));
    trueBest = fields.find((f) => f.val === 1)!;
    particles = s.particles.map((p) => particle(p));
    globalBestValue = s.globalBest?.value ?? 0;
    globalBestX = s.globalBest?.x ?? 0;
    globalBestY = s.globalBest?.y ?? 0;
    trails.length = history.length = 0;
    record();
  }
  setupLandscape();
  for (let i = 0; i < settings.populationSize; i++)
    particles.push(
      particle({
        x: random.number() * width - width / 2,
        y: random.number() * height - height / 2,
        vx: random.number({ distribution: "normal" }),
        vy: random.number({ distribution: "normal" }),
      }),
    );
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        updateBests();
        if (globalBestValue === trueBest.val) break;
        run(world, moveParticles);
        record();
      }
    },
    setScenario,
    updateBests,
    moveParticles,
    setParameters(changes: Partial<SwarmParameters>) {
      if (
        Reflect.ownKeys(changes).some((k) =>
          [
            "seed",
            "width",
            "height",
            "landscapeSmoothness",
            "populationSize",
          ].includes(String(k)),
        )
      )
        throw new TypeError("Setup-only parameter.");
      settings = parseParameters(inputs, { ...settings, ...changes });
    },
    read() {
      return {
        width,
        height,
        tick: world.tick.value,
        parameters: { ...settings },
        globalBestValue,
        globalBestX,
        globalBestY,
        trueBest: { x: trueBest.x, y: trueBest.y, value: trueBest.val },
        complete: globalBestValue === 1,
        randomState: random.state,
        particles: particles.map((p) => ({
          id: String(p.sourceId),
          x: p.x,
          y: p.y,
          heading: p.heading,
          vx: p.vx,
          vy: p.vy,
          personalBestValue: p.personalBestValue,
          personalBestX: p.personalBestX,
          personalBestY: p.personalBestY,
        })),
        cells: fields.map((f) => ({ id: f.id, x: f.x, y: f.y, val: f.val })),
        landscape: fields.map((f) => f.val),
        history: history.map((p) => ({ ...p })),
        trails: trails.map((t) => ({
          ...t,
          from: { ...t.from },
          to: { ...t.to },
        })),
      };
    },
  };
}
export const model = {
  title: "Particle Swarm Optimization",
  description:
    "Toroidal landscape search with personal and global memory. Stonedahl and Wilensky (2008), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<SwarmParameters, ReturnType<typeof create>>;
