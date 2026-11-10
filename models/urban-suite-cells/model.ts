/** Adapted from Wilensky's Urban Suite - Cells (2007).
 * Copyright 2007 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md/source.nlogox.
 * Canonical field state includes source-timed numeric color memory. Mulberry
 * trials use field order; irrelevant source ask shuffles, including color cycling,
 * are omitted explicitly. No cross-NetLogo random-stream equivalence is claimed.
 */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export type Neighborhood = "von-neumann" | "moore" | "displaced-von-n" | "h" | "moore-von-n";
export type CountRule = "positive" | "exactly-one" | "at-most-two";
export interface CellsParameters { seed: number; neighborhood: Neighborhood; countRule: CountRule; probability: number; ageLimit: number }
export const inputs: Inputs<CellsParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  neighborhood: { kind: "choice", default: "von-neumann", options: ["von-neumann", "moore", "displaced-von-n", "h", "moore-von-n"] },
  countRule: { kind: "choice", default: "exactly-one", options: ["positive", "exactly-one", "at-most-two"] },
  probability: { kind: "number", default: 100, min: 0, max: 100, integer: true },
  ageLimit: { kind: "number", default: 55, min: 0, max: 100, integer: true },
};
export interface CellInput { readonly on: boolean; readonly onTime: number; readonly seed: boolean; readonly colorNumber?: number }
interface CellsSample { readonly tick: number; readonly on: number }

export function create(options: Partial<CellsParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const width = 81, height = 81, startingColor = 109;
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: width, y: height, boundary: "wrap" }, { random });
  const grid = Grid.create({ x: width, y: height, boundary: "wrap" }, { state: { on: false, onTime: 0, seed: false, colorNumber: 0 } });
  world.add(grid);
  const fields = grid.fields;
  type Cell = (typeof fields)[number];
  const history: Readonly<CellsSample>[] = [];

  function neighborhoodOf(field: Cell, kind: Neighborhood): readonly Cell[] {
    const faces = grid.neighbors(field, { neighborhood: "faces" });
    if (kind === "von-neumann") return faces;
    const moore = grid.neighbors(field, { neighborhood: "moore" });
    if (kind === "moore") return moore;
    if (kind === "displaced-von-n") return moore.filter(neighbor => !faces.includes(neighbor));
    if (kind === "h") {
      const vertical = faces.filter(neighbor => neighbor.x === field.x);
      return moore.filter(neighbor => !vertical.includes(neighbor));
    }
    const combined = new Set<Cell>([field, ...moore]);
    for (const face of faces) for (const neighbor of grid.neighbors(face, { neighborhood: "faces" })) combined.add(neighbor);
    return [...combined]; // source contains self, four distance2 faces and eight Moore cells
  }
  // Grid owns topology. This derived rule projection stores canonical Field
  // references only; no duplicated coordinates, cell state or custom offset engine.
  let adjacency = fields.map(field => neighborhoodOf(field, settings.neighborhood));
  function record() {
    const sample = Object.freeze({ tick: world.tick.value, on: fields.filter(field => field.on).length });
    if (history.at(-1)?.tick === sample.tick) history[history.length - 1] = sample;
    else history.push(sample);
    if (history.length > 1001) history.splice(1, 1);
  }
  function turnOn(field: Cell) { field.on = true; field.onTime = world.tick.value; }
  function turnOff(field: Cell) { field.on = false; field.onTime = 0; field.colorNumber = 0; }
  function recolorCells() {
    const active = fields.filter(field => field.on);
    if (!active.length) return;
    const lower = Math.min(...active.map(field => field.onTime));
    const upper = Math.max(...active.map(field => field.onTime)) + 5;
    for (const field of active) if (!field.seed) {
      const fraction = Math.max(0, Math.min(1, (field.onTime - lower) / (upper - lower)));
      field.colorNumber = Math.min(109.9999, 100 + 10 * fraction);
    }
  }
  function countPasses(count: number) {
    if (count === 0) return false;
    if (settings.countRule === "positive") return true;
    if (settings.countRule === "exactly-one") return count === 1;
    return count <= 2;
  }
  function go() {
    const minOnTime = world.tick.value - settings.ageLimit;
    // Freeze every eligibility/probability result against the old on-state.
    const selected = fields.filter((field, index) => {
      if (field.on) return false;
      const count = adjacency[index]!.filter(neighbor => neighbor.on).length;
      return countPasses(count) && Math.floor(random.number() * 100) < settings.probability;
    });
    for (const field of selected) turnOn(field);
    if (settings.ageLimit > 0) for (const field of fields) if (field.onTime < minOnTime) turnOff(field);
    recolorCells();
  }
  const initial = grid.fieldAt({ x: 0, y: 0 })!;
  turnOn(initial); initial.seed = true; initial.colorNumber = 9.9;
  recolorCells(); record();

  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) { run(world, go); record(); }
    },
    setRules(rules: Partial<Omit<CellsParameters, "seed">>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => typeof key !== "string" || !["neighborhood", "countRule", "probability", "ageLimit"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only live cells rule data.");
      const next = parseParameters(inputs, { ...settings, ...rules });
      const nextAdjacency = next.neighborhood === settings.neighborhood ? adjacency : fields.map(field => neighborhoodOf(field, next.neighborhood));
      settings = next; adjacency = nextAdjacency; record();
    },
    addRandomSeed() {
      const x = Math.floor(random.number() * width) - 40;
      const y = Math.floor(random.number() * height) - 40;
      const field = grid.fieldAt({ x, y })!;
      turnOn(field); field.seed = true; field.colorNumber = 9.9;
      recolorCells(); record();
    },
    cycleColors() {
      for (const field of fields) if (field.on) {
        const next = field.colorNumber - 0.01;
        field.colorNumber = next < 0 ? next + 140 : next;
      }
      // No scientific tick/history point, and no display-only source RNG shuffle.
    },
    setCells(values: readonly CellInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length !== fields.length || Reflect.ownKeys(values).length !== values.length + 1)
        throw new RangeError("Supply one cell record per field.");
      const copied: Required<CellInput>[] = [];
      for (let i = 0; i < values.length; i++) {
        const item = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = item && "value" in item ? item.value : undefined;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          ![3, 4].includes(Reflect.ownKeys(value).length) || !["on", "onTime", "seed"].every(key => Object.hasOwn(value, key)) ||
          Reflect.ownKeys(value).some(key => typeof key !== "string" || !["on", "onTime", "seed", "colorNumber"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
          throw new TypeError("Supply on/onTime/seed cell data and optional colorNumber.");
        const cell = value as CellInput;
        if (typeof cell.on !== "boolean" || typeof cell.seed !== "boolean" || !Number.isSafeInteger(cell.onTime) || cell.onTime < 0 || cell.onTime > world.tick.value ||
          (Object.hasOwn(value, "colorNumber") && (typeof cell.colorNumber !== "number" || !Number.isFinite(cell.colorNumber) || cell.colorNumber < 0 || cell.colorNumber >= 140)))
          throw new RangeError("Invalid cell state, time or color number.");
        copied.push({ on: cell.on, onTime: cell.onTime, seed: cell.seed, colorNumber: cell.colorNumber ?? (cell.on && cell.seed ? 9.9 : 0) });
      }
      for (const [index, field] of fields.entries()) Object.assign(field, copied[index]!);
      record(); // fixtures retain supplied color memory until the next go
    },
    read() {
      return Object.freeze({
        tick: world.tick.value, width, height, startingColor, parameters: settings,
        cells: Object.freeze(fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y, on: field.on, onTime: field.onTime, seed: field.seed, colorNumber: field.colorNumber }))),
        counts: Object.freeze({ on: fields.filter(field => field.on).length }),
        history: Object.freeze([...history]), randomState: random.state, done: false as const,
      });
    },
  };
}
export const model = {
  title: "Urban Growth Cells",
  description: "Cells switch on depending on how many neighbors are on, growing city-like clusters from seeds. Wilensky (2007), CC BY-NC-SA 3.0.",
  inputs, create,
} satisfies Definition<CellsParameters, ReturnType<typeof create>>;
