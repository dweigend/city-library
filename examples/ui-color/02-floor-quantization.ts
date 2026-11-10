import { strict as assert } from "node:assert";
import { indexedColor } from "../../ui/index.ts";
assert.equal(indexedColor(100.01), "#020204");
assert.equal(indexedColor(100.09999), "#020204");
assert.notEqual(indexedColor(100.1), indexedColor(100.09999));
assert.equal(indexedColor(109.9999), "#fbfcfd"); // blue maximum is not pure white
