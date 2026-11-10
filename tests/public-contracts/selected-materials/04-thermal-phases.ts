import assert from "node:assert/strict";
import { create as heat } from "../../../models/heat-diffusion/model.ts";
import { create as crystal } from "../../../models/crystallization-basic/model.ts";
const plate = heat({ width: 11, height: 11, initialPlateTemp: 44, leftTemp: 44, rightTemp: 44, topTemp: 44, bottomTemp: 44, alpha: 0.8418, seed: 7 });
plate.advance(2);
assert.equal(plate.read().tick, 2);
assert.ok(plate.read().cells.every(c => Math.abs(c.temperature - 44) < 1e-10));
assert.equal(plate.read().heatDiffusivity, 0.25 * Math.exp(-1 / (0.8418 + 0.3)));
plate.updateAlpha("wood");
assert.equal(plate.read().parameters.alpha, 0.00128);
// A single source patch update sees old-temperature; later updates may see its write.
plate.setTemperatures(plate.read().cells.map(c => c.x === 0 && c.y === 0 ? 100 : 44));
plate.updateFieldAt(0, 0);
const d = 0.25 * Math.exp(-1 / (0.00128 + 0.3));
assert.ok(Math.abs(plate.read().cells.find(c => c.x === 0 && c.y === 0)!.temperature - (d * 176 + (1 - 4 * d) * 100)) < 1e-10);

// One exposed atom has itself in the nine-site neighborhood and own temp twice.
const metal = crystal({ width: 1, height: 1, initMetalTemp: 1550, meltingTemp: 550, roomTemp: 100, circle: false, seed: 8 });
assert.equal(metal.read().atoms.length, 1);
metal.advance();
assert.equal(metal.read().atoms[0]!.temp, 390);
assert.equal(metal.read().averageMetalTemp, 390);
assert.equal(metal.read().numFrozen, 0);
assert.equal(metal.read().tick, 1);
metal.advance(5);
assert.equal(metal.read().tick, 1); // terminal preflight does not cool/tick again
assert.equal(metal.read().done, true);
console.log("materials 04: thermal equations and crystallization phase barriers passed");
