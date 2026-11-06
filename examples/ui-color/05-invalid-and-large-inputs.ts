import { strict as assert } from "node:assert";
import { netLogoColor } from "../../ui/index.ts";
for (const input of [NaN, Infinity, -Infinity]) assert.throws(() => netLogoColor(input), RangeError);
for (const input of ["105", null, {}, undefined]) assert.throws(() => netLogoColor(input as unknown as number), TypeError);
assert.equal(netLogoColor(140000105), "#345da9");
assert.equal(netLogoColor(-140000175), "#345da9");
