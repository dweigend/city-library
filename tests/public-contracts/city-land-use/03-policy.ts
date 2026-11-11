import assert from "node:assert/strict";
import { model } from "../../../models/city-land-use/model.ts";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

// Experiment A: same demand, dispersed instead of compact growth.
const dispersed = model.create();
dispersed.setGrowthPattern("dispersed");
dispersed.advance();
close(dispersed.read().urbanEdgeKm, 1.4);
dispersed.advance(15);
assert.equal(dispersed.read().greenAreaHa, 18);
assert.equal(dispersed.read().largestGreenPatchHa, 4);
assert.equal(dispersed.read().greenPatchCount, 10);
close(dispersed.read().urbanEdgeKm, 4.9);

// Experiment B: equal protected area, connected corridor versus scattered parcels.
const corridor = model.create();
corridor.setGrowthPattern("dispersed");
corridor.applyProtectionPlan("corridor");
assert.equal(corridor.read().protectedAreaHa, 6);
corridor.advance(16);
assert.equal(corridor.read().largestGreenPatchHa, 11);
assert.equal(corridor.read().greenPatchCount, 7);
assert.ok(corridor.read().parcels.filter(parcel => parcel.column === 1).every(parcel => parcel.use === "green" && parcel.isProtected));

const scattered = model.create();
scattered.setGrowthPattern("dispersed");
scattered.applyProtectionPlan("scattered");
assert.equal(scattered.read().protectedAreaHa, 6);
scattered.advance(16);
assert.equal(scattered.read().largestGreenPatchHa, 4);
assert.equal(scattered.read().greenPatchCount, 12);

// Plans replace each other; single parcels can still be toggled; demand is live.
scattered.applyProtectionPlan("none");
assert.equal(scattered.read().protectedAreaHa, 0);
scattered.setProtection("parcel:0", true);
assert.equal(scattered.read().protectedAreaHa, 1);
scattered.setDemand({ residentialDemand: 20 });
assert.equal(scattered.read().parameters.commercialDemand, 6);
scattered.advance();
assert.equal(scattered.read().convertedParcelCount, 2);
assert.equal(scattered.read().parcels.filter(parcel => parcel.changedThisYear).every(parcel => parcel.use === "green"), true);
console.log("city-land-use growth pattern and protection experiments passed");
