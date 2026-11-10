import assert from "node:assert/strict";
import { create } from "../../../models/neighborhood-heat/model.ts";

const simulation = create();
const { grid, world, center, initialState, totalTemperature } = simulation;
simulation.advance(1);

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
