import assert from "node:assert/strict";
import { Agent, World, run } from "city-library";

// Ordinary author composition using public runtime functions, not a mock runtime.
const world = World.add();
const agent = Agent.add({ remaining: 3 });
world.add(agent);
const history = [{ tick: 0, remaining: agent.remaining }];
function advance(count: number) {
  if (!Number.isSafeInteger(count) || count < 0) throw new RangeError("Invalid step count.");
  for (let index = 0; index < count && agent.remaining > 0; index += 1) {
    run(world, () => { agent.remaining -= 1; });
    history.push({ tick: world.tick.value, remaining: agent.remaining });
  }
}
advance(100);
assert.equal(world.tick.value, 3);
assert.deepEqual(history, [
  { tick: 0, remaining: 3 }, { tick: 1, remaining: 2 },
  { tick: 2, remaining: 1 }, { tick: 3, remaining: 0 },
]);
advance(1);
assert.equal(world.tick.value, 3);
assert.equal(history.length, 4);

const failed = World.add();
const state = Agent.add({ value: 0 });
failed.add(state);
assert.throws(() => run(failed, () => { state.value += 1; throw new Error("Rule failure"); }));
assert.equal(state.value, 1);
assert.equal(failed.tick.value, 0);
assert.throws(() => {
  run(failed, () => { state.value += 1; });
  throw new Error("Post-commit observation failure");
});
assert.equal(state.value, 2);
assert.equal(failed.tick.value, 1);
