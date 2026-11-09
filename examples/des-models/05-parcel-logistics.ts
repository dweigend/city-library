/** Frozen public city-model contract; time is minutes. */
import assert from "node:assert/strict";
import { create as parcels } from "../../models/des-parcel-logistics/model.ts";

const logistics = parcels();
logistics.advance(12);
assert.deepEqual(logistics.read().parcels.map((parcel) => parcel.delivered), [3, 9]);
assert.deepEqual(logistics.read().parcels.map((parcel) => parcel.returned), [5, 12]);
assert.equal(logistics.read().vanBusy, 0);
assert.equal(logistics.read().queued, 0);

const independent = parcels();
const baseline = independent.read();
assert.throws(() => independent.advance(-1), RangeError);
assert.deepEqual(independent.read(), baseline);
