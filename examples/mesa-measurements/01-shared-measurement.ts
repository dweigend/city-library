import assert from "node:assert/strict";
import { measurements } from "city-library";

const heat = measurements.define((state: { temperatures: number[] }) => ({
  meanTemperature: state.temperatures.reduce((sum, value) => sum + value, 0) / state.temperatures.length,
}));
const state = { temperatures: [20, 24] };
const observation = heat.read(state);
assert.deepEqual(observation, { meanTemperature: 22 });
assert.deepEqual(state, { temperatures: [20, 24] });
assert.throws(() => heat.read({ temperatures: [] }), RangeError);
