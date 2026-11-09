// Frozen before runtime; acceptance syntax and assertions must remain unchanged.
import { strict as assert } from "node:assert";
import { create } from "../../models/urban-suite-tijuana-bordertowns/model.ts";
import { cell, field, globals, job, migrant, near, scene, semantic, service } from "./scenario.ts";

const model = create({ seed: 1 });
model.setScenario(scene(model, {
  rules: { migrationTicks: 1, crossingTicks: 20, cityGrowth: false, visualUpdate: "off" },
  agents: [service(), job(), migrant("parent", 2, 6, 8, { income: 70, savings: 100, livingExpenses: 40, residentSince: 8 })],
  // One vacant qualified patch only; source migration changes the parent, not child.
  field: (x, y) => field({ landValue: 2, water: 2, electricity: 3, transport: 1,
    occupied: x === 7 && y === 8 ? "no" : "maquiladora" }),
}));
const parentId = model.read().agents.find(item => item.kind === "migrant")!.id;
model.advance(); const state = model.read();
assert.equal(state.tick, 1); assert.equal(state.counts.migrants, 2);
const parent = state.agents.find(item => item.id === parentId)!;
const child = state.agents.find(item => item.kind === "migrant" && item.id !== parentId)!;
assert.ok(parent.kind === "migrant" && child.kind === "migrant");
assert.equal(parent.x, 6); assert.equal(parent.y, 8); assert.equal(parent.residentSince, 0);
assert.equal(child.x, 7); assert.equal(child.y, 8); assert.equal(child.residentSince, 8);
assert.equal(child.income, 70); assert.equal(child.livingExpenses, 40); assert.equal(child.savings, 130);
assert.equal(child.origin, "oaxaca"); assert.deepEqual(child.works, parent.works);
// Source costs after parent migration are NOT precision-rounded again in that GO.
near(parent.livingExpenses, 42.53333333333333);
assert.equal(cell(model, 6, 8).colonia, -0.5);
assert.equal(cell(model, 8, 8).colonia, -0.5); // migrate radius4−coloniaSize = 2
assert.equal(cell(model, 9, 8).colonia, 9.9); // outside migration, cleanup normalizes zero

const crossed = create({ seed: 1 });
crossed.setScenario(scene(crossed, {
  rules: { migrationTicks: 20, crossingTicks: 1, cityGrowth: false },
  globals: globals({ crossed: 0 }), agents: [service(), job(), migrant()],
}));
crossed.advance(); assert.equal(crossed.read().tick, 1);
assert.equal(crossed.read().counts.migrants, 0); assert.equal(crossed.read().globals.crossed, 1);
const successfulHistory = crossed.read().history.length;
assert.throws(() => crossed.advance(), /empty|max/i);
const failed = crossed.read();
assert.equal(failed.tick, 2); assert.equal(failed.globals.crossed, 1); assert.equal(failed.done, false);
assert.equal(failed.history.length, successfulHistory);
assert.equal(failed.lastFailure!.action, "go"); assert.equal(failed.lastFailure!.tick, 2);
// Validation errors are atomic even when the current model is an earlier runtime partial state.
const partial = semantic(crossed);
const invalid = scene(crossed, { agents: [service(), job(), migrant("bad", 2, 85.5, 0)] });
assert.throws(() => crossed.setScenario(invalid));
assert.deepEqual(semantic(crossed), partial);
const missingReference = scene(crossed, { agents: [service(), job(), migrant("bad", 2, 0, 0, { works: ["missing-job"] })] });
assert.throws(() => crossed.setScenario(missingReference));
assert.deepEqual(semantic(crossed), partial);
