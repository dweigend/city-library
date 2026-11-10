import assert from "node:assert/strict";
import { Grid, World, run } from "city-library";

const space = {
  x: 3,
  y: 3,
};

const initialState = {
  temperature: 20,
};

const diffusion = {
  rate: 1,
};

const world = World.create();

const grid = Grid.create(space, {
  state: initialState,
});

const center = grid.fieldAt({
  x: 0,
  y: 0,
});

if (center === undefined) throw new Error("Missing center field.");

center.temperature = 28;

world.add(grid);

run(world, spreadHeat, 1);

console.log({
  tick: world.tick.value,
  centerTemperature: center.temperature,
  totalTemperature: totalTemperature(),
});

assert.equal(world.tick.value, 1);
assert.equal(grid.fields.length, 9);
assert.equal(center.temperature, 20);
assert.equal(totalTemperature(), 188);

const directNeighbors = grid.neighbors(center, { neighborhood: "faces" });
const neighborTemperatures = directNeighbors.map(field => field.temperature);
const allTemperatures = grid.fields.map(field => field.temperature);

assert.equal(directNeighbors.length, 4);
assert.deepEqual(neighborTemperatures, [22, 22, 22, 22]);
assert.equal(allTemperatures.filter(value => value === 20).length, 5);
assert.equal(initialState.temperature, 20);

function spreadHeat() {
  grid.diffuse("temperature", diffusion);
}

function totalTemperature() {
  let total = 0;

  for (const field of grid.fields) total += field.temperature;

  return total;
}
