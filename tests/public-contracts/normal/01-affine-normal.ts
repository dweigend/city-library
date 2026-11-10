import { strict as assert } from "node:assert";
import { Random } from "city-library";
const standard = Random.add({ seed: 19 }), scaled = Random.add({ seed: 19 });
for (let i = 0; i < 6; i++) {
  const z = standard.number({ distribution: "normal" });
  assert.ok(Number.isFinite(z));
  assert.equal(scaled.number({ distribution: "normal", mean: 10, deviation: 2 }), 10 + 2 * z);
  assert.deepEqual(scaled.state, standard.state); // cache stores standard, not scaled samples
}
