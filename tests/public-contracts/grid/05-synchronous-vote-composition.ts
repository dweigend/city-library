import assert from "node:assert/strict";
import { Grid, Random, World, run } from "city-library";

const random = Random.add({ seed: 3 });
const world = World.add({ random });
const grid = Grid.add({ x: 3, y: 3, boundary: "wrap" }, { state: { vote: 0 } });
// Caller-defined tie-flip rule, not a full implementation of NetLogo Voting.
// Four old ones: every old zero has four one-neighbors; every old one has three.
for (const index of [0, 1, 2, 3]) grid.fields[index]!.vote = 1;
const continuation = random.state;
run(world, () => {
  const sums = grid.fields.map(field => grid.neighbors(field).reduce((sum, neighbor) => sum + neighbor.vote, 0));
  const next = grid.fields.map((field, index) => sums[index]! === 4 ? 1 - field.vote : field.vote);
  grid.fields.forEach((field, index) => { field.vote = next[index]!; });
});
assert.deepEqual(grid.fields.map(field => field.vote), [1, 1, 1, 1, 1, 1, 1, 1, 1]);
assert.equal(world.tick.value, 1);
assert.deepEqual(random.state, continuation);
