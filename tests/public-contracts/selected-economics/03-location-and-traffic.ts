import assert from "node:assert/strict";
import { create as stores } from "../../../models/hotellings-law/model.ts";
import { create as traffic } from "../../../models/braess-paradox/model.ts";
const h = stores({ layout: "line", rules: "moving-only", seed: 1 });
assert.equal(h.read().stores.length, 3);
assert.equal(h.read().consumers.length, 41);
assert.equal(h.read().stores.reduce((n, s) => n + s.areaCount, 0), 41);
h.advance(10); const hs = h.read();
assert.equal(hs.tick, 10); assert.ok(hs.stores.every(s => s.price === 10 && s.x === 0));
assert.equal(hs.stores.reduce((n, s) => n + s.areaCount, 0), 41);
// The road model uses its source waiting clock, not static shortest-path costs.
const b = traffic({ spawnRate: 10, seed: 1 });
assert.equal(b.read().commuters.length, 0);
b.advance(26); assert.equal(b.read().tick, 26); assert.equal(b.read().spawnedCarCount, 0);
b.advance(); assert.equal(b.read().tick, 27); assert.equal(b.read().spawnedCarCount, 1);
assert.equal(b.read().commuters.length, 1); assert.equal(b.read().commuters[0]!.ticksHere, 2);
b.advance(100); assert.equal(b.read().tick, 127);
assert.ok(b.read().commuters.every(c => c.route >= 0 && c.route <= 2));
console.log("location-and-traffic: simultaneous store decisions and strict spawn/wait timing");
