import { strict as assert } from "node:assert";
import { indexedColor } from "../../ui/index.ts";
assert.equal(indexedColor(-0.01), "#fefcfd");
assert.equal(indexedColor(139.99), "#fefcfd");
assert.equal(indexedColor(140), "#000000");
assert.equal(indexedColor(385), "#345da9");
assert.equal(indexedColor(-175), "#345da9");
