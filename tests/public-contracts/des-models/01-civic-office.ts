/** Frozen public city-model contract; time is minutes. */
import assert from "node:assert/strict";
import { create as office } from "../../../models/des-civic-office/model.ts";

const civic = office();
assert.equal(civic.read().waitingResidentCount, 2);
civic.advance(6);
assert.deepEqual(civic.read().residents.map((resident) => resident.completed), [2, 4, 6]);
assert.equal(civic.read().totalWaitMinutes, 6);
assert.equal(civic.read().busyClerkCount, 0);

const independent = office();
const baseline = independent.read();
assert.throws(() => independent.advance(-1), RangeError);
assert.deepEqual(independent.read(), baseline);
