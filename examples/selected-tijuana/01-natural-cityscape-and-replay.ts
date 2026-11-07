// Frozen before runtime; acceptance syntax and assertions must remain unchanged.
import { strict as assert } from "node:assert";
import { create, TijuanaRuntimeError } from "../../experiments/urban-suite-tijuana-bordertowns/model.ts";
import { semantic } from "./scenario.ts";

// Fixed BEFORE runtime: five target seeds, 3000 native-shaped setup calls each.
// Stalls or genuine source errors in individual seeds are observations, not ready.
const outcomes: { seed: number; ready: boolean; failure: string | null }[] = [];
let firstSeedResult: unknown;
let firstSeedFailed = false;
for (const seed of [1, 2, 3, 4, 5]) {
  const model = create({ seed });
  const initial = model.read();
  assert.equal(initial.width, 171); assert.equal(initial.height, 115);
  assert.equal(initial.cells.length, 19665);
  assert.equal(Math.min(...initial.cells.map(item => item.x)), -85);
  assert.equal(Math.max(...initial.cells.map(item => item.y)), 57);
  assert.equal(initial.tick, 0); assert.equal(initial.setupDone, false);
  assert.equal(initial.agents.length, 0); assert.equal(initial.done, false);
  assert.ok(initial.cells.every(item => item.landValue === 0 && item.water === 0 && item.colonia === 0 && item.colorNumber === 9.9));
  const untouched = semantic(model);
  assert.equal(model.advance().status, "guarded");
  assert.deepEqual(semantic(model), untouched);
  assert.throws(() => model.advanceCityscape(-1));
  assert.deepEqual(semantic(model), untouched);
  let failure: string | null = null;
  let sawJobs = false, sawSeeds = false, sawExpansion = false;
  try {
    model.advanceCityscape();
    const first = model.read();
    assert.equal(first.tick, 1); assert.equal(first.counts.serviceCenters, 3);
    assert.ok(first.cells.some(item => item.water === 2 && item.electricity === 3));
    assert.ok(first.cells.some(item => item.elevation < 9.9));
    assert.ok(first.agents.some(item => item.kind === "first-builder" || item.kind === "second-builder" || item.kind === "third-builder"));
    for (let calls = 1; calls < 3000 && !model.read().setupDone;) {
      const batch = Math.min(25, 3000 - calls);
      model.advanceCityscape(batch); calls += batch;
      for (const point of model.read().history) {
        sawJobs ||= point.counts.employmentCenters > 0;
        sawSeeds ||= point.seedMigrants > 0;
        sawExpansion ||= point.counts.migrants > point.seedMigrants;
      }
    }
  } catch (error) {
    // Only explicit native-boundary errors are admissible outcomes. An ordinary
    // TypeError, failed assertion, or unexpected implementation error must fail.
    if (!(error instanceof TijuanaRuntimeError)) throw error;
    failure = `${error.code}: ${error.message}`;
  }
  const state = model.read();
  outcomes.push({ seed, ready: state.setupDone, failure });
  if (seed === 1) { firstSeedResult = semantic(model); firstSeedFailed = failure !== null; }
  if (state.setupDone) {
    assert.equal(state.tick, 0); assert.equal(state.globals.thirdPhase, "stop");
    assert.ok(state.counts.employmentCenters > 0 && state.counts.migrants > 0);
    assert.ok(sawJobs && sawSeeds && sawExpansion, "Successful generation must include jobs, seed expansion and economics.");
    assert.ok(state.agents.filter(item => item.kind === "migrant").every(item => item.size !== 0.65 && item.income >= item.livingExpenses));
    // Final setup precision does not introduce a global nonnegative clamp.
    assert.ok(state.cells.every(item => Number.isFinite(item.landValue) && Math.abs(item.landValue * 100 - Math.round(item.landValue * 100)) < 1e-8));
    const ready = semantic(model);
    assert.equal(model.advanceCityscape(20).status, "guarded");
    assert.deepEqual(semantic(model), ready);
    model.advance(); assert.equal(model.read().tick, 1);
  }
  const ids = model.read().cells.map(item => item.id), stream = model.read().randomState;
  model.clear(); const cleared = model.read();
  assert.equal(cleared.tick, 0); assert.equal(cleared.setupDone, false); assert.equal(cleared.agents.length, 0);
  assert.deepEqual(cleared.cells.map(item => item.id), ids);
  assert.deepEqual(cleared.randomState, stream); // explicit target CLEAR no-draw adaptation
  assert.equal(cleared.parameters.seed, seed);
}
assert.ok(outcomes.some(item => item.ready), JSON.stringify(outcomes));

// Fixed seed1 replay one call at a time versus batches25, with pure reads.
const replay = create({ seed: 1 });
let replayFailed = false;
try {
  for (let calls = 0; calls < 3000 && !replay.read().setupDone; calls++) {
    replay.read(); replay.advanceCityscape();
  }
} catch (error) {
  if (!(error instanceof TijuanaRuntimeError)) throw error;
  replayFailed = true;
}
assert.equal(replayFailed, firstSeedFailed);
assert.deepEqual(semantic(replay), firstSeedResult);
