/** NetLogo Heat Diffusion (Wilensky, 1998), CC BY-NC-SA 3.0; see NOTICE.md.
 * Source-specific random sequential equations, composed with public Grid/World.
 */
import { Grid, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export type Material = "wood" | "stone" | "iron" | "aluminum" | "silver" | "other";
export interface HeatParameters { width: number; height: number; seed: number; initialPlateTemp: number; leftTemp: number; rightTemp: number; topTemp: number; bottomTemp: number; alpha: number; materialType: Material }
export const inputs: Inputs<HeatParameters> = {
  width: { kind: "number", default: 51, min: 5, max: 101, integer: true },
  height: { kind: "number", default: 51, min: 5, max: 101, integer: true },
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  initialPlateTemp: { kind: "number", default: 44, min: 1, max: 100 },
  leftTemp: { kind: "number", default: 1, min: 1, max: 100 },
  rightTemp: { kind: "number", default: 50, min: 1, max: 100 },
  topTemp: { kind: "number", default: 50, min: 1, max: 100 },
  bottomTemp: { kind: "number", default: 50, min: 1, max: 100 },
  alpha: { kind: "number", default: 0.8418, min: 0.001, max: 10 },
  materialType: { kind: "choice", default: "aluminum", options: ["wood", "stone", "iron", "aluminum", "silver", "other"] },
};
export function create(options: Partial<HeatParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1) throw new RangeError("Use odd cell dimensions for integer native patches.");
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ random });
  const grid = Grid.add({ x: settings.width, y: settings.height, boundary: "wrap" }, { state: { temperature: 0, oldTemperature: 0, legendLevel: -1 } });
  world.add(grid);
  const fields = grid.fields;
  const plateSize = Math.round(0.6 * ((settings.width - 1) / 2));
  let minTemp = 0, maxTemp = 0;
  const history: Readonly<{ tick: number; mean: number }>[] = [];
  function heatDiffusivity() { return 0.25 * Math.exp(-1 / (settings.alpha + 0.3)); }
  function setEdgeTemperatures(field: typeof fields[number]) {
    const x = field.x, y = field.y, s = plateSize;
    if (x >= s && Math.abs(y) < s) field.temperature = settings.rightTemp;
    if (x <= -s && Math.abs(y) < s) field.temperature = settings.leftTemp;
    if (y >= s && Math.abs(x) < s) field.temperature = settings.topTemp;
    if (y <= -s && Math.abs(x) < s) field.temperature = settings.bottomTemp;
    if (x >= s && y >= s) field.temperature = 0.5 * (settings.rightTemp + settings.topTemp);
    if (x >= s && y <= -s) field.temperature = 0.5 * (settings.rightTemp + settings.bottomTemp);
    if (x <= -s && y >= s) field.temperature = 0.5 * (settings.leftTemp + settings.topTemp);
    if (x <= -s && y <= -s) field.temperature = 0.5 * (settings.leftTemp + settings.bottomTemp);
  }
  function record() {
    history.push(Object.freeze({ tick: world.tick.value, mean: stats.describe(fields.filter(f => Math.abs(f.x) < plateSize && Math.abs(f.y) < plateSize).map(f => f.temperature)).mean ?? 0 }));
    if (history.length > 1001) history.splice(1, 1);
  }
  function drawLegend() {
    // Native draw-legend writes temperature AFTER old-temperature initialization.
    // Its fixed display values remain a presentation overlay outside the plate.
    const minX = -(settings.width - 1) / 2;
    for (let column = 0; column < 3; column++) for (let level = 0; level < 10; level++) for (const y of [level * 2 - 11, level * 2 - 10]) {
      const field = grid.fieldAt({ x: minX + 5 + column, y });
      if (field) { field.temperature = level * 10; field.legendLevel = level * 10; }
    }
  }
  function setup() {
    for (const field of fields) {
      field.temperature = Math.abs(field.x) < plateSize && Math.abs(field.y) < plateSize ? settings.initialPlateTemp : 0;
      field.legendLevel = -1;
      setEdgeTemperatures(field);
      field.oldTemperature = field.temperature;
    }
    const summary = stats.describe(fields.map(f => f.oldTemperature));
    minTemp = summary.min!; maxTemp = summary.max!;
    // Legend is only meaningful when the original coordinates fit, rather than
    // wrapping a native decorative legend across a small host test world.
    if (settings.width >= 31 && settings.height >= 25) drawLegend();
    world.tick.reset(); history.length = 0; record();
  }
  function updateField(field: typeof fields[number]) {
    const d = heatDiffusivity();
    field.temperature = d * grid.neighbors(field, { neighborhood: "faces" }).reduce((sum, neighbor) => sum + neighbor.oldTemperature, 0) + (1 - 4 * d) * field.oldTemperature;
    setEdgeTemperatures(field);
    // This write is intentionally inside the randomized patch pass. Later
    // patches see it: replacing this with Grid.diffuse would change the model.
    field.oldTemperature = field.temperature;
  }
  function updatePatch(x: number, y: number) {
    const field = fields.find(f => f.x === x && f.y === y);
    if (!field) throw new RangeError("Expected a native patch center.");
    updateField(field);
  }
  function go() {
    for (const field of random.sample(fields, { count: fields.length, compatibility: "legacy-shuffle" })) updateField(field);
  }
  function setRules(changes: Partial<Pick<HeatParameters, "leftTemp" | "rightTemp" | "topTemp" | "bottomTemp" | "alpha" | "materialType">>) {
    for (const key of Object.keys(changes)) if (!["leftTemp", "rightTemp", "topTemp", "bottomTemp", "alpha", "materialType"].includes(key)) throw new TypeError("Only live thermal parameters may change.");
    settings = parameters(inputs, { ...settings, ...changes });
  }
  function updateAlpha(material: Material = settings.materialType) {
    const alphas = { wood: 0.00128, stone: 0.012, iron: 0.2034, aluminum: 0.8418, silver: 1.7004 };
    const next = parameters(inputs, { ...settings, materialType: material });
    settings = parameters(inputs, { ...next, alpha: material === "other" ? next.alpha : alphas[material] });
  }
  function setTemperatures(values: readonly number[]) {
    if (!Array.isArray(values) || values.length !== fields.length || Array.from(values).some(v => typeof v !== "number" || !Number.isFinite(v))) throw new RangeError("Supply a finite temperature per patch.");
    fields.forEach((f, i) => { f.temperature = values[i]!; f.oldTemperature = values[i]!; f.legendLevel = -1; });
    world.tick.reset(); history.length = 0; record();
  }
  setup();
  return {
    setup, updatePatch, updateAlpha, heatDiffusivity, setRules, setTemperatures,
    advance(count = 1) { stepCount(count); for (let i = 0; i < count; i++) { run(world, go); record(); } },
    read() { return Object.freeze({ tick: world.tick.value, width: settings.width, height: settings.height, parameters: settings, plateSize, minTemp, maxTemp, heatDiffusivity: heatDiffusivity(), cells: Object.freeze(fields.map(f => Object.freeze({ id: f.id, x: f.x, y: f.y, temperature: f.temperature, oldTemperature: f.oldTemperature, legendLevel: f.legendLevel, inPlate: Math.abs(f.x) <= plateSize && Math.abs(f.y) <= plateSize }))), history: Object.freeze([...history]), randomState: random.state }); },
  };
}
export const model = { title: "Heat Diffusion", description: "Random sequential patch heat transfer with clamped boundary strips. Wilensky (1998), CC BY-NC-SA 3.0.", inputs, create } satisfies Definition<HeatParameters, ReturnType<typeof create>>;
