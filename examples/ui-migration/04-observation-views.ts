import { strict as assert } from "node:assert";
import { defineUI, type UISpec } from "../../ui/index.ts";
import { model, type VirusParameters } from "../../experiments/virus-on-a-network/model.ts";

const spec = { views: [
  { type: "network", label: "Network", nodes: state => state.nodes, edges: state => state.edges },
  { type: "line", label: "Infected (%)", series: state => [
    { label: "Infected", points: state.history.map(point => ({ x: point.tick, y: point.infected })) },
  ] },
] } as const satisfies UISpec<VirusParameters, ReturnType<typeof model.create>>;
export const ui = defineUI(model, spec);
const instance = model.create({ numberOfNodes: 10 });
const before = instance.read();
const network = spec.views[0];
const chart = spec.views[1];
assert.equal(network.type, "network");
assert.equal(chart.type, "line");
if (network.type !== "network" || chart.type !== "line") throw new Error("Unexpected view kinds.");
assert.equal(network.nodes(before).length, 10);
assert.ok(network.edges(before).length > 0);
assert.equal(chart.series(before)[0]!.points[0]!.y, 30);
assert.deepEqual(instance.read(), before, "Projecting views must preserve model state, time and RNG.");
