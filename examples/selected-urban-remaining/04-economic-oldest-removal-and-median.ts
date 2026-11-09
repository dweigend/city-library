import { strict as assert } from "node:assert";
import { create } from "../../models/urban-suite-economic-disparity/model.ts";

const model = create({ poorPerStep: 0, richPerStep: 0, deathRate: 4 });
model.setAgents([
  { kind: "job", x: 0, y: 0, utility: 0 },
  ...Array.from({ length: 20 }, () => ({ kind: "rich" as const, x: 0, y: 0, utility: 0 })),
  ...Array.from({ length: 20 }, () => ({ kind: "poor" as const, x: 0, y: 0, utility: 0 })),
]);
const rich = model.read().agents.filter(agent => agent.kind === "rich").map(agent => agent.id);
const poor = model.read().agents.filter(agent => agent.kind === "poor").map(agent => agent.id);
model.advance();
assert.deepEqual(model.read().counts, { rich: 16, poor: 16, jobs: 1 });
assert.deepEqual(model.read().agents.filter(agent => agent.kind === "rich").map(agent => agent.id), rich.slice(4));
assert.deepEqual(model.read().agents.filter(agent => agent.kind === "poor").map(agent => agent.id), poor.slice(4));
assert.deepEqual(model.read().medianTravelDistance, { rich: 0, poor: 0 });
model.advance();
assert.deepEqual(model.read().counts, { rich: 16, poor: 16, jobs: 1 }); // threshold tested once per go
assert.equal(model.read().tick, 2);
assert.equal(model.read().done, false);
