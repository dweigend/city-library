import assert from "node:assert/strict";
import { create as termites } from "../../experiments/termites/model.ts";
import { create as shepherds } from "../../experiments/shepherds/model.ts";
const wood = termites({ number: 5, density: 20, seed: 13 });
const initial = wood.read().chipCount + wood.read().carryingCount;
wood.advance(100);
assert.equal(wood.read().chipCount + wood.read().carryingCount, initial);
assert.equal(wood.read().termites.length, 5);
assert.equal(wood.read().tick, null); // Source has no ticks; bounded procedure work is separate.
const empty = termites({ number: 1, density: 0 });
empty.advance(10); // Recursive source searches must remain interruptible.
assert.equal(empty.read().chipCount, 0);
const herd = shepherds({ numSheep: 20, numShepherds: 3, sheepSpeed: 0, seed: 2 });
herd.advance(20);
assert.equal(herd.read().tick, 20);
assert.equal(herd.read().sheep.length, 20);
assert.equal(herd.read().shepherds.length, 3);
const carried = herd.read().shepherds.flatMap(s => s.carriedSheep === null ? [] : [s.carriedSheep]);
assert.equal(new Set(carried).size, carried.length);
assert.equal(herd.read().sheep.filter(s => s.hidden).length, carried.length);
console.log("Conserved transport, interruptible search and unique carried sheep verified.");
