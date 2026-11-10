/** Adapted from Felsen and Wilensky's Urban Suite - Pollution (2007).
 * Copyright 2007 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md/source.nlogox.
 * Changes: headless public composition, Mulberry RNG, explicit atomic fixtures,
 * detached observations and bounded successful-tick history. No visual state.
 */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface PollutionParameters {
  seed: number;
  initialPopulation: number;
  powerPlants: number;
  birthRate: number;
  plantingRate: number;
  pollutingRate: number;
}
export const inputs: Inputs<PollutionParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  initialPopulation: { kind: "number", default: 30, min: 0, max: 100, step: 10, integer: true },
  powerPlants: { kind: "number", default: 2, min: 0, max: 20, integer: true },
  birthRate: { kind: "number", default: 0.10, min: 0, max: 0.20, step: 0.01 },
  plantingRate: { kind: "number", default: 0.05, min: 0, max: 0.10, step: 0.01 },
  pollutingRate: { kind: "number", default: 3, min: 0, max: 5, integer: true },
};
export interface PollutionIndividualInput { readonly x: number; readonly y: number; readonly heading: number; readonly health: number }
export interface EnvironmentInput { readonly pollution: number; readonly powerPlant: boolean }
type Individual = Agent<{ kind: "person" | "tree"; health: number }>;
type LiveRules = Pick<PollutionParameters, "birthRate" | "plantingRate" | "pollutingRate">;
interface PollutionSample { readonly tick: number; readonly people: number; readonly trees: number; readonly powerPlants: number; readonly totalPollution: number }

export function create(options: Partial<PollutionParameters> = {}) {
  let settings = parameters(inputs, options);
  const width = 71, height = 63;
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: width, y: height, boundary: "wrap" }, { random });
  const grid = Grid.create({ x: width, y: height, boundary: "wrap" }, { state: { pollution: 0, powerPlant: false } });
  world.add(grid);
  const fields = grid.fields;
  const history: Readonly<PollutionSample>[] = [];
  const individuals = () => world.agents as readonly Individual[];
  const people = () => individuals().filter(individual => individual.kind === "person");
  const trees = () => individuals().filter(individual => individual.kind === "tree");
  const integer = (upper: number) => Math.floor(random.number() * upper);
  // Uniform Fisher-Yates on full ask snapshots; no source RNG equivalence implied.
  function activation<T>(snapshot: readonly T[]) {
    return random.sample(snapshot, { count: snapshot.length, compatibility: "legacy-shuffle" });
  }
  function pollute() {
    for (const field of fields) if (field.powerPlant) field.pollution = settings.pollutingRate;
  }
  function measurement() {
    return {
      counts: { people: people().length, trees: trees().length, powerPlants: fields.filter(field => field.powerPlant).length },
      totalPollution: fields.reduce((sum, field) => sum + field.pollution, 0),
    };
  }
  function record() {
    const observed = measurement();
    const point = Object.freeze({ tick: world.tick.value, ...observed.counts, totalPollution: observed.totalPollution });
    if (history.at(-1)?.tick === point.tick) history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 1001) history.splice(1, 1);
  }
  function wander(person: Individual) {
    person.rotate(random.number() * 50);
    person.rotate(-random.number() * 50);
    person.move(1);
    person.health -= 0.1;
  }
  function reproduce(person: Individual) {
    if (person.health > 4 && random.number() < settings.birthRate) {
      const child = person.copy();
      child.health = 5;
      world.add(child);
    }
  }
  function plantTree(person: Individual) {
    if (random.number() < settings.plantingRate) {
      const tree = person.copy();
      tree.kind = "tree";
      tree.health = 5;
      world.add(tree);
    }
  }
  function eatPollution(person: Individual) {
    const pollution = grid.fieldAt(person)!.pollution;
    if (pollution > 0.5) person.health -= pollution / 10;
  }
  function maybeDie(individual: Individual) { if (individual.health <= 0) individual.delete(); }
  function cleanup(tree: Individual) {
    const field = grid.fieldAt(tree)!;
    field.pollution = Math.max(0, field.pollution - 1);
    for (const neighbor of grid.neighbors(field, { neighborhood: "moore" })) neighbor.pollution = Math.max(0, neighbor.pollution - 0.5);
    tree.health -= 0.1;
  }
  function go() {
    // Each complete person procedure runs before the next. Newborn people are
    // outside this snapshot, while newly planted trees enter the later tree ask.
    for (const person of activation(people())) {
      wander(person); reproduce(person); plantTree(person); eatPollution(person); maybeDie(person);
    }
    grid.diffuse("pollution", { rate: 0.8, neighborhood: "moore" });
    pollute();
    for (const tree of activation(trees())) { cleanup(tree); maybeDie(tree); }
  }

  for (const field of random.sample(fields, { count: settings.powerPlants })) field.powerPlant = true;
  pollute();
  for (let i = 0; i < settings.initialPopulation; i++) {
    const heading = integer(360), x = integer(width) - 35, y = integer(height) - 31;
    world.add(Agent.create({ kind: "person", health: 5 } as { kind: "person" | "tree"; health: number }, { position: { x, y }, orientation: { heading } }));
  }
  record();

  function replaceIndividuals(kind: "person" | "tree", values: readonly PollutionIndividualInput[]) {
    if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype) throw new TypeError("Supply an individual array.");
    const copied: PollutionIndividualInput[] = [];
    for (let i = 0; i < values.length; i++) {
      const item = Object.getOwnPropertyDescriptor(values, String(i));
      const value: unknown = item && "value" in item ? item.value : undefined;
      if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
        Reflect.ownKeys(value).length !== 4 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["x", "y", "heading", "health"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
        throw new TypeError("Supply x/y/heading/health individual data.");
      const individual = value as PollutionIndividualInput;
      if (![individual.x, individual.y, individual.heading, individual.health].every(Number.isFinite) || individual.x < -width / 2 || individual.x >= width / 2 || individual.y < -height / 2 || individual.y >= height / 2)
        throw new RangeError("Invalid individual position, heading or health.");
      copied.push({ x: individual.x, y: individual.y, heading: individual.heading, health: individual.health });
    }
    for (const individual of individuals().filter(individual => individual.kind === kind)) individual.delete();
    for (const individual of copied)
      world.add(Agent.create({ kind, health: individual.health }, { position: { x: individual.x, y: individual.y }, orientation: { heading: individual.heading } }));
    record();
  }
  function observeIndividual(individual: Individual) {
    return Object.freeze({ id: individual.id, x: individual.x, y: individual.y, heading: individual.heading, health: individual.health });
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        if (people().length === 0) break;
        run(world, go); record();
      }
    },
    setRules(rules: Partial<LiveRules>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => typeof key !== "string" || !["birthRate", "plantingRate", "pollutingRate"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only live pollution rule data.");
      settings = parameters(inputs, { ...settings, ...rules });
      record();
    },
    setPeople(values: readonly PollutionIndividualInput[]) { replaceIndividuals("person", values); },
    setTrees(values: readonly PollutionIndividualInput[]) { replaceIndividuals("tree", values); },
    setEnvironment(values: readonly EnvironmentInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length !== fields.length) throw new RangeError("Supply one environment record per field.");
      const copied: EnvironmentInput[] = [];
      for (let i = 0; i < values.length; i++) {
        const item = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = item && "value" in item ? item.value : undefined;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          Reflect.ownKeys(value).length !== 2 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["pollution", "powerPlant"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
          throw new TypeError("Supply pollution/powerPlant environment data.");
        const environment = value as EnvironmentInput;
        if (!Number.isFinite(environment.pollution) || environment.pollution < 0 || typeof environment.powerPlant !== "boolean") throw new RangeError("Invalid pollution or power-plant flag.");
        copied.push({ pollution: environment.pollution, powerPlant: environment.powerPlant });
      }
      // The diffusion/reporting contract requires finite totals as well as cells.
      if (!Number.isFinite(copied.reduce((sum, field) => sum + field.pollution, 0))) throw new RangeError("Total pollution must be finite.");
      for (let i = 0; i < fields.length; i++) { fields[i]!.pollution = copied[i]!.pollution; fields[i]!.powerPlant = copied[i]!.powerPlant; }
      record();
    },
    read() {
      const observed = measurement();
      return Object.freeze({
        tick: world.tick.value, width, height, parameters: settings,
        people: Object.freeze(people().map(observeIndividual)), trees: Object.freeze(trees().map(observeIndividual)),
        cells: Object.freeze(fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y, pollution: field.pollution, powerPlant: field.powerPlant }))),
        counts: Object.freeze(observed.counts), totalPollution: observed.totalPollution,
        history: Object.freeze([...history]), randomState: random.state, done: observed.counts.people === 0,
      });
    },
  };
}
export const model = {
  title: "Urban Suite - Pollution",
  description: "Moving people, plant-reset pollution and tree cleanup. Adapted from Felsen and Wilensky (2007), CC BY-NC-SA3.0.",
  inputs, create,
} satisfies Definition<PollutionParameters, ReturnType<typeof create>>;
