import assert from "node:assert/strict";
import { create } from "../../../models/dla/model.ts";
const cluster = create({ width: 21, height: 21, maxParticleCount: 1, wiggleAngle: 0, useWholeWorld: false, seed: 9 });
assert.equal(cluster.read().radius, 0);
assert.equal(cluster.read().agents.length, 0);
assert.equal(cluster.read().cells.filter(c => c.occupied).length, 1);
cluster.advance();
assert.equal(cluster.read().tick, 1);
assert.equal(cluster.read().agents.length, 0); // count < ticks throttles initial birth
cluster.makeNewAgent();
let walker = cluster.read().agents[0]!;
assert.ok(Math.abs(Math.hypot(walker.x, walker.y) - 1.5) < 1e-10);
cluster.wander(walker.id);
walker = cluster.read().agents[0]!;
assert.ok(Math.abs(Math.hypot(walker.x, walker.y) - 0.5) < 1e-10); // faces center, zero wiggle
assert.equal(cluster.read().tick, 1); // source turtle procedure does not tick
const growing = create({ width: 21, height: 21, maxParticleCount: 20, wiggleAngle: 60, useWholeWorld: false, seed: 10 });
growing.advance(500);
assert.ok(growing.read().cells.filter(c => c.occupied).length > 1);
assert.ok(growing.read().radius > 0);
assert.ok(growing.read().agents.length <= 20);
assert.ok(growing.read().radius >= 7 || growing.read().tick === 500);
if (growing.read().done) {
  const tick = growing.read().tick;
  growing.advance(5);
  assert.equal(growing.read().tick, tick);
}
console.log("materials 05: DLA birth throttle, radial motion and sticking passed");
