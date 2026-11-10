/** Adapted from Felsen and Wilensky's Urban Suite - Recycling (2007).
 * Copyright 2007 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md/source.nlogox.
 * Changes: typed headless public composition, Mulberry RNG, atomic fixtures
 * and detached observations/history. Discrete source trial semantics retained.
 */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface RecyclingParameters {
  seed: number;
  recyclerCount: number;
  wastefulCount: number;
  maxStoredEnergy: number;
  recyclingWasteCost: number;
  resourceRegeneration: number;
  agentsSeekResources: boolean;
  showEnergy: boolean;
}
export const inputs: Inputs<RecyclingParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  recyclerCount: { kind: "number", default: 25, min: 0, max: 50, integer: true },
  wastefulCount: { kind: "number", default: 25, min: 0, max: 50, integer: true },
  maxStoredEnergy: { kind: "number", default: 50, min: 10, max: 100, step: 5, integer: true },
  recyclingWasteCost: { kind: "number", default: 0.5, min: 0, max: 2, step: 0.25 },
  resourceRegeneration: { kind: "number", default: 25, min: 0, max: 100, integer: true },
  agentsSeekResources: { kind: "boolean", default: false },
  showEnergy: { kind: "boolean", default: true },
};
export type Resource = "new" | "recycled" | "waste";
export type PersonKind = "recycler" | "wasteful";
export interface RecyclingPersonInput { readonly kind: PersonKind; readonly x: number; readonly y: number; readonly heading: number; readonly energy: number }
type Person = Agent<{ kind: PersonKind; energy: number }>;
type LiveRules = Pick<RecyclingParameters, "maxStoredEnergy" | "recyclingWasteCost" | "resourceRegeneration" | "agentsSeekResources" | "showEnergy">;
interface RecyclingSample {
  readonly tick: number;
  readonly recyclerCount: number;
  readonly wastefulPersonCount: number;
  readonly new: number;
  readonly recycled: number;
  readonly waste: number;
}

export function create(options: Partial<RecyclingParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const width = 35, height = 35;
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: width, y: height, boundary: "wrap" }, { random });
  const grid = Grid.create({ x: width, y: height, boundary: "wrap" }, { state: { resource: "new" as Resource } });
  world.add(grid);
  const fields = grid.fields;
  const history: Readonly<RecyclingSample>[] = [];
  const people = () => world.agents as readonly Person[];
  const integer = (upper: number) => Math.floor(random.number() * upper);
  // Explicit target ask policy: uniform Fisher-Yates snapshots through public Random.
  function activation<T>(snapshot: readonly T[]) {
    return random.sample(snapshot, { sampleCount: snapshot.length, algorithm: "fisher-yates-descending" });
  }
  function initializePeople(kind: PersonKind, count: number) {
    for (let i = 0; i < count; i++) {
      const heading = integer(360), x = integer(width) - 17, y = integer(height) - 17;
      world.add(Agent.create({ kind, energy: settings.maxStoredEnergy / 2 }, { position: { x, y }, orientation: { heading } }));
    }
  }
  function measurement() {
    const counts = { recyclerCount: 0, wastefulPersonCount: 0 };
    for (const person of people()) if (person.kind === "recycler") counts.recyclerCount++; else counts.wastefulPersonCount++;
    const resources = { new: 0, recycled: 0, waste: 0 };
    for (const field of fields) resources[field.resource]++;
    return {
      counts,
      landPercentages: { new: resources.new / fields.length * 100, recycled: resources.recycled / fields.length * 100, waste: resources.waste / fields.length * 100 },
    };
  }
  function record() {
    const observed = measurement();
    const point = Object.freeze({ tick: world.tick.value, ...observed.counts, ...observed.landPercentages });
    if (history.at(-1)?.tick === point.tick) history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 1001) history.splice(1, 1);
  }
  function processRecyclerField(person: Person) {
    const field = grid.fieldAt(person)!;
    if (field.resource === "new") {
      if (person.energy <= settings.maxStoredEnergy - 2) person.energy += 2;
    } else if (field.resource === "recycled") {
      if (person.energy <= settings.maxStoredEnergy - 1) person.energy++;
    } else {
      person.energy -= settings.recyclingWasteCost;
      field.resource = "recycled";
    }
  }
  function processWastefulField(person: Person) {
    const field = grid.fieldAt(person)!;
    if (field.resource === "new" && person.energy <= settings.maxStoredEnergy - 4) {
      person.energy += 4; field.resource = "waste";
    } else if (field.resource === "recycled" && person.energy <= settings.maxStoredEnergy - 2) {
      person.energy += 2; field.resource = "waste";
    }
  }
  function movePeople() {
    for (const person of activation(people())) {
      const neighbors = grid.neighbors(grid.fieldAt(person)!, { neighborhood: "moore" });
      let target = random.sample(neighbors)[0]!; // Draw fallback even if seeking overrides it.
      if (settings.agentsSeekResources) {
        const fresh = neighbors.filter(field => field.resource === "new");
        if (fresh.length) target = random.sample(fresh)[0]!;
        else {
          const recycled = neighbors.filter(field => field.resource === "recycled");
          if (recycled.length) target = random.sample(recycled)[0]!;
        }
      }
      person.rotate({ towards: target });
      person.move({ to: target });
      person.energy--;
      if (person.energy > settings.maxStoredEnergy) person.energy = settings.maxStoredEnergy;
      if (person.energy < 0) person.delete();
    }
  }
  function regenerateResources() {
    const threshold = settings.resourceRegeneration / 10;
    for (const field of activation(fields.filter(field => field.resource === "recycled")))
      if (integer(100) < threshold) field.resource = "new";
    for (const field of activation(fields.filter(field => field.resource === "waste")))
      if (integer(5) === 0 && integer(100) < threshold) field.resource = "new";
  }
  function go() {
    for (const person of activation(people().filter(person => person.kind === "recycler"))) processRecyclerField(person);
    for (const person of activation(people().filter(person => person.kind === "wasteful"))) processWastefulField(person);
    movePeople(); regenerateResources();
  }

  initializePeople("recycler", settings.recyclerCount);
  initializePeople("wasteful", settings.wastefulCount);
  record();

  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) { run(world, go); record(); }
    },
    setRules(rules: Partial<LiveRules>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => typeof key !== "string" || !["maxStoredEnergy", "recyclingWasteCost", "resourceRegeneration", "agentsSeekResources", "showEnergy"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only live recycling rule data.");
      settings = parseParameters(inputs, { ...settings, ...rules });
      record();
    },
    setPeople(values: readonly RecyclingPersonInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype) throw new TypeError("Supply a people array.");
      const copied: RecyclingPersonInput[] = [];
      const counts = { recyclerCount: 0, wastefulPersonCount: 0 };
      for (let i = 0; i < values.length; i++) {
        const item = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = item && "value" in item ? item.value : undefined;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          Reflect.ownKeys(value).length !== 5 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["kind", "x", "y", "heading", "energy"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
          throw new TypeError("Supply kind/x/y/heading/energy person data.");
        const person = value as RecyclingPersonInput;
        if (!["recycler", "wasteful"].includes(person.kind) || ![person.x, person.y, person.heading, person.energy].every(Number.isFinite) ||
          !Number.isInteger(person.x) || person.x < -17 || person.x > 17 || !Number.isInteger(person.y) || person.y < -17 || person.y > 17 || ++counts[person.kind === "recycler" ? "recyclerCount" : "wastefulPersonCount"] > 50)
          throw new RangeError("Invalid discrete person state or kind count.");
        copied.push({ kind: person.kind, x: person.x, y: person.y, heading: person.heading, energy: person.energy });
      }
      for (const person of people()) person.delete();
      for (const person of copied) world.add(Agent.create({ kind: person.kind, energy: person.energy }, { position: { x: person.x, y: person.y }, orientation: { heading: person.heading } }));
      record();
    },
    setResources(values: readonly Resource[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length !== fields.length) throw new RangeError("Supply one resource per field.");
      const copied: Resource[] = [];
      for (let i = 0; i < values.length; i++) {
        const item = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = item && "value" in item ? item.value : undefined;
        if (value !== "new" && value !== "recycled" && value !== "waste") throw new TypeError("Resources must be new/recycled/waste data values.");
        copied.push(value);
      }
      for (let i = 0; i < fields.length; i++) fields[i]!.resource = copied[i]!;
      record();
    },
    read() {
      const observed = measurement();
      return Object.freeze({
        tick: world.tick.value, width, height, parameters: settings,
        people: Object.freeze(people().map(person => Object.freeze({ id: person.id, kind: person.kind, x: person.x, y: person.y, heading: person.heading, energy: person.energy }))),
        cells: Object.freeze(fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y, resource: field.resource }))),
        counts: Object.freeze(observed.counts), landPercentages: Object.freeze(observed.landPercentages),
        history: Object.freeze([...history]), randomState: random.state, done: false as const,
      });
    },
  };
}
export const model = {
  title: "Recycling and Resource Use",
  description: "Recyclers and wasteful residents use the same resources at different costs to the environment. Adapted from Felsen and Wilensky (2007), CC BY-NC-SA 3.0.",
  inputs, create,
} satisfies Definition<RecyclingParameters, ReturnType<typeof create>>;
