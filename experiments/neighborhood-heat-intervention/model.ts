/** Original synthetic heat-index rule; index units are not Celsius. */
import { Grid, World, run, twoPhase, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface HeatParameters { width: number; shadeCooling: number }
export const inputs: Inputs<HeatParameters> = {
  width: { kind: "number", default: 6, min: 2, max: 12, integer: true },
  shadeCooling: { kind: "number", default: 0.5, min: 0, max: 2, step: 0.1 },
};
export function create(options: Partial<HeatParameters> = {}) {
  let settings = parameters(inputs, options);
  const world = World.add();
  const grid = Grid.add({ x: settings.width, y: settings.width, boundary: "hard" }, { state: { heatIndex: 30, shaded: false } });
  world.add(grid);
  grid.fields.forEach((field, index) => { field.shaded = index % settings.width < settings.width / 2; });
  const measure = measurements.define((fields: typeof grid.fields) => ({
    meanHeat: fields.reduce((sum, field) => sum + field.heatIndex, 0) / fields.length,
    shadedFields: fields.filter(field => field.shaded).length,
  }));
  const exchangeFraction = 0.2;
  const history = storage.history({ capacity: 120 });
  function record() { history.add({ tick: world.tick.value, values: measure.read(grid.fields) }); }
  function step() {
    twoPhase(grid.fields, {
      compute(field) {
        const neighbors = grid.neighbors(field);
        const exchange = neighbors.reduce((sum, neighbor) => sum + neighbor.heatIndex - field.heatIndex, 0) / neighbors.length;
        return Math.max(0, field.heatIndex + exchangeFraction * exchange - (field.shaded ? settings.shadeCooling : 0));
      },
      commit: (field, heatIndex) => { field.heatIndex = heatIndex; },
    });
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let index = 0; index < count; index += 1) { run(world, step); record(); }
    },
    setShadeCooling(value: number) { settings = parameters(inputs, { ...settings, shadeCooling: value }); },
    read() { return Object.freeze({ tick: world.tick.value, parameters: settings, ...measure.read(grid.fields),
      fields: Object.freeze(grid.fields.map((field, index) => Object.freeze({ id: field.id, field: index + 1, shaded: field.shaded, heatIndex: field.heatIndex }))),
      history: history.samples, done: false }); },
  };
}
export const model = { title: "Neighborhood Heat Intervention",
  description: "Illustrative synchronous exchange and shade cooling in abstract index units; no temperature forecast.", inputs, create,
} satisfies Definition<HeatParameters, ReturnType<typeof create>>;
