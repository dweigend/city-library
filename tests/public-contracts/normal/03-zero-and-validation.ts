import { strict as assert } from "node:assert";
import { Random } from "city-library";
const random = Random.add({ seed: 7 });
random.number({ distribution: "normal" });
const pending = random.state;
assert.equal(random.number({ distribution: "normal", mean: 11, deviation: 0 }), 11);
assert.deepEqual(random.state, pending);
for (const options of [{ distribution: "normal", deviation: -1 }, { distribution: "normal", mean: Infinity }, { distribution: "normal", min: 0 }, { distribution: "uniform", mean: 2 }]) {
  assert.throws(() => random.number(options as { distribution: "normal"; mean?: number; deviation?: number }));
  assert.deepEqual(random.state, pending);
}
let invoked = false;
const bad = Object.defineProperty({}, "distribution", { enumerable: true, get() { invoked = true; return "normal"; } });
assert.throws(() => random.number(bad));
assert.equal(invoked, false);
assert.deepEqual(random.state, pending);
