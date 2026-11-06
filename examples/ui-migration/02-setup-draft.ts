import { strict as assert } from "node:assert";
import { defineUI, type UISpec } from "../../ui/index.ts";
import { model, type VirusParameters } from "../../experiments/virus-on-a-network/model.ts";

const spec = { setup: [{ field: "numberOfNodes", label: "Nodes" }], views: [] } as const satisfies UISpec<VirusParameters, ReturnType<typeof model.create>>;
export const ui = defineUI(model, spec);
const draft = { numberOfNodes: 10 };
const active = model.create(draft);
draft.numberOfNodes = 20;
assert.equal(active.read().nodes.length, 10);
const restarted = model.create(draft);
assert.equal(restarted.read().nodes.length, 20);
assert.equal(active.read().nodes.length, 10, "Applying another setup must preserve the old instance.");
