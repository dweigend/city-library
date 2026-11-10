/** Frozen public city-model contract; time is minutes. */
import assert from "node:assert/strict";
import { create as goods } from "../../../models/des-goods-buffer/model.ts";

const buffer = goods();
buffer.advance(3);
assert.equal(buffer.read().storedLotCount, 2);
assert.equal(buffer.read().blockedLotCount, 1);
buffer.advance();
assert.equal(buffer.read().storedLotCount, 2);
assert.equal(buffer.read().blockedLotCount, 0);
buffer.advance(4);
assert.deepEqual(buffer.read().deliveries.map((crate) => crate.collectedAtMinutes), [4, 6, 8]);
assert.equal(buffer.read().producedLotCount, buffer.read().collectedLotCount + buffer.read().storedLotCount + buffer.read().blockedLotCount);

const independent = goods();
const baseline = independent.read();
assert.throws(() => independent.advance(-1), RangeError);
assert.deepEqual(independent.read(), baseline);
