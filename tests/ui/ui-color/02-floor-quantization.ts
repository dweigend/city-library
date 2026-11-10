import { strict as assert } from "node:assert";
import { netLogoColor } from "../../../ui/index.ts";
assert.equal(netLogoColor(100.01), "#020204");
assert.equal(netLogoColor(100.09999), "#020204");
assert.notEqual(netLogoColor(100.1), netLogoColor(100.09999));
assert.equal(netLogoColor(109.9999), "#fbfcfd"); // blue maximum is not pure white
