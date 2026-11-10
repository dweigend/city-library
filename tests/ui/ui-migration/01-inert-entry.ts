import { strict as assert } from "node:assert";
import { defineUI } from "../../../ui/index.ts";
import { model } from "../../../models/virus-on-a-network/model.ts";

let creations = 0;
const entry = defineUI({ ...model, create: options => { creations++; return model.create(options); } }, {
  setup: [{ field: "nodeCount", label: "Nodes" }],
  monitors: [{ label: "Tick", value: state => state.tick }],
  views: [],
});
assert.equal(entry.title, model.title);
assert.equal(typeof entry.mount, "function");
assert.equal(creations, 0, "Declaring a UI must not initialize a simulation.");
