/** Adapted from Rand and Wilensky's Urban Suite - Path Dependence (2007).
 * Copyright 2007 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md/source.nlogox.
 * Preserves the inverted distribute branch and repeated search after settlement.
 * Mulberry/Fisher-Yates and pure tie reporting differ from source RNG behavior.
 */
import { Agent, Grid, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface PathParameters {
  seed: number; initialFirms: number; distribute: boolean;
  regionSize: number; increasingReturns: number; attempts: number; birth: boolean;
}
export const inputs: Inputs<PathParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  initialFirms: { kind: "number", default: 200, min: 0, max: 1000, integer: true },
  distribute: { kind: "boolean", default: false },
  regionSize: { kind: "number", default: 0, min: 0, max: 5, integer: true },
  increasingReturns: { kind: "number", default: 0.5, min: 0, max: 1, step: 0.01 },
  attempts: { kind: "number", default: 1, min: 1, max: 20, integer: true },
  birth: { kind: "boolean", default: false },
};
export interface FirmInput { readonly x: number; readonly y: number; readonly heading: number; readonly movedIn: boolean }
type Firm = Agent<{ movedIn: boolean }>;
type LiveRules = Pick<PathParameters, "regionSize" | "increasingReturns" | "attempts" | "birth">;
interface PathSample { readonly tick: number; readonly firms: number; readonly settled: number; readonly searching: number; readonly largestPopulation: number }

export function create(options: Partial<PathParameters> = {}) {
  let settings = parameters(inputs, options);
  const width = 11, height = 11;
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: width, y: height, boundary: "wrap" }, { random });
  const grid = Grid.create({ x: width, y: height, boundary: "wrap" }, { state: { quality: 0 } });
  world.add(grid);
  const fields = grid.fields;
  const firms = () => world.agents as readonly Firm[];
  const warnings: string[] = [];
  const history: Readonly<PathSample>[] = [];
  let largestPopulation = 0;
  const integer = (upper: number) => Math.floor(random.number() * upper);
  const activation = <T>(snapshot: readonly T[]) => random.sample(snapshot, { count: snapshot.length, algorithm: "fisher-yates-descending" });

  function regionalPopulation(at: { readonly x: number; readonly y: number }) {
    // Source movement remains on exact field centers. At radius0 the public
    // canonical occupancy query is the same all-firm/self-inclusive population.
    if (settings.regionSize === 0) return grid.agentsAt(grid.fieldAt(at)!).length;
    return firms().filter(firm => firm.distanceTo(at, { space: world.space }) <= settings.regionSize).length;
  }
  function updateLargestPopulation() {
    largestPopulation = Math.max(...fields.map(field => regionalPopulation(field)));
  }
  function counts() {
    const all = firms();
    const settled = all.filter(firm => firm.movedIn).length;
    return { firms: all.length, settled, searching: all.length - settled };
  }
  function record() {
    const sample = Object.freeze({ tick: world.tick.value, ...counts(), largestPopulation });
    if (history.at(-1)?.tick === sample.tick) history[history.length - 1] = sample;
    else history.push(sample);
    if (history.length > 1001) history.splice(1, 1);
  }
  function immigrate(position: { readonly x: number; readonly y: number }) {
    const firm = Agent.create({ movedIn: false }, { position, orientation: { heading: integer(4) * 90 } });
    world.add(firm);
    return firm;
  }
  function suitability(firm: Firm) {
    const quality = grid.fieldAt(firm)!.quality;
    return quality * (1 - settings.increasingReturns) + settings.increasingReturns * (regionalPopulation(firm) / largestPopulation);
  }
  function wander(firm: Firm) {
    firm.rotate(integer(2) * 90);
    firm.rotate(-integer(2) * 90);
    firm.move(1);
    // Eliminate trig roundoff while retaining the source's cardinal field walk.
    firm.move({ to: grid.fieldAt(firm)! });
  }
  function search(firm: Firm) {
    for (let attempt = 0; attempt < settings.attempts; attempt++) {
      wander(firm);
      if (random.number() < suitability(firm)) firm.movedIn = true;
      // A later failure does not undo an earlier success. Never break early.
    }
  }
  function go() {
    if (settings.birth) {
      const parent = random.sample(firms(), { count: 1 })[0]!;
      const child = parent.copy();
      child.movedIn = false;
      child.rotate(integer(4) * 90 - child.heading);
      world.add(child);
    }
    updateLargestPopulation();
    for (const firm of activation(firms().filter(firm => firm.movedIn)))
      if (random.number() > suitability(firm)) firm.movedIn = false;
    for (const firm of activation(firms().filter(firm => !firm.movedIn))) search(firm);
    updateLargestPopulation();
  }

  if (settings.distribute) {
    if (settings.initialFirms > fields.length) {
      // The first source repeat fills all fields; subsequent empty repeats do nothing.
      for (const field of activation(fields)) immigrate(field);
    } else warnings.push("Can't distribute, fewer fields than people.");
  } else {
    for (let i = 0; i < settings.initialFirms; i++) {
      const heading = integer(4) * 90;
      const x = integer(width) - 5, y = integer(height) - 5;
      world.add(Agent.create({ movedIn: false }, { position: { x, y }, orientation: { heading } }));
    }
  }
  updateLargestPopulation();
  for (const field of fields) field.quality = random.number();
  record();

  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        if (settings.birth && firms().length === 0) throw new RangeError("Cannot birth a firm without an existing parent.");
        run(world, go); record();
      }
    },
    setRules(rules: Partial<LiveRules>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => typeof key !== "string" || !["regionSize", "increasingReturns", "attempts", "birth"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only live path-dependence rule data.");
      settings = parameters(inputs, { ...settings, ...rules });
      record(); // source largest-population is refreshed at the next go, not a slider edit
    },
    disturb() { for (const firm of firms()) firm.movedIn = false; record(); },
    setFirms(values: readonly FirmInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || Reflect.ownKeys(values).length !== values.length + 1) throw new TypeError("Supply a firm data array.");
      const copied: FirmInput[] = [];
      for (let i = 0; i < values.length; i++) {
        const item = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = item && "value" in item ? item.value : undefined;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          Reflect.ownKeys(value).length !== 4 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["x", "y", "heading", "movedIn"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
          throw new TypeError("Supply x/y/heading/movedIn firm data.");
        const firm = value as FirmInput;
        if (!Number.isInteger(firm.x) || firm.x < -5 || firm.x > 5 || !Number.isInteger(firm.y) || firm.y < -5 || firm.y > 5 || ![0, 90, 180, 270].includes(firm.heading) || typeof firm.movedIn !== "boolean")
          throw new RangeError("Firms require integer field centers and cardinal headings.");
        copied.push({ x: firm.x, y: firm.y, heading: firm.heading, movedIn: firm.movedIn });
      }
      for (const firm of firms()) firm.delete();
      for (const firm of copied) world.add(Agent.create({ movedIn: firm.movedIn }, { position: { x: firm.x, y: firm.y }, orientation: { heading: firm.heading } }));
      updateLargestPopulation(); record();
    },
    setQualities(values: readonly number[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length !== fields.length || Reflect.ownKeys(values).length !== values.length + 1) throw new RangeError("Supply one quality per field.");
      const copied: number[] = [];
      for (let i = 0; i < values.length; i++) {
        const item = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = item && "value" in item ? item.value : undefined;
        if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) throw new RangeError("Qualities must be finite data in [0,1].");
        copied.push(value);
      }
      for (const [index, field] of fields.entries()) field.quality = copied[index]!;
      updateLargestPopulation(); record();
    },
    read() {
      const cells = fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y, quality: field.quality, occupants: grid.agentsAt(field).length }));
      const maximumOccupants = Math.max(...cells.map(cell => cell.occupants));
      const upper = 1 + maximumOccupants;
      const histogram = stats.histogram(cells.filter(cell => cell.occupants > 0).map(cell => cell.occupants), { edges: Array.from({ length: 11 }, (_, i) => upper * i / 10) });
      return Object.freeze({
        tick: world.tick.value, width, height, parameters: settings, cells: Object.freeze(cells),
        firms: Object.freeze(firms().map(firm => Object.freeze({ id: firm.id, x: firm.x, y: firm.y, heading: firm.heading, movedIn: firm.movedIn }))),
        counts: Object.freeze(counts()), largestPopulation, maximumOccupants,
        winningAreas: Object.freeze(cells.filter(cell => cell.occupants === maximumOccupants)),
        histogram, warnings: Object.freeze([...warnings]), history: Object.freeze([...history]), randomState: random.state, done: false as const,
      });
    },
  };
}
export const model = {
  title: "Firm Location Path Dependence",
  description: "Firms settle where other firms already are; early chance decisions lock in one center. Rand and Wilensky (2007), CC BY-NC-SA 3.0.",
  inputs, create,
} satisfies Definition<PathParameters, ReturnType<typeof create>>;
