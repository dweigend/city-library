import { strict as assert } from "node:assert";
import { indexedColor } from "../../ui/index.ts";
for (const input of [NaN, Infinity, -Infinity]) assert.throws(() => indexedColor(input), RangeError);
for (const input of ["105", null, {}, undefined]) assert.throws(() => indexedColor(input as unknown as number), TypeError);
assert.equal(indexedColor(140000105), "#345da9");
assert.equal(indexedColor(-140000175), "#345da9");
