// Frozen before runtime; acceptance syntax and assertions must remain unchanged.
import { strict as assert } from "node:assert";
import { create } from "../../../models/urban-suite-tijuana-bordertowns/model.ts";
import { cell, field, globals, job, migrant, near, scene, semantic, service } from "./scenario.ts";

const model = create();
model.setScenario(scene(model, {
  field: (x, y) => field({ colorNumber: 42, colonia: x === 0 && y === 0 ? -5 : x === 1 && y === 0 ? -9.95 : 0 }),
}));
const stream = model.read().randomState;
model.setRules({ visualUpdate: "colonias" });
assert.equal(cell(model, 2, 0).colonia, 0); // editing a chooser is not UPDATE NOW
model.updateDisplay();
assert.equal(cell(model, 2, 0).colonia, 9.9); near(cell(model, 2, 0).colorNumber, 19.9);
assert.equal(cell(model, 0, 0).colonia, -5); assert.equal(cell(model, 0, 0).colorNumber, 5);
assert.equal(cell(model, 1, 0).colonia, -9.95); assert.equal(cell(model, 1, 0).colorNumber, 0); // second predicate wins
assert.equal(model.read().tick, 0); assert.deepEqual(model.read().randomState, stream);
const afterDisplay = semantic(model); model.read(); model.read(); assert.deepEqual(semantic(model), afterDisplay);

model.setScenario(scene(model, {
  rules: { visualUpdate: "units with no water" },
  agents: [service(), job(), migrant("migrant", 2, 0, 0)],
  field: (x, y) => field({ colorNumber: 42, water: x === 2 && y === 0 ? 2 : 10 }),
}));
model.updateDisplay();
assert.equal(cell(model, 0, 0).colorNumber, 67); assert.equal(cell(model, 2, 0).colorNumber, 42);
model.setRules({ visualUpdate: "units with no electricity" }); model.updateDisplay();
assert.equal(cell(model, 0, 0).colorNumber, 127); assert.equal(cell(model, 2, 0).colorNumber, 42);

const intervention = create();
intervention.setScenario(scene(intervention, {
  agents: [], rules: { carryingCapacity: 2 },
  globals: globals({ weights: 0.6, marginalValue: 1 }),
  field: (x, y) => field({ occupied: y === 0 && (x === 0 || x === 1) ? "maquiladora" : "no", landValue: x === 0 && y === 1 ? 2 : 0 }),
}));
const ids = intervention.read().cells.map(item => item.id);
intervention.addNode({ x: 0, y: 0 });
assert.equal(intervention.read().counts.nodes, 1); assert.equal(intervention.read().tick, 0);
near(cell(intervention, 0, 0).landValue, 0.6); // center unconditional even on industrial cache
assert.equal(cell(intervention, 1, 0).landValue, 0); // surrounding industrial cache excluded
near(cell(intervention, 2, 0).landValue, 0.45);
near(cell(intervention, -1, 0).landValue, 0.525);
assert.equal(cell(intervention, 0, 1).landValue, 2); // old land>=marginal excluded
assert.equal(cell(intervention, 3, 0).landValue, 0);
assert.equal(cell(intervention, 2, 0).water, 2); assert.equal(cell(intervention, 2, 0).electricity, 3); assert.equal(cell(intervention, 2, 0).transport, 1);
assert.equal(intervention.read().globals.weights, 0.6); assert.equal(intervention.read().globals.marginalValue, 1);
assert.deepEqual(intervention.read().cells.map(item => item.id), ids);
const beforeInvalid = semantic(intervention);
assert.throws(() => intervention.addNode({ x: 85.5, y: 0 }));
assert.deepEqual(semantic(intervention), beforeInvalid);

// The display action changes a quantity later used by migration and cleanup.
const off = create(), colonias = create();
for (const target of [off, colonias]) target.setScenario(scene(target, {
  rules: { migrationTicks: 1, crossingTicks: 20, visualUpdate: "off" },
  agents: [service(), job(), migrant()],
  field: (x, y) => field({ landValue: 2, water: 2, electricity: 3, transport: 1, occupied: x === 7 && y === 8 ? "no" : "maquiladora" }),
}));
colonias.setRules({ visualUpdate: "colonias" }); colonias.updateDisplay();
off.advance(); colonias.advance();
assert.equal(cell(off, 6, 8).colonia, -0.5);
assert.equal(cell(colonias, 6, 8).colonia, 9.9); // 9.9−.5 followed by GO cleanup
