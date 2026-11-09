import { strict as assert } from "node:assert";
import { defineUI, type UISpec } from "../../ui/index.ts";
import { model, type VirusParameters } from "../../models/virus-on-a-network/model.ts";

const spec = {
  actions: [{ label: "Step", run: instance => instance.advance() }],
  live: [{ field: "spreadChance", value: state => state.parameters.spreadChance,
    set: (instance, value) => instance.setRules({ spreadChance: Number(value) }) }],
  monitors: [{ label: "Tick", value: state => state.tick }], views: [],
} as const satisfies UISpec<VirusParameters, ReturnType<typeof model.create>>;
export const ui = defineUI(model, spec);
const instance = model.create({ numberOfNodes: 10, spreadChance: 0, recoveryChance: 0 });
spec.actions[0].run(instance);
assert.equal(spec.monitors[0].value(instance.read()), 1);
spec.live[0].set(instance, 7);
assert.equal(spec.live[0].value(instance.read()), 7);
assert.equal(instance.read().tick, 1, "Changing a live rule must not advance time.");
