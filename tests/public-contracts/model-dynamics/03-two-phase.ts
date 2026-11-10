import assert from "node:assert/strict";
import { twoPhase } from "city-library";

const left = { heat: 10 };
const right = { heat: 30 };
const fields = [left, right];
twoPhase(fields, {
  compute: () => (left.heat + right.heat) / 2,
  commit: (field, heat) => { field.heat = heat; },
});
assert.deepEqual(fields, [{ heat: 20 }, { heat: 20 }]);
assert.throws(() => twoPhase(fields, {
  compute: (field) => { if (field === right) throw new Error("compute failed"); return 99; },
  commit: (field, heat) => { field.heat = heat; },
}), /compute failed/);
assert.equal(left.heat, 20);
