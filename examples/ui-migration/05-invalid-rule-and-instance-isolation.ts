import { strict as assert } from "node:assert";
import { defineUI, type UISpec } from "../../ui/index.ts";
import { model, type VirusParameters } from "../../experiments/virus-on-a-network/model.ts";

const spec = { live: [{ field: "spreadChance", value: state => state.parameters.spreadChance,
  set: (instance, value) => instance.setRules({ spreadChance: Number(value) }) }], views: [] } as const satisfies UISpec<VirusParameters, ReturnType<typeof model.create>>;
export const ui = defineUI(model, spec);
const first = model.create({ numberOfNodes: 10 });
const second = model.create({ numberOfNodes: 10 });
const before = first.read();
assert.throws(() => spec.live[0].set(first, 11), RangeError);
assert.deepEqual(first.read(), before, "An invalid live value must leave the active model unchanged.");
spec.live[0].set(first, 7);
assert.equal(first.read().parameters.spreadChance, 7);
assert.equal(second.read().parameters.spreadChance, model.inputs.spreadChance.default);
