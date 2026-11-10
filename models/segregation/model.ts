/** Adapted from NetLogo Segregation, Uri Wilensky (1997), CC BY-NC-SA 3.0.
 * https://ccl.northwestern.edu/netlogo/models/Segregation
 * Served NetLogo 7.0.4 source is archived beside this module; see NOTICE.md.
 * Changes: typed headless composition, Mulberry RNG, iterative random walk,
 * explicit interventions, bounded observations and safe undefined/full-grid cases.
 */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface SegregationParameters {
  width: number;
  height: number;
  seed: number;
  density: number;
  similarWanted: number;
}
export const inputs: Inputs<SegregationParameters> = {
  width: { kind: "number", default: 51, min: 3, max: 101, integer: true },
  height: { kind: "number", default: 51, min: 3, max: 101, integer: true },
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  density: { kind: "number", default: 95, min: 50, max: 99, integer: true },
  similarWanted: { kind: "number", default: 30, min: 0, max: 100, integer: true },
};
export interface ResidentInput {
  readonly x: number;
  readonly y: number;
  readonly group: "blue" | "orange";
}
type Resident = Agent<{
  group: ResidentInput["group"];
  happy: boolean;
  similarNeighborCount: number;
  otherNeighborCount: number;
  neighborCount: number;
}>;
interface Measurement {
  readonly tick: number;
  readonly personCount: number;
  readonly unhappyPersonCount: number;
  readonly percentSimilar: number;
  readonly percentUnhappy: number;
}

export function create(options: Partial<SegregationParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: settings.width, y: settings.height, boundary: "wrap" as const };
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  const fields = grid.fields;
  const history: Readonly<Measurement>[] = [];

  function residents(): Resident[] {
    return [...world.agents] as Resident[];
  }
  function addResident(input: ResidentInput, heading: number) {
    world.add(Agent.create({
      group: input.group,
      happy: true,
      similarNeighborCount: 0,
      otherNeighborCount: 0,
      neighborCount: 0,
    }, { position: { x: input.x, y: input.y }, orientation: { heading } }));
  }
  function updateResidents() {
    const population = residents();
    // Detached, phase-local group counts are an observation of canonical positions.
    // They are rebuilt after movement; they never own or update occupancy.
    const groups = new Map<typeof fields[number], { bluePersonCount: number; orangePersonCount: number }>();
    for (const resident of population) {
      const field = grid.fieldAt(resident)!;
      const count = groups.get(field) ?? { bluePersonCount: 0, orangePersonCount: 0 };
      count[resident.group === "blue" ? "bluePersonCount" : "orangePersonCount"] += 1;
      groups.set(field, count);
    }
    for (const resident of population) {
      let blue = 0;
      let orange = 0;
      for (const neighbor of grid.neighbors(grid.fieldAt(resident)!)) {
        const count = groups.get(neighbor);
        if (count) { blue += count.bluePersonCount; orange += count.orangePersonCount; }
      }
      resident.similarNeighborCount = resident.group === "blue" ? blue : orange;
      resident.otherNeighborCount = resident.group === "blue" ? orange : blue;
      resident.neighborCount = blue + orange;
      resident.happy = resident.similarNeighborCount >= settings.similarWanted * resident.neighborCount / 100;
    }
  }
  function measure(): Measurement {
    const population = residents();
    const unhappyPersonCount = population.filter((resident) => !resident.happy).length;
    const similar = population.reduce((sum, resident) => sum + resident.similarNeighborCount, 0);
    const total = population.reduce((sum, resident) => sum + resident.neighborCount, 0);
    return {
      tick: world.tick.value,
      personCount: population.length,
      unhappyPersonCount: unhappyPersonCount,
      percentSimilar: total === 0 ? 0 : 100 * similar / total,
      percentUnhappy: population.length === 0 ? 0 : 100 * unhappyPersonCount / population.length,
    };
  }
  function record() {
    const point = Object.freeze(measure());
    if (history.at(-1)?.tick === point.tick) history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 1001) history.splice(1, 1);
  }
  function stopReason(): "all-happy" | "no-vacancy" | null {
    const population = residents();
    if (population.every((resident) => resident.happy)) return "all-happy";
    if (population.length === fields.length) return "no-vacancy";
    return null;
  }
  function findNewSpot(resident: Resident) {
    // Source recursively turns and walks again on an occupied cell. This loop
    // preserves that search, without a recursion limit or a uniform-cell shortcut.
    for (;;) {
      resident.rotate(random.number() * 360);
      resident.move(random.number() * 10);
      const field = grid.fieldAt(resident)!;
      // World membership is exactly the resident population. The implicit query
      // observes preceding moves through the library's canonical occupancy index.
      if (grid.agentsAt(field).every((other) => other === resident)) {
        resident.move({ to: field });
        return;
      }
    }
  }
  function moveUnhappyResidents() {
    const population = residents();
    const unhappy = population.filter((resident) => !resident.happy);
    for (const resident of random.sample(unhappy, { sampleCount: unhappy.length })) {
      findNewSpot(resident);
    }
    updateResidents();
  }

  for (const field of random.sample(fields, { sampleCount: fields.length })) {
    if (Math.floor(random.number() * 100) < settings.density) {
      const group = random.number() < 0.5 ? "blue" : "orange";
      addResident({ x: field.x, y: field.y, group }, Math.floor(random.number() * 360));
    }
  }
  updateResidents();
  record();

  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        if (stopReason()) break;
        run(world, moveUnhappyResidents);
        record();
      }
    },
    setRules(rules: Partial<Pick<SegregationParameters, "similarWanted">>) {
      if (typeof rules !== "object" || rules === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some((key) => key !== "similarWanted" ||
          !("value" in Object.getOwnPropertyDescriptor(rules, key)!))) {
        throw new TypeError("Supply only a similarWanted data property.");
      }
      const next = parseParameters(inputs, { ...settings, ...rules });
      settings = next;
      updateResidents();
      record();
    },
    setResidents(values: readonly ResidentInput[]) {
      if (!Array.isArray(values)) throw new TypeError("Supply an array of resident records.");
      const copied = Array.from(values, (value): ResidentInput => {
        if (typeof value !== "object" || value === null ||
          ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          Reflect.ownKeys(value).some((key) => !["x", "y", "group"].includes(String(key)) ||
            !("value" in Object.getOwnPropertyDescriptor(value, key)!))) {
          throw new TypeError("Supply resident x, y and group data properties.");
        }
        const { x, y, group } = value;
        if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y) ||
          (group !== "blue" && group !== "orange")) throw new RangeError("Invalid resident coordinates or group.");
        const field = grid.fieldAt({ x, y });
        if (!field || field.x !== x || field.y !== y) throw new RangeError("Residents require exact in-bounds grid centers.");
        return { x, y, group };
      });
      const positions = new Set(copied.map(({ x, y }) => `${x},${y}`));
      if (positions.size !== copied.length) throw new RangeError("Each grid cell admits at most one resident.");
      for (const resident of residents()) resident.delete();
      // A deterministic intervention does not consume simulation randomness.
      for (const resident of copied) addResident(resident, 0);
      updateResidents();
      record();
    },
    read() {
      const measurement = measure();
      const reason = stopReason();
      return Object.freeze({
        tick: measurement.tick,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        residents: Object.freeze(residents().map((resident) => Object.freeze({
          id: resident.id, x: resident.x, y: resident.y, group: resident.group,
          happy: resident.happy, similarNeighborCount: resident.similarNeighborCount,
          otherNeighborCount: resident.otherNeighborCount, neighborCount: resident.neighborCount,
        }))),
        counts: Object.freeze({ personCount: measurement.personCount, unhappyPersonCount: measurement.unhappyPersonCount }),
        percentSimilar: measurement.percentSimilar,
        percentUnhappy: measurement.percentUnhappy,
        done: reason !== null,
        stopReason: reason,
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Segregation",
  description: "Local similarity preferences and sequential relocation. Adapted from Uri Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<SegregationParameters, ReturnType<typeof create>>;
