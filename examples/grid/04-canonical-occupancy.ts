import assert from "node:assert/strict";
import { Agent, Grid } from "city-library";

const grid = Grid.add({ x: 2, y: 2 });
const cell = grid.fields[0]!;
const first = Agent.add({ species: "sheep" }, { position: { x: -0.5, y: -0.5 } });
const second = Agent.add({ species: "wolf" }, { position: { x: -0.4, y: -0.4 } });
const outside = Agent.add({ species: "sheep" }, { position: { x: 0.5, y: 0.5 } });
assert.deepEqual(grid.agentsAt(cell, { source: [second, first, first, outside] }), [second, first]);
assert.throws(() => grid.agentsAt(cell));
first.move({ to: outside });
assert.deepEqual(grid.agentsAt(cell, { source: [first, second] }), [second]);
second.delete();
assert.deepEqual(grid.agentsAt(cell, { source: [first, second] }), []);
