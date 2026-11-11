import assert from "node:assert/strict";
import { model } from "../../../models/city-land-use/model.ts";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
const compact = model.create();
compact.advance();
let state = compact.read();
assert.equal(state.convertedParcelCount, 2);
assert.equal(state.residentialAreaHa, 6);
assert.equal(state.parcels.filter(parcel => parcel.changedThisYear).length, 2);
assert.ok(state.parcels.filter(parcel => parcel.changedThisYear).every(parcel => parcel.use === "residential"));
close(state.urbanEdgeKm, 1.2);
for (let year = 2; year <= 16; year += 1) {
  compact.advance();
  state = compact.read();
  assert.equal(state.residentialAreaHa + state.commercialAreaHa + state.greenAreaHa, 48);
  assert.ok(state.convertedParcelCount <= 2);
}
assert.equal(state.residentialAreaHa, 24);
assert.equal(state.commercialAreaHa, 6);
assert.equal(state.greenAreaHa, 18);
assert.equal(state.largestGreenPatchHa, 10);
assert.equal(state.greenPatchCount, 2);
close(state.urbanEdgeKm, 1.8);
assert.equal(state.unmetResidentialDemand + state.unmetCommercialDemand, 0);
compact.advance();
assert.equal(compact.read().convertedParcelCount, 0);
console.log("city-land-use compact conversion and area conservation passed");
