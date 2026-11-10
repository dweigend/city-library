// Frozen before runtime; acceptance syntax and assertions must remain unchanged.
import { strict as assert } from "node:assert";
import { create } from "../../../models/urban-suite-tijuana-bordertowns/model.ts";
import { cell, field, globals, job, migrant, near, scene, service } from "./scenario.ts";

const model = create({ seed: 1 });
// Economics matches the executed native fixture; block every expansion lot.
// The extra remote negative patch is a source-derived diagnostic, not a claim
// that this extended fixture was itself executed in the native browser.
model.setScenario(scene(model, {
  tick: 25,
  globals: globals({ setupDone: false, thirdPhase: 0 }),
  agents: [service(), job(), migrant("seed", 2, 6, 8, { size: 0.65, income: 0, savings: 0, livingExpenses: 0 })],
  field: (x, y) => field({ occupied: "maquiladora",
    ...(x === 6 && y === 8 ? { landValue: 2, water: 2, electricity: 3, transport: 1 } : {}),
    ...(x === 20 && y === 20 ? { landValue: -0.013 } : {}) }),
}));
const before = model.read();
const result = model.advanceCityscape();
const state = model.read();
assert.equal(result.status, "ready"); assert.equal(state.tick, 0); assert.equal(state.setupDone, true);
assert.equal(state.globals.thirdPhase, "stop"); assert.equal(state.counts.migrants, 1);
const person = state.agents.find(item => item.kind === "migrant")!;
assert.equal(person.size, 0.6);
near(state.globals.maxCost, 2 + 3 + 2 + 27 + (10 / 30 + 5 / 25) + 8);
const roundedCost = 42.53;
assert.ok(Number.isInteger(Math.round((roundedCost - person.livingExpenses) * 100) / 100));
assert.ok(person.livingExpenses <= roundedCost && person.income >= person.livingExpenses);
if (person.livingExpenses < roundedCost) assert.ok(person.income - person.livingExpenses < 1 + 1e-10);
near(person.income * 100, Math.round(person.income * 100), 1e-8);
near(person.livingExpenses * 100, Math.round(person.livingExpenses * 100), 1e-8);
assert.notDeepEqual(state.randomState, before.randomState);
assert.equal(cell(model, 6, 8).colonia, -0.5);
assert.equal(cell(model, 9, 8).colonia, -0.5); // economics radius4−coloniaSize/2 = 3
assert.equal(cell(model, 10, 8).colonia, 0);
assert.equal(cell(model, 20, 20).landValue, -0.01); // final precision, not an invented clamp
assert.equal(cell(model, 6, 8).occupied, "oaxaca");
assert.equal(state.history.at(-1)!.action, "cityscape");
assert.equal(state.history.at(-1)!.tickBefore, 25);
assert.equal(state.history.at(-1)!.tickAfter, 0);
assert.equal(state.history.at(-1)!.setupDone, true);
assert.ok(state.epoch > before.epoch, "Reset starts a history segment, not a second clock.");
