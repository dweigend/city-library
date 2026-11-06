import { strict as assert } from "node:assert";
import { netLogoColor } from "../../ui/index.ts";
assert.equal(netLogoColor(-0.01), "#fefcfd");
assert.equal(netLogoColor(139.99), "#fefcfd");
assert.equal(netLogoColor(140), "#000000");
assert.equal(netLogoColor(385), "#345da9");
assert.equal(netLogoColor(-175), "#345da9");
