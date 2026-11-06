// Frozen before runtime; acceptance syntax and assertions must remain unchanged.
import { strict as assert } from "node:assert";
import { create } from "../../experiments/urban-suite-tijuana-bordertowns/model.ts";
import { cell, field, globals, job, migrant, near, ring, scene, service, thirdBuilder } from "./scenario.ts";

// Asymmetric x<81 allows this negative-side site; abs(x)<81 would exclude it.
// Candidate land.2 and values1 distinguish abs(land)−values from abs(land−values).
const regularization = create();
regularization.setScenario(scene(regularization, {
  rules: { cityGrowth: false, migrationTicks: 20, crossingTicks: 20 },
  globals: globals({ values: 1, marginalWeight: 0.4 }),
  agents: [service(), job(), migrant("resident", 2, -81, 0)],
  patch: (x, y) => field({ landValue: x === -81 && y === 0 ? 0.2 : 2,
    colonia: x === -82 && y === 0 ? -17 : x === -81 && y === 0 ? -15 : 0 }),
}));
regularization.advance();
assert.equal(regularization.read().counts.rings, 1);
assert.equal(regularization.read().counts.thirdBuilders, 1);
const newRing = regularization.read().agents.find(item => item.kind === "ring")!;
assert.equal(newRing.x, -82); assert.equal(newRing.y, 0); near(newRing.size, 75);
const newBuilder = regularization.read().agents.find(item => item.kind === "third-builder")!;
assert.equal(newBuilder.x, -81); assert.equal(newBuilder.y, 0); assert.equal(newBuilder.weight, 0.4);
// Native FACE at a coincident migrant is a no-op: retain the newly sprouted
// builder's public-uniform integer default heading, not an invented north bias.
assert.ok(Number.isInteger(newBuilder.heading) && newBuilder.heading >= 0 && newBuilder.heading < 360);
assert.equal(newBuilder.origin.kind, "field");
if (newBuilder.origin.kind === "field") assert.equal(newBuilder.origin.id, cell(regularization, -81, 0).id);

// Adjust has its own genuine nonnegative clamp; final setup alone does not.
// At tick26 a parked third builder writes a negative land value before clamping
// its weight, then satisfies adjust's no-first/all-third-energy-zero predicate.
const adjusted = create({ seed: 1 });
adjusted.setScenario(scene(adjusted, {
  tick: 25, globals: globals({ setupDone: false, thirdPhase: 0 }),
  agents: [service(), thirdBuilder("parked", 1, 0, 0, { energy: 0, weight: -0.1 })],
  patch: (x, y) => field({ landValue: x === 0 && y === 0 ? -1 : 0 }),
}));
adjusted.advanceCityscape();
assert.equal(adjusted.read().tick, 26); assert.equal(adjusted.read().setupDone, false);
assert.equal(adjusted.read().counts.thirdBuilders, 0);
assert.equal(adjusted.read().counts.employmentCenters, 1); // industrial fallback duplicates collapse
assert.ok(adjusted.read().cells.every(item => item.landValue >= 0));
assert.equal(adjusted.read().globals.marginalValue, 0);
assert.equal(adjusted.read().globals.marginalWeight, 0);
assert.equal(adjusted.read().agents.find(item => item.kind === "service-center")!.size, 2);

// buildingTicks .5: one growth AND the 2*period hatch both occur at tick1.
const growth = create();
growth.setScenario(scene(growth, {
  rules: { cityGrowth: true, buildingTicks: 0.5, migrationTicks: 20, crossingTicks: 20 },
  globals: globals({ marginalWeight: 0.4 }),
  agents: [service(), job(), migrant("resident", 2, 0, 1), thirdBuilder(), ring("ring", 4, 0, 2)],
  patch: () => field({ landValue: 2, colonia: -4 }),
}));
const original = growth.read().agents.find(item => item.kind === "third-builder")!.id;
growth.advance();
const built = growth.read();
assert.equal(built.tick, 1); assert.equal(built.counts.thirdBuilders, 3);
const builder = built.agents.find(item => item.id === original)!;
assert.ok(builder.kind === "third-builder"); near(builder.y, 0.75); near(builder.weight, 0.55);
assert.ok(built.agents.filter(item => item.kind === "third-builder" && item.id !== original).every(item => item.weight === 0.4));
near(cell(growth, 0, 1).landValue, 1.65);
assert.equal(cell(growth, 0, 1).water, 2); assert.equal(cell(growth, 0, 1).electricity, 3); assert.equal(cell(growth, 0, 1).transport, 1);
near(cell(growth, 0, 1).colonia, -3.85);
const resident = built.agents.find(item => item.kind === "migrant")!;
// Costs observe OLD infrastructure before builder overwrites it.
near(resident.livingExpenses, 2 + 1 + 10 + 27 + 1.5 * (1 / 30 + Math.sqrt(18) / 25) + 8);
assert.equal(built.globals.values, 2); assert.equal(built.globals.weights, 0.6); // caches precede growth

const reports = create();
reports.setScenario(scene(reports, {
  rules: { initDensity: 0.5 },
  agents: [service(), job(), migrant("ordinary", 2, 0, 0, { size: 0.6, savings: 10 }),
    migrant("relocated", 3, 0, 0, { size: 0.8, savings: 30 }), migrant("seed", 4, 0, 0, { size: 0.65, savings: 999 })],
  patch: (x, y) => field({
    ...(x === 0 && y === 0 ? { occupied: "oaxaca", electricity: 3 } : {}),
    ...(x === 1 && y === 0 ? { occupied: "jalisco" } : {}),
    ...(y === 0 && (x === 2 || x === 3) ? { water: 2, electricity: 3 } : {}),
  }),
}));
assert.equal(reports.read().reports.savings, 10); assert.equal(reports.read().reports.savingsNode, 30);
assert.equal(reports.read().reports.equippedPatchCount, 2);
assert.equal(reports.read().reports.noWaterPercent, 100); assert.equal(reports.read().reports.noPowerPercent, 100);
assert.equal(reports.read().counts.migrants, 3); // denominators are equipped patches*density, not people

const sparse = create();
sparse.setScenario(scene(sparse, {
  rules: { migrationTicks: 20, crossingTicks: 20, cityGrowth: false, visualUpdate: "colonias" },
  agents: [service(), job(), migrant("far", 2, 40, 0), ring()],
  patch: (x, y) => field({ landValue: x === 2 && y === 0 ? -2 : 0 }),
}));
const historyBefore = sparse.read().history.length;
assert.throws(() => sparse.advance(), /empty|mean/i);
assert.equal(sparse.read().tick, 1); assert.equal(sparse.read().counts.rings, 1); assert.equal(sparse.read().counts.migrants, 1);
assert.equal(cell(sparse, 2, 0).landValue, 0); assert.equal(cell(sparse, 2, 0).colonia, 9.9);
assert.equal(sparse.read().globals.maxCost, 40); assert.equal(sparse.read().history.length, historyBefore);
assert.equal(sparse.read().lastFailure!.tick, 1);

const industrial = create();
industrial.setScenario(scene(industrial, {
  rules: { migrationTicks: 1, crossingTicks: 20 },
  agents: [service(), job(), migrant()],
  patch: (x, y) => field({ occupied: x === 7 && y === 8 ? "no" : "maquiladora",
    ...(x === 6 && y === 8 ? { water: "0.0", electricity: "0.0", transport: "0.0" } : {}) }),
}));
const parentId = industrial.read().agents.find(item => item.kind === "migrant")!.id;
assert.throws(() => industrial.advance(), /numeric|number|transport/i);
const partial = industrial.read();
assert.equal(partial.tick, 1); assert.equal(partial.counts.migrants, 2); // hatch was already committed
const parent = partial.agents.find(item => item.id === parentId)!;
assert.ok(parent.kind === "migrant"); assert.equal(parent.residentSince, 0); assert.equal(parent.livingExpenses, 40);
assert.equal(partial.lastFailure!.action, "go"); assert.equal(partial.done, false);
