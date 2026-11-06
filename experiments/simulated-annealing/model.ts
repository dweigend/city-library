/** Stonedahl & Wilensky (2009), CC BY-NC-SA 3.0. Exact source and notices adjacent. */
import { Grid, Random, World, run, geometry } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface AnnealingParameters {
  width: number;
  height: number;
  seed: number;
  coolingRate: number;
  swapRadius: number;
  acceptEqualChanges: boolean;
}
export const inputs: Inputs<AnnealingParameters> = {
  width: { kind: "number", default: 30, min: 2, max: 201, integer: true },
  height: { kind: "number", default: 30, min: 2, max: 201, integer: true },
  seed: { kind: "number", default: 1, integer: true },
  coolingRate: { kind: "number", default: 1, min: 0, max: 50 },
  swapRadius: { kind: "number", default: 1, min: 1, max: 5, integer: true },
  acceptEqualChanges: { kind: "boolean", default: false },
};
/** Native anisotropic directed-neighbor energy, including toroidal aliases on tiny grids. */
export function patchEnergy(
  here: number,
  north: number,
  south: number,
  east: number,
  west: number,
): number {
  for (const b of [here, north, south, east, west])
    if (b !== 0 && b !== 1) throw new RangeError("Brightness must be binary.");
  return (
    (north - here) ** 2 +
    (south - here) ** 2 +
    1 -
    (east - here) ** 2 +
    1 -
    (west - here) ** 2
  );
}
export function create(options: Partial<AnnealingParameters> = {}) {
  let settings = parameters(inputs, options);
  const { width, height } = settings;
  if ((width * height) % 2)
    throw new RangeError(
      "An even number of patches is required for exact half initialization.",
    );
  const random = Random.add({ seed: settings.seed }),
    world = World.add({ random });
  const grid = Grid.add(
    { x: width, y: height, boundary: "wrap" },
    { state: { brightness: 0 } },
  );
  world.add(grid);
  const fields = grid.fields;
  let temperature = 1,
    globalEnergy = 0,
    attempts = 0,
    accepted = 0;
  const history: {
    tick: number;
    energy: number;
    temperature: number;
  }[] = [];
  const at = (x: number, y: number) => {
    if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y))
      throw new RangeError("Expected integer patch coordinates.");
    return grid.fieldAt({ x: x - (width - 1) / 2, y: y - (height - 1) / 2 })!;
  };
  function energyAt(x: number, y: number) {
    const f = at(x, y);
    return patchEnergy(
      f.brightness,
      at(x, y + 1).brightness,
      at(x, y - 1).brightness,
      at(x + 1, y).brightness,
      at(x - 1, y).brightness,
    );
  }
  const coordinates = (f: (typeof fields)[number]) => ({
    x: f.x + (width - 1) / 2,
    y: f.y + (height - 1) / 2,
  });
  function totalEnergy() {
    return fields.reduce((sum, f) => {
      const c = coordinates(f);
      return sum + energyAt(c.x, c.y);
    }, 0);
  }
  function record() {
    history.push({ tick: world.tick.value, energy: globalEnergy, temperature });
    if (history.length > 2001) history.shift();
  }
  function attemptSwap(x1: number, y1: number, x2: number, y2: number) {
    const p1 = at(x1, y1),
      p2 = at(x2, y2);
    attempts++;
    if (p1.brightness === p2.brightness) return false;
    const affected = new Set([
      p1,
      p2,
      ...grid.neighbors(p1, { neighborhood: "faces" }),
      ...grid.neighbors(p2, { neighborhood: "faces" }),
    ]);
    const energy = () =>
      [...affected].reduce((sum, f) => {
        const c = coordinates(f);
        return sum + energyAt(c.x, c.y);
      }, 0);
    const before = energy(),
      b = p1.brightness;
    p1.brightness = p2.brightness;
    p2.brightness = b;
    const after = energy();
    const accept =
      after < before ||
      (settings.acceptEqualChanges && after === before) ||
      random.number() < temperature;
    if (!accept) {
      p2.brightness = p1.brightness;
      p1.brightness = b;
    } else {
      accepted++;
      globalEnergy += after - before;
    }
    return accept;
  }
  function setScenario(s: {
    brightness: readonly number[];
    temperature?: number;
  }) {
    if (
      !s ||
      !Array.isArray(s.brightness) ||
      s.brightness.length !== fields.length ||
      s.brightness.some((b) => b !== 0 && b !== 1)
    )
      throw new RangeError("Scenario must contain one binary value per patch.");
    const t = s.temperature ?? 1;
    if (!Number.isFinite(t) || t < 0 || t > 1)
      throw new RangeError("Temperature must be in [0,1].");
    fields.forEach((f, i) => (f.brightness = s.brightness[i]!));
    temperature = t;
    attempts = accepted = 0;
    globalEnergy = totalEnergy();
    history.length = 0;
    record();
  }
  for (const f of random.sample(fields, { count: fields.length / 2 }))
    f.brightness = 1;
  globalEnergy = totalEnergy();
  record();
  // Neighborhood membership depends only on the live radius. Cache once per rule change, not simulation state.
  let radius = -1;
  let candidates: readonly (typeof fields)[number][][] = [];
  function neighborhoodTable() {
    if (radius === settings.swapRadius) return;
    radius = settings.swapRadius;
    const offsets: {
      x: number;
      y: number;
    }[] = [];
    for (let dy = -radius; dy <= radius; dy++)
      for (let dx = -radius; dx <= radius; dx++)
        if (Math.hypot(dx, dy) <= radius) offsets.push({ x: dx, y: dy });
    candidates = fields.map((f) => {
      const c = coordinates(f);
      return [...new Set(offsets.map((o) => at(c.x + o.x, c.y + o.y)))].filter(
        (p) => geometry.distance(f, p, { space: grid.space }) <= radius,
      );
    });
  }
  return {
    advance(count = 1) {
      stepCount(count);
      neighborhoodTable();
      for (let t = 0; t < count; t++) {
        run(world, () => {
          for (let n = 0; n < 1000; n++) {
            const i = Math.floor(random.number() * fields.length),
              p = fields[i]!,
              near = candidates[i]!,
              q = near[Math.floor(random.number() * near.length)]!,
              a = coordinates(p),
              b = coordinates(q);
            attemptSwap(a.x, a.y, b.x, b.y);
          }
          temperature *= 1 - settings.coolingRate / 100;
          globalEnergy = totalEnergy();
        });
        record();
      }
    },
    energyAt,
    attemptSwap,
    setScenario,
    totalEnergy,
    setParameters(patch: Partial<AnnealingParameters>) {
      if (
        Reflect.ownKeys(patch).some(
          (k) =>
            !["coolingRate", "swapRadius", "acceptEqualChanges"].includes(
              String(k),
            ),
        )
      )
        throw new TypeError("Setup-only parameter.");
      settings = parameters(inputs, { ...settings, ...patch });
    },
    read() {
      return {
        width,
        height,
        tick: world.tick.value,
        parameters: { ...settings },
        temperature,
        globalEnergy,
        attempts,
        accepted,
        randomState: random.state,
        brightness: fields.map((f) => f.brightness),
        cells: fields.map((f) => ({
          id: f.id,
          x: f.x,
          y: f.y,
          brightness: f.brightness,
        })),
        history: history.map((p) => ({ ...p })),
      };
    },
  };
}
export const model = {
  title: "Simulated Annealing",
  description:
    "Anisotropic image energy and temperature-only swap acceptance. Stonedahl and Wilensky (2009), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<AnnealingParameters, ReturnType<typeof create>>;
