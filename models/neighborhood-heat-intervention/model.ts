/** Original synthetic heat-index rule; index units are not Celsius. */
import { Grid, World, run, twoPhase, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface HeatParameters {
  width: number;
  shadeCooling: number;
}
export const inputs: Inputs<HeatParameters> = {
  width: { kind: "number", default: 6, min: 2, max: 12, integer: true },
  shadeCooling: { kind: "number", default: 0.5, min: 0, max: 2, step: 0.1 },
};
export function create(options: Partial<HeatParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const world = World.create();
  const grid = Grid.create({ x: settings.width, y: settings.width, boundary: "hard" }, { state: { heatIndex: 30, shaded: false } });
  world.add(grid);
  grid.fields.forEach((field, index) => {
    const isWesternHalf = index % settings.width < settings.width / 2;
    field.shaded = isWesternHalf;
  });
  const measure = measurements.define((fields: typeof grid.fields) => ({
    meanHeat: fields.reduce((sum, field) => sum + field.heatIndex, 0) / fields.length,
    shadedFieldCount: fields.filter(field => field.shaded).length,
  }));
  const exchangeFraction = 0.2;
  const history = storage.history({ capacity: 120 });
  function record() {
    history.add({ tick: world.tick.value, values: measure.read(grid.fields) });
  }
  function step() {
    twoPhase(grid.fields, {
      compute(field) {
        const neighbors = grid.neighbors(field);
        // Preserve left-to-right accumulation of each neighbor difference.
        const meanExchange = neighbors.reduce(
          (sum, neighbor) => sum + neighbor.heatIndex - field.heatIndex, 0,
        ) / neighbors.length;
        return Math.max(0, field.heatIndex + exchangeFraction * meanExchange - (field.shaded ? settings.shadeCooling : 0));
      },
      commit(field, heatIndex) {
        field.heatIndex = heatIndex;
      },
    });
  }
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, step);
        record();
      }
    },
    setShadeCooling(value: number) {
      settings = parseParameters(inputs, { ...settings, shadeCooling: value });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        width: grid.space.x,
        height: grid.space.y,
        ...measure.read(grid.fields),
        fields: Object.freeze(grid.fields.map((field, index) => Object.freeze({
          id: field.id,
          field: index + 1,
          x: field.x,
          y: field.y,
          shaded: field.shaded,
          heatIndex: field.heatIndex,
        }))),
        history: history.samples,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Neighborhood Heat Intervention",
  description: "Heat is exchanged between city blocks while shade cools selected blocks. Abstract index units.", inputs,
  create,
} satisfies Definition<HeatParameters, ReturnType<typeof create>>;
