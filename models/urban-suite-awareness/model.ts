/** Adapted from Felsen and Wilensky's Urban Suite - Awareness (2007).
 * Copyright 2007 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md/source.nlogox.
 * Changes: public typed composition, centered coordinates, Mulberry RNG,
 * atomic fixtures, finite empty means and detached bounded observations.
 */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface AwarenessParameters {
  seed: number;
  people: number;
  centers: number;
  nonUsageLimit: number;
}
export const inputs: Inputs<AwarenessParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  people: { kind: "number", default: 60, min: 0, max: 300, step: 10, integer: true },
  centers: { kind: "number", default: 20, min: 0, max: 100, step: 5, integer: true },
  nonUsageLimit: { kind: "number", default: 100, min: 0, max: 500, step: 5, integer: true },
};
export type CenterKind = "original" | "created";
export interface AwarenessPersonInput { readonly x: number; readonly y: number; readonly heading: number; readonly awareness: number }
export interface CenterInput { readonly x: number; readonly y: number; readonly kind: CenterKind; readonly nonUsage: number }
type Person = Agent<{ awareness: number }>;
interface AwarenessSample {
  readonly tick: number;
  readonly activists: number;
  readonly wellInformed: number;
  readonly aware: number;
  readonly unaware: number;
  readonly centers: number;
  readonly meanAwareness: number | null;
  readonly meanNonUsage: number | null;
}

export function create(options: Partial<AwarenessParameters> = {}) {
  let settings = parameters(inputs, options);
  const width = 37, height = 38;
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: width, y: height, boundary: "wrap" }, { random });
  const grid = Grid.create({ x: width, y: height, boundary: "wrap" }, { state: { center: null as CenterKind | null, nonUsage: 0 } });
  world.add(grid);
  const fields = grid.fields;
  const history: Readonly<AwarenessSample>[] = [];
  const people = () => world.agents as readonly Person[];
  const integer = (upper: number) => Math.floor(random.number() * upper);
  // Full activation snapshots use the public uniform Fisher-Yates variant.
  // Mulberry/order differ from NetLogo; rendering-only asks consume no draws.
  function activation<T>(snapshot: readonly T[]) {
    return random.sample(snapshot, { count: snapshot.length, algorithm: "fisher-yates-descending" });
  }
  function initializePeople() {
    for (let i = 0; i < settings.people; i++) {
      const heading = integer(360);
      const x = random.number() * width - width / 2;
      const y = random.number() * height - height / 2;
      world.add(Agent.create({ awareness: 0 }, { position: { x, y }, orientation: { heading } }));
    }
  }
  function measurement() {
    const population = people();
    const counts = { activists: 0, wellInformed: 0, aware: 0, unaware: 0, centers: 0 };
    let awareness = 0, nonUsage = 0;
    for (const person of population) {
      awareness += person.awareness;
      if (person.awareness >= 15) counts.activists++;
      else if (person.awareness >= 10) counts.wellInformed++;
      else if (person.awareness >= 5) counts.aware++;
      else counts.unaware++;
    }
    for (const field of fields) if (field.center !== null) { counts.centers++; nonUsage += field.nonUsage; }
    return {
      counts,
      meanAwareness: population.length ? awareness / population.length : null,
      meanNonUsage: counts.centers ? nonUsage / counts.centers : null,
    };
  }
  function record() {
    const observed = measurement();
    const point = Object.freeze({ tick: world.tick.value, ...observed.counts, meanAwareness: observed.meanAwareness, meanNonUsage: observed.meanNonUsage });
    if (history.at(-1)?.tick === point.tick) history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 1001) history.splice(1, 1);
  }
  function wander() {
    for (const person of activation(people())) {
      person.move(1);
      person.rotate(-integer(50));
      person.rotate(integer(50));
    }
  }
  function experienceCenters() {
    // This phase is independent of activation order and deliberately uses no shuffle.
    for (const person of people()) {
      const field = grid.fieldAt(person)!;
      person.awareness += field.center === null ? -1 : 5;
      field.nonUsage = 0;
    }
  }
  function informOthers() {
    // Senders are frozen at ask entry; receivers are selected anew per sender.
    const senders = people().filter(person => person.awareness >= 10);
    for (const sender of activation(senders)) {
      const candidates = grid.agentsAt(grid.fieldAt(sender)!).filter((person): person is Person =>
        person !== sender && (person as Person).awareness >= 0 && (person as Person).awareness < 10);
      for (const recipient of activation(candidates)) recipient.awareness++;
    }
  }
  function clampAwareness() {
    for (const person of people()) person.awareness = Math.max(0, Math.min(15, person.awareness));
  }
  function createCenters() {
    for (const activist of activation(people().filter(person => person.awareness >= 15))) {
      const vacant = grid.neighbors(grid.fieldAt(activist)!, { neighborhood: "moore" }).filter(field => field.center === null);
      if (vacant.length) random.sample(vacant)[0]!.center = "created";
    }
  }
  function expireCenters() {
    // No center competes with another here; deterministic order omits only an independent ask shuffle.
    for (const field of fields) if (field.center !== null) {
      if (grid.agentsAt(field).length === 0) field.nonUsage++;
      if (field.nonUsage > settings.nonUsageLimit) field.center = null;
    }
  }
  function go() { wander(); experienceCenters(); informOthers(); clampAwareness(); createCenters(); expireCenters(); }

  initializePeople();
  for (const field of random.sample(fields, { count: settings.centers })) field.center = "original";
  record();

  function centerAt(value: unknown) {
    if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
      Reflect.ownKeys(value).length !== 2 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["x", "y"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
      throw new TypeError("Supply x/y center coordinates as plain data.");
    const point = value as { x: number; y: number };
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new RangeError("Center coordinates must be finite.");
    const field = grid.fieldAt(point);
    if (!field || field.x !== point.x || field.y !== point.y) throw new RangeError("Use exact centered cell coordinates.");
    return field;
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) { run(world, go); record(); }
    },
    setRules(rules: Partial<Pick<AwarenessParameters, "nonUsageLimit">>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => key !== "nonUsageLimit" || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only the live nonUsageLimit rule as data.");
      settings = parameters(inputs, { ...settings, ...rules });
      record();
    },
    setPeople(values: readonly AwarenessPersonInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length > 300)
        throw new RangeError("Supply at most300 people.");
      const copied: AwarenessPersonInput[] = [];
      for (let i = 0; i < values.length; i++) {
        const item = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = item && "value" in item ? item.value : undefined;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          Reflect.ownKeys(value).length !== 4 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["x", "y", "heading", "awareness"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
          throw new TypeError("Supply x/y/heading/awareness person data.");
        const person = value as AwarenessPersonInput;
        if (![person.x, person.y, person.heading, person.awareness].every(Number.isFinite) || person.x < -width / 2 || person.x >= width / 2 || person.y < -height / 2 || person.y >= height / 2 || person.awareness < 0 || person.awareness > 15)
          throw new RangeError("Invalid person position, heading or awareness.");
        copied.push({ x: person.x, y: person.y, heading: person.heading, awareness: person.awareness });
      }
      for (const person of people()) person.delete();
      for (const person of copied) world.add(Agent.create({ awareness: person.awareness }, { position: { x: person.x, y: person.y }, orientation: { heading: person.heading } }));
      record();
    },
    setCenters(values: readonly CenterInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype) throw new TypeError("Supply a center array.");
      const copied: { field: typeof fields[number]; kind: CenterKind; nonUsage: number }[] = [];
      const seen = new Set<typeof fields[number]>();
      for (let i = 0; i < values.length; i++) {
        const item = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = item && "value" in item ? item.value : undefined;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          Reflect.ownKeys(value).length !== 4 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["x", "y", "kind", "nonUsage"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
          throw new TypeError("Supply x/y/kind/nonUsage center data.");
        const center = value as CenterInput;
        const field = centerAt({ x: center.x, y: center.y });
        if (!["original", "created"].includes(center.kind) || !Number.isSafeInteger(center.nonUsage) || center.nonUsage < 0 || seen.has(field))
          throw new RangeError("Invalid or duplicate center.");
        copied.push({ field, kind: center.kind, nonUsage: center.nonUsage }); seen.add(field);
      }
      for (const field of fields) { field.center = null; field.nonUsage = 0; }
      for (const center of copied) { center.field.center = center.kind; center.field.nonUsage = center.nonUsage; }
      record();
    },
    placeCenter(point: { readonly x: number; readonly y: number }) {
      centerAt(point).center = "original"; // Source painting deliberately retains nonUsage.
      record();
    },
    read() {
      const observed = measurement();
      return Object.freeze({
        tick: world.tick.value, width, height, parameters: settings,
        people: Object.freeze(people().map(person => Object.freeze({ id: person.id, x: person.x, y: person.y, heading: person.heading, awareness: person.awareness }))),
        cells: Object.freeze(fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y, center: field.center, nonUsage: field.nonUsage }))),
        counts: Object.freeze(observed.counts), meanAwareness: observed.meanAwareness, meanNonUsage: observed.meanNonUsage,
        history: Object.freeze([...history]), randomState: random.state, done: false as const,
      });
    },
  };
}
export const model = {
  title: "Urban Suite - Awareness",
  description: "Local contact, awareness centers and disuse on a torus. Adapted from Felsen and Wilensky (2007), CC BY-NC-SA3.0.",
  inputs, create,
} satisfies Definition<AwarenessParameters, ReturnType<typeof create>>;
