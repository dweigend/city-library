import { strict as assert } from "node:assert";
import { Random } from "city-library";
const random = Random.add({ seed: 31 });
random.number({ distribution: "normal" });
const state = random.state, control = random.copy();
assert.throws(() => random.local(() => {
  random.number({ distribution: "normal" }); random.number();
  random.local(() => random.number({ distribution: "normal" }));
  throw new Error("Restore both word and cached companion");
}));
assert.deepEqual(random.state, state);
assert.equal(random.number({ distribution: "normal" }), control.number({ distribution: "normal" }));
random.reseed(31);
assert.equal(random.state.continuation.gaussian, null);
const fresh = Random.add({ seed: 31 });
assert.equal(random.number({ distribution: "normal" }), fresh.number({ distribution: "normal" }));
