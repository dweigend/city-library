import assert from "node:assert/strict";
import { create as bacterium } from "../../models/crispr-bacterium/model.ts";
import { create as ecosystem } from "../../models/crispr-ecosystem/model.ts";

const defense = bacterium({ seed: 41, initialArraySize: 3, maxVirusTypes: 1, crisprFunction: 0 });
assert.deepEqual(defense.read().array, [0, 0, 0]);
assert.equal(defense.read().rnapCount, 25);
assert.equal(defense.read().cas9Count, 0);
assert.equal(defense.read().guideCount, 0);
defense.infect(0);
assert.equal(defense.read().virusCount, 1);
assert.equal(defense.read().tick, 0);
defense.advance(3);
assert.equal(defense.read().tick, 3);
assert.equal(defense.read().infected, false);
assert.equal(defense.read().rnapCount, 25);

const habitat = ecosystem({ seed: 42, initialBacteria: 10, initialViruses: 0 });
assert.equal(habitat.read().bacteriaCount, 10);
assert.equal(habitat.read().virusCount, 0);
habitat.advance(5);
assert.equal(habitat.read().tick, 0);
assert.equal(habitat.read().stopped, true);
const active = ecosystem({ seed: 43, initialBacteria: 20, initialViruses: 20, infectionChance: 0 });
active.advance(4);
assert.equal(active.read().tick, 4);
assert.ok(active.read().bacteriaCount > 0);
assert.ok(active.read().cells.every(field => field.foodEnergy >= 0 && field.foodEnergy <= 100));
console.log("CRISPR defense and ecology passed");
