import assert from "node:assert/strict";
import { model } from "../../../models/city-water/model.ts";

function season(trigger: number, share: number) {
  const city = model.create();
  city.setConservationRule({ conservationTrigger: trigger, conservationShare: share });
  let lowest = Infinity;
  for (let day = 0; day < 120; day += 1) {
    city.advance();
    lowest = Math.min(lowest, city.read().storedM3);
  }
  return { state: city.read(), lowest };
}

// Baseline: the default rule (trigger 1, share 0) never cuts demand, so no day counts as a saving day.
const baseline = season(1, 0);
assert.equal(baseline.state.totalConservedM3, 0);
assert.equal(baseline.state.conservationDayCount, 0);
assert.equal(baseline.state.isSavingTomorrow, false);
assert.equal(baseline.state.totalShortageM3, 1200);

// Experiment A: modest savings that start early.
const early = season(0.6, 0.15);
assert.equal(early.state.totalShortageM3, 0);
assert.equal(early.state.conservationDayCount, 84);
assert.equal(early.state.totalConservedM3, 2520);
assert.equal(early.lowest, 120);
assert.equal(early.state.storedM3, 2120);
assert.equal(early.state.worstDayCutShare, 0.15);

// Experiment B: deep rationing that starts late.
const late = season(0.25, 0.4);
assert.equal(late.state.totalShortageM3, 0);
assert.equal(late.state.conservationDayCount, 42);
assert.equal(late.state.totalConservedM3, 3360);
assert.equal(late.lowest, 640);
assert.equal(late.state.storedM3, 2960);
assert.equal(late.state.worstDayCutShare, 0.4);

// Treatment expansion changes untreated wastewater, not drinking water.
const treatment = model.create();
treatment.setTreatmentCapacity(200);
treatment.advance();
assert.equal(treatment.read().untreatedM3, 0);
assert.equal(treatment.read().suppliedM3, 200);
treatment.setInflow(0);
treatment.setConservationShare(0.5);
treatment.advance();
assert.equal(treatment.read().suppliedM3, 100);
console.log("city-water early savings and late rationing passed");
