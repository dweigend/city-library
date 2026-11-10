import { strict as assert } from "node:assert";
import { Random, type RandomState } from "city-library";
const random = Random.add({ seed: 1 });
random.number({ distribution: "normal" });
const checkpoint = random.state;
assert.notEqual(checkpoint.continuation.gaussian, null);
const copy = random.copy(), restored = Random.add({ seed: 9 });
restored.state = JSON.parse(JSON.stringify(checkpoint)) as RandomState;
const word = checkpoint.continuation.word;
const next = random.number({ distribution: "normal", mean: 7, deviation: 3 });
assert.equal(copy.number({ distribution: "normal", mean: 7, deviation: 3 }), next);
assert.equal(restored.number({ distribution: "normal", mean: 7, deviation: 3 }), next);
assert.equal(random.state.continuation.word, word);
assert.equal(random.state.continuation.gaussian, null);
restored.state = checkpoint;
restored.number(); // uniform consumes a word but preserves the pending companion
assert.equal(restored.number({ distribution: "normal", mean: 7, deviation: 3 }), next);
