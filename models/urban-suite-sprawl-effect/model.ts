/** Adapted from Felsen and Wilensky (2007), Copyright Uri Wilensky.
 * CC BY-NC-SA 3.0; unchanged program and credits in source.nlogox/NOTICE.md.
 * Target: public canonical state, Mulberry snapshot activation, explicit fixtures.
 */
import { Agent, Grid, Random, World, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface SprawlParameters {
  seed: number; smoothness: number; maxAttraction: number; population: number;
  seekerSearchAngle: number; seekerPatience: number; waitBetweenSeeking: number;
}
export const inputs: Inputs<SprawlParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  smoothness: { kind: "number", default: 15, min: 1, max: 20, integer: true },
  maxAttraction: { kind: "number", default: 15, min: 0, max: 30, integer: true },
  population: { kind: "number", default: 200, min: 1, max: 750, integer: true },
  seekerSearchAngle: { kind: "number", default: 84, min: 1, max: 360, integer: true },
  seekerPatience: { kind: "number", default: 60, min: 0, max: 120, integer: true },
  waitBetweenSeeking: { kind: "number", default: 15, min: 5, max: 60, integer: true },
};
export type SprawlKind = "seeker" | "house";
export interface SprawlAgentInput {
  readonly kind: SprawlKind; readonly x: number; readonly y: number;
  readonly heading: number; readonly patienceCounter: number; readonly stayCounter: number;
}
type Resident = Agent<{ kind: SprawlKind; patienceCounter: number; stayCounter: number }>;
type LiveRules = Pick<SprawlParameters, "maxAttraction" | "seekerSearchAngle" | "seekerPatience" | "waitBetweenSeeking">;
interface SprawlSample { readonly tick: number; readonly seekers: number; readonly houses: number; readonly totalAttraction: number }

export function create(options: Partial<SprawlParameters> = {}) {
  let settings = parameters(inputs, options);
  const width = 35, height = 35;
  const space = { x: width, y: height, boundary: "wrap" as const };
  const random = Random.add({ seed: settings.seed });
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: { attraction: 0, colorNumber: 50 } });
  world.add(grid);
  const fields = grid.fields;
  const buildThreshold = Math.floor(settings.maxAttraction / 2);
  const history: Readonly<SprawlSample>[] = [];
  const residents = () => world.agents as readonly Resident[];
  // Native random on a nonnegative attraction uses ceil; zero consumes no draw.
  function attractionTrial(attraction: number) {
    if (attraction === 0) return 0;
    return random.number({ min: 0, max: Math.ceil(attraction), integer: true });
  }
  function activation<T>(snapshot: readonly T[]) {
    return random.sample(snapshot, { count: snapshot.length, compatibility: "legacy-shuffle" });
  }
  function recolorLand() {
    // Source scale-color green attraction 2.5 10, clamped to green's 10-unit band.
    for (const field of fields) field.colorNumber = 50 + Math.min(9.9999, Math.max(0, (field.attraction - 2.5) / 7.5 * 10));
  }
  function counts() {
    const result = { seekers: 0, houses: 0 };
    for (const person of residents()) if (person.kind === "seeker") result.seekers++; else result.houses++;
    return result;
  }
  function totalAttraction() { return fields.reduce((sum, field) => sum + field.attraction, 0); }
  function record() {
    const sample = Object.freeze({ tick: world.tick.value, ...counts(), totalAttraction: totalAttraction() });
    if (history.at(-1)?.tick === sample.tick) history[history.length - 1] = sample;
    else history.push(sample);
    if (history.length > 1001) history.splice(1, 1);
  }
  function attractionAhead(person: Resident, heading: number) {
    const direction = geometry.direction({ heading });
    const point = geometry.normalize({ x: person.x + direction.x, y: person.y + direction.y }, { space })!;
    return grid.fieldAt(point)!.attraction;
  }
  function turnTowardAttraction(person: Resident) {
    const ahead = attractionAhead(person, person.heading);
    const right = attractionAhead(person, person.heading + settings.seekerSearchAngle);
    const left = attractionAhead(person, person.heading - settings.seekerSearchAngle);
    if (right > ahead && right > left)
      person.rotate(random.number({ min: 0, max: settings.seekerSearchAngle, integer: true }));
    else if (left > ahead)
      person.rotate(-random.number({ min: 0, max: settings.seekerSearchAngle, integer: true }));
  }
  function seek(person: Resident) {
    const here = grid.fieldAt(person)!;
    // Draw before checking patience, as in the source OR expression.
    if (attractionTrial(here.attraction) >= buildThreshold || person.patienceCounter === 0) {
      person.kind = "house"; person.stayCounter = settings.waitBetweenSeeking;
    } else if (person.patienceCounter > 0) {
      turnTowardAttraction(person);
      person.move(0.5);
      person.patienceCounter--;
      grid.fieldAt(person)!.attraction += 0.01;
    }
  }
  function occupy(person: Resident) {
    const here = grid.fieldAt(person)!;
    if (here.attraction <= settings.maxAttraction * 2) here.attraction += 0.05;
    else here.attraction = 0;
    person.stayCounter--;
    if (person.stayCounter <= 0) { person.kind = "seeker"; person.patienceCounter = settings.seekerPatience; }
  }
  function go() {
    for (const person of activation(residents().filter(person => person.kind === "seeker"))) seek(person);
    // Take this snapshot after seeking, so new houses act immediately.
    for (const person of activation(residents().filter(person => person.kind === "house"))) occupy(person);
    recolorLand();
  }
  for (const field of fields) field.attraction = attractionTrial(settings.maxAttraction);
  for (let i = 0; i < settings.smoothness; i++) grid.diffuse("attraction", { rate: 0.4, neighborhood: "moore" });
  recolorLand();
  for (let i = 0; i < settings.population; i++) world.add(Agent.add({ kind: "seeker" as SprawlKind, patienceCounter: settings.seekerPatience, stayCounter: 0 }, { position: { x: 0, y: 0 }, orientation: { heading: random.number({ min: 0, max: 360, integer: true }) } }));
  record();
  return {
    advance(count = 1) { stepCount(count); for (let i = 0; i < count; i++) { run(world, go); record(); } },
    setRules(rules: Partial<LiveRules>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => typeof key !== "string" || !["maxAttraction", "seekerSearchAngle", "seekerPatience", "waitBetweenSeeking"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(rules, key)!))) throw new TypeError("Supply only live Sprawl rule data.");
      settings = parameters(inputs, { ...settings, ...rules }); record();
    },
    setAttractions(values: readonly number[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || Reflect.ownKeys(values).some(key => key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= values.length)) || values.length !== fields.length) throw new RangeError("Supply one attraction per field.");
      const copied: number[] = [];
      for (let i = 0; i < values.length; i++) {
        const entry = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = entry && "value" in entry ? entry.value : undefined;
        if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || !Number.isSafeInteger(Math.ceil(value))) throw new RangeError("Attractions must be finite nonnegative safe random bounds.");
        copied.push(value);
      }
      for (let i = 0; i < fields.length; i++) fields[i]!.attraction = copied[i]!;
      recolorLand(); record();
    },
    setAgents(values: readonly SprawlAgentInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || Reflect.ownKeys(values).some(key => key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= values.length)) || values.length > 750) throw new RangeError("Supply up to 750 resident fixtures.");
      const copied: SprawlAgentInput[] = [];
      for (let i = 0; i < values.length; i++) {
        const entry = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = entry && "value" in entry ? entry.value : undefined;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) || Reflect.ownKeys(value).length !== 6 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["kind", "x", "y", "heading", "patienceCounter", "stayCounter"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!))) throw new TypeError("Supply complete resident fixture data.");
        const person = value as SprawlAgentInput;
        if (!["seeker", "house"].includes(person.kind) || ![person.x, person.y, person.heading, person.patienceCounter, person.stayCounter].every(Number.isFinite) || person.x < -17.5 || person.x >= 17.5 || person.y < -17.5 || person.y >= 17.5 || !Number.isSafeInteger(person.patienceCounter) || !Number.isSafeInteger(person.stayCounter)) throw new RangeError("Invalid resident fixture; integer signed counters are diagnostic states.");
        copied.push({ kind: person.kind, x: person.x, y: person.y, heading: person.heading, patienceCounter: person.patienceCounter, stayCounter: person.stayCounter });
      }
      for (const person of residents()) person.delete();
      for (const person of copied) world.add(Agent.add({ kind: person.kind, patienceCounter: person.patienceCounter, stayCounter: person.stayCounter }, { position: { x: person.x, y: person.y }, orientation: { heading: person.heading } }));
      record();
    },
    read() {
      return Object.freeze({ tick: world.tick.value, width, height, parameters: settings, buildThreshold,
        cells: Object.freeze(fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y, attraction: field.attraction, colorNumber: field.colorNumber }))),
        agents: Object.freeze(residents().map(person => Object.freeze({ id: person.id, kind: person.kind, x: person.x, y: person.y, heading: person.heading, patienceCounter: person.patienceCounter, stayCounter: person.stayCounter }))),
        counts: Object.freeze(counts()), totalAttraction: totalAttraction(), history: Object.freeze([...history]), randomState: random.state, done: false as const });
    },
  };
}
export const model = { title: "Urban Suite - Sprawl Effect", description: "Seekers settle, return to searching and alter a shared attraction landscape. Adapted from Felsen and Wilensky (2007), CC BY-NC-SA3.0.", inputs, create } satisfies Definition<SprawlParameters, ReturnType<typeof create>>;
