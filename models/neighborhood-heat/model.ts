import { Grid, World, run } from "city-library";
import type { Definition } from "../definition.ts";
import { validateStepCount } from "../parameters.ts";

/** Equal capacities and a closed boundary preserve the temperature sum. */
export function create() {
  const initialState = { temperature: 20 };
  const grid = Grid.create({ x: 3, y: 3 }, { state: initialState });
  const world = World.create();
  const center = grid.fieldAt({ x: 0, y: 0 });
  if (center === undefined) throw new Error("Missing center field.");
  center.temperature = 28;
  world.add(grid);

  function spreadHeat() {
    grid.diffuse("temperature", { rate: 1 });
  }

  function totalTemperature() {
    let total = 0;
    for (const field of grid.fields) total += field.temperature;
    return total;
  }

  return {
    grid, world, center, initialState, totalTemperature,
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      run(world, spreadHeat, stepCount);
    },
    read() {
      return {
        tick: world.tick.value,
        centerTemperature: center.temperature,
        totalTemperature: totalTemperature(),
        fields: grid.fields.map(field => ({ id: field.id, x: field.x, y: field.y, temperature: field.temperature })),
      };
    },
  };
}

export const model = {
  title: "Neighborhood Heat",
  description: "Heat spreads from one hot field to its neighbors in a 3×3 block. Illustrative reference.",
  inputs: {}, create,
} satisfies Definition<Record<string, never>, ReturnType<typeof create>>;
