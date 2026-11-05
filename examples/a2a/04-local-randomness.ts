import assert from "node:assert/strict";
import { Random } from "city-library";

const random = Random.add({ seed: 1 });
random.number();
const main = random.state;
let effects = 0;
const failure = new Error("temporary calculation failed");
assert.throws(() => random.local(() => {
  effects += 1;
  const first = random.number();
  const afterFirst = random.state;
  const nested = random.local(() => random.number());
  assert.equal(nested, first);
  assert.deepEqual(random.state, afterFirst);
  random.reseed(9);
  random.number();
  throw failure;
}), (error) => error === failure);
assert.equal(effects, 1);
assert.deepEqual(random.state, main);
assert.equal(random.local(() => random.number()), 0.002735721180215478);
assert.deepEqual(random.state, main);
assert.throws(() => random.local(() => {
  effects += 1;
  random.number();
  return Promise.resolve(1);
}));
assert.equal(effects, 2);
assert.deepEqual(random.state, main);
assert.equal(random.number(), 0.002735721180215478);
console.log("local-randomness: nested main checkpoints, rollback of stream only, failure cleanup");
